import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="comment-ca-marche" class="section-padding" style="background: var(--color-bg);">
      <div class="container-max">

        <!-- Header -->
        <div class="text-center max-w-2xl mx-auto mb-20" appFadeIn [fadeInDelay]="0">
          <div class="section-badge w-fit mx-auto">Workflow</div>
          <h2 class="text-3xl sm:text-4xl font-bold leading-tight mb-5" style="color: var(--color-text);">
            De la réception à la<br/>
            <span class="gradient-text">satisfaction client</span>
          </h2>
          <p class="text-lg" style="color: var(--color-muted);">
            Le cycle complet d'un ticket en 6 étapes claires.
          </p>
        </div>

        <!-- Timeline -->
        <div class="max-w-3xl mx-auto">
          @for (step of steps; track step.number; let last = $last) {
            <div appFadeIn [fadeInDelay]="step.number * 80"
                 class="flex gap-6">

              <!-- Left: dot + line -->
              <div class="flex flex-col items-center">
                <div class="timeline-dot">{{ step.number }}</div>
                @if (!last) {
                  <div class="timeline-line my-1"></div>
                }
              </div>

              <!-- Right: content -->
              <div [class.pb-10]="!last" [class.pb-0]="last" class="flex-1 pt-1.5">
                <div class="card-glass p-5 mb-1">
                  <div class="flex items-start gap-4">
                    <span class="text-2xl flex-shrink-0">{{ step.icon }}</span>
                    <div>
                      <h3 class="text-base font-bold mb-1.5" style="color: var(--color-text);">{{ step.title }}</h3>
                      <p class="text-sm leading-relaxed mb-3" style="color: var(--color-muted);">{{ step.description }}</p>
                      <p class="text-xs font-medium" style="color: var(--color-primary);">→ {{ step.detail }}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          }
        </div>

      </div>
    </section>
  `,
})
export class HowItWorksComponent {
  steps = [
    {
      number: 1,
      icon: '📥',
      title: 'Réception',
      description: 'Le ticket est créé avec les infos client, l\'appareil et le problème décrit.',
      detail: 'Numéro auto généré, QR token créé, client notifié par WhatsApp.',
    },
    {
      number: 2,
      icon: '🔍',
      title: 'Diagnostic',
      description: 'Le technicien inspecte l\'appareil, note ses observations et identifie les pièces nécessaires.',
      detail: 'Durée tracée, pièces identifiées, actions enregistrées.',
    },
    {
      number: 3,
      icon: '📄',
      title: 'Devis (si nécessaire)',
      description: 'Un devis est envoyé au client. Il l\'approuve ou le refuse depuis son smartphone.',
      detail: 'Aucun appel. Validation sécurisée en 1 clic via lien QR.',
    },
    {
      number: 4,
      icon: '🔧',
      title: 'Réparation',
      description: 'L\'intervention est lancée. Le stock est débité automatiquement des pièces utilisées.',
      detail: 'Technicien guidé, temps passé mesuré, résultat enregistré.',
    },
    {
      number: 5,
      icon: '✅',
      title: 'Clôture',
      description: 'L\'appareil est prêt. Le client est notifié. Le ticket est fermé avec son résultat.',
      detail: 'Résultat : RÉPARÉ / IRRÉPARABLE / EN COURS. Historique complet conservé.',
    },
    {
      number: 6,
      icon: '⭐',
      title: 'Feedback',
      description: 'Un QR code de satisfaction est envoyé. Le client note le technicien et l\'entreprise.',
      detail: 'Données exploitables pour piloter et améliorer votre service.',
    },
  ];
}
