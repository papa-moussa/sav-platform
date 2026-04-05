package com.sav.common.dto;

import com.sav.common.enums.ResultatIntervention;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record InterventionRequest(
        @NotBlank String diagnostic,
        @NotBlank String actionsRealisees,
        String observations,
        Double tempsPasseHeures,
        @NotNull ResultatIntervention resultat
) {}
