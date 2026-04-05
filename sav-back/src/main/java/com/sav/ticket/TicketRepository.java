package com.sav.ticket;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<TicketEntity, Long>,
        JpaSpecificationExecutor<TicketEntity> {

    // JOIN FETCH client/technicien/site pour éviter N+1 sur la liste paginée
    @EntityGraph(attributePaths = {"client", "technicien", "site"})
    Page<TicketEntity> findAll(Specification<TicketEntity> spec, Pageable pageable);

    // JOIN FETCH pour la liste sans pagination (mes-tickets, etc.)
    @EntityGraph(attributePaths = {"client", "technicien", "site"})
    List<TicketEntity> findAll(Specification<TicketEntity> spec);

    // Remplace la méthode dérivée — JOIN FETCH pour éviter N+1 dans findMesTickets()
    @Query("""
            SELECT t FROM TicketEntity t
            JOIN FETCH t.client
            LEFT JOIN FETCH t.technicien
            JOIN FETCH t.site
            WHERE t.technicien.id = :technicienId
            ORDER BY t.createdAt DESC
            """)
    List<TicketEntity> findByTechnicienIdOrderByCreatedAtDesc(@Param("technicienId") Long technicienId);

    Optional<TicketEntity> findByNumero(String numero);

    Optional<TicketEntity> findByQrToken(String qrToken);

    /** JOIN FETCH client/technicien/site — utilisé par FeedbackService (évite N+1 sur lazy) */
    @Query("""
            SELECT t FROM TicketEntity t
            JOIN FETCH t.client
            LEFT JOIN FETCH t.technicien
            JOIN FETCH t.site
            WHERE t.qrToken = :qrToken
            """)
    Optional<TicketEntity> findByQrTokenWithRelations(@Param("qrToken") String qrToken);

    /**
     * Retourne le numéro de séquence maximal pour une année donnée.
     * Le numéro est au format TKT-YYYY-NNNNN → on extrait les 5 derniers chiffres.
     */
    @Query("SELECT MAX(CAST(SUBSTRING(t.numero, 10) AS integer)) FROM TicketEntity t " +
           "WHERE SUBSTRING(t.numero, 5, 4) = :year")
    Optional<Integer> findMaxSequenceByYear(@Param("year") String year);

    @Query("SELECT t FROM TicketEntity t LEFT JOIN FETCH t.client LEFT JOIN FETCH t.technicien LEFT JOIN FETCH t.site WHERE t.id = :id")
    Optional<TicketEntity> findByIdWithRelations(@Param("id") Long id);

    // --- Reporting Queries (filtre company) ---

    @Query("SELECT COUNT(t) FROM TicketEntity t WHERE t.createdAt >= :start AND t.createdAt <= :end AND (:siteId IS NULL OR t.site.id = :siteId) AND (:companyId IS NULL OR t.company.id = :companyId)")
    long countByPeriodAndSiteAndCompany(@Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end, @Param("siteId") Long siteId, @Param("companyId") Long companyId);

    @Query("SELECT COUNT(t) FROM TicketEntity t WHERE t.statut IN ('REPARE', 'CLOTURE') AND t.updatedAt >= :start AND t.updatedAt <= :end AND (:siteId IS NULL OR t.site.id = :siteId) AND (:companyId IS NULL OR t.company.id = :companyId)")
    long countResolvedByPeriodAndSiteAndCompany(@Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end, @Param("siteId") Long siteId, @Param("companyId") Long companyId);

    @Query("SELECT t.statut as statut, COUNT(t) as count FROM TicketEntity t WHERE t.createdAt >= :start AND t.createdAt <= :end AND (:siteId IS NULL OR t.site.id = :siteId) AND (:companyId IS NULL OR t.company.id = :companyId) GROUP BY t.statut")
    List<Object[]> countByStatusAndCompany(@Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end, @Param("siteId") Long siteId, @Param("companyId") Long companyId);

    @Query("SELECT COALESCE(t.site.nom, 'Sans site') as site, COUNT(t) as count FROM TicketEntity t WHERE t.createdAt >= :start AND t.createdAt <= :end AND (:siteId IS NULL OR t.site.id = :siteId) AND (:companyId IS NULL OR t.company.id = :companyId) GROUP BY t.site.nom")
    List<Object[]> countBySiteAndCompany(@Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end, @Param("siteId") Long siteId, @Param("companyId") Long companyId);

    @Query("SELECT t.technicien.nom as tech, COUNT(t) as count FROM TicketEntity t WHERE t.technicien IS NOT NULL AND t.createdAt >= :start AND t.createdAt <= :end AND (:siteId IS NULL OR t.site.id = :siteId) AND (:companyId IS NULL OR t.company.id = :companyId) GROUP BY t.technicien.nom")
    List<Object[]> countByTechnicianAndCompany(@Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end, @Param("siteId") Long siteId, @Param("companyId") Long companyId);

    // Conservées pour compatibilité ascendante
    @Query("SELECT COUNT(t) FROM TicketEntity t WHERE t.createdAt >= :start AND t.createdAt <= :end AND (:siteId IS NULL OR t.site.id = :siteId)")
    long countByPeriodAndSite(@Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end, @Param("siteId") Long siteId);

    @Query("SELECT COUNT(t) FROM TicketEntity t WHERE t.statut IN ('REPARE', 'CLOTURE') AND t.updatedAt >= :start AND t.updatedAt <= :end AND (:siteId IS NULL OR t.site.id = :siteId)")
    long countResolvedByPeriodAndSite(@Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end, @Param("siteId") Long siteId);

    @Query("SELECT COUNT(t) FROM TicketEntity t WHERE (:companyId IS NULL OR t.company.id = :companyId)")
    long countByCompanyId(@Param("companyId") Long companyId);
}
