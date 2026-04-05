package com.sav.common.dto;

import com.sav.common.enums.Role;

public record LoginResponse(
        String token,
        Role role,
        String nom,
        /** ID de l'entreprise — null pour SUPER_ADMIN */
        Long companyId,
        /** Nom de l'entreprise — null pour SUPER_ADMIN */
        String companyNom
) {}
