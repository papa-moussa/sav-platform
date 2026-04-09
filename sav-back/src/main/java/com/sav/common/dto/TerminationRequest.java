package com.sav.common.dto;

import com.sav.common.enums.ResultatIntervention;
import jakarta.validation.constraints.NotNull;

public record TerminationRequest(
        @NotNull ResultatIntervention result,
        String observations,
        Double tempsPasseHeures
) {}
