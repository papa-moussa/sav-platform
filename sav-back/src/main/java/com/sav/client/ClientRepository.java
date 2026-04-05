package com.sav.client;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, Long> {

    /**
     * Recherche paginée filtrée par company.
     * Si companyId = null (SUPER_ADMIN), retourne tous les clients.
     */
    @Query("SELECT c FROM ClientEntity c WHERE " +
           "(:companyId IS NULL OR c.company.id = :companyId) AND " +
           "(LOWER(c.nom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           " OR c.telephone LIKE CONCAT('%', :search, '%') " +
           " OR LOWER(COALESCE(c.email, '')) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<ClientEntity> searchByCompany(@Param("companyId") Long companyId,
                                       @Param("search") String search,
                                       Pageable pageable);

    // Conservée pour compatibilité
    @Query("SELECT c FROM ClientEntity c WHERE " +
           "LOWER(c.nom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR c.telephone LIKE CONCAT('%', :search, '%') " +
           "OR LOWER(COALESCE(c.email, '')) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<ClientEntity> search(@Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(c) FROM ClientEntity c WHERE " +
           "(:companyId IS NULL OR c.company.id = :companyId) AND " +
           "c.createdAt >= :start AND c.createdAt <= :end")
    long countByCompanyAndPeriod(@Param("companyId") Long companyId,
                                  @Param("start") java.time.LocalDateTime start,
                                  @Param("end") java.time.LocalDateTime end);

    @Query("SELECT COUNT(c) FROM ClientEntity c WHERE c.createdAt >= :start AND c.createdAt <= :end")
    long countByPeriod(@Param("start") java.time.LocalDateTime start,
                       @Param("end") java.time.LocalDateTime end);
}
