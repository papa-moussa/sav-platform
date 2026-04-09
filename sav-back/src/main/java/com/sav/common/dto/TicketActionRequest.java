package com.sav.common.dto;

import jakarta.validation.constraints.NotBlank;

public record TicketActionRequest(
        @NotBlank String description
) {}
