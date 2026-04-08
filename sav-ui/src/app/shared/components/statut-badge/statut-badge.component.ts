import { Component, input } from '@angular/core';
import { TicketStatut, STATUT_LABELS } from '@sav/shared-models';

export const STATUT_ION_COLORS: Record<TicketStatut, string> = {
  RECU:                 'medium',
  EN_DIAGNOSTIC:        'primary',
  EN_REPARATION:        'warning',
  EN_ATTENTE_PIECES:    'tertiary',
  REPARE:               'success',
  IRREPARABLE:          'danger',
  EN_ATTENTE_FEEDBACK:  'secondary',
  CLOTURE:              'dark',
};

@Component({
  selector: 'app-statut-badge',
  standalone: true,
  imports: [],
  template: `
    <span class="badge" [style.background-color]="bgColor()" [style.color]="textColor()">
      {{ label() }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.025em;
      white-space: nowrap;
      text-transform: uppercase;
    }
  `]
})
export class StatutBadgeComponent {
  statut = input.required<TicketStatut>();

  label()  { return STATUT_LABELS[this.statut()]; }

  bgColor() {
    switch (this.statut()) {
      case 'RECU': return 'rgba(107, 114, 128, 0.1)';
      case 'EN_DIAGNOSTIC': return 'rgba(79, 70, 229, 0.1)';
      case 'EN_REPARATION': return 'rgba(245, 158, 11, 0.1)';
      case 'EN_ATTENTE_PIECES': return 'rgba(139, 92, 246, 0.1)';
      case 'REPARE': return 'rgba(16, 185, 129, 0.1)';
      case 'IRREPARABLE': return 'rgba(244, 63, 94, 0.1)';
      case 'EN_ATTENTE_FEEDBACK': return 'rgba(14, 165, 233, 0.1)';
      case 'CLOTURE': return 'rgba(31, 41, 55, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  }

  textColor() {
    switch (this.statut()) {
      case 'RECU': return '#4b5563';
      case 'EN_DIAGNOSTIC': return '#4338ca';
      case 'EN_REPARATION': return '#b45309';
      case 'EN_ATTENTE_PIECES': return '#6d28d9';
      case 'REPARE': return '#047857';
      case 'IRREPARABLE': return '#be123c';
      case 'EN_ATTENTE_FEEDBACK': return '#0369a1';
      case 'CLOTURE': return '#111827';
      default: return '#4b5563';
    }
  }
}
