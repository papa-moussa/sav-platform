package com.sav.stock.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SortieStockRequest(
        @NotNull @Min(1) Integer quantite,
        Long interventionId,
        String motif
) {}
