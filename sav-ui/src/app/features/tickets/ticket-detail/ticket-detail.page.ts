import { Component, inject, OnInit, signal } from '@angular/core';
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
  IonLabel,
  ModalController,
  ToastController,
  AlertController,
  IonButton,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import { DiagnosticModalComponent } from '../components/diagnostic-modal.component';
import { AddActionModalComponent } from '../components/add-action-modal.component';
import { BlockModalComponent } from '../components/block-modal.component';
import { TerminateModalComponent } from '../components/terminate-modal.component';
import { CommonModule, DatePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { 
  addOutline, 
  documentTextOutline, 
  swapHorizontalOutline,
  ellipsisHorizontalOutline,
  constructOutline,
  informationCircleOutline,
  timeOutline,
  buildOutline,
  pauseCircleOutline,
  playCircleOutline,
  checkmarkCircleOutline,
  qrCodeOutline,
  downloadOutline,
  shareSocialOutline,
  alertCircleOutline,
  chevronForwardOutline,
  chatboxOutline,
  flagOutline,
  receiptOutline,
  alertOutline,
  cubeOutline,
  personCircleOutline
} from 'ionicons/icons';
import { TicketStore } from '../ticket.store';
import { StatutBadgeComponent } from '../../../shared/components/statut-badge/statut-badge.component';
import { OfflineBannerComponent } from '../../../shared/components/offline-banner/offline-banner.component';
import {
  Ticket,
  TicketStatut,
  STATUT_LABELS,
  TYPE_APPAREIL_LABELS,
  BlockingReason,
  ResultatIntervention
} from '@sav/shared-models';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonBackButton, IonButtons,
    IonSpinner,
    IonIcon,
    IonButton,
    IonSegment, IonSegmentButton, IonLabel,
    StatutBadgeComponent, OfflineBannerComponent,
  ],

  providers: [DatePipe],
  templateUrl: './ticket-detail.page.html',
})
export class TicketDetailPage implements OnInit {
  private route      = inject(ActivatedRoute);
  readonly store     = inject(TicketStore);
  private modalCtrl  = inject(ModalController);
  private toastCtrl  = inject(ToastController);
  private alertCtrl  = inject(AlertController);

  readonly STATUT_LABELS        = STATUT_LABELS;
  readonly TYPE_APPAREIL_LABELS = TYPE_APPAREIL_LABELS;

  activeSegment = signal<'workflow' | 'history'>('workflow');

  constructor() {
    addIcons({ 
      addOutline, 
      documentTextOutline, 
      swapHorizontalOutline,
      ellipsisHorizontalOutline,
      constructOutline,
      informationCircleOutline,
      timeOutline,
      buildOutline,
      pauseCircleOutline,
      playCircleOutline,
      checkmarkCircleOutline,
      qrCodeOutline,
      downloadOutline,
      shareSocialOutline,
      alertCircleOutline,
      chevronForwardOutline,
      chatboxOutline,
      flagOutline,
      receiptOutline,
      alertOutline,
      cubeOutline,
      personCircleOutline
    });
  }

  getHistoryIcon(type: string): string {
    switch (type.toUpperCase()) {
      case 'DIAGNOSTIC': return 'build-outline';
      case 'ACTION': return 'build-outline';
      case 'PIÈCE':
      case 'PIECE': return 'cube-outline';
      case 'STATUT': return 'flag-outline';
      case 'BLOCAGE': return 'alert-outline';
      case 'REPRISE': return 'play-circle-outline';
      case 'CRÉATION':
      case 'CREATION': return 'receipt-outline';
      default: return 'document-text-outline';
    }
  }

  getHistoryColor(type: string): string {
    switch (type.toUpperCase()) {
      case 'DIAGNOSTIC': return 'blue';
      case 'ACTION': return 'indigo';
      case 'PIÈCE':
      case 'PIECE': return 'purple';
      case 'STATUT': return 'emerald';
      case 'BLOCAGE': return 'amber';
      case 'REPRISE': return 'green';
      case 'CRÉATION':
      case 'CREATION': return 'gray';
      default: return 'slate';
    }
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.store.loadDetail(id);
  }

  get ticket(): Ticket | null {
    return this.store.selectedTicket();
  }

  // --- Workflow Actions ---

  async onStartDiagnostic() {
    if (!this.ticket) return;
    await this.store.startDiagnostic(this.ticket.id);
  }

  async onCompleteDiagnostic() {
    if (!this.ticket) return;
    const modal = await this.modalCtrl.create({
      component: DiagnosticModalComponent,
      componentProps: { ticket: this.ticket }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      await this.store.completeDiagnostic(this.ticket.id, data);
    }
  }

  async onAddAction() {
    if (!this.ticket) return;
    const modal = await this.modalCtrl.create({
      component: AddActionModalComponent,
      componentProps: { ticket: this.ticket }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      await this.store.addAction(this.ticket.id, data);
    }
  }

  async onBlock() {
    if (!this.ticket) return;
    const modal = await this.modalCtrl.create({
      component: BlockModalComponent,
      componentProps: { ticket: this.ticket }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      await this.store.blockTicket(this.ticket.id, data.reason, data.observation);
    }
  }

  async onResume() {
    if (!this.ticket) return;
    await this.store.resumeTicket(this.ticket.id);
  }

  async onTerminate() {
    if (!this.ticket) return;
    const modal = await this.modalCtrl.create({
      component: TerminateModalComponent,
      componentProps: { ticket: this.ticket }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      await this.store.terminateIntervention(this.ticket.id, data.result, data.observations, data.temps);
    }
  }

  async downloadQr() {
    const qr = this.store.qrCode();
    if (!qr) return;
    // Logic for mobile download/save
    const toast = await this.toastCtrl.create({
      message: 'QR Code prêt pour scan client.',
      duration: 2000,
      color: 'primary'
    });
    await toast.present();
  }

  async shareQr() {
    // Logic for Native Sharing
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

