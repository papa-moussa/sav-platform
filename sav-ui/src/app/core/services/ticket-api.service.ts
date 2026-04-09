import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  Ticket,
  TicketStatut,
  Intervention,
  InterventionRequest,
} from '@sav/shared-models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TicketApiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/tickets`;

  getMesTickets(): Promise<Ticket[]> {
    return firstValueFrom(this.http.get<Ticket[]>(`${this.base}/mes-tickets`));
  }

  getById(id: number): Promise<Ticket> {
    return firstValueFrom(this.http.get<Ticket>(`${this.base}/${id}`));
  }

  changeStatut(id: number, statut: TicketStatut): Promise<Ticket> {
    return firstValueFrom(
      this.http.patch<Ticket>(`${this.base}/${id}/statut`, { statut })
    );
  }

  addIntervention(id: number, request: InterventionRequest): Promise<Intervention> {
    return firstValueFrom(
      this.http.post<Intervention>(`${this.base}/${id}/interventions`, request)
    );
  }

  getQrCode(id: number): Promise<{ base64Image: string; expiresAt: string }> {
    return firstValueFrom(
      this.http.get<{ base64Image: string; expiresAt: string }>(`${this.base}/${id}/qrcode`)
    );
  }

  // --- Workflow Methods ---

  startDiagnostic(id: number): Promise<Ticket> {
    return firstValueFrom(
      this.http.post<Ticket>(`${this.base}/${id}/start-diagnostic`, {})
    );
  }

  completeDiagnostic(id: number, diagnostic: string): Promise<Ticket> {
    return firstValueFrom(
      this.http.post<Ticket>(`${this.base}/${id}/complete-diagnostic`, { diagnostic })
    );
  }

  addAction(id: number, description: string): Promise<any> {
    return firstValueFrom(
      this.http.post<any>(`${this.base}/${id}/actions`, { description })
    );
  }

  blockTicket(id: number, reason: string, observation?: string): Promise<Ticket> {
    return firstValueFrom(
      this.http.post<Ticket>(`${this.base}/${id}/block`, { reason, observation })
    );
  }

  resumeTicket(id: number): Promise<Ticket> {
    return firstValueFrom(
      this.http.post<Ticket>(`${this.base}/${id}/resume`, {})
    );
  }

  terminateIntervention(id: number, result: string, observations?: string, tempsPasseHeures?: number): Promise<Ticket> {
    return firstValueFrom(
      this.http.post<Ticket>(`${this.base}/${id}/terminate`, { result, observations, tempsPasseHeures })
    );
  }
}

