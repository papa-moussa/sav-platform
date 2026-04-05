package com.sav.stock.dto;

import com.sav.common.enums.TypeAppareil;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PieceRequest(
        @NotBlank String reference,
        @NotBlank String designation,
        @NotNull TypeAppareil categorieAppareil,
        String marqueCompatible,
        @NotNull @Min(0) Integer quantite,
        @NotNull @Min(0) Integer seuilAlerte,
        BigDecimal prixUnitaire,
        @NotNull Long siteId
) {}
