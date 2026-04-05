package com.sav.reporting.dto;

import com.sav.common.enums.TicketStatut;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record DashboardStatsResponse(
    long totalTickets,
    long resolvedTickets,
    long newClients,
    long totalClients,
    BigDecimal estimatedRevenue,
    Map<TicketStatut, Long> statusDistribution,
    Map<String, Long> siteDistribution,
    Map<String, Long> technicianPerformance,
    List<DailyTrendDTO> dailyTrends
) {}
