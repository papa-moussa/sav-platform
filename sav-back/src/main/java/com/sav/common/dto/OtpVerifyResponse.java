package com.sav.common.dto;

/**
 * Réponse retournée après vérification OTP réussie.
 * Contient le token de session (accessToken) et les données du formulaire.
 *
 * @param accessToken token de session à usage unique, valable 15 minutes
 * @param formData    données du ticket à afficher dans le formulaire
 */
public record OtpVerifyResponse(
        String accessToken,
        FeedbackFormDataResponse formData
) {}
