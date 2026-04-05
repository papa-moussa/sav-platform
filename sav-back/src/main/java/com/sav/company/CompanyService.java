package com.sav.company;

import com.sav.common.dto.CompanyRequest;
import com.sav.common.dto.CompanyResponse;
import com.sav.common.enums.CompanyStatus;
import com.sav.common.enums.Role;
import com.sav.common.mail.MailService;
import com.sav.user.UserEntity;
import com.sav.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository    userRepository;
    private final PasswordEncoder   passwordEncoder;
    private final MailService       mailService;

    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
    private static final SecureRandom RNG = new SecureRandom();

    // ─── Lecture ─────────────────────────────────────────────────────────────

    public List<CompanyResponse> findAll() {
        return companyRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public CompanyResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    // ─── Création ─────────────────────────────────────────────────────────────

    @Transactional
    public CompanyResponse create(CompanyRequest request) {
        if (companyRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("Le slug '" + request.slug() + "' est déjà utilisé.");
        }
        if (companyRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("L'email '" + request.email() + "' est déjà utilisé.");
        }

        CompanyEntity company = CompanyEntity.builder()
                .name(request.name())
                .slug(request.slug())
                .email(request.email())
                .phone(request.phone())
                .address(request.address())
                .logoUrl(request.logoUrl())
                .status(CompanyStatus.ACTIVE)
                .build();

        company = companyRepository.save(company);

        // Créer l'admin de la company avec un mot de passe aléatoire
        String plainPassword = generatePassword(12);
        UserEntity admin = UserEntity.builder()
                .nom("Administrateur " + company.getName())
                .email(company.getEmail())
                .passwordHash(passwordEncoder.encode(plainPassword))
                .role(Role.ADMIN)
                .company(company)
                .build();
        userRepository.save(admin);

        // Envoyer les identifiants par mail (loggués si mail désactivé)
        mailService.sendCompanyAdminCredentials(
                company.getEmail(),
                company.getName(),
                company.getEmail(),
                plainPassword
        );

        return toResponse(company);
    }

    /** Génère un mot de passe aléatoire de longueur donnée */
    private String generatePassword(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARS.charAt(RNG.nextInt(CHARS.length())));
        }
        return sb.toString();
    }

    // ─── Mise à jour ─────────────────────────────────────────────────────────

    @Transactional
    public CompanyResponse update(Long id, CompanyRequest request) {
        CompanyEntity company = getOrThrow(id);

        if (!company.getSlug().equals(request.slug()) && companyRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("Le slug '" + request.slug() + "' est déjà utilisé.");
        }

        company.setName(request.name());
        company.setSlug(request.slug());
        company.setEmail(request.email());
        company.setPhone(request.phone());
        company.setAddress(request.address());
        company.setLogoUrl(request.logoUrl());

        return toResponse(companyRepository.save(company));
    }

    // ─── Activation / Suspension ──────────────────────────────────────────────

    @Transactional
    public CompanyResponse toggleStatus(Long id) {
        CompanyEntity company = getOrThrow(id);
        company.setStatus(company.getStatus() == CompanyStatus.ACTIVE
                ? CompanyStatus.SUSPENDED
                : CompanyStatus.ACTIVE);
        return toResponse(companyRepository.save(company));
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private CompanyEntity getOrThrow(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Entreprise non trouvée : " + id));
    }

    private CompanyResponse toResponse(CompanyEntity c) {
        long userCount = userRepository.countByCompanyId(c.getId());
        return new CompanyResponse(
                c.getId(),
                c.getName(),
                c.getSlug(),
                c.getEmail(),
                c.getPhone(),
                c.getAddress(),
                c.getLogoUrl(),
                c.getStatus(),
                userCount,
                c.getCreatedAt(),
                c.getUpdatedAt()
        );
    }
}
