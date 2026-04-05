package com.sav.common.dto;

import com.sav.common.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserRequest(
        @NotBlank String nom,
        @NotBlank @Email String email,
        @NotBlank String password,
        @NotNull Role role,
        Long siteId
) {}
