package com.sav.common.dto;

import com.sav.common.enums.Role;

public record UserResponse(
        Long id,
        String nom,
        String email,
        Role role,
        boolean actif,
        Long siteId,
        String siteNom,
        String telephone
) {}
