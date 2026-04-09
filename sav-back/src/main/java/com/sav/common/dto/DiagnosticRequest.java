package com.sav.common.dto;

import jakarta.validation.constraints.NotBlank;

public record DiagnosticRequest(
        @NotBlank String diagnostic
) {}
