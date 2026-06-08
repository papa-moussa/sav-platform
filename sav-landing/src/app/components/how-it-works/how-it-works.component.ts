import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="workflow" class="section" style="background: var(--bg);">
      <div class="wrap">

        <!-- Header -->
        <div class="max-w-[720px]" appFadeIn [fadeInDelay]="0">
          <span class="eyebrow">Workflow</span>
          <h2 class="text-[2rem] sm:text-[2.5rem] leading-[1.08] mb-4">
            De la réception du ticket<br/>
            <span style="color: var(--text-muted);">à la satisfaction client.</span>
          </h2>
          <p class="text-[16.5px] leading-relaxed max-w-[620px]" style="color: var(--text-mid);">
            Six étapes claires — chacune horodatée, tracée, et visible par tous les intervenants.
          </p>
        </div>

        <!-- Two-column layout: timeline + sticky sidecard -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-16 items-start">

          <!-- Timeline -->
          <div class="lg:col-span-7">
            @for (step of steps; track step.number; let last = $last) {
              <div class="flex gap-5" appFadeIn [fadeInDelay]="step.number * 60">

                <div class="flex flex-col items-center" aria-hidden="true">
                  <div class="step-dot">{{ step.number }}</div>
                  @if (!last) { <div class="step-line"></div> }
                </div>

                <div [class.pb-6]="!last" class="flex-1 pt-0.5">
                  <div class="surface-flat p-5">
                    <div class="flex items-start gap-3">
                      <div class="icon-tile flex-shrink-0" [class]="step.iconClass">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <path [attr.d]="step.iconPath"/>
                        </svg>
                      </div>
                      <div class="flex-1">
                        <div class="flex items-baseline gap-2.5 mb-1">
                          <h3 class="text-[14.5px] font-semibold" style="color: var(--text);">{{ step.title }}</h3>
                          <span class="mono text-[11px]" style="color: var(--text-subtle);">{{ step.duration }}</span>
                        </div>
                        <p class="text-[13.5px] leading-relaxed mb-2" style="color: var(--text-mid);">{{ step.description }}</p>
                        <div class="flex flex-wrap gap-1.5">
                          @for (tag of step.tags; track tag) {
                            <span class="pill-ghost text-[11px]">{{ tag }}</span>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Sticky side card -->
          <div class="lg:col-span-5 lg:sticky lg:top-24" appFadeIn [fadeInDelay]="150">
            <div class="surface-flat overflow-hidden">

              <div class="p-6 sm:p-7">
                <div class="icon-tile-lg icon-tile-primary mb-5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <h3 class="text-[1.25rem] font-semibold mb-2">Tout tracé, tout le temps.</h3>
                <p class="text-[14px] leading-relaxed mb-6" style="color: var(--text-mid);">
                  Chaque action est horodatée. Un historique complet, accessible en un clic — pour auditer, piloter, améliorer.
                </p>

                <ul class="space-y-3">
                  @for (h of highlights; track h) {
                    <li class="flex items-start gap-2.5 text-[13.5px]" style="color: var(--text-sub);">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      {{ h }}
                    </li>
                  }
                </ul>
              </div>

              <!-- Testimonial -->
              <div class="px-6 sm:px-7 py-5" style="background: var(--surface-2); border-top: 1px solid var(--border);">
                <p class="text-[13.5px] leading-relaxed italic mb-3" style="color: var(--text-sub);">
                  "Déployé en 48h. Opérationnel dès le premier jour. Nos techniciens l'ont pris en main sans formation longue."
                </p>
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white"
                       style="background: var(--primary);">M</div>
                  <div>
                    <p class="text-[12px] font-semibold" style="color: var(--text);">Mamadou D.</p>
                    <p class="text-[11px]" style="color: var(--text-muted);">Directeur SAV · Dakar</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  `,
})
export class HowItWorksComponent {
  steps = [
    {
      number: 1,
      title: 'Réception du ticket',
      description: 'Client, appareil, problème. Un ticket est créé en moins d\'une minute, numéroté automatiquement.',
      duration: '< 1 min',
      iconClass: 'icon-tile-primary',
      iconPath: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
      tags: ['QR token', 'Client notifié', 'SLA calculé'],
    },
    {
      number: 2,
      title: 'Diagnostic',
      description: 'Le technicien inspecte, note, photographie. Les pièces nécessaires sont identifiées.',
      duration: '10–30 min',
      iconClass: 'icon-tile-warning',
      iconPath: 'M21 21l-4.35-4.35 M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
      tags: ['Photos avant', 'Pièces liées', 'Durée tracée'],
    },
    {
      number: 3,
      title: 'Devis client',
      description: 'Un devis est envoyé au client par lien sécurisé. Il l\'approuve ou le refuse depuis son téléphone.',
      duration: 'Variable',
      iconClass: 'icon-tile-success',
      iconPath: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 15l2 2 4-4',
      tags: ['Lien QR sécurisé', 'Approbation 1 clic'],
    },
    {
      number: 4,
      title: 'Réparation',
      description: 'L\'intervention est lancée. Le stock est débité automatiquement. Temps et actions enregistrés.',
      duration: '30 min – 3h',
      iconClass: 'icon-tile-primary',
      iconPath: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
      tags: ['Stock débité', 'Photos après'],
    },
    {
      number: 5,
      title: 'Clôture & notification',
      description: 'L\'appareil est prêt. Le client est automatiquement notifié. Le ticket est fermé avec son résultat final.',
      duration: 'Auto',
      iconClass: 'icon-tile-success',
      iconPath: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3',
      tags: ['WhatsApp auto', 'Historique conservé'],
    },
    {
      number: 6,
      title: 'Feedback satisfaction',
      description: 'QR code envoyé. Le client note le technicien et l\'entreprise. Des données exploitables, pas des impressions.',
      duration: '< 30 s',
      iconClass: 'icon-tile-orange',
      iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87L8.91 8.26 12 2z',
      tags: ['NPS mesuré', 'Exportable'],
    },
  ];

  highlights = [
    'Historique complet de chaque intervention',
    'Notifications multicanales (WhatsApp, SMS, e-mail)',
    'Traçabilité des pièces et du stock',
    'Feedback client à chaque clôture',
    'Rapports exportables en PDF',
  ];
}
