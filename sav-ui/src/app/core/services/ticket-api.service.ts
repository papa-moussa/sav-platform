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
}
