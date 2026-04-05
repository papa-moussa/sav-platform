package com.sav.stock;

import com.sav.common.dto.PageResponse;
import com.sav.common.enums.TypeMouvementStock;
import com.sav.common.tenant.TenantContext;
import com.sav.company.CompanyEntity;
import com.sav.company.CompanyRepository;
import com.sav.reparation.InterventionEntity;
import com.sav.reparation.InterventionRepository;
import com.sav.site.SiteEntity;
import com.sav.site.SiteRepository;
import com.sav.stock.dto.*;
import com.sav.user.UserEntity;
import com.sav.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class StockService {

    private final PieceRepository pieceRepository;
    private final MouvementStockRepository mouvementRepository;
    private final SiteRepository siteRepository;
    private final UserRepository userRepository;
    private final InterventionRepository interventionRepository;
    private final CompanyRepository companyRepository;

    private PieceResponse toResponse(PieceEntity p) {
        return new PieceResponse(
                p.getId(),
                p.getReference(),
                p.getDesignation(),
                p.getCategorieAppareil(),
                p.getMarqueCompatible(),
                p.getQuantite(),
                p.getSeuilAlerte(),
                p.getPrixUnitaire(),
                p.getSite().getId(),
                p.getSite().getNom(),
                p.getQuantite() < p.getSeuilAlerte(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }

    private MouvementStockResponse toMouvementResponse(MouvementStockEntity m) {
        return new MouvementStockResponse(
                m.getId(),
                m.getType(),
                m.getQuantite(),
                m.getIntervention() != null ? m.getIntervention().getId() : null,
                m.getMotif(),
                m.getCreatedBy().getNom(),
                m.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public PageResponse<PieceResponse> findAll(String search, Long siteId, Boolean alerteOnly, Pageable pageable) {
        Specification<PieceEntity> spec = buildPieceSpec(search, siteId, alerteOnly);
        return PageResponse.from(pieceRepository.findAll(spec, pageable).map(this::toResponse));
    }

    private Specification<PieceEntity> buildPieceSpec(String search, Long siteId, Boolean alerteOnly) {
        Specification<PieceEntity> spec = Specification.where(null);

        // Filtre multi-tenant — null = SUPER_ADMIN (voit tout)
        Long companyId = TenantContext.get();
        if (companyId != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("company").get("id"), companyId));
        }

        if (search != null && !search.isBlank()) {
            String like = "%" + search.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> cb.or(
                    cb.like(cb.lower(root.get("reference")), like),
                    cb.like(cb.lower(root.get("designation")), like),
                    cb.like(cb.lower(root.get("marqueCompatible")), like)
            ));
        }

        if (siteId != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("site").get("id"), siteId));
        }

        if (Boolean.TRUE.equals(alerteOnly)) {
            spec = spec.and((root, q, cb) -> cb.lessThan(root.get("quantite"), root.get("seuilAlerte")));
        }

        return spec;
    }

    @Transactional(readOnly = true)
    public PieceResponse findById(Long id) {
        return pieceRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Pièce non trouvée : " + id));
    }

    @CacheEvict(value = "alertesCount", allEntries = true)
    public PieceResponse create(PieceRequest req) {
        Long companyId = TenantContext.get();
        CompanyEntity company = companyId != null
                ? companyRepository.findById(companyId)
                        .orElseThrow(() -> new EntityNotFoundException("Company non trouvée"))
                : null;

        if (pieceRepository.existsByReferenceAndCompanyId(req.reference(), companyId)) {
            throw new IllegalArgumentException("Référence déjà utilisée : " + req.reference());
        }

        SiteEntity site = siteRepository.findById(req.siteId())
                .orElseThrow(() -> new EntityNotFoundException("Site non trouvé"));

        PieceEntity p = new PieceEntity();
        p.setReference(req.reference());
        p.setDesignation(req.designation());
        p.setCategorieAppareil(req.categorieAppareil());
        p.setMarqueCompatible(req.marqueCompatible());
        p.setQuantite(req.quantite());
        p.setSeuilAlerte(req.seuilAlerte());
        p.setPrixUnitaire(req.prixUnitaire());
        p.setSite(site);
        p.setCompany(company);

        return toResponse(pieceRepository.save(p));
    }

    @CacheEvict(value = "alertesCount", allEntries = true)
    public PieceResponse update(Long id, PieceRequest req) {
        PieceEntity p = pieceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pièce non trouvée : " + id));

        Long companyId = TenantContext.get();
        if (pieceRepository.existsByReferenceAndIdNotAndCompanyId(req.reference(), id, companyId)) {
            throw new IllegalArgumentException("Référence déjà utilisée : " + req.reference());
        }

        SiteEntity site = siteRepository.findById(req.siteId())
                .orElseThrow(() -> new EntityNotFoundException("Site non trouvé"));

        p.setReference(req.reference());
        p.setDesignation(req.designation());
        p.setCategorieAppareil(req.categorieAppareil());
        p.setMarqueCompatible(req.marqueCompatible());
        p.setSeuilAlerte(req.seuilAlerte());
        p.setPrixUnitaire(req.prixUnitaire());
        p.setSite(site);
        // NOTE: quantite is NOT updated here — managed through mouvements

        return toResponse(pieceRepository.save(p));
    }

    @CacheEvict(value = "alertesCount", allEntries = true)
    public MouvementStockResponse entreeStock(Long pieceId, EntreeStockRequest req, String userEmail) {
        PieceEntity piece = pieceRepository.findById(pieceId)
                .orElseThrow(() -> new EntityNotFoundException("Pièce non trouvée"));
        UserEntity user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));

        piece.setQuantite(piece.getQuantite() + req.quantite());
        pieceRepository.save(piece);

        MouvementStockEntity m = new MouvementStockEntity();
        m.setPiece(piece);
        m.setType(TypeMouvementStock.ENTREE);
        m.setQuantite(req.quantite());
        m.setMotif(req.motif());
        m.setCreatedBy(user);

        return toMouvementResponse(mouvementRepository.save(m));
    }

    @CacheEvict(value = "alertesCount", allEntries = true)
    public MouvementStockResponse sortieStock(Long pieceId, SortieStockRequest req, String userEmail) {
        PieceEntity piece = pieceRepository.findById(pieceId)
                .orElseThrow(() -> new EntityNotFoundException("Pièce non trouvée"));

        if (piece.getQuantite() < req.quantite()) {
            throw new IllegalArgumentException("Stock insuffisant. Disponible : " + piece.getQuantite());
        }

        UserEntity user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));

        InterventionEntity intervention = null;
        if (req.interventionId() != null) {
            intervention = interventionRepository.findById(req.interventionId())
                    .orElseThrow(() -> new EntityNotFoundException("Intervention non trouvée"));
        }

        piece.setQuantite(piece.getQuantite() - req.quantite());
        pieceRepository.save(piece);

        MouvementStockEntity m = new MouvementStockEntity();
        m.setPiece(piece);
        m.setType(TypeMouvementStock.SORTIE);
        m.setQuantite(req.quantite());
        m.setIntervention(intervention);
        m.setMotif(req.motif());
        m.setCreatedBy(user);

        return toMouvementResponse(mouvementRepository.save(m));
    }

    @Transactional(readOnly = true)
    public List<MouvementStockResponse> getMouvements(Long pieceId) {
        return mouvementRepository.findByPieceIdOrderByCreatedAtDesc(pieceId)
                .stream()
                .map(this::toMouvementResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MouvementStockResponse> getMouvementsByIntervention(Long interventionId) {
        return mouvementRepository.findByInterventionIdOrderByCreatedAtDesc(interventionId)
                .stream()
                .map(this::toMouvementResponse)
                .toList();
    }

    // NOTE: @Cacheable retiré — cache non multi-tenant safe (résultat varie par company)
    @Transactional(readOnly = true)
    public long countAlertes() {
        return pieceRepository.countPiecesEnAlerteByCompany(TenantContext.get());
    }
}
