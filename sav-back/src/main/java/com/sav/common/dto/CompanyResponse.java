package com.sav.common.dto;

import com.sav.common.enums.CompanyStatus;

import java.time.LocalDateTime;

public record CompanyResponse(
        Long id,
        String name,
        String slug,
        String email,
        String phone,
        String address,
        String logoUrl,
        CompanyStatus status,
        long userCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
