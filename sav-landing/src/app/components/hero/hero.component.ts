import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="accueil" class="relative overflow-hidden" style="background: var(--bg);">

      <!-- subtle grid backdrop -->
      <div class="absolute inset-0 bg-grid bg-grid-mask pointer-events-none" aria-hidden="true"></div>

      <!-- top line gradient -->
      <div class="absolute top-0 left-0 right-0 h-px"
           style="background: linear-gradient(to right, transparent, var(--border-strong) 20%, var(--border-strong) 80%, transparent);"
           aria-hidden="true"></div>

      <div class="relative wrap pt-24 sm:pt-28 pb-20 sm:pb-24 px-5 sm:px-6 lg:px-8">

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          <!-- ═══ Left: Copy ═══ -->
          <div class="lg:col-span-6" appFadeIn [fadeInDelay]="0">

            <!-- Announcement -->
            <a href="#produit"
               class="inline-flex items-center gap-2 pl-1 pr-3 py-1 mb-8 rounded-full text-[12.5px] font-medium transition-colors"
               style="background: var(--surface); border: 1px solid var(--border); color: var(--text-sub);">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                    style="background: var(--primary-soft); color: var(--primary);">
                Nouveau
              </span>
              App mobile technicien disponible
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </a>

            <!-- H1 — the big promise -->
            <h1 class="text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] font-semibold leading-[1.04] mb-6"
                style="color: var(--text);">
              Optimisez votre service<br/>
              après-vente <span style="color: var(--text-muted);">de bout en bout.</span>
            </h1>

            <!-- Sub -->
            <p class="text-[17px] sm:text-[18px] leading-[1.55] mb-9 max-w-[540px]"
               style="color: var(--text-mid);">
              La plateforme métier qui orchestre vos tickets, vos techniciens,
              vos stocks et la satisfaction client — sur plusieurs sites, en temps réel.
            </p>

            <!-- CTAs -->
            <div class="flex flex-col sm:flex-row items-start gap-2.5 mb-10">
              <a href="#contact" class="btn btn-accent btn-lg">
                Demander une démo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="#produit" class="btn btn-ghost btn-lg">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Voir le produit
              </a>
            </div>

            <!-- Trust -->
            <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]" style="color: var(--text-muted);">
              @for (t of trust; track t) {
                <span class="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  {{ t }}
                </span>
              }
            </div>

            <!-- Logo strip -->
            <div class="mt-12 pt-8" style="border-top: 1px solid var(--border);">
              <p class="text-[11px] font-semibold uppercase tracking-[0.12em] mb-4" style="color: var(--text-subtle);">
                Utilisé par les équipes SAV de
              </p>
              <div class="flex flex-wrap items-center gap-x-7 gap-y-3">
                @for (logo of logos; track logo) {
                  <span class="text-[14px] font-semibold tracking-tight" style="color: var(--text-muted); opacity: 0.9;">
                    {{ logo }}
                  </span>
                }
              </div>
            </div>
          </div>

          <!-- ═══ Right: Dashboard mockup ═══ -->
          <div class="lg:col-span-6 relative" appFadeIn [fadeInDelay]="120">
            <div class="relative">

              <!-- Faint ambient glow -->
              <div class="absolute -inset-10 pointer-events-none" aria-hidden="true"
                   style="background: radial-gradient(ellipse 60% 50% at 60% 40%, rgba(79,70,229,0.08), transparent 70%); filter: blur(20px);"></div>

              <!-- Main window -->
              <div class="relative mock-window">

                <!-- Topbar -->
                <div class="mock-topbar">
                  <div class="flex gap-1.5">
                    <span class="mock-dot" style="background: #E4E4E7;"></span>
                    <span class="mock-dot" style="background: #E4E4E7;"></span>
                    <span class="mock-dot" style="background: #E4E4E7;"></span>
                  </div>
                  <div class="flex-1 ml-2 px-2.5 py-1 rounded-[6px] text-[11.5px] flex items-center gap-1.5 mono"
                       style="background: var(--surface); border: 1px solid var(--border); color: var(--text-muted);">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    app.sama-sav.com/dashboard
                  </div>
                </div>

                <div class="flex" style="min-height: 400px;">

                  <!-- Sidebar -->
                  <aside class="hidden sm:flex w-[172px] flex-col gap-0.5 p-3 border-r" style="background: var(--surface-2); border-color: var(--border);">
                    <p class="text-[10px] font-semibold uppercase tracking-[0.1em] px-2 pt-1 pb-2" style="color: var(--text-subtle);">
                      Menu
                    </p>
                    @for (item of sidebar; track item.label; let i = $index) {
                      <div class="flex items-center gap-2 px-2 py-1.5 rounded-[6px] text-[12.5px]"
                           [style]="item.active
                             ? 'background: var(--surface); color: var(--text); font-weight: 600; box-shadow: var(--shadow-xs);'
                             : 'color: var(--text-mid);'">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <path [attr.d]="item.icon"/>
                        </svg>
                        {{ item.label }}
                        @if (item.count) {
                          <span class="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded mono"
                                style="background: var(--surface-3); color: var(--text-mid);">
                            {{ item.count }}
                          </span>
                        }
                      </div>
                    }
                    <div class="mt-auto pt-3">
                      <p class="text-[10px] font-semibold uppercase tracking-[0.1em] px-2 pb-2" style="color: var(--text-subtle);">
                        Sites
                      </p>
                      @for (s of sites; track s) {
                        <div class="flex items-center gap-2 px-2 py-1.5 rounded-[6px] text-[12px]" style="color: var(--text-mid);">
                          <span class="w-1.5 h-1.5 rounded-full" [style.background]="s.dot"></span>
                          {{ s.name }}
                        </div>
                      }
                    </div>
                  </aside>

                  <!-- Main panel -->
                  <div class="flex-1 p-4 sm:p-5" style="background: var(--bg);">

                    <!-- Page header -->
                    <div class="flex items-start justify-between mb-4">
                      <div>
                        <p class="text-[11px] font-semibold uppercase tracking-[0.1em] mb-0.5" style="color: var(--text-subtle);">
                          Tableau de bord
                        </p>
                        <p class="text-[15px] font-semibold" style="color: var(--text);">Vue consolidée</p>
                      </div>
                      <span class="pill-success text-[11px]">
                        <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background: var(--success);"></span>
                        Temps réel
                      </span>
                    </div>

                    <!-- KPI row -->
                    <div class="grid grid-cols-2 gap-2 mb-4">
                      @for (kpi of kpis; track kpi.label) {
                        <div class="surface-flat p-3">
                          <p class="text-[10.5px] font-medium mb-1" style="color: var(--text-muted);">{{ kpi.label }}</p>
                          <div class="flex items-baseline gap-1.5">
                            <p class="text-[20px] font-semibold leading-none" style="color: var(--text); font-family: 'Inter Tight', sans-serif; letter-spacing: -0.03em;">
                              {{ kpi.value }}
                            </p>
                            <span class="text-[10.5px] font-semibold"
                                  [style.color]="kpi.up ? 'var(--success)' : 'var(--warning)'">
                              {{ kpi.change }}
                            </span>
                          </div>
                          <!-- sparkline -->
                          <svg class="mt-1.5 w-full" height="16" viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true">
                            <polyline fill="none" [attr.stroke]="kpi.up ? 'var(--success)' : 'var(--warning)'" stroke-width="1.4" [attr.points]="kpi.spark"/>
                          </svg>
                        </div>
                      }
                    </div>

                    <!-- Tickets list -->
                    <div class="flex items-center justify-between mb-2">
                      <p class="text-[11px] font-semibold uppercase tracking-[0.1em]" style="color: var(--text-subtle);">
                        Tickets récents
                      </p>
                      <span class="text-[11px] font-medium" style="color: var(--primary);">Voir tout →</span>
                    </div>
                    <div class="space-y-1">
                      @for (t of tickets; track t.id) {
                        <div class="flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] surface-flat">
                          <span class="mono text-[10.5px] font-semibold px-1.5 py-0.5 rounded"
                                style="background: var(--surface-2); color: var(--text-mid);">
                            {{ t.ref }}
                          </span>
                          <p class="flex-1 min-w-0 text-[12px] truncate" style="color: var(--text-sub);">
                            {{ t.title }}
                          </p>
                          <span class="status" [class]="t.statusClass">{{ t.status }}</span>
                        </div>
                      }
                    </div>

                  </div>
                </div>
              </div>

              <!-- Floating chip — notification -->
              <div class="hidden sm:flex absolute -top-5 -left-7 items-center gap-2.5 px-3 py-2 rounded-xl"
                   style="background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow-lg);"
                   aria-hidden="true">
                <div class="icon-tile icon-tile-success w-8 h-8">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <p class="text-[12px] font-semibold leading-tight" style="color: var(--text);">Client notifié</p>
                  <p class="text-[11px] leading-tight mt-0.5" style="color: var(--text-muted);">WhatsApp envoyé · auto</p>
                </div>
              </div>

              <!-- Floating chip — rating -->
              <div class="hidden sm:flex absolute -bottom-5 -right-4 items-center gap-2.5 px-3 py-2 rounded-xl"
                   style="background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow-lg);"
                   aria-hidden="true">
                <div class="icon-tile icon-tile-warning w-8 h-8">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <div>
                  <p class="text-[12px] font-semibold leading-tight" style="color: var(--text);">4.8 · satisfaction</p>
                  <p class="text-[11px] leading-tight mt-0.5" style="color: var(--text-muted);">+0.6 pt ce mois</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {
  trust = [
    'Multi-sites',
    'App mobile technicien',
    'Données isolées & sécurisées',
    'Déploiement en 48h',
  ];

  logos = ['ElectroSénégal', 'TechRepair', 'MaîtreElec', 'Seneco', 'Aramco Pro'];

  sidebar = [
    { label: 'Tableau de bord', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', active: true,  count: '' },
    { label: 'Tickets',         icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2', active: false, count: '24' },
    { label: 'Techniciens',     icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', active: false, count: '' },
    { label: 'Stock',           icon: 'M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16', active: false, count: '' },
    { label: 'Clients',         icon: 'M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75', active: false, count: '' },
  ];

  sites = [
    { name: 'Dakar — Plateau', dot: 'var(--success)' },
    { name: 'Thiès',           dot: 'var(--success)' },
    { name: 'Abidjan',         dot: 'var(--warning)' },
  ];

  kpis = [
    { label: 'Tickets ouverts', value: '24',   change: '+3',    up: true,  spark: '0,10 15,8 30,11 45,6 60,9 75,4 90,6 100,3' },
    { label: 'Délai moyen',     value: '2.1j', change: '-12%',  up: true,  spark: '0,4 15,7 30,5 45,9 60,7 75,10 90,8 100,12' },
    { label: 'Satisfaction',    value: '4.8',  change: '+0.6',  up: true,  spark: '0,12 15,10 30,11 45,8 60,7 75,5 90,4 100,3' },
    { label: 'Stock critique',  value: '6',    change: '2 SKU', up: false, spark: '0,3 15,5 30,4 45,7 60,9 75,8 90,11 100,10' },
  ];

  tickets = [
    { id: 1, ref: 'TKT-241', title: 'Réfrigérateur Samsung — bruit anormal',  status: 'Reçu',       statusClass: 'status-new' },
    { id: 2, ref: 'TKT-240', title: 'Lave-linge Bosch — fuite eau',           status: 'En cours',   statusClass: 'status-progress' },
    { id: 3, ref: 'TKT-239', title: 'Four Brandt — résistance HS',            status: 'Réparé',     statusClass: 'status-done' },
    { id: 4, ref: 'TKT-238', title: 'iPhone 13 — écran brisé',                status: 'Clôturé',    statusClass: 'status-closed' },
  ];
}
