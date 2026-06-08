import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-advantages',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="resultats" class="section" style="background: var(--surface);">
      <div class="wrap">

        <!-- Header -->
        <div class="max-w-[720px]" appFadeIn [fadeInDelay]="0">
          <span class="eyebrow">Résultats</span>
          <h2 class="text-[2rem] sm:text-[2.5rem] leading-[1.08] mb-4">
            Des résultats mesurables,<br/>
            <span style="color: var(--text-muted);">dès le premier mois.</span>
          </h2>
          <p class="text-[16.5px] leading-relaxed max-w-[580px]" style="color: var(--text-mid);">
            Les équipes qui utilisent Sama SAV constatent des gains concrets sur les délais, les coûts et la satisfaction.
          </p>
        </div>

        <!-- KPI strip — Linear-style -->
        <div class="mt-14 grid grid-cols-2 lg:grid-cols-4 rounded-[12px] overflow-hidden"
             style="border: 1px solid var(--border);" appFadeIn [fadeInDelay]="50">
          @for (kpi of kpis; track kpi.label; let i = $index; let last = $last) {
            <div class="p-6 sm:p-7"
                 [style]="'background: var(--surface); ' +
                          (i < 2 ? 'border-bottom: 1px solid var(--border);' : '') +
                          (i % 2 === 0 ? 'border-right: 1px solid var(--border);' : '')">
              <p class="num-2xl mb-2" [style.color]="kpi.color">{{ kpi.metric }}</p>
              <p class="text-[14px] font-semibold mb-0.5" style="color: var(--text);">{{ kpi.label }}</p>
              <p class="text-[12.5px]" style="color: var(--text-muted);">{{ kpi.sublabel }}</p>
            </div>
          }
        </div>

        <!-- Arguments grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          @for (arg of args; track arg.title; let i = $index) {
            <div class="surface-card p-7" appFadeIn [fadeInDelay]="i * 80">
              <div class="icon-tile-lg mb-5" [class]="arg.iconClass">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path [attr.d]="arg.iconPath"/>
                </svg>
              </div>
              <h3 class="text-[15px] font-semibold mb-2 leading-snug">{{ arg.title }}</h3>
              <p class="text-[13.5px] leading-relaxed" style="color: var(--text-muted);">{{ arg.description }}</p>
            </div>
          }
        </div>

      </div>
    </section>
  `,
})
export class AdvantagesComponent {
  kpis = [
    { metric: '−40%', label: 'Rappels entrants',       sublabel: 'Grâce aux notifications auto',  color: 'var(--text)' },
    { metric: '+85%', label: 'Satisfaction client',     sublabel: 'Mesurée via QR feedback',        color: 'var(--text)' },
    { metric: '2×',   label: 'Vitesse d\'exécution',    sublabel: 'Vs. suivi manuel / tableurs',    color: 'var(--text)' },
    { metric: '100%', label: 'Traçabilité',             sublabel: 'Historique complet conservé',    color: 'var(--text)' },
  ];

  args = [
    {
      title: 'Multi-sites & multi-techniciens',
      description: 'Pilotez plusieurs agences depuis un back-office unifié. Stocks, équipes et rapports propres à chaque site.',
      iconClass: 'icon-tile-primary',
      iconPath: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
    },
    {
      title: 'Données isolées & sécurisées',
      description: 'Architecture multi-tenant stricte. Chaque entreprise a son espace, ses rôles, ses droits. Conformité garantie.',
      iconClass: 'icon-tile-success',
      iconPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
    },
    {
      title: 'Déploiement en 48h',
      description: 'Interface intuitive, onboarding dédié, support inclus 30 jours. Vos équipes opérationnelles immédiatement.',
      iconClass: 'icon-tile-warning',
      iconPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    },
  ];
}
