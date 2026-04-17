import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-advantages',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="avantages" class="section-padding" style="background: var(--color-surface);">
      <div class="container-max">

        <!-- Header -->
        <div class="text-center max-w-2xl mx-auto mb-16" appFadeIn [fadeInDelay]="0">
          <div class="section-badge w-fit mx-auto">Résultats</div>
          <h2 class="text-3xl sm:text-4xl font-bold leading-tight mb-5" style="color: var(--color-text);">
            Des résultats mesurables<br/>
            <span class="gradient-text">dès le premier mois</span>
          </h2>
        </div>

        <!-- KPI metrics — big numbers -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16" appFadeIn [fadeInDelay]="50">
          @for (kpi of kpis; track kpi.metric) {
            <div class="card-glass p-6 text-center">
              <p class="text-3xl sm:text-4xl font-bold mb-2 gradient-text">{{ kpi.metric }}</p>
              <p class="text-sm font-medium mb-1" style="color: var(--color-text);">{{ kpi.label }}</p>
              <p class="text-xs" style="color: var(--color-muted);">{{ kpi.sublabel }}</p>
            </div>
          }
        </div>

        <!-- Trust arguments -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (arg of trustArgs; track arg.icon; let i = $index) {
            <div appFadeIn [fadeInDelay]="i * 100" class="card-glass p-7">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                     style="background: #EFF6FF;">
                  {{ arg.icon }}
                </div>
                <div>
                  <h3 class="font-bold mb-2 text-sm" style="color: var(--color-text);">{{ arg.title }}</h3>
                  <p class="text-sm leading-relaxed" style="color: var(--color-muted);">{{ arg.description }}</p>
                </div>
              </div>
            </div>
          }
        </div>

      </div>
    </section>
  `,
})
export class AdvantagesComponent {
  kpis = [
    { metric: '-40%', label: 'Rappels clients', sublabel: 'Grâce aux notifications auto' },
    { metric: '+85%', label: 'Satisfaction client', sublabel: 'Mesurée par QR feedback' },
    { metric: '2x', label: 'Rapidité d\'exécution', sublabel: 'Vs. gestion manuelle' },
    { metric: '100%', label: 'Traçabilité tickets', sublabel: 'Historique complet' },
  ];

  trustArgs = [
    {
      icon: '🏢',
      title: 'Multi-sites et multi-techniciens',
      description: 'Gérez plusieurs agences depuis un seul back-office. Chaque site a ses propres stocks, ses propres équipes.',
    },
    {
      icon: '🔒',
      title: 'Données sécurisées et isolées',
      description: 'Architecture multi-tenant : vos données sont strictement séparées de celles des autres entreprises.',
    },
    {
      icon: '🚀',
      title: 'Déploiement rapide, sans formation longue',
      description: 'Interface intuitive. Vos équipes sont opérationnelles en 48h. Support inclus pendant les 30 premiers jours.',
    },
  ];
}
