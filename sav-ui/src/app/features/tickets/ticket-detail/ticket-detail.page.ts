import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonSpinner,
  IonIcon,
  ModalController,
  ToastController,
  IonFooter,
  IonButton,
  IonActionSheet,
  ActionSheetButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  addOutline, 
  documentTextOutline, 
  swapHorizontalOutline,
  ellipsisHorizontalOutline,
  constructOutline,
  informationCircleOutline,
  timeOutline
} from 'ionicons/icons';
import { TicketStore } from '../ticket.store';
import { StatutBadgeComponent } from '../../../shared/components/statut-badge/statut-badge.component';
import { OfflineBannerComponent } from '../../../shared/components/offline-banner/offline-banner.component';
import {
  Ticket,
  TicketStatut,
  TICKET_TRANSITIONS,
  STATUT_LABELS,
  TYPE_APPAREIL_LABELS,
} from '@sav/shared-models';
import { AddInterventionModal } from '../add-intervention/add-intervention.modal';
import { ChangeStatusModal } from '../change-status/change-status.modal';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonBackButton, IonButtons,
    IonSpinner,
    IonFooter, IonButton, IonIcon, IonActionSheet,
    StatutBadgeComponent, OfflineBannerComponent,
  ],
  templateUrl: './ticket-detail.page.html',
})
export class TicketDetailPage implements OnInit {
  private route      = inject(ActivatedRoute);
  readonly store     = inject(TicketStore);
  private modalCtrl  = inject(ModalController);
  private toastCtrl  = inject(ToastController);

  readonly STATUT_LABELS        = STATUT_LABELS;
  readonly TYPE_APPAREIL_LABELS = TYPE_APPAREIL_LABELS;
  readonly TICKET_TRANSITIONS   = TICKET_TRANSITIONS;

  public statusActionSheetButtons: ActionSheetButton[] = [];

  constructor() {
    addIcons({ 
      addOutline, 
      documentTextOutline, 
      swapHorizontalOutline,
      ellipsisHorizontalOutline,
      constructOutline,
      informationCircleOutline,
      timeOutline
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.store.loadDetail(id);
  }

  get ticket(): Ticket | null {
    return this.store.selectedTicket();
  }

  get allowedTransitions(): TicketStatut[] {
    return this.ticket ? TICKET_TRANSITIONS[this.ticket.statut] : [];
  }

  get canAddIntervention(): boolean {
    return this.ticket ? this.ticket.statut !== 'CLOTURE' : false;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  }

  formatDateTime(date: string): string {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  setupStatusActionSheet() {
    this.statusActionSheetButtons = this.allowedTransitions.map(s => ({
      text: STATUT_LABELS[s],
      handler: () => this.openChangeStatus(s)
    }));
    this.statusActionSheetButtons.push({ text: 'Annuler', role: 'cancel' });
  }

  async openAddIntervention(): Promise<void> {
    if (!this.ticket) return;
    const modal = await this.modalCtrl.create({
      component: AddInterventionModal,
      componentProps: { ticketId: this.ticket.id },
      breakpoints: [0, 0.85, 1],
      initialBreakpoint: 0.85,
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss<Ticket>();
    if (role === 'confirm' && data) {
      this.store.updateTicketLocally(data);
      await this.showToast('Intervention enregistrée.', 'success');
      this.setupStatusActionSheet();
    }
  }

  async openChangeStatus(statut: TicketStatut): Promise<void> {
    if (!this.ticket) return;
    const modal = await this.modalCtrl.create({
      component: ChangeStatusModal,
      componentProps: { ticket: this.ticket, targetStatut: statut },
      breakpoints: [0, 0.5],
      initialBreakpoint: 0.5,
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss<Ticket>();
    if (role === 'confirm' && data) {
      this.store.updateTicketLocally(data);
      await this.showToast(
        `Statut mis à jour : ${STATUT_LABELS[data.statut]}`,
        'success'
      );
      this.setupStatusActionSheet();
    }
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }
}
