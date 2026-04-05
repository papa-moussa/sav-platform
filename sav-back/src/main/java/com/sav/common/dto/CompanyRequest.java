package com.sav.common.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CompanyRequest(

        @NotBlank(message = "Le nom est obligatoire")
        String name,

        @NotBlank(message = "Le slug est obligatoire")
        @Pattern(regexp = "^[a-z0-9-]+$", message = "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets")
        @Size(min = 2, max = 50, message = "Le slug doit faire entre 2 et 50 caractères")
        String slug,

        @NotBlank(message = "L'email est obligatoire")
        @Email(message = "Email invalide")
        String email,

        String phone,

        String address,

        String logoUrl

) {}
