package com.sav.common.dto;

import com.sav.common.enums.TicketStatut;
import jakarta.validation.constraints.NotNull;

public record TicketStatusRequest(
        @NotNull TicketStatut statut
) {}
