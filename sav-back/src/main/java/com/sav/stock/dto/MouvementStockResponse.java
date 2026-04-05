package com.sav.stock.dto;

import com.sav.common.enums.TypeMouvementStock;

import java.time.LocalDateTime;

public record MouvementStockResponse(
        Long id,
        TypeMouvementStock type,
        Integer quantite,
        Long interventionId,
        String motif,
        String createdByNom,
        LocalDateTime createdAt
) {}
