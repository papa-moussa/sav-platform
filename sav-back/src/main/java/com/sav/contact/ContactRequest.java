package com.sav.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(

        @NotBlank(message = "Le nom est requis")
        String name,

        @NotBlank(message = "L'email est requis")
        @Email(message = "Email invalide")
        String email,

        String company,

        @NotBlank(message = "Le message est requis")
        @Size(min = 10, message = "Le message doit contenir au moins 10 caractères")
        String message
) {}
