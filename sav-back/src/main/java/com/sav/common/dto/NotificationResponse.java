package com.sav.common.dto;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String title,
        String message,
        String type,
        Long targetCompanyId,
        String targetCompanyNom,
        LocalDateTime createdAt
) {}
