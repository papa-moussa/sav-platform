import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="fonctionnalites" class="section-padding" style="background: var(--color-surface);">
      <div class="container-max">

        <!-- Header -->
        <div class="text-center max-w-2xl mx-auto mb-16" appFadeIn [fadeInDelay]="0">
          <div class="section-badge w-fit mx-auto">Fonctionnalités</div>
          <h2 class="text-3xl sm:text-4xl font-bold leading-tight mb-5" style="color: var(--color-text);">
            Tout ce dont votre SAV a besoin
          </h2>
          <p class="text-lg" style="color: var(--color-muted);">
            Chaque fonctionnalité a été pensée pour réduire la friction
            et augmenter votre productivité.
          </p>
        </div>

        <!-- Feature grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (feature of features; track feature.title; let i = $index) {
            <div appFadeIn [fadeInDelay]="i * 80" class="card-glass p-7 group">
              <!-- Icon -->
              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110"
                   [style.background]="feature.iconBg">
                {{ feature.icon }}
              </div>
              <!-- Title -->
              <h3 class="text-base font-bold mb-2.5" style="color: var(--color-text);">{{ feature.title }}</h3>
              <!-- Description -->
              <p class="text-sm leading-relaxed" style="color: var(--color-muted);">{{ feature.description }}</p>
              <!-- Benefit tag -->
              <div class="mt-5 pt-5" style="border-top: 1px solid rgba(255,255,255,0.05);">
                <span class="text-xs font-semibold" style="color: #A5B4FC;">→ {{ feature.benefit }}</span>
              </div>
            </div>
          }
        </div>

      </div>
    </section>
  `,
})
export class FeaturesComponent {
  features = [
    {
      icon: '📋',
      title: 'Tickets structurés, zéro oubli',
      description: 'De la réception REÇU à la CLÔTURE, chaque ticket suit un workflow guidé. Numérotation automatique, SLA calculé, historique complet.',
      benefit: 'Aucun ticket ne tombe dans l\'oubli',
      iconBg: 'rgba(99,102,241,0.12)',
    },
    {
      icon: '🔧',
      title: 'Techniciens pilotés, pas noyés',
      description: 'Assignation en 1 clic, diagnostic détaillé, suivi du temps passé. Vos techniciens savent exactement quoi faire, quand et comment.',
      benefit: 'Productivité technicien +35%',
      iconBg: 'rgba(16,185,129,0.12)',
    },
    {
      icon: '📲',
      title: 'Clients notifiés automatiquement',
      description: 'WhatsApp automatique à chaque changement de statut. "Votre appareil est prêt" — sans que votre équipe lève le petit doigt.',
      benefit: '-40% d\'appels entrants inutiles',
      iconBg: 'rgba(34,211,238,0.12)',
    },
    {
      icon: '📦',
      title: 'Stock géré, ruptures évitées',
      description: 'Seuils d\'alerte automatiques, mouvements tracés, pièces reliées aux interventions. Vous savez toujours ce qu\'il vous reste.',
      benefit: 'Fini les interventions bloquées',
      iconBg: 'rgba(245,158,11,0.12)',
    },
    {
      icon: '📊',
      title: 'Devis accepté en 1 clic',
      description: 'Envoyez un devis, le client l\'approuve via son lien QR sécurisé. Aucun appel inutile. Transaction fluide et traçable.',
      benefit: 'Validation client 3x plus rapide',
      iconBg: 'rgba(99,102,241,0.12)',
    },
    {
      icon: '⭐',
      title: 'Satisfaction mesurée, fidélité construite',
      description: 'QR code de feedback à chaque clôture. Note technicien, note entreprise. Identifiez les axes d\'amélioration. Construisez votre réputation.',
      benefit: 'Données actionnables en temps réel',
      iconBg: 'rgba(245,158,11,0.12)',
    },
  ];
}
