import { Injectable, inject, signal, effect } from '@angular/core';
import { SavDbService, SyncQueueItem } from '../db/sav-db.service';
import { NetworkService } from '../network/network.service';
import { TicketApiService } from './ticket-api.service';
import { StockApiService } from './stock-api.service';
import { InterventionRequest, TicketStatut, SortieStockRequest } from '@sav/shared-models';

const MAX_RETRY = 3;

@Injectable({ providedIn: 'root' })
export class SyncService {
  private db      = inject(SavDbService);
  private network = inject(NetworkService);
  private ticketApi = inject(TicketApiService);
  private stockApi  = inject(StockApiService);

  readonly pendingCount = signal(0);
  readonly syncing      = signal(false);

  constructor() {
    // Déclencher la sync automatiquement au retour en ligne
    effect(() => {
      if (this.network.isOnline()) {
        this.syncAll();
      }
    });
    this.refreshPendingCount();
  }

  async queueIntervention(ticketId: number, payload: InterventionRequest): Promise<void> {
    await this.db.syncQueue.add({
      type: 'ADD_INTERVENTION',
      ticketId,
      payload: JSON.stringify(payload),
      createdAt: Date.now(),
      retryCount: 0,
    });
    await this.refreshPendingCount();
  }

  async queueStatusChange(ticketId: number, statut: TicketStatut): Promise<void> {
    await this.db.syncQueue.add({
      type: 'CHANGE_STATUS',
      ticketId,
      payload: JSON.stringify({ statut }),
      createdAt: Date.now(),
      retryCount: 0,
    });
    await this.refreshPendingCount();
  }

  async queueSortie(pieceId: number, ticketId: number, payload: SortieStockRequest): Promise<void> {
    await this.db.syncQueue.add({
      type: 'SORTIE_PIECE',
      ticketId,
      pieceId,
      payload: JSON.stringify(payload),
      createdAt: Date.now(),
      retryCount: 0,
    });
    await this.refreshPendingCount();
  }

  async syncAll(): Promise<void> {
    if (!this.network.isOnline() || this.syncing()) return;

    const items = await this.db.syncQueue.orderBy('createdAt').toArray();
    if (items.length === 0) return;

    this.syncing.set(true);

    for (const item of items) {
      await this.processItem(item);
    }

    this.syncing.set(false);
    await this.refreshPendingCount();
  }

  private async processItem(item: SyncQueueItem): Promise<void> {
    try {
      switch (item.type) {
        case 'ADD_INTERVENTION': {
          const payload = JSON.parse(item.payload) as InterventionRequest;
          await this.ticketApi.addIntervention(item.ticketId, payload);
          break;
        }
        case 'CHANGE_STATUS': {
          const { statut } = JSON.parse(item.payload) as { statut: TicketStatut };
          await this.ticketApi.changeStatut(item.ticketId, statut);
          break;
        }
        case 'SORTIE_PIECE': {
          const payload = JSON.parse(item.payload) as SortieStockRequest;
          await this.stockApi.sortieStock(item.pieceId!, payload);
          break;
        }
      }
      // Succès : supprimer l'item et rafraîchir le cache Dexie
      await this.db.syncQueue.delete(item.id!);
      const updated = await this.ticketApi.getById(item.ticketId);
      await this.db.tickets.put({ ...updated, cachedAt: Date.now() });
    } catch (err: unknown) {
      const status = (err as { status?: number }).status;
      // Conflit serveur (ex. transition de statut invalide) : on supprime sans retry
      if (status && status >= 400 && status < 500) {
        await this.db.syncQueue.delete(item.id!);
        return;
      }
      // Erreur réseau : incrémenter retryCount, supprimer si max atteint
      const newRetry = (item.retryCount ?? 0) + 1;
      if (newRetry >= MAX_RETRY) {
        await this.db.syncQueue.delete(item.id!);
      } else {
        await this.db.syncQueue.update(item.id!, { retryCount: newRetry });
      }
    }
  }

  private async refreshPendingCount(): Promise<void> {
    const count = await this.db.syncQueue.count();
    this.pendingCount.set(count);
  }
}
