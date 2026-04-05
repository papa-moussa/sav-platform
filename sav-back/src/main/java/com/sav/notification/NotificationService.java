package com.sav.notification;

import com.sav.common.dto.NotificationRequest;
import com.sav.common.dto.NotificationResponse;
import com.sav.common.dto.PageResponse;
import com.sav.company.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final CompanyRepository companyRepository;

    public PageResponse<NotificationResponse> findAll(Pageable pageable) {
        return PageResponse.from(
                notificationRepository.findAllByOrderByCreatedAtDesc(pageable)
                        .map(this::toResponse)
        );
    }

    public NotificationResponse create(NotificationRequest req) {
        String companyNom = null;
        if (req.targetCompanyId() != null) {
            companyNom = companyRepository.findById(req.targetCompanyId())
                    .map(c -> c.getName())
                    .orElse(null);
        }

        NotificationEntity entity = NotificationEntity.builder()
                .title(req.title())
                .message(req.message())
                .type(req.type())
                .targetCompanyId(req.targetCompanyId())
                .targetCompanyNom(companyNom)
                .build();

        return toResponse(notificationRepository.save(entity));
    }

    private NotificationResponse toResponse(NotificationEntity e) {
        return new NotificationResponse(
                e.getId(),
                e.getTitle(),
                e.getMessage(),
                e.getType(),
                e.getTargetCompanyId(),
                e.getTargetCompanyNom(),
                e.getCreatedAt()
        );
    }
}
