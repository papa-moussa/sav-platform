import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Ticket } from '@sav/shared-models';

export interface CachedTicket extends Ticket {
  cachedAt: number;
}

export type SyncItemType = 'ADD_INTERVENTION' | 'CHANGE_STATUS' | 'SORTIE_PIECE';

export interface SyncQueueItem {
  id?: number;
  type: SyncItemType;
  ticketId: number;
  pieceId?: number;
  payload: string; // JSON.stringify du body de requête
  createdAt: number;
  retryCount: number;
}

@Injectable({ providedIn: 'root' })
export class SavDbService extends Dexie {
  tickets!: Table<CachedTicket, number>;
  syncQueue!: Table<SyncQueueItem, number>;

  constructor() {
    super('sav_db');
    this.version(1).stores({
      tickets: 'id, statut, technicienId, cachedAt',
      syncQueue: '++id, type, ticketId, createdAt',
    });
  }
}
