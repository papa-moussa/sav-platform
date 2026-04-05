package com.sav.common.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Corps de la requête de vérification OTP.
 */
public record OtpVerifyRequest(

        @NotBlank(message = "Le token QR est obligatoire")
        String token,

        @NotBlank(message = "Le code OTP est obligatoire")
        @Size(min = 6, max = 6, message = "Le code OTP doit contenir exactement 6 chiffres")
        @Pattern(regexp = "\\d{6}", message = "Le code OTP doit être composé de 6 chiffres")
        String otp

) {}
