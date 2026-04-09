import { Injectable, inject, signal, computed } from '@angular/core';
import { Ticket, TicketStatut } from '@sav/shared-models';
import { TicketApiService } from '../../core/services/ticket-api.service';
import { SavDbService } from '../../core/db/sav-db.service';
import { NetworkService } from '../../core/network/network.service';

@Injectable({ providedIn: 'root' })
export class TicketStore {
  private api     = inject(TicketApiService);
  private db      = inject(SavDbService);
  private network = inject(NetworkService);

  readonly tickets        = signal<Ticket[]>([]);
  readonly selectedTicket = signal<Ticket | null>(null);
  readonly loading        = signal(false);
  readonly error          = signal<string | null>(null);
  readonly filterStatut   = signal<TicketStatut | 'ALL'>('ALL');
  readonly qrCode         = signal<{ base64Image: string; expiresAt: string } | null>(null);

  readonly filteredTickets = computed(() => {
    const f = this.filterStatut();
    return f === 'ALL'
      ? this.tickets()
      : this.tickets().filter((t) => t.statut === f);
  });

  async loadTickets(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      if (this.network.isOnline()) {
        const list = await this.api.getMesTickets();
        // Mettre à jour le cache Dexie
        const now = Date.now();
        await this.db.tickets.bulkPut(list.map((t) => ({ ...t, cachedAt: now })));
        this.tickets.set(list);
      } else {
        const cached = await this.db.tickets.toArray();
        this.tickets.set(cached);
      }
    } catch {
      this.error.set('Impossible de charger les tickets.');
      // Fallback sur le cache
      const cached = await this.db.tickets.toArray();
      this.tickets.set(cached);
    } finally {
      this.loading.set(false);
    }
  }

  async loadDetail(id: number): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    this.qrCode.set(null); // Reset QR code on detail load
    try {
      if (this.network.isOnline()) {
        const ticket = await this.api.getById(id);
        await this.db.tickets.put({ ...ticket, cachedAt: Date.now() });
        this.selectedTicket.set(ticket);
        
        // Auto-load QR code if status is TERMINE
        if (ticket.statut === 'TERMINE' && !ticket.feedbackSoumis) {
          this.loadQrCode(ticket.id);
        }
      } else {
        const cached = await this.db.tickets.get(id);
        this.selectedTicket.set(cached ?? null);
      }
    } catch {
      this.error.set('Impossible de charger le ticket.');
      const cached = await this.db.tickets.get(id);
      this.selectedTicket.set(cached ?? null);
    } finally {
      this.loading.set(false);
    }
  }

  async loadQrCode(id: number): Promise<void> {
    try {
      const resp = await this.api.getQrCode(id);
      this.qrCode.set(resp);
    } catch {
      console.error('Erreur lors du chargement du QR Code');
    }
  }

  updateTicketLocally(ticket: Ticket): void {
    this.selectedTicket.set(ticket);
    this.tickets.update((list) =>
      list.map((t) => (t.id === ticket.id ? ticket : t))
    );
    // Mettre à jour le cache Dexie de manière asynchrone
    this.db.tickets.put({ ...ticket, cachedAt: Date.now() });
    
    // Check for QR Code if needed
    if (ticket.statut === 'TERMINE' && !ticket.feedbackSoumis && !this.qrCode()) {
      this.loadQrCode(ticket.id);
    }
  }

  // --- Workflow Actions ---

  async startDiagnostic(id: number): Promise<void> {
    this.loading.set(true);
    try {
      const updated = await this.api.startDiagnostic(id);
      this.updateTicketLocally(updated);
    } catch {
      this.error.set('Erreur lors du démarrage du diagnostic.');
    } finally {
      this.loading.set(false);
    }
  }

  async completeDiagnostic(id: number, diagnostic: string): Promise<void> {
    this.loading.set(true);
    try {
      const updated = await this.api.completeDiagnostic(id, diagnostic);
      this.updateTicketLocally(updated);
    } catch {
      this.error.set('Erreur lors de la validation du diagnostic.');
    } finally {
      this.loading.set(false);
    }
  }

  async addAction(id: number, description: string): Promise<void> {
    try {
      await this.api.addAction(id, description);
      // Re-load detail to get updated actions and status
      await this.loadDetail(id);
    } catch {
      this.error.set('Erreur lors de l\'ajout de l\'action.');
    }
  }

  async blockTicket(id: number, reason: string, observation?: string): Promise<void> {
    this.loading.set(true);
    try {
      const updated = await this.api.blockTicket(id, reason, observation);
      this.updateTicketLocally(updated);
    } catch {
      this.error.set('Erreur lors du blocage du ticket.');
    } finally {
      this.loading.set(false);
    }
  }

  async resumeTicket(id: number): Promise<void> {
    this.loading.set(true);
    try {
      const updated = await this.api.resumeTicket(id);
      this.updateTicketLocally(updated);
    } catch {
      this.error.set('Erreur lors de la reprise de l\'intervention.');
    } finally {
      this.loading.set(false);
    }
  }

  async terminateIntervention(id: number, result: string, observations?: string, temps?: number): Promise<void> {
    this.loading.set(true);
    try {
      const updated = await this.api.terminateIntervention(id, result, observations, temps);
      this.updateTicketLocally(updated);
    } catch {
      this.error.set('Erreur lors de la finalisation de l\'intervention.');
    } finally {
      this.loading.set(false);
    }
  }
}

