package com.sav.common.dto;

import java.time.LocalDateTime;

public record ActivityItemDTO(
        String type,        // COMPANY_CREATED | USER_CREATED | TICKET_CREATED | FEEDBACK_SUBMITTED
        String description,
        String companyName,
        LocalDateTime timestamp
) {}
