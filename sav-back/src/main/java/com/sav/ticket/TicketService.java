package com.sav.ticket;

import com.sav.client.ClientEntity;
import com.sav.client.ClientRepository;
import com.sav.common.dto.*;
import com.sav.common.tenant.TenantContext;
import com.sav.company.CompanyEntity;
import com.sav.company.CompanyRepository;
import com.sav.common.enums.Role;
import com.sav.common.enums.TicketStatut;
import com.sav.reparation.InterventionEntity;
import com.sav.reparation.InterventionRepository;
import com.sav.site.SiteEntity;
import com.sav.site.SiteRepository;
import com.sav.user.UserEntity;
import com.sav.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository  ticketRepository;
    private final InterventionRepository interventionRepository;
    private final ClientRepository  clientRepository;
    private final SiteRepository    siteRepository;
    private final UserRepository    userRepository;
    private final CompanyRepository companyRepository;
    private final TicketSequenceRepository sequenceRepository;

    // ─── Liste avec filtres ───────────────────────────────────────────────────

    public PageResponse<TicketResponse> findAll(TicketStatut statut, Long siteId, Long technicienId,
                                                Long clientId, String search, Pageable pageable) {
        Specification<TicketEntity> spec = buildSpec(statut, siteId, technicienId, clientId, search);
        Page<TicketEntity> page = ticketRepository.findAll(spec, pageable);
        return PageResponse.from(page.map(t -> toResponse(t, List.of())));
    }

    public List<TicketResponse> findByTechnicien(Long technicienId) {
        return ticketRepository.findByTechnicienIdOrderByCreatedAtDesc(technicienId).stream()
                .map(t -> toResponse(t, List.of()))
                .toList();
    }

    public List<TicketResponse> findMesTickets(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé : " + email));
        return findByTechnicien(user.getId());
    }

    // ─── Détail complet ───────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public TicketResponse findById(Long id) {
        TicketEntity ticket = getOrThrow(id);
        List<InterventionEntity> interventions =
                interventionRepository.findByTicketIdOrderByCreatedAtAsc(id);
        return toResponse(ticket, interventions);
    }

    // ─── Création ─────────────────────────────────────────────────────────────

    @Transactional
    public TicketResponse create(TicketRequest request, String userEmail) {
        ClientEntity client = clientRepository.findById(request.clientId())
                .orElseThrow(() -> new EntityNotFoundException("Client non trouvé : " + request.clientId()));
        SiteEntity site = siteRepository.findById(request.siteId())
                .orElseThrow(() -> new EntityNotFoundException("Site non trouvé : " + request.siteId()));

        UserEntity technicien = null;
        if (request.technicienId() != null) {
            technicien = userRepository.findById(request.technicienId())
                    .orElseThrow(() -> new EntityNotFoundException("Technicien non trouvé : " + request.technicienId()));
        }

        // Résolution de la company courante
        CompanyEntity company = null;
        Long companyId = TenantContext.get();
        if (companyId != null) {
            company = companyRepository.findById(companyId)
                    .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Company non trouvée : " + companyId));
        }

        TicketEntity ticket = TicketEntity.builder()
                .numero(generateNumero())
                .client(client)
                .site(site)
                .technicien(technicien)
                .company(company)
                .typeAppareil(request.typeAppareil())
                .marqueModele(request.marqueModele())
                .numeroSerie(request.numeroSerie())
                .descriptionPanne(request.descriptionPanne())
                .sousGarantie(request.sousGarantie())
                .dateAchat(request.dateAchat())
                .statut(TicketStatut.RECU)
                .build();

        return toResponse(ticketRepository.save(ticket), List.of());
    }

    // ─── Changement de statut ─────────────────────────────────────────────────

    /**
     * Change le statut d'un ticket.
     *
     * <p>Règles métier :
     * <ul>
     *   <li>REPARE / IRREPARABLE → EN_ATTENTE_FEEDBACK : génère automatiquement le token QR.</li>
     *   <li>EN_ATTENTE_FEEDBACK → CLOTURE : autorisé si feedback soumis OU si l'appelant est ADMIN.</li>
     * </ul>
     */
    @Transactional
    public TicketResponse changeStatut(Long id, TicketStatut newStatut, String callerEmail) {
        TicketEntity ticket = getOrThrow(id);
        TicketStatut current = ticket.getStatut();

        if (!TicketStatutTransition.isAllowed(current, newStatut)) {
            throw new IllegalArgumentException(
                    "Transition invalide : " + current + " → " + newStatut
                    + ". Transitions autorisées : " + TicketStatutTransition.getAllowed(current));
        }

        // Clôture sans feedback → override ADMIN uniquement
        UserEntity caller = null;
        if (newStatut == TicketStatut.CLOTURE && !ticket.isFeedbackSoumis()) {
            caller = userRepository.findByEmail(callerEmail)
                    .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé : " + callerEmail));
            if (caller.getRole() != Role.ADMIN) {
                throw new IllegalStateException(
                        "Ce ticket ne peut être clôturé sans feedback client. " +
                        "Le client doit scanner le QR Code, ou un administrateur peut clôturer manuellement.");
            }
        }

        // REPARE / IRREPARABLE exige une intervention (sauf ADMIN)
        if (newStatut == TicketStatut.REPARE || newStatut == TicketStatut.IRREPARABLE) {
            long count = interventionRepository.countByTicketId(id);
            if (count == 0) {
                if (caller == null) {
                    caller = userRepository.findByEmail(callerEmail)
                            .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé : " + callerEmail));
                }
                if (caller.getRole() != Role.ADMIN) {
                    throw new IllegalStateException(
                            "Un rapport d'intervention est requis pour marquer ce ticket comme " + newStatut.name().toLowerCase() + ".");
                }
            }
        }

        // Génération automatique du QR token lors du passage EN_ATTENTE_FEEDBACK
        if (newStatut == TicketStatut.EN_ATTENTE_FEEDBACK) {
            ensureQrToken(ticket);
        }

        ticket.setStatut(newStatut);
        return toResponse(ticketRepository.save(ticket), List.of());
    }

    // ─── Assignation technicien ───────────────────────────────────────────────

    @Transactional
    public TicketResponse assigner(Long id, Long technicienId) {
        TicketEntity ticket = getOrThrow(id);
        UserEntity technicien = userRepository.findById(technicienId)
                .orElseThrow(() -> new EntityNotFoundException("Technicien non trouvé : " + technicienId));
        ticket.setTechnicien(technicien);
        return toResponse(ticketRepository.save(ticket), List.of());
    }

    // ─── Ajout d'intervention ─────────────────────────────────────────────────

    @Transactional
    public InterventionResponse addIntervention(Long ticketId, InterventionRequest request, String userEmail) {
        TicketEntity ticket = getOrThrow(ticketId);
        
        if (ticket.getStatut() == TicketStatut.CLOTURE) {
            throw new IllegalStateException("Impossible d'ajouter une intervention sur un ticket clôturé.");
        }

        UserEntity technicien = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé : " + userEmail));

        InterventionEntity intervention = InterventionEntity.builder()
                .ticket(ticket)
                .technicien(technicien)
                .diagnostic(request.diagnostic())
                .actionsRealisees(request.actionsRealisees())
                .observations(request.observations())
                .tempsPasseHeures(request.tempsPasseHeures())
                .resultat(request.resultat())
                .build();

        return toInterventionResponse(interventionRepository.save(intervention));
    }

    // ─── Helpers privés ───────────────────────────────────────────────────────

    private TicketEntity getOrThrow(Long id) {
        return ticketRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new EntityNotFoundException("Ticket non trouvé : " + id));
    }

    /** Attribue un token QR unique si le ticket n'en a pas encore. */
    private void ensureQrToken(TicketEntity ticket) {
        if (ticket.getQrToken() == null) {
            ticket.setQrToken(UUID.randomUUID().toString());
            ticket.setQrTokenExpiresAt(LocalDateTime.now().plusDays(30));
        }
    }

    /** Génère le prochain numéro de ticket au format TKT-YYYY-NNNNN de manière atomique. */
    private String generateNumero() {
        String yearStr = String.valueOf(Year.now().getValue());

        // Récupère la séquence avec verrouillage pessimiste
        TicketSequenceEntity sequence = sequenceRepository.findByYearWithLock(yearStr)
                .orElseGet(() -> TicketSequenceEntity.builder()
                        .year(yearStr)
                        .currentValue(0L)
                        .build());

        sequence.increment();
        sequenceRepository.saveAndFlush(sequence);

        return String.format("TKT-%s-%05d", yearStr, sequence.getCurrentValue());
    }

    private TicketResponse toResponse(TicketEntity t, List<InterventionEntity> interventions) {
        return new TicketResponse(
                t.getId(),
                t.getNumero(),
                t.getClient().getId(),
                t.getClient().getNom(),
                t.getTechnicien() != null ? t.getTechnicien().getId() : null,
                t.getTechnicien() != null ? t.getTechnicien().getNom() : null,
                t.getSite().getId(),
                t.getSite().getNom(),
                t.getTypeAppareil(),
                t.getMarqueModele(),
                t.getNumeroSerie(),
                t.getDescriptionPanne(),
                t.getStatut(),
                t.isSousGarantie(),
                t.getDateAchat(),
                t.getCreatedAt(),
                t.getUpdatedAt(),
                interventions.stream().map(this::toInterventionResponse).toList(),
                t.isFeedbackSoumis(),
                t.getQrToken() != null,
                t.getQrToken()
        );
    }

    private InterventionResponse toInterventionResponse(InterventionEntity i) {
        return new InterventionResponse(
                i.getId(),
                i.getTechnicien().getNom(),
                i.getDiagnostic(),
                i.getActionsRealisees(),
                i.getObservations(),
                i.getTempsPasseHeures(),
                i.getResultat(),
                i.getCreatedAt()
        );
    }

    private Specification<TicketEntity> buildSpec(TicketStatut statut, Long siteId,
                                                   Long technicienId, Long clientId, String search) {
        return (root, query, cb) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();

            // ─── Filtre tenant ──────────────────────────────────────────────────
            Long companyId = TenantContext.get();
            if (companyId != null) {
                predicates.add(cb.equal(root.get("company").get("id"), companyId));
            }
            // ────────────────────────────────────────────────────────────────────

            if (statut != null) predicates.add(cb.equal(root.get("statut"), statut));
            if (siteId != null) predicates.add(cb.equal(root.get("site").get("id"), siteId));
            if (technicienId != null) predicates.add(cb.equal(root.get("technicien").get("id"), technicienId));
            if (clientId != null) predicates.add(cb.equal(root.get("client").get("id"), clientId));
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("numero")), pattern),
                        cb.like(cb.lower(root.get("client").get("nom")), pattern),
                        cb.like(cb.lower(root.get("marqueModele")), pattern)
                ));
            }

            if (!query.getResultType().equals(Long.class)) {
                query.orderBy(cb.desc(root.get("createdAt")));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
}
