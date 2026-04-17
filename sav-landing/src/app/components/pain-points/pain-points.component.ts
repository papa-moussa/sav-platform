import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-pain-points',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section class="section-padding" style="background: var(--color-surface);">
      <div class="container-max">

        <!-- Header -->
        <div class="text-center max-w-2xl mx-auto mb-16" appFadeIn [fadeInDelay]="0">
          <p class="text-sm font-semibold uppercase tracking-widest mb-4" style="color: #EF4444;">
            Le problème
          </p>
          <h2 class="text-3xl sm:text-4xl font-bold leading-tight mb-5" style="color: var(--color-text);">
            Votre SAV vous coûte plus cher<br/>
            <span class="gradient-text-warm">que vous ne le pensez.</span>
          </h2>
          <p class="text-lg" style="color: var(--color-muted);">
            3 problèmes qui plombent la rentabilité des services SAV aujourd'hui.
          </p>
        </div>

        <!-- Pain cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (pain of pains; track pain.icon) {
            <div class="card-pain p-7" appFadeIn [fadeInDelay]="pain.delay">
              <!-- Icon -->
              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                   style="background: #FEF2F2;">
                {{ pain.icon }}
              </div>
              <!-- Title -->
              <h3 class="text-lg font-bold mb-3" style="color: var(--color-text);">{{ pain.title }}</h3>
              <!-- Description -->
              <p class="leading-relaxed text-sm" style="color: var(--color-muted);">{{ pain.description }}</p>
              <!-- Impact tag -->
              <div class="mt-5 flex items-center gap-2">
                <span class="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style="background: #FEF2F2; color: #DC2626;">
                  ↑ {{ pain.impact }}
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
      icon: '🗂️',
      title: 'Tickets perdus, délais oubliés',
      description: 'Sans outil centralisé, les tickets traînent dans des tableurs, des cahiers ou des mails. Résultat : retards, client mécontent, image dégradée.',
      impact: 'jusqu\'à 30% de tickets mal suivis',
      delay: 0,
    },
    {
      icon: '📡',
      title: 'Zéro visibilité pour le client',
      description: 'Le client rappelle 5 fois pour savoir où en est sa réparation. Vos équipes perdent du temps. Votre réputation en prend un coup.',
      impact: '40% des appels = demandes de statut',
      delay: 100,
    },
    {
      icon: '📦',
      title: 'Stocks ingérables, interventions bloquées',
      description: 'Un technicien arrive sans les pièces. Un stock vide découvert trop tard. Des interventions repoussées inutilement — et un client de moins.',
      impact: '1 intervention sur 5 retardée par rupture',
      delay: 200,
    },
  ];
}
