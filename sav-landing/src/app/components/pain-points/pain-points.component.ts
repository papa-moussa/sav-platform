import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-pain-points',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section class="section" style="background: var(--surface);">
      <div class="wrap">

        <!-- Header -->
        <div class="max-w-[720px]" appFadeIn [fadeInDelay]="0">
          <span class="eyebrow" style="color: var(--danger);">Le problème</span>
          <h2 class="text-[2rem] sm:text-[2.5rem] leading-[1.08] mb-4">
            Votre SAV vous coûte<br/>
            <span style="color: var(--text-muted);">plus cher que vous ne le croyez.</span>
          </h2>
          <p class="text-[16.5px] leading-relaxed max-w-[580px]" style="color: var(--text-mid);">
            Ces trois frictions plombent la rentabilité des services SAV —
            et aucune n'est visible dans un tableur.
          </p>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
          @for (pain of pains; track pain.title; let i = $index) {
            <div class="surface-card p-7" appFadeIn [fadeInDelay]="i * 90">

              <div class="flex items-center justify-between mb-6">
                <div class="icon-tile-lg" style="background: var(--danger-soft); border-color: rgba(220,38,38,0.14); color: var(--danger);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path [attr.d]="pain.iconPath"/>
                  </svg>
                </div>
                <span class="mono text-[11px] font-semibold tracking-wider" style="color: var(--text-subtle);">
                  0{{ i + 1 }}
                </span>
              </div>

              <h3 class="text-[17px] font-semibold mb-2 leading-snug">{{ pain.title }}</h3>
              <p class="text-[14px] leading-relaxed mb-5" style="color: var(--text-muted);">
                {{ pain.description }}
              </p>

              <div class="pt-4 flex items-center gap-2" style="border-top: 1px solid var(--border);">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
                <span class="text-[12.5px] font-semibold" style="color: var(--danger);">
                  {{ pain.impact }}
                </span>
              </div>
            </div>
          }
        </div>

      </div>
    </section>
  `,
})
export class PainPointsComponent {
  pains = [
    {
      title: 'Tickets éparpillés, délais oubliés',
      description: 'Carnets, tableurs, WhatsApp, e-mails. Le suivi se perd. Les échéances passent. Les clients attendent — et s\'en souviennent.',
      impact: 'Jusqu\'à 30% des tickets mal suivis',
      iconPath: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M12 14l-2 2 2 2',
    },
    {
      title: 'Zéro visibilité pour le client',
      description: 'Le client rappelle, rappelle encore. Votre équipe perd du temps à rassurer au lieu de réparer. Chaque rappel coûte.',
      impact: '40% des appels = demandes de statut',
      iconPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M12 8v4 M12 16h.01',
    },
    {
      title: 'Stock ingérable, interventions bloquées',
      description: 'Un technicien sans la pièce. Un stock vide découvert trop tard. L\'intervention est repoussée — et un client est perdu.',
      impact: '1 intervention sur 5 retardée',
      iconPath: 'M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
    },
  ];
}
