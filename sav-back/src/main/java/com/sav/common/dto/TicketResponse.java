package com.sav.common.dto;

import com.sav.common.enums.TicketStatut;
import com.sav.common.enums.TypeAppareil;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record TicketResponse(
        Long id,
        String numero,
        Long clientId,
        String clientNom,
        Long technicienId,
        String technicienNom,
        Long siteId,
        String siteNom,
        TypeAppareil typeAppareil,
        String marqueModele,
        String numeroSerie,
        String descriptionPanne,
        TicketStatut statut,
        boolean sousGarantie,
        LocalDate dateAchat,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<InterventionResponse> interventions,
        boolean feedbackSoumis,
        boolean qrTokenDisponible,
        String qrToken
) {}
