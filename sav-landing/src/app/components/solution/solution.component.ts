import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-solution',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section class="section-padding" style="background: var(--color-bg);">
      <div class="container-max">
        <div class="text-center max-w-3xl mx-auto" appFadeIn [fadeInDelay]="0">

          <!-- Badge -->
          <div class="section-badge w-fit mx-auto">
            ✦ La solution
          </div>

          <!-- Title -->
          <h2 class="text-3xl sm:text-4xl font-bold leading-tight mb-6" style="color: var(--color-text);">
            Un seul outil pour orchestrer<br/>
            <span class="gradient-text">tout votre Service Après-Vente.</span>
          </h2>

          <!-- Description -->
          <p class="text-lg leading-relaxed mb-16" style="color: var(--color-muted);">
            SAV Platform centralise la réception, le suivi, la communication et la clôture
            de chaque ticket de réparation. Vos équipes gagnent en efficacité.
            Vos clients gagnent en confiance.
          </p>

          <!-- 3 pillars -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-2xl overflow-hidden"
               style="background: var(--color-border);">
            @for (pillar of pillars; track pillar.icon) {
              <div class="p-8 flex flex-col items-center text-center" style="background: var(--color-surface);">
                <div class="text-3xl mb-4">{{ pillar.icon }}</div>
                <h3 class="text-base font-bold mb-2" style="color: var(--color-text);">{{ pillar.title }}</h3>
                <p class="text-sm" style="color: var(--color-muted);">{{ pillar.subtitle }}</p>
              </div>
            }
          </div>

        </div>
      </div>
    </section>
  `,
})
export class SolutionComponent {
  pillars = [
    { icon: '🎯', title: 'Simplicité', subtitle: 'Pour vos équipes' },
    { icon: '⚡', title: 'Rapidité', subtitle: 'Dans vos délais' },
    { icon: '❤️', title: 'Satisfaction', subtitle: 'Pour vos clients' },
  ];
}
