package com.sav.common.dto;

/**
 * Réponse retournée lors de l'initiation du flow OTP.
 *
 * @param alreadySubmitted true si le feedback a déjà été soumis pour ce ticket
 * @param maskedPhone      numéro de téléphone masqué (ex: +221 **** **89), null si alreadySubmitted
 * @param message          message informatif à afficher à l'utilisateur, null si alreadySubmitted
 */
public record OtpInitiateResponse(
        boolean alreadySubmitted,
        String maskedPhone,
        String message
) {}
