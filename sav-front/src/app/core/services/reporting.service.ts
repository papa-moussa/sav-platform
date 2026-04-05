import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DailyTrend {
  date: string;
  creations: number;
  resolutions: number;
}

export interface DashboardStats {
  totalTickets: number;
  resolvedTickets: number;
  newClients: number;
  totalClients: number;
  estimatedRevenue: number;
  statusDistribution: Record<string, number>;
  siteDistribution: Record<string, number>;
  technicianPerformance: Record<string, number>;
  dailyTrends: DailyTrend[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reporting`;

  getStats(startDate: string, endDate: string, siteId?: number): Observable<DashboardStats> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    if (siteId) {
      params = params.set('siteId', siteId.toString());
    }

    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`, { params });
  }
}
