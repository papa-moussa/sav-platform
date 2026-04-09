import { Component, inject, signal, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonTextarea,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonButtons,
  IonSpinner,
  IonIcon,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { TicketApiService } from '../../../core/services/ticket-api.service';
import { SyncService } from '../../../core/services/sync.service';
import { NetworkService } from '../../../core/network/network.service';
import { addIcons } from 'ionicons';
import { 
  timeOutline, 
  syncOutline, 
  alertCircleOutline 
} from 'ionicons/icons';
import {
  InterventionRequest,
  ResultatIntervention,
  TicketStatut,
  Ticket,
} from '@sav/shared-models';

@Component({
  selector: 'app-add-intervention-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonInput, IonTextarea, IonSegment, IonSegmentButton, IonLabel,
    IonButton, IonButtons, IonSpinner, IonIcon
  ],
  templateUrl: './add-intervention.modal.html',
})
export class AddInterventionModal {
  @Input() ticketId!: number;
  @Input() ticket!: Ticket;

  private fb         = inject(FormBuilder);
  private api        = inject(TicketApiService);
  private syncSvc    = inject(SyncService);
  private network    = inject(NetworkService);
  private modalCtrl  = inject(ModalController);
  private toastCtrl  = inject(ToastController);

  constructor() {
    addIcons({ timeOutline, syncOutline, alertCircleOutline });
  }

  loading = signal(false);
  error   = signal<string | null>(null);

  form = this.fb.group({
    diagnostic:       ['', Validators.required],
    actionsRealisees: ['', Validators.required],
    observations:     [''],
    tempsPasseHeures: [null as number | null],
    resultat:         ['EN_COURS' as ResultatIntervention, Validators.required],
  });

  dismiss(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.error.set('Veuillez remplir les champs obligatoires.');
      return;
    }

    const v = this.form.value;
    const request: InterventionRequest = {
      diagnostic:       v.diagnostic ?? '',
      actionsRealisees: v.actionsRealisees ?? '',
      observations:     v.observations || undefined,
      tempsPasseHeures: v.tempsPasseHeures ?? undefined,
      resultat:         v.resultat as ResultatIntervention,
    };

    this.loading.set(true);
    this.error.set(null);

    try {
      if (this.network.isOnline()) {
        // Mode en ligne : appel API direct
        await this.api.addIntervention(this.ticketId, request);

        // Action combinée : si résultat = REPARE ou IRREPARABLE → changer le statut automatiquement
        let updatedTicket: Ticket | null = null;
        const resultat = request.resultat;
        if (resultat === 'REPARE' || resultat === 'IRREPARABLE') {
          const targetStatut: TicketStatut = 'TERMINE';
          try {
            updatedTicket = await this.api.changeStatut(this.ticketId, targetStatut);
          } catch {
            // L'intervention est enregistrée mais le changement de statut a échoué
            // Le technicien peut le faire manuellement
          }
        }

        // Retourner le ticket mis à jour (ou charger le détail frais)
        if (!updatedTicket) {
          updatedTicket = await this.api.getById(this.ticketId);
        }
        updatedTicket.interventions = [
          ...(updatedTicket.interventions ?? []),
        ];

        this.modalCtrl.dismiss(updatedTicket, 'confirm');
      } else {
        // Mode hors ligne : mettre en queue
        await this.syncSvc.queueIntervention(this.ticketId, request);

        // Action combinée offline
        const resultat = request.resultat;
        if (resultat === 'REPARE' || resultat === 'IRREPARABLE') {
          const targetStatut: TicketStatut = 'TERMINE';
          await this.syncSvc.queueStatusChange(this.ticketId, targetStatut);
        }
        const toast = await this.toastCtrl.create({
          message: 'Intervention sauvegardée hors ligne — sera synchronisée dès reconnexion.',
          color: 'warning',
          duration: 4000,
          position: 'bottom',
        });
        await toast.present();
        this.modalCtrl.dismiss(null, 'offline');
      }
    } catch (err: unknown) {
      const msg = (err as { error?: { message?: string } }).error?.message;
      this.error.set(msg ?? 'Erreur lors de l\'enregistrement.');
    } finally {
      this.loading.set(false);
    }
  }
}
