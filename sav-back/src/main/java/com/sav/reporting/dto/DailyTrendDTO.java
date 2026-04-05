package com.sav.reporting.dto;

import java.time.LocalDate;

public record DailyTrendDTO(
    LocalDate date,
    long creations,
    long resolutions
) {}
