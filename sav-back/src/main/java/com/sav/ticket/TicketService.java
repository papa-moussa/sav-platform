package com.sav.ticket;

import com.sav.client.ClientEntity;
import com.sav.client.ClientRepository;
import com.sav.common.dto.*;
import com.sav.common.tenant.TenantContext;
import com.sav.company.CompanyEntity;
import com.sav.company.CompanyRepository;
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
    private final TicketActionRepository actionRepository;
    private final TicketHistoryRepository historyRepository;

    @Transactional(readOnly = true)
    public PageResponse<TicketResponse> findAll(TicketStatut statut, Long siteId, Long technicienId,
                                                Long clientId, String search, Pageable pageable) {
        Specification<TicketEntity> spec = buildSpec(statut, siteId, technicienId, clientId, search);
        Page<TicketEntity> page = ticketRepository.findAll(spec, pageable);
        return PageResponse.from(page.map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> findByTechnicien(Long technicienId) {
        return ticketRepository.findByTechnicienIdOrderByCreatedAtDesc(technicienId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> findMesTickets(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé : " + email));
        return findByTechnicien(user.getId());
    }

    @Transactional(readOnly = true)
    public TicketResponse findById(Long id) {
        TicketEntity ticket = getOrThrow(id);
        return toResponse(ticket);
    }

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

        CompanyEntity company = null;
        Long companyId = TenantContext.get();
        if (companyId != null) {
            company = companyRepository.findById(companyId)
                    .orElseThrow(() -> new EntityNotFoundException("Company non trouvée : " + companyId));
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

        return toResponse(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketResponse startDiagnostic(Long id, String callerEmail) {
        TicketEntity ticket = getOrThrow(id);
        transitionStatut(ticket, TicketStatut.EN_DIAGNOSTIC, callerEmail);
        addHistory(ticket, "CHANGE_STATUT", "Démarrage du diagnostic", callerEmail);
        return toResponse(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketResponse completeDiagnostic(Long id, String diagnostic, String callerEmail) {
        TicketEntity ticket = getOrThrow(id);
        addHistory(ticket, "DIAGNOSTIC", diagnostic, callerEmail);
        transitionStatut(ticket, TicketStatut.EN_COURS, callerEmail);
        return toResponse(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketActionResponse addAction(Long id, String description, String userEmail) {
        TicketEntity ticket = getOrThrow(id);
        UserEntity user = getUserByEmail(userEmail);

        TicketActionEntity action = TicketActionEntity.builder()
                .ticket(ticket)
                .utilisateur(user)
                .description(description)
                .build();
        
        actionRepository.save(action);
        addHistory(ticket, "ACTION", description, userEmail);
        return toActionResponse(action);
    }

    @Transactional
    public TicketResponse blockTicket(Long id, com.sav.common.enums.BlockingReason reason, String observation, String userEmail) {
        TicketEntity ticket = getOrThrow(id);
        ticket.setBlockingReason(reason);
        ticket.setBlockingObservation(observation);
        addHistory(ticket, "BLOCAGE", "Sujet: " + reason + " - Obs: " + observation, userEmail);
        return toResponse(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketResponse resumeTicket(Long id, String userEmail) {
        TicketEntity ticket = getOrThrow(id);
        ticket.setBlockingReason(null);
        ticket.setBlockingObservation(null);
        addHistory(ticket, "REPRISE", "Blocage levé", userEmail);
        return toResponse(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketResponse terminateIntervention(Long id, com.sav.common.enums.ResultatIntervention result, String observations, Double temps, String userEmail) {
        TicketEntity ticket = getOrThrow(id);
        ticket.setResult(result);
        ticket.setStatut(TicketStatut.TERMINE);
        ensureQrToken(ticket);
        
        addHistory(ticket, "TERMINAISON", "Résultat: " + result + " - Obs: " + observations, userEmail);
        return toResponse(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketResponse assigner(Long id, Long technicienId) {
         TicketEntity ticket = getOrThrow(id);
         UserEntity tech = userRepository.findById(technicienId)
                 .orElseThrow(() -> new EntityNotFoundException("Technicien non trouvé"));
         ticket.setTechnicien(tech);
         return toResponse(ticketRepository.save(ticket));
    }

    @Transactional
    public InterventionResponse addIntervention(Long ticketId, InterventionRequest request, String userEmail) {
        TicketEntity ticket = getOrThrow(ticketId);
        if (ticket.getStatut() == TicketStatut.CLOTURE) {
            throw new IllegalStateException("Impossible d'ajouter une intervention sur un ticket clôturé.");
        }
        UserEntity technicien = getUserByEmail(userEmail);
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

    private void transitionStatut(TicketEntity ticket, TicketStatut newStatut, String callerEmail) {
        TicketStatut current = ticket.getStatut();
        if (!TicketStatutTransition.isAllowed(current, newStatut)) {
            throw new IllegalArgumentException("Transition invalide : " + current + " -> " + newStatut);
        }
        ticket.setStatut(newStatut);
    }

    private void addHistory(TicketEntity ticket, String type, String details, String userEmail) {
        UserEntity user = getUserByEmail(userEmail);
        TicketHistoryEntity history = TicketHistoryEntity.builder()
                .ticket(ticket)
                .utilisateur(user)
                .typeAction(type)
                .details(details)
                .build();
        historyRepository.save(history);
    }

    private UserEntity getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé : " + email));
    }

    private TicketEntity getOrThrow(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ticket non trouvé : " + id));
    }

    private void ensureQrToken(TicketEntity ticket) {
        if (ticket.getQrToken() == null) {
            ticket.setQrToken(UUID.randomUUID().toString());
            ticket.setQrTokenExpiresAt(LocalDateTime.now().plusDays(30));
        }
    }

    private String generateNumero() {
        String yearStr = String.valueOf(Year.now().getValue());
        TicketSequenceEntity sequence = sequenceRepository.findByYearWithLock(yearStr)
                .orElseGet(() -> TicketSequenceEntity.builder().year(yearStr).currentValue(0L).build());
        sequence.increment();
        sequenceRepository.saveAndFlush(sequence);
        return String.format("TKT-%s-%05d", yearStr, sequence.getCurrentValue());
    }

    private TicketResponse toResponse(TicketEntity t) {
        return TicketResponse.builder()
                .id(t.getId())
                .numero(t.getNumero())
                .clientId(t.getClient().getId())
                .clientNom(t.getClient().getNom())
                .technicienId(t.getTechnicien() != null ? t.getTechnicien().getId() : null)
                .technicienNom(t.getTechnicien() != null ? t.getTechnicien().getNom() : null)
                .siteId(t.getSite().getId())
                .siteNom(t.getSite().getNom())
                .typeAppareil(t.getTypeAppareil())
                .marqueModele(t.getMarqueModele())
                .numeroSerie(t.getNumeroSerie())
                .descriptionPanne(t.getDescriptionPanne())
                .statut(t.getStatut())
                .sousGarantie(t.isSousGarantie())
                .dateAchat(t.getDateAchat())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .feedbackSoumis(t.isFeedbackSoumis())
                .feedbackStatus(t.getFeedbackStatus())
                .blockingReason(t.getBlockingReason())
                .blockingObservation(t.getBlockingObservation())
                .result(t.getResult())
                .interventions(t.getInterventions() != null 
                    ? t.getInterventions().stream().map(this::toInterventionResponse).toList() 
                    : List.of())
                .actions(t.getActions() != null 
                    ? t.getActions().stream().map(this::toActionResponse).toList() 
                    : List.of())
                .history(t.getHistory() != null 
                    ? t.getHistory().stream().map(this::toHistoryResponse).toList() 
                    : List.of())
                .build();
    }

    private TicketActionResponse toActionResponse(TicketActionEntity a) {
        return new TicketActionResponse(a.getId(), a.getUtilisateur().getNom(), a.getDescription(), a.getCreatedAt());
    }

    private TicketHistoryResponse toHistoryResponse(TicketHistoryEntity h) {
        return new TicketHistoryResponse(h.getId(), h.getUtilisateur().getNom(), h.getTypeAction(), h.getDetails(), h.getTimestamp());
    }

    private InterventionResponse toInterventionResponse(InterventionEntity i) {
        return new InterventionResponse(i.getId(), i.getTechnicien().getNom(), i.getDiagnostic(), i.getActionsRealisees(), i.getObservations(), i.getTempsPasseHeures(), i.getResultat(), i.getCreatedAt());
    }

    private Specification<TicketEntity> buildSpec(TicketStatut statut, Long siteId,
                                                   Long technicienId, Long clientId, String search) {
        return (root, query, cb) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();
            Long companyId = TenantContext.get();
            if (companyId != null) predicates.add(cb.equal(root.get("company").get("id"), companyId));
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
            if (query.getResultType() != Long.class) query.orderBy(cb.desc(root.get("createdAt")));
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
}
