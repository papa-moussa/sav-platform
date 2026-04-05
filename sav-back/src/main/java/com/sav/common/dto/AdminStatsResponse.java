package com.sav.common.dto;

import java.util.List;

public record AdminStatsResponse(
        long totalCompanies,
        long activeCompanies,
        long suspendedCompanies,
        long totalUsers,
        long totalTickets,
        long totalFeedbacks,
        double averageRating,
        List<ActivityItemDTO> recentActivity
) {}
