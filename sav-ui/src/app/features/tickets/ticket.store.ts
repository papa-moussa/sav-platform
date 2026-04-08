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
    try {
      if (this.network.isOnline()) {
        const ticket = await this.api.getById(id);
        await this.db.tickets.put({ ...ticket, cachedAt: Date.now() });
        this.selectedTicket.set(ticket);
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

  updateTicketLocally(ticket: Ticket): void {
    this.selectedTicket.set(ticket);
    this.tickets.update((list) =>
      list.map((t) => (t.id === ticket.id ? ticket : t))
    );
    // Mettre à jour le cache Dexie de manière asynchrone
    this.db.tickets.put({ ...ticket, cachedAt: Date.now() });
  }
}
