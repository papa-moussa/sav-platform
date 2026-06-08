import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section class="section-padding" style="background: var(--color-surface);">
      <div class="container-max">

        <!-- Header -->
        <div class="text-center max-w-xl mx-auto mb-16" appFadeIn [fadeInDelay]="0">
          <span class="section-label">Témoignages</span>
          <h2 class="text-3xl sm:text-4xl font-bold leading-tight mb-4" style="color: var(--color-text);">
            Ils ont transformé leur SAV
          </h2>
          <p class="text-lg" style="color: var(--color-muted);">
            Ce que disent les responsables SAV qui utilisent Sama SAV au quotidien.
          </p>
        </div>

        <!-- Stats strip -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-px mb-16 rounded-2xl overflow-hidden"
             style="background: var(--color-border);" appFadeIn [fadeInDelay]="50">
          @for (stat of stats; track stat.label) {
            <div class="px-6 py-8 text-center" style="background: var(--color-surface);">
              <p class="stat-number gradient-text mb-2">{{ stat.value }}</p>
              <p class="text-sm font-semibold mb-0.5" style="color: var(--color-text);">{{ stat.label }}</p>
              <p class="text-xs" style="color: var(--color-muted);">{{ stat.sub }}</p>
            </div>
          }
        </div>

        <!-- Testimonials grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          @for (t of testimonials; track t.author; let i = $index) {
            <div appFadeIn [fadeInDelay]="i * 100"
                 class="card p-7 flex flex-col"
                 [class.md:col-span-2]="i === 0">

              <!-- Stars -->
              <div class="flex items-center gap-0.5 mb-4" [attr.aria-label]="'Note: 5 étoiles sur 5'">
                @for (s of [1,2,3,4,5]; track s) {
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                }
              </div>

              <!-- Quote -->
              <blockquote class="flex-1">
                <p class="text-[15px] leading-relaxed mb-6 italic" style="color: var(--color-sub);">
                  "{{ t.quote }}"
                </p>
              </blockquote>

              <!-- Author -->
              <div class="flex items-center gap-3 pt-5" style="border-top: 1px solid var(--color-border);">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                     [style.background]="t.avatarBg">
                  {{ t.initial }}
                </div>
                <div>
                  <p class="text-[13px] font-semibold" style="color: var(--color-text);">{{ t.author }}</p>
                  <p class="text-[12px]" style="color: var(--color-muted);">{{ t.role }}</p>
                </div>
                <div class="ml-auto">
                  <span class="badge-neutral text-[11px]">{{ t.tag }}</span>
                </div>
              </div>
            </div>
          }
        </div>

      </div>
    </section>
  `,
})
export class StatsComponent {
  stats = [
    { value: '500+', label: 'Entreprises',          sub: 'nous font confiance' },
    { value: '98%',  label: 'Satisfaction client',  sub: 'score moyen global' },
    { value: '10×',  label: 'Plus rapide',          sub: 'vs. méthodes papier' },
    { value: '24/7', label: 'Disponibilité',        sub: 'plateforme cloud' },
  ];

  testimonials = [
    {
      quote: 'Sama SAV a complètement changé notre façon de travailler. Avant, on perdait des tickets, les clients rappelaient sans arrêt. Aujourd\'hui, tout est centralisé, les techniciens sont guidés et nos clients reçoivent des notifications automatiques. Notre note de satisfaction est passée de 3.2 à 4.8 en deux mois.',
      author: 'Ousmane Ndiaye',
      role: 'Directeur SAV — ElectroSénégal, Dakar',
      initial: 'O',
      avatarBg: 'linear-gradient(135deg, #1D4ED8, #6366F1)',
      tag: 'Électroménager',
    },
    {
      quote: 'Le déploiement a été fait en 48h comme promis. Mes techniciens ont pris en main l\'outil en moins d\'une journée. Je recommande sans hésiter.',
      author: 'Aminata Diallo',
      role: 'Responsable opérations — TechRepair CI, Abidjan',
      initial: 'A',
      avatarBg: 'linear-gradient(135deg, #F97316, #EF4444)',
      tag: 'Multi-sites',
    },
    {
      quote: 'La fonctionnalité de notification WhatsApp automatique a réduit nos appels entrants de 40%. Un gain de temps énorme pour notre équipe.',
      author: 'Fatou Sow',
      role: 'Gérante — MaîtreElec Pro, Thiès',
      initial: 'F',
      avatarBg: 'linear-gradient(135deg, #059669, #0EA5E9)',
      tag: 'PME',
    },
  ];
}
