import { Component, inject, signal, Input } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonSpinner,
  IonText,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { TicketApiService } from '../../../core/services/ticket-api.service';
import { SyncService } from '../../../core/services/sync.service';
import { NetworkService } from '../../../core/network/network.service';
import { Ticket, TicketStatut, STATUT_LABELS, TICKET_TRANSITIONS } from '@sav/shared-models';
import { STATUT_ION_COLORS } from '../../../shared/components/statut-badge/statut-badge.component';

@Component({
  selector: 'app-change-status-modal',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonButtons, IonSpinner, IonText,
    IonList, IonItem, IonLabel, IonIcon,
  ],
  templateUrl: './change-status.modal.html',
})
export class ChangeStatusModal {
  @Input() ticket!: Ticket;

  private api        = inject(TicketApiService);
  private syncSvc    = inject(SyncService);
  private network    = inject(NetworkService);
  private modalCtrl  = inject(ModalController);
  private toastCtrl  = inject(ToastController);
  private alertCtrl  = inject(AlertController);

  loading         = signal(false);
  // Double-tap confirm : premier tap sélectionne, deuxième exécute
  selectedStatut  = signal<TicketStatut | null>(null);

  readonly STATUT_LABELS     = STATUT_LABELS;
  readonly STATUT_ION_COLORS = STATUT_ION_COLORS;
  readonly TICKET_TRANSITIONS = TICKET_TRANSITIONS;

  constructor() {
    addIcons({ checkmarkCircleOutline });
  }

  get allowedTransitions(): TicketStatut[] {
    return this.ticket ? TICKET_TRANSITIONS[this.ticket.statut] : [];
  }

  dismiss(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async onStatutTap(statut: TicketStatut): Promise<void> {
    // Garde : REPARE/IRREPARABLE nécessitent au moins une intervention
    if (
      (statut === 'REPARE' || statut === 'IRREPARABLE') &&
      this.ticket.interventions.length === 0
    ) {
      const alert = await this.alertCtrl.create({
        header: 'Intervention requise',
        message: `Un rapport d'intervention est nécessaire avant de marquer ce ticket comme "${STATUT_LABELS[statut]}".`,
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (this.selectedStatut() === statut) {
      // Deuxième tap : exécuter
      await this.executeChange(statut);
    } else {
      // Premier tap : sélectionner
      this.selectedStatut.set(statut);
    }
  }

  private async executeChange(statut: TicketStatut): Promise<void> {
    this.loading.set(true);
    try {
      if (this.network.isOnline()) {
        const updated = await this.api.changeStatut(this.ticket.id, statut);
        this.modalCtrl.dismiss(updated, 'confirm');
      } else {
        await this.syncSvc.queueStatusChange(this.ticket.id, statut);
        const toast = await this.toastCtrl.create({
          message: 'Changement de statut mis en queue — sera synchronisé dès reconnexion.',
          color: 'warning',
          duration: 4000,
          position: 'bottom',
        });
        await toast.present();
        this.modalCtrl.dismiss(null, 'offline');
      }
    } catch (err: unknown) {
      const msg = (err as { error?: { message?: string } }).error?.message;
      const toast = await this.toastCtrl.create({
        message: msg ?? 'Erreur lors du changement de statut.',
        color: 'danger',
        duration: 3000,
        position: 'bottom',
      });
      await toast.present();
      this.selectedStatut.set(null);
    } finally {
      this.loading.set(false);
    }
  }
}
