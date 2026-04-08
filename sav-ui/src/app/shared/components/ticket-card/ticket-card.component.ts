import { Component, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { Ticket, TYPE_APPAREIL_LABELS } from '@sav/shared-models';
import { StatutBadgeComponent } from '../statut-badge/statut-badge.component';
import { addIcons } from 'ionicons';
import { locationOutline, timeOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [
    IonIcon,
    StatutBadgeComponent,
  ],
  template: `
    <div 
      class="ticket-card card-hover" 
      (click)="clicked.emit(ticket())"
      (keydown.enter)="clicked.emit(ticket())"
      role="button"
      tabindex="0"
    >
      <div class="card-header">
        <div class="header-main">
          <span class="ticket-number">{{ ticket().numero }}</span>
          <h3 class="client-name">{{ ticket().clientNom }}</h3>
        </div>
        <app-statut-badge [statut]="ticket().statut" />
      </div>
      
      <div class="card-content">
        <p class="device-info">
          {{ typeLabel() }} <span class="divider">•</span> {{ ticket().marqueModele }}
        </p>
        
        <div class="metadata">
          <div class="meta-item">
            <ion-icon name="location-outline"></ion-icon>
            <span>{{ ticket().siteNom }}</span>
          </div>
          <div class="meta-item">
            <ion-icon name="time-outline"></ion-icon>
            <span>Reçu le {{ formatDate(ticket().createdAt) }}</span>
          </div>
        </div>
      </div>
      
      <div class="card-footer">
        <div class="chevron">
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ticket-card {
      background: var(--ion-card-background);
      border-radius: var(--card-border-radius);
      padding: 16px;
      margin: 12px 16px;
      border: 1px solid var(--ion-color-step-100);
      box-shadow: var(--card-shadow);
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow: hidden;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-main {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .ticket-number {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--ion-color-primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .client-name {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--ion-text-color);
      letter-spacing: -0.01em;
    }

    .card-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .device-info {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--ion-color-step-700);
    }

    .divider {
      color: var(--ion-color-step-300);
      margin: 0 4px;
    }

    .metadata {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--ion-color-step-500);
      font-size: 0.8rem;
    }

    .meta-item ion-icon {
      font-size: 0.9rem;
      color: var(--ion-color-step-400);
    }

    .card-footer {
      position: absolute;
      right: 16px;
      bottom: 16px;
      opacity: 0.3;
    }

    .chevron {
      font-size: 1.2rem;
    }
  `]
})
export class TicketCardComponent {
  ticket  = input.required<Ticket>();
  clicked = output<Ticket>();

  constructor() {
    addIcons({ locationOutline, timeOutline, chevronForwardOutline });
  }

  typeLabel() {
    return TYPE_APPAREIL_LABELS[this.ticket().typeAppareil];
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
    });
  }
}
