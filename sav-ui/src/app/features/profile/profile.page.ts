import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSpinner,
  IonIcon,
  IonButtons,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  syncOutline, 
  logOutOutline,
  notificationsOutline,
  shieldOutline,
  globeOutline,
  cloudUploadOutline,
  personOutline,
  chevronForwardOutline,
  lockClosedOutline,
  helpCircleOutline
} from 'ionicons/icons';
import { AuthService } from '../../core/auth/auth.service';
import { SyncService } from '../../core/services/sync.service';
import { NetworkService } from '../../core/network/network.service';
import { OfflineBannerComponent } from '../../shared/components/offline-banner/offline-banner.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonSpinner, IonIcon,
    IonButtons,
    OfflineBannerComponent,
  ],
  templateUrl: './profile.page.html',
})
export class ProfilePage {
  readonly auth        = inject(AuthService);
  readonly syncService = inject(SyncService);
  readonly network     = inject(NetworkService);
  private alertCtrl   = inject(AlertController);

  constructor() {
    addIcons({ 
      syncOutline, 
      logOutOutline,
      notificationsOutline,
      shieldOutline,
      globeOutline,
      cloudUploadOutline,
      personOutline,
      chevronForwardOutline,
      lockClosedOutline,
      helpCircleOutline
    });
  }

  async syncNow(): Promise<void> {
    await this.syncService.syncAll();
  }

  async confirmLogout(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Déconnexion',
      message: 'Voulez-vous vous déconnecter ? Les actions hors ligne non synchronisées seront perdues.',
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Se déconnecter',
          role: 'confirm',
          handler: () => this.auth.logout(),
        },
      ],
    });
    await alert.present();
  }
}
