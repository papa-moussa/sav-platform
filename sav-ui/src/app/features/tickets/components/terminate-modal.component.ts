import { Component, inject, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonContent, 
  IonButton, IonButtons, IonIcon, IonTextarea,
  IonSelect, IonSelectOption,
  ModalController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, timeOutline, chatboxOutline } from 'ionicons/icons';
import { Ticket, ResultatIntervention } from '@sav/shared-models';

@Component({
  selector: 'app-terminate-modal',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonContent,
    IonButton, IonButtons, IonIcon, IonTextarea,
    IonSelect, IonSelectOption
  ],
  template: `
    <ion-header class="ion-no-border glass">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()" color="medium">Annuler</ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button (click)="submit()" [disabled]="form.invalid" color="primary" class="fw-bold">
            Terminer
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Ticket Hero -->
      <div class="info-hero success-theme">
        <div class="icon-wrapper">
          <ion-icon name="checkmark-circle-outline"></ion-icon>
        </div>
        <div class="info-meta">
          <span class="label uppercase tracking-widest">Fin de l'intervention</span>
          <p class="desc">{{ ticket.clientNom }} • {{ ticket.marqueModele }}</p>
          <span class="sub-label">Ticket #{{ ticket.numero }}</span>
        </div>
      </div>

      <form [formGroup]="form" class="premium-form">
        <!-- Result -->
        <div class="form-section">
          <label class="section-label">Résultat de l'intervention *</label>
          <div class="results-grid">
            <div class="result-card" 
                 [class.active]="form.get('result')?.value === 'REPARE'"
                 (click)="form.get('result')?.setValue('REPARE')">
              <div class="check-indicator"></div>
              <span>Réparé</span>
            </div>
            <div class="result-card irreparable" 
                 [class.active]="form.get('result')?.value === 'IRREPARABLE'"
                 (click)="form.get('result')?.setValue('IRREPARABLE')">
              <div class="check-indicator"></div>
              <span>Irréparable</span>
            </div>
          </div>
        </div>

        <!-- Duration Picker -->
        <div class="form-section">
          <label class="section-label">Temps passé sur l'intervention *</label>
          <div class="duration-selector">
            <div class="select-wrapper">
              <ion-icon name="time-outline"></ion-icon>
              <ion-select formControlName="hours" interface="popover" placeholder="0">
                @for (h of [0,1,2,3,4,5,6,7,8]; track h) {
                  <ion-select-option [value]="h">{{ h }} h</ion-select-option>
                }
              </ion-select>
            </div>
            <div class="select-wrapper">
              <ion-select formControlName="minutes" interface="popover" placeholder="00">
                @for (m of [0,15,30,45]; track m) {
                  <ion-select-option [value]="m">{{ m | number:'2.0' }} min</ion-select-option>
                }
              </ion-select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <label class="section-label">Observations finales</label>
          <div class="custom-input-container textarea-container">
            <ion-icon name="chatbox-outline"></ion-icon>
            <ion-textarea
              formControlName="observations"
              placeholder="Précisez les détails de la résolution ou le motif de l'échec..."
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
      .success-theme .icon-wrapper {
        background: rgba(var(--ion-color-success-rgb), 0.1);
        color: var(--ion-color-success);
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
      .results-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .result-card {
        padding: 16px;
        border-radius: 20px;
        background: var(--ion-color-step-50);
        border: 2px solid var(--ion-color-step-100);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        transition: all 0.2s ease;
      }
      .result-card span { font-weight: 800; font-size: 0.95rem; }
      .check-indicator {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid var(--ion-color-step-200);
        position: relative;
      }
      .result-card.active {
        background: rgba(var(--ion-color-success-rgb), 0.05);
        border-color: var(--ion-color-success);
        color: var(--ion-color-success-shade);
      }
      .result-card.active .check-indicator {
        background: var(--ion-color-success);
        border-color: var(--ion-color-success);
      }
      .result-card.active .check-indicator::after {
        content: '';
        position: absolute;
        width: 8px;
        height: 4px;
        border-left: 2px solid white;
        border-bottom: 2px solid white;
        top: 5px;
        left: 5px;
        transform: rotate(-45deg);
      }
      .result-card.irreparable.active {
        background: rgba(var(--ion-color-danger-rgb), 0.05);
        border-color: var(--ion-color-danger);
        color: var(--ion-color-danger-shade);
      }
      .result-card.irreparable.active .check-indicator {
        background: var(--ion-color-danger);
        border-color: var(--ion-color-danger);
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
      .duration-selector {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .select-wrapper {
        background: var(--ion-color-step-50);
        border: 2px solid var(--ion-color-step-100);
        border-radius: 18px;
        height: 56px;
        display: flex;
        align-items: center;
        padding: 0 16px;
        gap: 10px;
      }
      .select-wrapper:focus-within {
        border-color: var(--ion-color-primary);
        background: white;
      }
      .select-wrapper ion-icon { font-size: 1.2rem; color: var(--ion-color-step-400); }
      ion-select { width: 100%; font-weight: 700; font-size: 0.95rem; }
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
        font-weight: 600;
        --placeholder-color: var(--ion-color-step-300);
      }
      .fw-bold { font-weight: 700; }
    </style>
  `
})
export class TerminateModalComponent {
  @Input() ticket!: Ticket;

  private fb = inject(FormBuilder);
  private modalCtrl = inject(ModalController);

  form = this.fb.group({
    result:       ['REPARE' as ResultatIntervention, Validators.required],
    observations: [''],
    hours:        [0, Validators.required],
    minutes:      [0, Validators.required]
  });

  constructor() {
    addIcons({ checkmarkCircleOutline, timeOutline, chatboxOutline });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  submit() {
    if (this.form.valid) {
      const v = this.form.value;
      const totalHours = (v.hours ?? 0) + (v.minutes ?? 0) / 60;
      this.modalCtrl.dismiss({
        result: v.result,
        observations: v.observations,
        temps: totalHours
      }, 'confirm');
    }
  }
}
