package com.sav.stock.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record EntreeStockRequest(
        @NotNull @Min(1) Integer quantite,
        String motif
) {}
