package com.sav.user;

import com.sav.common.dto.PageResponse;
import com.sav.common.dto.UserRequest;
import com.sav.common.dto.UserResponse;
import com.sav.common.tenant.TenantContext;
import com.sav.company.CompanyEntity;
import com.sav.company.CompanyRepository;
import com.sav.site.SiteEntity;
import com.sav.site.SiteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository    userRepository;
    private final SiteRepository    siteRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder   passwordEncoder;

    public PageResponse<UserResponse> findAll(String search, Pageable pageable) {
        String s = (search != null && !search.isBlank()) ? search : "";
        // SUPER_ADMIN (companyId = null) → voit tous les utilisateurs
        Long companyId = TenantContext.get();
        return PageResponse.from(userRepository.searchByCompany(companyId, s, pageable).map(this::toResponse));
    }

    public UserResponse create(UserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email déjà utilisé : " + request.email());
        }

        SiteEntity site = null;
        if (request.siteId() != null) {
            site = siteRepository.findById(request.siteId())
                    .orElseThrow(() -> new EntityNotFoundException("Site non trouvé : " + request.siteId()));
        }

        // Associer l'utilisateur à la company courante (ou à celle fournie explicitement)
        CompanyEntity company = null;
        Long companyId = TenantContext.get();
        if (companyId != null) {
            company = companyRepository.findById(companyId)
                    .orElseThrow(() -> new EntityNotFoundException("Company non trouvée : " + companyId));
        }

        UserEntity user = UserEntity.builder()
                .nom(request.nom())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(request.role())
                .actif(true)
                .site(site)
                .company(company)
                .telephone(request.telephone())
                .build();

        return toResponse(userRepository.save(user));
    }

    public UserResponse toggleActif(Long id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé : " + id));
        user.setActif(!user.isActif());
        return toResponse(userRepository.save(user));
    }

    private UserResponse toResponse(UserEntity u) {
        return new UserResponse(
                u.getId(),
                u.getNom(),
                u.getEmail(),
                u.getRole(),
                u.isActif(),
                u.getSite() != null ? u.getSite().getId() : null,
                u.getSite() != null ? u.getSite().getNom() : null,
                u.getTelephone()
        );
    }
}
