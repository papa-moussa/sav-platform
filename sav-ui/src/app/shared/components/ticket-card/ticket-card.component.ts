import { Component, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { Ticket, TYPE_APPAREIL_LABELS } from '@sav/shared-models';
import { StatutBadgeComponent } from '../statut-badge/statut-badge.component';
import { addIcons } from 'ionicons';
import { 
  locationOutline, 
  timeOutline, 
  chevronForwardOutline,
  businessOutline,
  constructOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [
    IonIcon,
    StatutBadgeComponent,
  ],
  template: `
    <div 
      class="ticket-card-v2 animate-in" 
      (click)="clicked.emit(ticket())"
      (keydown.enter)="clicked.emit(ticket())"
      role="button"
      tabindex="0"
    >
      <div class="card-header">
        <div class="device-tag">
          <ion-icon name="construct-outline"></ion-icon>
          <span>{{ typeLabel() }}</span>
        </div>
        <div class="status-glow" [class]="ticket().statut.toLowerCase()">
          <div class="dot"></div>
          <span class="status-text">{{ ticket().statut.replace('_', ' ') }}</span>
        </div>
      </div>

      <div class="card-body">
        <h3 class="client-name">{{ ticket().clientNom }}</h3>
        <p class="marque-modele">{{ ticket().marqueModele }}</p>
      </div>
      
      <div class="card-footer">
        <div class="meta-item">
          <span class="ticket-no">#{{ ticket().numero }}</span>
        </div>
        <div class="footer-divider"></div>
        <div class="meta-item">
          <ion-icon name="business-outline"></ion-icon>
          <span>{{ ticket().siteNom }}</span>
        </div>
        <div class="footer-divider"></div>
        <div class="meta-item">
          <span>{{ formatDate(ticket().createdAt) }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ticket-card-v2 {
      background: white;
      border-radius: 22px;
      padding: 20px;
      margin: 12px 16px;
      border: 1px solid rgba(0,0,0,0.06);
      box-shadow: 0 4px 12px -2px rgba(0,0,0,0.03);
      display: flex;
      flex-direction: column;
      gap: 16px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
    }

    .ticket-card-v2:active {
      transform: scale(0.975) translateY(2px);
      background: var(--ion-color-step-50);
      box-shadow: 0 2px 4px -2px rgba(0,0,0,0.02);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .device-tag {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: rgba(var(--ion-color-primary-rgb), 0.06);
      border-radius: 12px;
      color: var(--ion-color-primary);
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .device-tag ion-icon {
      font-size: 1rem;
    }

    /* Status Glow Dot */
    .status-glow {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      border-radius: 10px;
    }

    .status-glow .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--ion-color-step-300);
      box-shadow: 0 0 0 4px rgba(var(--ion-color-step-300-rgb), 0.1);
    }

    .status-text {
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      color: var(--ion-color-step-500);
    }

    /* Statut Specific Glows */
    .status-glow.recu .dot { 
      background: #10b981; 
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.4); 
    }
    .status-glow.recu .status-text { color: #10b981; }

    .status-glow.en_diagnostic .dot { 
      background: #f59e0b; 
      box-shadow: 0 0 10px rgba(245, 158, 11, 0.4); 
    }
    .status-glow.en_diagnostic .status-text { color: #f59e0b; }

    .status-glow.en_cours .dot { 
      background: #3b82f6; 
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.4); 
    }
    .status-glow.en_cours .status-text { color: #3b82f6; }

    .status-glow.termine .dot { 
      background: #6366f1; 
      box-shadow: 0 0 10px rgba(99, 102, 241, 0.4); 
    }
    .status-glow.termine .status-text { color: #6366f1; }

    .card-body {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .client-name {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--ion-text-color);
      letter-spacing: -0.04em;
    }

    .marque-modele {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--ion-color-step-400);
    }

    .card-footer {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 4px;
      padding-top: 16px;
      border-top: 1px solid rgba(0,0,0,0.04);
    }

    .footer-divider {
      width: 4px;
      height: 4px;
      background: var(--ion-color-step-200);
      border-radius: 50%;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--ion-color-step-400);
    }

    .ticket-no {
      color: var(--ion-color-step-600);
      font-weight: 800;
    }

    .animate-in {
      animation: slideIn 0.4s ease-out;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class TicketCardComponent {
  ticket  = input.required<Ticket>();
  clicked = output<Ticket>();

  constructor() {
    addIcons({ 
      locationOutline, 
      timeOutline, 
      chevronForwardOutline,
      businessOutline,
      constructOutline
    });
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
