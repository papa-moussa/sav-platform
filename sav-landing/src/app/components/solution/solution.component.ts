import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-solution',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="produit" class="section" style="background: var(--bg);">
      <div class="wrap">

        <!-- Heading -->
        <div class="max-w-[720px]" appFadeIn [fadeInDelay]="0">
          <span class="eyebrow">La solution</span>
          <h2 class="text-[2rem] sm:text-[2.5rem] leading-[1.08] mb-4">
            Un seul outil pour piloter<br/>
            <span style="color: var(--text-muted);">tout votre service après-vente.</span>
          </h2>
          <p class="text-[16.5px] leading-relaxed max-w-[620px]" style="color: var(--text-mid);">
            Sama SAV centralise la réception, le diagnostic, la validation, la réparation
            et la communication client — pour plusieurs sites, avec des données strictement isolées.
          </p>
        </div>

        <!-- Pillars row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
          @for (p of pillars; track p.title; let i = $index) {
            <div class="surface-card p-6" appFadeIn [fadeInDelay]="i * 80">
              <div class="icon-tile-lg mb-5" [class]="p.iconClass">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path [attr.d]="p.icon"/>
                </svg>
              </div>
              <h3 class="text-[15.5px] font-semibold mb-1.5">{{ p.title }}</h3>
              <p class="text-[13.5px] leading-relaxed" style="color: var(--text-muted);">{{ p.description }}</p>
            </div>
          }
        </div>

        <!-- Multi-tenant showcase -->
        <div class="mt-20 surface-flat overflow-hidden" appFadeIn [fadeInDelay]="120">
          <div class="grid grid-cols-1 lg:grid-cols-2">

            <!-- Left: copy -->
            <div class="p-8 sm:p-10 lg:p-12 flex flex-col justify-center"
                 style="border-right: 1px solid var(--border);">
              <span class="pill-primary w-fit mb-5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
                Multi-entreprise · Multi-sites
              </span>
              <h3 class="text-[1.625rem] sm:text-[1.875rem] leading-[1.1] mb-3">
                Une plateforme, plusieurs entités —<br/>
                <span style="color: var(--text-muted);">données strictement isolées.</span>
              </h3>
              <p class="text-[15px] leading-relaxed mb-6" style="color: var(--text-mid);">
                Chaque entreprise dispose de son espace : utilisateurs, sites, stocks, tickets et rapports.
                Aucune fuite possible, aucun mélange. Idéal pour les réseaux, les franchises et les groupes.
              </p>
              <ul class="space-y-2.5 mb-2">
                @for (bullet of multiTenant; track bullet) {
                  <li class="flex items-start gap-2.5 text-[14px]" style="color: var(--text-sub);">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {{ bullet }}
                  </li>
                }
              </ul>
            </div>

            <!-- Right: schematic of tenancy -->
            <div class="p-8 sm:p-10 lg:p-12 flex items-center justify-center relative"
                 style="background: var(--surface-2);">
              <div class="relative w-full max-w-sm">
                <!-- Root tenant -->
                <div class="surface-elevated p-4 mb-6 flex items-center gap-3">
                  <div class="icon-tile icon-tile-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-[13px] font-semibold" style="color: var(--text);">ElectroSénégal</p>
                    <p class="text-[11.5px]" style="color: var(--text-muted);">3 sites · 14 techniciens · 482 tickets</p>
                  </div>
                </div>

                <!-- Dashed connectors -->
                <div class="grid grid-cols-3 gap-3">
                  @for (child of childSites; track child.name) {
                    <div class="surface-flat p-3 relative">
                      <div class="w-2 h-2 rounded-full mb-2" [style.background]="child.color"></div>
                      <p class="text-[12px] font-semibold leading-tight" style="color: var(--text);">{{ child.name }}</p>
                      <p class="text-[10.5px] mt-0.5 mono" style="color: var(--text-muted);">{{ child.tickets }} tickets</p>
                    </div>
                  }
                </div>

                <!-- Data isolation chip -->
                <div class="mt-6 flex items-center gap-2 px-3 py-2 rounded-[8px]"
                     style="background: var(--surface); border: 1px solid var(--border);">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span class="text-[12px] font-medium" style="color: var(--text-sub);">Isolation stricte par tenant</span>
                  <span class="ml-auto mono text-[10.5px] font-semibold px-1.5 py-0.5 rounded"
                        style="background: var(--success-soft); color: var(--success);">SÉCURISÉ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  `,
})
export class SolutionComponent {
  pillars = [
    {
      title: 'Structuré',
      description: 'Chaque ticket suit un workflow guidé — de la réception à la clôture, sans étape oubliée.',
      iconClass: 'icon-tile-primary',
      icon: 'M4 6h16 M4 12h16 M4 18h16',
    },
    {
      title: 'Mobile',
      description: 'Vos techniciens interviennent depuis leur téléphone. Mode offline, fiches complètes, signature client.',
      iconClass: 'icon-tile-success',
      icon: 'M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01',
    },
    {
      title: 'Mesurable',
      description: 'SLA, temps d\'intervention, satisfaction, taux de ré-ouverture. Vos KPI pilotés en temps réel.',
      iconClass: 'icon-tile-warning',
      icon: 'M3 3v18h18 M7 12l4 4 6-6',
    },
  ];

  multiTenant = [
    'Espaces isolés par entreprise (données, utilisateurs, rôles)',
    'Gestion fine des sites et des agences',
    'Reporting agrégé et par site',
    'Rôles personnalisés (admin, chef d\'atelier, technicien, accueil)',
  ];

  childSites = [
    { name: 'Dakar',   tickets: 214, color: 'var(--success)' },
    { name: 'Thiès',   tickets: 128, color: 'var(--success)' },
    { name: 'Abidjan', tickets: 140, color: 'var(--warning)' },
  ];
}
