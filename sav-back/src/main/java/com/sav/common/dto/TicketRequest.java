package com.sav.common.dto;

import com.sav.common.enums.TypeAppareil;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record TicketRequest(
        @NotNull Long clientId,
        @NotNull Long siteId,
        @NotNull TypeAppareil typeAppareil,
        @NotBlank String marqueModele,
        String numeroSerie,
        @NotBlank String descriptionPanne,
        @NotNull Boolean sousGarantie,
        LocalDate dateAchat,
        Long technicienId
) {}
