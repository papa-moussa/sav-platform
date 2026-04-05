package com.sav.common.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NotificationRequest(
        @NotBlank @Size(max = 150) String title,
        @NotBlank @Size(max = 1000) String message,
        @NotBlank String type,           // INFO | ALERT | MAINTENANCE
        Long targetCompanyId             // null = toutes les companies
) {}
