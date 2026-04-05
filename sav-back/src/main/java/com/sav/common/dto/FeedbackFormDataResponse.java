package com.sav.common.dto;

import com.sav.common.enums.TypeAppareil;

/**
 * Données renvoyées au formulaire public de feedback (scan QR Code).
 * Ne contient aucune information sensible.
 */
public record FeedbackFormDataResponse(
        Long ticketId,
        String ticketNumero,
        TypeAppareil typeAppareil,
        String marqueModele,
        String descriptionPanne,
        String technicienNom,
        String siteNom,
        boolean feedbackDejaSoumis
) {}
