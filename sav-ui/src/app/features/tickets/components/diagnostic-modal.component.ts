import { Component, inject, Input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonButtons, IonIcon, IonTextarea,
  ModalController, IonSpinner
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { chatboxOutline, alertCircleOutline, chevronForwardOutline } from 'ionicons/icons';
import { Ticket } from '@sav/shared-models';

@Component({
  selector: 'app-diagnostic-modal',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonButtons, IonIcon, IonTextarea
  ],

  template: `
    <ion-header class="ion-no-border glass">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()" color="medium">Annuler</ion-button>
        </ion-buttons>
        <ion-title>Diagnostic</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="submit()" [disabled]="form.invalid" color="primary" class="fw-bold">
            Valider
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Complaint Hero -->
      <div class="info-hero">
        <div class="icon-wrapper">
          <ion-icon name="alert-circle-outline"></ion-icon>
        </div>
        <div class="info-meta">
          <span class="label uppercase tracking-widest">Panne déclarée</span>
          <p class="desc">"{{ ticket.descriptionPanne }}"</p>
        </div>
      </div>

      <form [formGroup]="form" class="premium-form">
        <div class="form-section">
          <label class="section-label">Résultats du diagnostic *</label>
          <div class="custom-input-container textarea-container">
            <ion-icon name="chatbox-outline"></ion-icon>
            <ion-textarea
              formControlName="diagnostic"
              placeholder="Décrivez la panne identifiée et les composants affectés..."
              rows="6"
              class="premium-textarea"
            ></ion-textarea>
          </div>
          <p class="helper-text">Soyez précis pour faciliter le suivi des actions ultérieures.</p>
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
      .icon-wrapper {
        width: 44px;
        height: 44px;
        background: rgba(var(--ion-color-warning-rgb), 0.1);
        color: var(--ion-color-warning);
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
      .premium-form {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .form-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
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
        border-color: var(--ion-color-primary);
        background: white;
        box-shadow: 0 4px 20px rgba(var(--ion-color-primary-rgb), 0.08);
      }
      .custom-input-container ion-icon {
        font-size: 1.3rem;
        color: var(--ion-color-step-300);
      }
      .premium-textarea {
        --padding-start: 0;
        font-size: 0.95rem;
        font-weight: 500;
        --placeholder-color: var(--ion-color-step-300);
        margin-top: -2px;
      }
      .helper-text {
        font-size: 0.75rem;
        color: var(--ion-color-step-400);
        padding-left: 4px;
        margin: 0;
      }
      .fw-bold { font-weight: 700; }
    </style>
  `
})
export class DiagnosticModalComponent {
  @Input() ticket!: Ticket;
  
  private fb = inject(FormBuilder);
  private modalCtrl = inject(ModalController);

  form = this.fb.group({
    diagnostic: ['', [Validators.required, Validators.minLength(5)]]
  });

  constructor() {
    addIcons({ chatboxOutline, alertCircleOutline, chevronForwardOutline });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  submit() {
    if (this.form.valid) {
      this.modalCtrl.dismiss(this.form.value.diagnostic, 'confirm');
    }
  }
}
