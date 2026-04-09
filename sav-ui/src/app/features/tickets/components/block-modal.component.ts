import { Component, inject, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonContent, 
  IonButton, IonButtons, IonIcon, IonTextarea,
  ModalController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { pauseCircleOutline, alertCircleOutline, chatboxOutline } from 'ionicons/icons';
import { Ticket, BlockingReason } from '@sav/shared-models';

@Component({
  selector: 'app-block-modal',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonContent,
    IonButton, IonButtons, IonIcon, IonTextarea
  ],
  template: `
    <ion-header class="ion-no-border glass">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()" color="medium">Annuler</ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button (click)="submit()" [disabled]="form.invalid" color="warning" class="fw-bold">
            Bloquer
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Ticket Hero -->
      <div class="info-hero warning-theme">
        <div class="icon-wrapper">
          <ion-icon name="pause-circle-outline"></ion-icon>
        </div>
        <div class="info-meta">
          <span class="label uppercase tracking-widest">Suspension de l'intervention</span>
          <p class="desc">{{ ticket.clientNom }} • {{ ticket.marqueModele }}</p>
          <span class="sub-label">Ticket #{{ ticket.numero }}</span>
        </div>
      </div>

      <form [formGroup]="form" class="premium-form">
        <!-- Reason selection -->
        <div class="form-section">
          <label class="section-label">Motif du blocage *</label>
          <div class="reasons-grid">
            @for (r of reasons; track r.id) {
              <div class="reason-pill" 
                   [class.active]="form.get('reason')?.value === r.id"
                   (click)="setReason(r.id)">
                {{ r.label }}
              </div>
            }
          </div>
        </div>

        <div class="form-section">
          <label class="section-label">Observations / Précisions</label>
          <div class="custom-input-container textarea-container">
            <ion-icon name="chatbox-outline"></ion-icon>
            <ion-textarea
              formControlName="observation"
              placeholder="Ex: Pièce X en commande, livraison prévue le..."
              rows="4"
              class="premium-textarea"
            ></ion-textarea>
          </div>
        </div>
      </form>
    </ion-content>

    <style>
      .glass {
        --background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(10px);
      }
      .info-hero {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        background: linear-gradient(135deg, var(--ion-color-step-50) 0%, var(--ion-item-background) 100%);
        padding: 20px;
        border-radius: 20px;
        border: 1px solid var(--ion-color-step-100);
        margin-bottom: 24px;
      }
      .warning-theme .icon-wrapper {
        background: rgba(var(--ion-color-warning-rgb), 0.1);
        color: var(--ion-color-warning);
      }
      .icon-wrapper {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
        flex-shrink: 0;
      }
      .info-meta .label {
        font-size: 0.65rem;
        font-weight: 800;
        color: var(--ion-color-step-400);
        display: block;
        margin-bottom: 4px;
      }
      .info-meta .desc {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--ion-text-color);
        line-height: 1.4;
      }
      .info-meta .sub-label {
        font-size: 0.75rem;
        color: var(--ion-color-step-400);
        margin-top: 2px;
        display: block;
      }
      .reasons-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .reason-pill {
        padding: 10px 16px;
        border-radius: 12px;
        background: var(--ion-color-step-50);
        border: 2px solid var(--ion-color-step-100);
        color: var(--ion-color-step-600);
        font-size: 0.85rem;
        font-weight: 700;
        transition: all 0.2s ease;
      }
      .reason-pill.active {
        background: rgba(var(--ion-color-warning-rgb), 0.1);
        border-color: var(--ion-color-warning);
        color: var(--ion-color-warning-shade);
      }
      .premium-form {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .form-section {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .section-label {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--ion-color-step-700);
        padding-left: 4px;
      }
      .custom-input-container {
        display: flex;
        align-items: center;
        gap: 12px;
        background: var(--ion-color-step-50);
        border: 2px solid var(--ion-color-step-100);
        border-radius: 18px;
        padding: 4px 16px;
        transition: all 0.2s ease;
      }
      .textarea-container {
        align-items: flex-start;
        padding-top: 14px;
      }
      .custom-input-container:focus-within {
        border-color: var(--ion-color-warning);
        background: white;
      }
      .custom-input-container ion-icon {
        font-size: 1.3rem;
        color: var(--ion-color-step-300);
      }
      .premium-textarea {
        --padding-start: 0;
        font-size: 0.95rem;
        font-weight: 600;
        --placeholder-color: var(--ion-color-step-300);
      }
      .fw-bold { font-weight: 700; }
    </style>
  `
})
export class BlockModalComponent {
  @Input() ticket!: Ticket;

  private fb = inject(FormBuilder);
  private modalCtrl = inject(ModalController);

  reasons: { id: BlockingReason; label: string }[] = [
    { id: 'PIECES', label: 'Pièces manquantes' },
    { id: 'CLIENT', label: 'Client absent' },
    { id: 'AUTRE',  label: 'Autre raison' }
  ];

  form = this.fb.group({
    reason: ['PIECES' as BlockingReason, Validators.required],
    observation: ['']
  });

  constructor() {
    addIcons({ pauseCircleOutline, alertCircleOutline, chatboxOutline });
  }

  setReason(id: BlockingReason) {
    this.form.get('reason')?.setValue(id);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  submit() {
    if (this.form.valid) {
      this.modalCtrl.dismiss(this.form.value, 'confirm');
    }
  }
}
