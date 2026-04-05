package com.sav.common.dto;

import jakarta.validation.constraints.NotBlank;

public record SiteRequest(
        @NotBlank String nom,
        String adresse
) {}
