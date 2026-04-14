import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-personas',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section class="section-padding" style="background: var(--color-bg);">
      <div class="container-max">

        <!-- Header -->
        <div class="text-center max-w-2xl mx-auto mb-16" appFadeIn [fadeInDelay]="0">
          <div class="section-badge w-fit mx-auto">Expériences</div>
          <h2 class="text-3xl sm:text-4xl font-bold leading-tight" style="color: var(--color-text);">
            Une expérience pensée<br/>
            <span class="gradient-text">pour chaque acteur</span>
          </h2>
        </div>

        <!-- Two-column personas -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <!-- Technicien -->
          <div appFadeIn [fadeInDelay]="0"
               class="rounded-2xl p-8 relative overflow-hidden"
               style="background: rgba(99,102,241,0.07); border: 1px solid rgba(99,102,241,0.2);">
            <!-- Glow -->
            <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20"
                 style="background: #6366F1;"></div>

            <div class="relative z-10">
              <!-- Avatar + tag -->
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                     style="background: rgba(99,102,241,0.2);">🔧</div>
                <div>
                  <p class="font-bold" style="color: var(--color-text);">Le Technicien</p>
                  <p class="text-xs" style="color: #A5B4FC;">Mobile-first · Rapide · Efficace</p>
                </div>
              </div>

              <!-- Quote -->
              <blockquote class="text-base italic leading-relaxed mb-8 pl-4"
                          style="color: var(--color-muted); border-left: 2px solid rgba(99,102,241,0.5);">
                "Je reçois ma liste d'interventions du jour. Je sais exactement quoi faire, dans quel ordre."
              </blockquote>

              <!-- Checklist -->
              <ul class="space-y-3">
                @for (item of techItems; track item) {
                  <li class="flex items-center gap-3 text-sm" style="color: var(--color-text);">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {{ item }}
                  </li>
                }
              </ul>
            </div>
          </div>

          <!-- Client -->
          <div appFadeIn [fadeInDelay]="100"
               class="rounded-2xl p-8 relative overflow-hidden"
               style="background: rgba(34,211,238,0.05); border: 1px solid rgba(34,211,238,0.2);">
            <!-- Glow -->
            <div class="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-10"
                 style="background: #22D3EE;"></div>

            <div class="relative z-10">
              <!-- Avatar + tag -->
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                     style="background: rgba(34,211,238,0.1);">📱</div>
                <div>
                  <p class="font-bold" style="color: var(--color-text);">Le Client</p>
                  <p class="text-xs" style="color: #22D3EE;">Transparent · Rassurant · Sans friction</p>
                </div>
              </div>

              <!-- Quote -->
              <blockquote class="text-base italic leading-relaxed mb-8 pl-4"
                          style="color: var(--color-muted); border-left: 2px solid rgba(34,211,238,0.4);">
                "J'ai reçu un message WhatsApp pour chaque étape. J'ai suivi ma réparation sans appeler une seule fois."
              </blockquote>

              <!-- Checklist -->
              <ul class="space-y-3">
                @for (item of clientItems; track item) {
                  <li class="flex items-center gap-3 text-sm" style="color: var(--color-text);">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {{ item }}
                  </li>
                }
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
})
export class PersonasComponent {
  techItems = [
    'Vue liste des tickets assignés du jour',
    'Fiche intervention complète sur mobile',
    'Diagnostic guidé avec notes et observations',
    'Temps passé mesuré automatiquement',
    'Blocage avec motif si pièce manquante',
  ];

  clientItems = [
    'Notification WhatsApp à chaque changement de statut',
    'Suivi en temps réel via lien QR sécurisé',
    'Approbation du devis en 1 clic depuis le téléphone',
    'Feedback facile après réparation (QR code)',
    'Notification automatique quand l\'appareil est prêt',
  ];
}
