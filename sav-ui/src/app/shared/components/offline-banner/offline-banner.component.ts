import { Component, inject } from '@angular/core';
import { IonItem, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudOfflineOutline } from 'ionicons/icons';
import { NetworkService } from '../../../core/network/network.service';
import { SyncService } from '../../../core/services/sync.service';

@Component({
  selector: 'app-offline-banner',
  standalone: true,
  imports: [IonItem, IonIcon, IonLabel],
  template: `
    @if (!networkService.isOnline()) {
      <ion-item color="warning" lines="none">
        <ion-icon name="cloud-offline-outline" slot="start" />
        <ion-label>
          <b>Mode hors ligne</b>
          @if (syncService.pendingCount() > 0) {
            — {{ syncService.pendingCount() }} action(s) en attente de sync
          }
        </ion-label>
      </ion-item>
    }
  `,
})
export class OfflineBannerComponent {
  networkService = inject(NetworkService);
  syncService    = inject(SyncService);

  constructor() {
    addIcons({ cloudOfflineOutline });
  }
}
