package com.sav.common.dto;

import jakarta.validation.constraints.NotBlank;

public record ClientRequest(
        @NotBlank String nom,
        @NotBlank String telephone,
        String email,
        String adresse
) {}
