package com.sav.config;

import com.sav.common.enums.CompanyStatus;
import com.sav.common.enums.Role;
import com.sav.company.CompanyEntity;
import com.sav.company.CompanyRepository;
import com.sav.site.SiteEntity;
import com.sav.site.SiteRepository;
import com.sav.user.UserEntity;
import com.sav.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final CompanyRepository companyRepository;
    private final SiteRepository    siteRepository;
    private final UserRepository    userRepository;
    private final PasswordEncoder   passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        initSuperAdmin();
        CompanyEntity demoCompany = initDemoCompany();
        initDemoSiteAndAdmin(demoCompany);
    }

    // ─── SUPER_ADMIN global (pas de company) ──────────────────────────────────

    private void initSuperAdmin() {
        if (userRepository.existsByEmail("pamodiallo@gmail.com")) return;

        UserEntity superAdmin = UserEntity.builder()
                .nom("Papa Moussa Diallo")
                .email("pamodiallo@gmail.com")
                .passwordHash(passwordEncoder.encode("passer123"))
                .role(Role.SUPER_ADMIN)
                .actif(true)
                .company(null) // Pas de company — accès global
                .telephone("+221770000000")
                .build();
        userRepository.save(superAdmin);

        log.warn("══════════════════════════════════════════════════════════════");
        log.warn("  SUPER_ADMIN CRÉÉ : pamodiallo@gmail.com / passer123");
        log.warn("  CHANGEZ CE MOT DE PASSE IMMÉDIATEMENT EN PRODUCTION !");
        log.warn("══════════════════════════════════════════════════════════════");
    }

    // ─── Entreprise de démonstration ──────────────────────────────────────────

    private CompanyEntity initDemoCompany() {
        return companyRepository.findBySlug("demo")
                .orElseGet(() -> {
                    CompanyEntity company = CompanyEntity.builder()
                            .name("SAV Demo")
                            .slug("demo")
                            .email("contact@sav-demo.com")
                            .phone("+221 33 123 45 67")
                            .address("123 Avenue Principale, Dakar")
                            .status(CompanyStatus.ACTIVE)
                            .build();
                    CompanyEntity saved = companyRepository.save(company);
                    log.info("Entreprise de démo créée : '{}' (id={})", saved.getName(), saved.getId());
                    return saved;
                });
    }

    // ─── Site siège + Admin de la company démo ────────────────────────────────

    private void initDemoSiteAndAdmin(CompanyEntity company) {
        // Site siège
        SiteEntity siege;
        var sites = siteRepository.findByCompanyId(company.getId());
        if (sites.isEmpty()) {
            siege = SiteEntity.builder()
                    .nom("Siège")
                    .adresse("123 Avenue Principale, Dakar")
                    .company(company)
                    .build();
            siege = siteRepository.save(siege);
            log.info("Site 'Siège' créé pour la company '{}' (id={})", company.getName(), siege.getId());
        } else {
            siege = sites.get(0);
        }

        // Admin de la company démo
        if (userRepository.existsByEmail("admin@sav.local")) return;

        UserEntity admin = UserEntity.builder()
                .nom("Administrateur")
                .email("admin@sav.local")
                .passwordHash(passwordEncoder.encode("passer123"))
                .role(Role.ADMIN)
                .actif(true)
                .site(siege)
                .company(company)
                .telephone("+221771111111")
                .build();
        userRepository.save(admin);

        log.warn("══════════════════════════════════════════════════════════════");
        log.warn("  ADMIN DÉMO CRÉÉ : admin@sav.local / passer123");
        log.warn("  Company : {} (slug: {})", company.getName(), company.getSlug());
        log.warn("  CHANGEZ CE MOT DE PASSE IMMÉDIATEMENT EN PRODUCTION !");
        log.warn("══════════════════════════════════════════════════════════════");
    }
}
