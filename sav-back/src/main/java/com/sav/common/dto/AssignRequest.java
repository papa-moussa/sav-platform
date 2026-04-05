package com.sav.common.dto;

import jakarta.validation.constraints.NotNull;

public record AssignRequest(
        @NotNull Long technicienId
) {}
