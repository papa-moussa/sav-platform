import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Ticket,
  TicketRequest,
  TicketFilters,
  TicketStatut,
  Intervention,
  InterventionRequest,
  AssignRequest,
  QrCodeResponse,
} from '../models/ticket.model';
import { PageResponse } from '../models/page.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/tickets`;

  getAll(filters?: TicketFilters, page = 0, size = 20): Observable<PageResponse<Ticket>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
    if (filters?.statut) params = params.set('statut', filters.statut);
    if (filters?.siteId) params = params.set('siteId', filters.siteId);
    if (filters?.technicienId) params = params.set('technicienId', filters.technicienId);
    if (filters?.clientId) params = params.set('clientId', filters.clientId);
    if (filters?.search?.trim()) params = params.set('search', filters.search.trim());
    if (filters?.dateDebut) params = params.set('dateDebut', filters.dateDebut);
    if (filters?.dateFin) params = params.set('dateFin', filters.dateFin);
    return this.http.get<PageResponse<Ticket>>(this.base, { params });
  }

  getMesTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.base}/mes-tickets`);
  }

  getById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.base}/${id}`);
  }

  create(request: TicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(this.base, request);
  }

  changeStatut(id: number, statut: TicketStatut): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.base}/${id}/statut`, { statut });
  }

  assigner(id: number, request: AssignRequest): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.base}/${id}/assigner`, request);
  }

  addIntervention(id: number, request: InterventionRequest): Observable<Intervention> {
    return this.http.post<Intervention>(`${this.base}/${id}/interventions`, request);
  }

  getQrCode(id: number): Observable<QrCodeResponse> {
    return this.http.get<QrCodeResponse>(`${this.base}/${id}/qrcode`);
  }
}
