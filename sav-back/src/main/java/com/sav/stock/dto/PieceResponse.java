package com.sav.stock.dto;

import com.sav.common.enums.TypeAppareil;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PieceResponse(
        Long id,
        String reference,
        String designation,
        TypeAppareil categorieAppareil,
        String marqueCompatible,
        Integer quantite,
        Integer seuilAlerte,
        BigDecimal prixUnitaire,
        Long siteId,
        String siteNom,
        boolean enAlerteStock,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
