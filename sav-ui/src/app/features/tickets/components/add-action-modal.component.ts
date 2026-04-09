import { Component, inject, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonButtons, IonIcon, IonInput,
  ModalController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { buildOutline, flashOutline } from 'ionicons/icons';
import { Ticket } from '@sav/shared-models';

@Component({
  selector: 'app-add-action-modal',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonButtons, IonIcon, IonInput
  ],
  template: `
    <ion-header class="ion-no-border glass">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()" color="medium">Annuler</ion-button>
        </ion-buttons>
        <ion-title>Nouvelle action</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="submit()" [disabled]="form.invalid" color="primary" class="fw-bold">
            Ajouter
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Ticket Hero -->
      <div class="info-hero">
        <div class="icon-wrapper">
          <ion-icon name="flash-outline"></ion-icon>
        </div>
        <div class="info-meta">
          <span class="label uppercase tracking-widest">En cours de réparation</span>
          <p class="desc">{{ ticket.clientNom }} • {{ ticket.marqueModele }}</p>
          <span class="sub-label">Ticket #{{ ticket.numero }}</span>
        </div>
      </div>

      <form [formGroup]="form" class="premium-form">
        <div class="form-section">
          <label class="section-label">Action réalisée *</label>
          <div class="custom-input-container">
            <ion-icon name="build-outline"></ion-icon>
            <ion-input
              formControlName="description"
              placeholder="Ex: Remplacement nappe écran, Nettoyage..."
              class="premium-input"
            ></ion-input>
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
      .icon-wrapper {
        width: 44px;
        height: 44px;
        background: rgba(var(--ion-color-primary-rgb), 0.1);
        color: var(--ion-color-primary);
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
        height: 56px;
        transition: all 0.2s ease;
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
      .premium-input {
        --padding-start: 0;
        font-size: 1rem;
        font-weight: 600;
        --placeholder-color: var(--ion-color-step-300);
      }
      .fw-bold { font-weight: 700; }
    </style>
  `
})
export class AddActionModalComponent {
  @Input() ticket!: Ticket;
  
  private fb = inject(FormBuilder);
  private modalCtrl = inject(ModalController);

  form = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor() {
    addIcons({ buildOutline, flashOutline });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  submit() {
    if (this.form.valid) {
      this.modalCtrl.dismiss(this.form.value.description, 'confirm');
    }
  }
}
