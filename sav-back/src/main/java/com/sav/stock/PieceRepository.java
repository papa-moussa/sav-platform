package com.sav.stock;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PieceRepository extends JpaRepository<PieceEntity, Long>, JpaSpecificationExecutor<PieceEntity> {

    // Multi-tenant : référence unique par company
    boolean existsByReferenceAndCompanyId(String reference, Long companyId);

    boolean existsByReferenceAndIdNotAndCompanyId(String reference, Long id, Long companyId);

    // Charge le site en JOIN pour éviter N+1 lors du listing (sans pagination)
    @EntityGraph(attributePaths = {"site"})
    List<PieceEntity> findAll(Specification<PieceEntity> spec, Sort sort);

    // Charge le site en JOIN pour éviter N+1 lors du listing (avec pagination)
    @EntityGraph(attributePaths = {"site"})
    Page<PieceEntity> findAll(Specification<PieceEntity> spec, Pageable pageable);

    // JOIN FETCH pour ne pas charger les entités sans leur site — filtre par company (null = toutes)
    @Query("SELECT p FROM PieceEntity p JOIN FETCH p.site WHERE p.quantite < p.seuilAlerte AND (:companyId IS NULL OR p.company.id = :companyId)")
    List<PieceEntity> findPiecesEnAlerteByCompany(@org.springframework.data.repository.query.Param("companyId") Long companyId);

    // COUNT direct — filtre par company (null = toutes)
    @Query("SELECT COUNT(p) FROM PieceEntity p WHERE p.quantite < p.seuilAlerte AND (:companyId IS NULL OR p.company.id = :companyId)")
    long countPiecesEnAlerteByCompany(@org.springframework.data.repository.query.Param("companyId") Long companyId);
}
