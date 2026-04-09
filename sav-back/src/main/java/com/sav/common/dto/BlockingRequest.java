package com.sav.common.dto;

import com.sav.common.enums.BlockingReason;
import jakarta.validation.constraints.NotNull;

public record BlockingRequest(
        @NotNull BlockingReason reason,
        String observation
) {}
