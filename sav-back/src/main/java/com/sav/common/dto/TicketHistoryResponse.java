package com.sav.common.dto;

import java.time.LocalDateTime;

public record TicketHistoryResponse(
        Long id,
        String utilisateurNom,
        String typeAction,
        String details,
        LocalDateTime timestamp
) {}
