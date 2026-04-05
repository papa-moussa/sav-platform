package com.sav.stock;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MouvementStockRepository extends JpaRepository<MouvementStockEntity, Long> {

    // JOIN FETCH createdBy + intervention pour éviter N+1 dans toMouvementResponse()
    @Query("""
            SELECT m FROM MouvementStockEntity m
            JOIN FETCH m.createdBy
            LEFT JOIN FETCH m.intervention
            WHERE m.piece.id = :pieceId
            ORDER BY m.createdAt DESC
            """)
    List<MouvementStockEntity> findByPieceIdOrderByCreatedAtDesc(@Param("pieceId") Long pieceId);

    @Query("""
            SELECT m FROM MouvementStockEntity m
            JOIN FETCH m.createdBy
            LEFT JOIN FETCH m.intervention
            WHERE m.intervention.id = :interventionId
            ORDER BY m.createdAt DESC
            """)
    List<MouvementStockEntity> findByInterventionIdOrderByCreatedAtDesc(@Param("interventionId") Long interventionId);

    @Query("SELECT SUM(m.quantite * m.piece.prixUnitaire) FROM MouvementStockEntity m WHERE m.type = 'SORTIE' AND m.createdAt >= :start AND m.createdAt <= :end AND (:siteId IS NULL OR m.piece.site.id = :siteId)")
    java.math.BigDecimal sumRevenueByPeriodAndSite(@Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end, @Param("siteId") Long siteId);

    @Query("SELECT SUM(m.quantite * m.piece.prixUnitaire) FROM MouvementStockEntity m WHERE m.type = 'SORTIE' AND m.createdAt >= :start AND m.createdAt <= :end AND (:siteId IS NULL OR m.piece.site.id = :siteId) AND (:companyId IS NULL OR m.piece.company.id = :companyId)")
    java.math.BigDecimal sumRevenueByPeriodAndSiteAndCompany(@Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end, @Param("siteId") Long siteId, @Param("companyId") Long companyId);
}
