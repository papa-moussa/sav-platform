package com.sav.reporting;

import com.sav.client.ClientRepository;
import com.sav.common.enums.TicketStatut;
import com.sav.common.tenant.TenantContext;
import com.sav.reporting.dto.DashboardStatsResponse;
import com.sav.reporting.dto.DailyTrendDTO;
import com.sav.stock.MouvementStockRepository;
import com.sav.ticket.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportingService {

    private final TicketRepository ticketRepository;
    private final MouvementStockRepository mouvementStockRepository;
    private final ClientRepository clientRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats(Long siteId, LocalDate start, LocalDate end) {
        LocalDateTime startDt = start.atStartOfDay();
        LocalDateTime endDt   = end.atTime(LocalTime.MAX);

        // Filtre tenant — null = SUPER_ADMIN (voit tout)
        Long companyId = TenantContext.get();

        long total    = ticketRepository.countByPeriodAndSiteAndCompany(startDt, endDt, siteId, companyId);
        long resolved = ticketRepository.countResolvedByPeriodAndSiteAndCompany(startDt, endDt, siteId, companyId);
        long newClients = clientRepository.countByCompanyAndPeriod(companyId, startDt, endDt);
        BigDecimal revenue = mouvementStockRepository.sumRevenueByPeriodAndSiteAndCompany(startDt, endDt, siteId, companyId);
        if (revenue == null) revenue = BigDecimal.ZERO;

        Map<TicketStatut, Long> statusDist = listToMap(ticketRepository.countByStatusAndCompany(startDt, endDt, siteId, companyId));
        Map<String, Long> siteDist         = listToMapStr(ticketRepository.countBySiteAndCompany(startDt, endDt, siteId, companyId));
        Map<String, Long> techPerf         = listToMapStr(ticketRepository.countByTechnicianAndCompany(startDt, endDt, siteId, companyId));

        List<DailyTrendDTO> trends = new ArrayList<>();
        LocalDate current = start;
        while (!current.isAfter(end)) {
            LocalDateTime dayStart = current.atStartOfDay();
            LocalDateTime dayEnd   = current.atTime(LocalTime.MAX);
            long created = ticketRepository.countByPeriodAndSiteAndCompany(dayStart, dayEnd, siteId, companyId);
            long closed  = ticketRepository.countResolvedByPeriodAndSiteAndCompany(dayStart, dayEnd, siteId, companyId);
            if (created > 0 || closed > 0) {
                trends.add(new DailyTrendDTO(current, created, closed));
            }
            current = current.plusDays(1);
        }

        long totalClients = clientRepository.countByCompanyAndPeriod(
                companyId, LocalDateTime.of(2000, 1, 1, 0, 0), LocalDateTime.now());

        return new DashboardStatsResponse(
                total, resolved, newClients, totalClients, revenue,
                statusDist, siteDist, techPerf, trends
        );
    }

    private Map<TicketStatut, Long> listToMap(List<Object[]> list) {
        Map<TicketStatut, Long> map = new HashMap<>();
        for (Object[] obj : list) {
            if (obj[0] == null) continue;
            TicketStatut status;
            if (obj[0] instanceof TicketStatut) {
                status = (TicketStatut) obj[0];
            } else {
                try { status = TicketStatut.valueOf(obj[0].toString()); }
                catch (Exception e) { continue; }
            }
            map.put(status, (Long) obj[1]);
        }
        return map;
    }

    private Map<String, Long> listToMapStr(List<Object[]> list) {
        Map<String, Long> map = new HashMap<>();
        for (Object[] obj : list) {
            String key = obj[0] != null ? obj[0].toString() : "Inconnu";
            map.put(key, (Long) obj[1]);
        }
        return map;
    }
}
