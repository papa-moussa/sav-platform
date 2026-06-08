import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-personas',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="cas-usage" class="section" style="background: var(--bg);">
      <div class="wrap">

        <!-- Header -->
        <div class="max-w-[720px]" appFadeIn [fadeInDelay]="0">
          <span class="eyebrow">Cas d'usage</span>
          <h2 class="text-[2rem] sm:text-[2.5rem] leading-[1.08] mb-4">
            Conçu pour les métiers<br/>
            <span style="color: var(--text-muted);">qui ne peuvent pas se tromper.</span>
          </h2>
          <p class="text-[16.5px] leading-relaxed max-w-[620px]" style="color: var(--text-mid);">
            Trois profils, une même exigence : fiabilité, rapidité, transparence vis-à-vis du client.
          </p>
        </div>

        <!-- Use case cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
          @for (uc of useCases; track uc.title; let i = $index) {
            <div class="surface-card p-7 flex flex-col" appFadeIn [fadeInDelay]="i * 100">

              <!-- Top label -->
              <div class="flex items-center gap-2 mb-6">
                <div class="icon-tile" [class]="uc.iconClass">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path [attr.d]="uc.icon"/>
                  </svg>
                </div>
                <span class="text-[11px] font-semibold uppercase tracking-[0.1em]" style="color: var(--text-muted);">
                  {{ uc.tag }}
                </span>
              </div>

              <h3 class="text-[17px] font-semibold mb-2 leading-snug">{{ uc.title }}</h3>
              <p class="text-[13.5px] leading-relaxed mb-5" style="color: var(--text-muted);">{{ uc.context }}</p>

              <!-- Checklist -->
              <ul class="space-y-2 mb-6">
                @for (point of uc.points; track point) {
                  <li class="flex items-start gap-2 text-[13px]" style="color: var(--text-sub);">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {{ point }}
                  </li>
                }
              </ul>

              <!-- Metric footer -->
              <div class="mt-auto pt-5" style="border-top: 1px solid var(--border);">
                <div class="flex items-baseline gap-2">
                  <p class="num-xl" style="color: var(--text);">{{ uc.metric }}</p>
                  <span class="text-[11.5px]" style="color: var(--text-muted);">{{ uc.metricLabel }}</span>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Testimonial strip -->
        <div class="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-4" appFadeIn [fadeInDelay]="200">
          @for (t of testimonials; track t.author) {
            <figure class="surface-flat p-6">
              <div class="flex items-center gap-0.5 mb-3">
                @for (s of [1,2,3,4,5]; track s) {
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--warning)" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                }
              </div>
              <blockquote class="text-[13.5px] leading-relaxed mb-5" style="color: var(--text-sub);">
                "{{ t.quote }}"
              </blockquote>
              <figcaption class="flex items-center gap-2.5 pt-4" style="border-top: 1px solid var(--border);">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white"
                     [style.background]="t.bg">{{ t.initial }}</div>
                <div>
                  <p class="text-[12.5px] font-semibold" style="color: var(--text);">{{ t.author }}</p>
                  <p class="text-[11px]" style="color: var(--text-muted);">{{ t.role }}</p>
                </div>
              </figcaption>
            </figure>
          }
        </div>

      </div>
    </section>
  `,
})
export class PersonasComponent {
  useCases = [
    {
      tag: 'Électroménager',
      title: 'Atelier de réparation',
      context: 'Vous gérez un atelier avec plusieurs techniciens. Vous recevez chaque jour des appareils, et chaque appareil a sa propre histoire.',
      iconClass: 'icon-tile-primary',
      icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
      points: [
        'Fiche appareil complète à chaque entrée',
        'Diagnostic photo + notes du technicien',
        'Historique des réparations par client',
        'Facturation liée au ticket',
      ],
      metric: '3×',
      metricLabel: 'plus de tickets traités / jour',
    },
    {
      tag: 'Téléphonie & électronique',
      title: 'SAV téléphonie',
      context: 'Vitrine, arrière-boutique, clients pressés. Vous avez besoin d\'un accueil rapide et d\'un suivi impeccable — sinon ils partent ailleurs.',
      iconClass: 'icon-tile-success',
      icon: 'M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01',
      points: [
        'Accueil en 30 secondes (QR ticket client)',
        'Suivi temps réel partageable avec le client',
        'Gestion des pièces (écrans, batteries, connecteurs)',
        'Retour client automatique par WhatsApp',
      ],
      metric: '−60%',
      metricLabel: 'd\'appels "où en est ma réparation ?"',
    },
    {
      tag: 'Réseau & franchise',
      title: 'Multi-sites nationaux',
      context: 'Vous opérez sur plusieurs villes ou régions. Vous voulez une vision consolidée — et une autonomie locale par site.',
      iconClass: 'icon-tile-warning',
      icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
      points: [
        'Back-office groupe + comptes par site',
        'Stocks et techniciens propres à chaque agence',
        'Rapports consolidés et par site',
        'Rôles fins (admin groupe, chef de site, agent)',
      ],
      metric: '+40%',
      metricLabel: 'de visibilité sur le réseau',
    },
  ];

  testimonials = [
    {
      quote: 'Notre note de satisfaction est passée de 3.2 à 4.8 en deux mois. Les clients voient la différence immédiatement.',
      author: 'Ousmane Ndiaye',
      role: 'Directeur SAV · ElectroSénégal',
      initial: 'O',
      bg: 'var(--primary)',
    },
    {
      quote: 'Déployé en 48h, pris en main en une demi-journée. Je recommande sans hésiter à tous les professionnels.',
      author: 'Aminata Diallo',
      role: 'Responsable opérations · TechRepair CI',
      initial: 'A',
      bg: 'var(--success)',
    },
    {
      quote: 'Les notifications WhatsApp ont divisé par deux nos appels entrants. Un gain de temps énorme au quotidien.',
      author: 'Fatou Sow',
      role: 'Gérante · MaîtreElec Pro',
      initial: 'F',
      bg: 'var(--warning)',
    },
  ];
}
