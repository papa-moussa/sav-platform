package com.sav.company;

import com.sav.common.enums.CompanyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<CompanyEntity, Long> {

    Optional<CompanyEntity> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsByEmail(String email);

    List<CompanyEntity> findByStatus(CompanyStatus status);

    long countByStatus(CompanyStatus status);

    List<CompanyEntity> findTop5ByOrderByCreatedAtDesc();
}
