import { Injectable, inject, signal } from '@angular/core';
import { TicketService } from './ticket.service';
import { 
  Ticket, TicketStatut, BlockingReason, ResultatIntervention,
  DiagnosticRequest, BlockingRequest, TerminationRequest, TicketActionRequest
} from '../models/ticket.model';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TicketWorkflowService {
  private ticketService = inject(TicketService);

  // Méthode pour démarrer le diagnostic (RECU -> EN_DIAGNOSTIC)
  startDiagnostic(ticketId: number): Observable<Ticket> {
    return this.ticketService.startDiagnostic(ticketId);
  }

  // Méthode pour valider le diagnostic (EN_DIAGNOSTIC -> EN_COURS)
  completeDiagnostic(ticketId: number, diagnostic: string): Observable<Ticket> {
    return this.ticketService.completeDiagnostic(ticketId, diagnostic);
  }

  // Méthode pour ajouter une action (EN_COURS)
  addAction(ticketId: number, description: string): Observable<any> {
    return this.ticketService.addAction(ticketId, description);
  }

  // Méthode pour bloquer (EN_COURS -> EN_COURS [blocked])
  blockTicket(ticketId: number, reason: BlockingReason, observation?: string): Observable<Ticket> {
    return this.ticketService.blockTicket(ticketId, reason, observation);
  }

  // Méthode pour reprendre (EN_COURS [blocked] -> EN_COURS)
  resumeTicket(ticketId: number): Observable<Ticket> {
    return this.ticketService.resumeTicket(ticketId);
  }

  // Méthode pour terminer (EN_COURS -> TERMINE)
  terminateIntervention(ticketId: number, result: ResultatIntervention, observations?: string, temps?: number): Observable<Ticket> {
    return this.ticketService.terminateIntervention(ticketId, result, observations, temps);
  }

  // Méthode pour clôturer (TERMINE -> CLOTURE)
  closeTicket(ticketId: number): Observable<Ticket> {
    return this.ticketService.changeStatut(ticketId, 'CLOTURE');
  }
}
