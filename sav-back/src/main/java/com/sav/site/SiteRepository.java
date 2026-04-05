package com.sav.site;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiteRepository extends JpaRepository<SiteEntity, Long> {

    /**
     * Retourne les sites d'une company.
     * Si companyId = null (SUPER_ADMIN), retourne tous les sites.
     */
    @Query("SELECT s FROM SiteEntity s WHERE :companyId IS NULL OR s.company.id = :companyId")
    List<SiteEntity> findByCompanyId(@Param("companyId") Long companyId);
}
