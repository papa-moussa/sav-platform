package com.sav.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByCompanyId(Long companyId);

    // ─── Requêtes filtrées par company (multi-tenant) ─────────────────────────

    /**
     * Recherche paginée dans une company.
     * Si companyId = null (SUPER_ADMIN), retourne tous les utilisateurs.
     */
    @EntityGraph(attributePaths = {"site", "company"})
    @Query("SELECT u FROM UserEntity u WHERE " +
           "(:companyId IS NULL OR u.company.id = :companyId) AND " +
           "(LOWER(u.nom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<UserEntity> searchByCompany(@Param("companyId") Long companyId,
                                     @Param("search") String search,
                                     Pageable pageable);

    // ─── Conservées pour compatibilité interne ────────────────────────────────

    @Query("SELECT u FROM UserEntity u LEFT JOIN FETCH u.site LEFT JOIN FETCH u.company")
    List<UserEntity> findAllWithSite();

    @EntityGraph(attributePaths = {"site", "company"})
    @Query("SELECT u FROM UserEntity u WHERE " +
           "LOWER(u.nom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<UserEntity> search(@Param("search") String search, Pageable pageable);

    List<UserEntity> findTop5ByOrderByCreatedAtDesc();
}
