import { Injectable, signal } from '@angular/core';
import { Network } from '@capacitor/network';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  private _isOnline = signal(true);
  readonly isOnline = this._isOnline.asReadonly();

  constructor() {
    // Récupérer l'état initial
    Network.getStatus().then((status) => {
      this._isOnline.set(status.connected);
    });

    // Écouter les changements de connectivité
    Network.addListener('networkStatusChange', (status) => {
      this._isOnline.set(status.connected);
    });
  }
}
