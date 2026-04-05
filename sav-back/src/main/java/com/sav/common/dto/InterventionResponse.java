package com.sav.common.dto;

import com.sav.common.enums.ResultatIntervention;

import java.time.LocalDateTime;

public record InterventionResponse(
        Long id,
        String technicienNom,
        String diagnostic,
        String actionsRealisees,
        String observations,
        Double tempsPasseHeures,
        ResultatIntervention resultat,
        LocalDateTime createdAt
) {}
