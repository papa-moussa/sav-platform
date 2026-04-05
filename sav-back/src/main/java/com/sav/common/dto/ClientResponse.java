package com.sav.common.dto;

import java.time.LocalDateTime;

public record ClientResponse(
        Long id,
        String nom,
        String telephone,
        String email,
        String adresse,
        LocalDateTime createdAt
) {}
