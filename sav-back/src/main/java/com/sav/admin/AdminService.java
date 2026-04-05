package com.sav.admin;

import com.sav.common.dto.ActivityItemDTO;
import com.sav.common.dto.AdminStatsResponse;
import com.sav.common.dto.AdminUserResponse;
import com.sav.common.dto.PageResponse;
import com.sav.common.enums.CompanyStatus;
import com.sav.common.mail.MailService;
import com.sav.company.CompanyEntity;
import com.sav.company.CompanyRepository;
import com.sav.feedback.FeedbackRepository;
import com.sav.ticket.TicketRepository;
import com.sav.user.UserEntity;
import com.sav.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final CompanyRepository companyRepository;
    private final UserRepository    userRepository;
    private final TicketRepository  ticketRepository;
    private final FeedbackRepository feedbackRepository;
    private final PasswordEncoder   passwordEncoder;
    private final MailService       mailService;

    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
    private static final SecureRandom RNG = new SecureRandom();

    // ─── Stats globales ───────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        long totalCompanies     = companyRepository.count();
        long activeCompanies    = companyRepository.countByStatus(CompanyStatus.ACTIVE);
        long suspendedCompanies = companyRepository.countByStatus(CompanyStatus.SUSPENDED);
        long totalUsers         = userRepository.count();
        long totalTickets       = ticketRepository.count();
        long totalFeedbacks     = feedbackRepository.count();
        Double avgRaw           = feedbackRepository.avgGlobalRating();
        double averageRating    = avgRaw != null ? Math.round(avgRaw * 10.0) / 10.0 : 0.0;

        List<ActivityItemDTO> recentActivity = buildRecentActivity();

        return new AdminStatsResponse(
                totalCompanies, activeCompanies, suspendedCompanies,
                totalUsers, totalTickets, totalFeedbacks, averageRating,
                recentActivity
        );
    }

    /** Agrège les 10 dernières activités (companies + users récemment créés) */
    private List<ActivityItemDTO> buildRecentActivity() {
        List<ActivityItemDTO> activities = new ArrayList<>();

        // 5 dernières companies créées
        companyRepository.findTop5ByOrderByCreatedAtDesc().forEach(c ->
                activities.add(new ActivityItemDTO(
                        "COMPANY_CREATED",
                        "Nouvelle entreprise créée : " + c.getName(),
                        c.getName(),
                        c.getCreatedAt()
                ))
        );

        // 5 derniers utilisateurs créés
        userRepository.findTop5ByOrderByCreatedAtDesc().forEach(u ->
                activities.add(new ActivityItemDTO(
                        "USER_CREATED",
                        "Nouvel utilisateur : " + u.getNom() + " (" + (u.getCompany() != null ? u.getCompany().getName() : "SUPER_ADMIN") + ")",
                        u.getCompany() != null ? u.getCompany().getName() : "Platform",
                        u.getCreatedAt()
                ))
        );

        // Trier par date décroissante, garder les 10 premiers
        activities.sort(Comparator.comparing(ActivityItemDTO::timestamp).reversed());
        return activities.stream().limit(10).toList();
    }

    // ─── Gestion globale des utilisateurs ────────────────────────────────────

    @Transactional(readOnly = true)
    public PageResponse<AdminUserResponse> findAllUsers(String search, Long companyId, Pageable pageable) {
        String s = (search != null && !search.isBlank()) ? search : "";
        return PageResponse.from(
                userRepository.searchByCompany(companyId, s, pageable)
                        .map(this::toAdminUserResponse)
        );
    }

    @Transactional
    public AdminUserResponse toggleUserActif(Long id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé : " + id));
        user.setActif(!user.isActif());
        return toAdminUserResponse(userRepository.save(user));
    }

    @Transactional
    public AdminUserResponse resetPassword(Long id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé : " + id));

        String plain = generatePassword(12);
        user.setPasswordHash(passwordEncoder.encode(plain));
        userRepository.save(user);

        String companyName = user.getCompany() != null ? user.getCompany().getName() : "SAV Platform";
        mailService.sendCompanyAdminCredentials(user.getEmail(), companyName, user.getEmail(), plain);

        log.info("Mot de passe réinitialisé pour l'utilisateur {} ({})", user.getNom(), user.getEmail());
        return toAdminUserResponse(user);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private AdminUserResponse toAdminUserResponse(UserEntity u) {
        return new AdminUserResponse(
                u.getId(),
                u.getNom(),
                u.getEmail(),
                u.getRole(),
                u.isActif(),
                u.getSite() != null ? u.getSite().getId() : null,
                u.getSite() != null ? u.getSite().getNom() : null,
                u.getCompany() != null ? u.getCompany().getId() : null,
                u.getCompany() != null ? u.getCompany().getName() : null
        );
    }

    private String generatePassword(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARS.charAt(RNG.nextInt(CHARS.length())));
        }
        return sb.toString();
    }
}
