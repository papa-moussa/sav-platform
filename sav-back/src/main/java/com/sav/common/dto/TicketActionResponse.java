package com.sav.common.dto;

import java.time.LocalDateTime;

public record TicketActionResponse(
        Long id,
        String technicienNom,
        String description,
        LocalDateTime createdAt
) {}
