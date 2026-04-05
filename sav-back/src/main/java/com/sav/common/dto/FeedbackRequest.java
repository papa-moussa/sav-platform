package com.sav.common.dto;

import jakarta.validation.constraints.*;

public record FeedbackRequest(

        @NotBlank(message = "Le token de session est obligatoire")
        String accessToken,

        @NotNull(message = "La note technicien est obligatoire")
        @Min(value = 1, message = "La note minimale est 1")
        @Max(value = 5, message = "La note maximale est 5")
        Integer noteTechnicien,

        @Size(max = 1000, message = "Le commentaire ne peut excéder 1000 caractères")
        String commentaireTechnicien,

        @NotNull(message = "La note entreprise est obligatoire")
        @Min(value = 1, message = "La note minimale est 1")
        @Max(value = 5, message = "La note maximale est 5")
        Integer noteEntreprise,

        @Size(max = 1000, message = "Le commentaire ne peut excéder 1000 caractères")
        String commentaireEntreprise

) {}
