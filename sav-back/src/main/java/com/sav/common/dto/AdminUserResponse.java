package com.sav.common.dto;

import com.sav.common.enums.Role;

public record AdminUserResponse(
        Long id,
        String nom,
        String email,
        Role role,
        boolean actif,
        Long siteId,
        String siteNom,
        Long companyId,
        String companyNom
) {}
