import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section class="gradient-primary section-padding text-white">
      <div class="container-max">

        <div appFadeIn class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            Ils nous font confiance
          </h2>
          <p class="text-blue-100 text-lg max-w-xl mx-auto">
            Des centaines d'entreprises utilisent Sama SAV pour optimiser leur service après-vente.
          </p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          @for (stat of stats; track stat.label; let i = $index) {
            <div appFadeIn [fadeInDelay]="i * 100"
                 class="text-center p-6 bg-white/15 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div class="text-4xl sm:text-5xl font-bold mb-2">{{ stat.value }}</div>
              <div class="text-blue-100 font-medium">{{ stat.label }}</div>
              <div class="text-blue-200 text-sm mt-1">{{ stat.sub }}</div>
            </div>
          }
        </div>

        <!-- Testimonial -->
        <div appFadeIn class="mt-16 text-center">
          <blockquote class="max-w-3xl mx-auto">
            <p class="text-xl sm:text-2xl font-medium text-white leading-relaxed mb-6">
              "Sama SAV a transformé notre façon de gérer les réparations. Nos clients sont ravis et nos techniciens sont plus efficaces que jamais."
            </p>
            <footer class="flex items-center justify-center gap-4">
              <div class="w-12 h-12 gradient-primary rounded-full border-2 border-white/40 flex items-center justify-center">
                <span class="text-white font-bold text-lg">A</span>
              </div>
              <div class="text-left">
                <p class="font-semibold text-white">Alexandre Martin</p>
                <p class="text-blue-200 text-sm">Directeur SAV — TechRepair Pro</p>
              </div>
            </footer>
          </blockquote>
        </div>

      </div>
    </section>
  `,
})
export class StatsComponent {
  stats = [
    { value: '500+', label: 'Entreprises', sub: 'nous font confiance' },
    { value: '98%', label: 'Satisfaction client', sub: 'score moyen' },
    { value: '10x', label: 'Plus rapide', sub: 'que les méthodes papier' },
    { value: '24/7', label: 'Disponibilité', sub: 'plateforme cloud' },
  ];
}
