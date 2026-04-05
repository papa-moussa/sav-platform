package com.sav.site;

import com.sav.common.dto.SiteRequest;
import com.sav.common.dto.SiteResponse;
import com.sav.common.tenant.TenantContext;
import com.sav.company.CompanyEntity;
import com.sav.company.CompanyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SiteService {

    private final SiteRepository    siteRepository;
    private final CompanyRepository companyRepository;

    // Cache supprimé car incompatible avec la clé de cache multi-tenant.
    // Réactiver avec @Cacheable(value="sites", key="#root.target.currentCompanyId()")
    public List<SiteResponse> findAll() {
        Long companyId = TenantContext.get();
        return siteRepository.findByCompanyId(companyId).stream()
                .map(s -> new SiteResponse(s.getId(), s.getNom(), s.getAdresse()))
                .toList();
    }

    public SiteResponse create(SiteRequest request) {
        Long companyId = TenantContext.get();
        CompanyEntity company = null;
        if (companyId != null) {
            company = companyRepository.findById(companyId)
                    .orElseThrow(() -> new EntityNotFoundException("Company non trouvée : " + companyId));
        }

        SiteEntity site = SiteEntity.builder()
                .nom(request.nom())
                .adresse(request.adresse())
                .company(company)
                .build();
        SiteEntity saved = siteRepository.save(site);
        return new SiteResponse(saved.getId(), saved.getNom(), saved.getAdresse());
    }
}
