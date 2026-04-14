import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="accueil" class="relative overflow-hidden min-h-screen flex items-center gradient-hero-bg grid-bg">

      <!-- Background blobs -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
             style="background: radial-gradient(circle, #6366F1 0%, transparent 70%)"></div>
        <div class="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-10"
             style="background: radial-gradient(circle, #22D3EE 0%, transparent 70%)"></div>
      </div>

      <div class="container-max section-padding relative z-10 w-full pt-32 pb-24">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">

          <!-- Left — Copy (3/5) -->
          <div class="lg:col-span-3" appFadeIn [fadeInDelay]="0">

            <!-- Badge -->
            <div class="badge-hero mb-8 w-fit">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              Plateforme SAV nouvelle génération
            </div>

            <!-- H1 -->
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6"
                style="color: var(--color-text);">
              Transformez votre SAV<br/>
              en <span class="gradient-text">avantage concurrentiel.</span>
            </h1>

            <!-- Subtitle -->
            <p class="text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl"
               style="color: var(--color-muted);">
              Centralisez vos tickets, pilotez vos techniciens et notifiez vos clients
              en temps réel. Moins de chaos. Plus de satisfaction.
            </p>

            <!-- CTAs -->
            <div class="flex flex-col sm:flex-row items-start gap-4 mb-10">
              <a href="#contact" class="btn-cta-hero">
                Demander une démo gratuite
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="#comment-ca-marche" class="btn-ghost">
                Voir comment ça marche
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 9l-7 7-7-7"/>
                </svg>
              </a>
            </div>

            <!-- Social proof -->
            <div class="flex flex-wrap items-center gap-6 text-sm" style="color: var(--color-muted);">
              <span class="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Déploiement en 48h
              </span>
              <span class="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Sans engagement
              </span>
              <span class="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Support inclus
              </span>
            </div>
          </div>

          <!-- Right — Dashboard mockup (2/5) -->
          <div class="lg:col-span-2 hidden lg:block" appFadeIn [fadeInDelay]="150">
            <div class="relative">

              <!-- Main card -->
              <div class="card-glass p-5 shadow-2xl" style="box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05);">
                <!-- Window bar -->
                <div class="flex items-center justify-between mb-5">
                  <div class="flex items-center gap-2">
                    <div class="flex gap-1.5">
                      <div class="w-2.5 h-2.5 rounded-full" style="background:#EF4444"></div>
                      <div class="w-2.5 h-2.5 rounded-full" style="background:#F59E0B"></div>
                      <div class="w-2.5 h-2.5 rounded-full" style="background:#10B981"></div>
                    </div>
                  </div>
                  <div class="text-xs font-mono px-2 py-0.5 rounded" style="background: rgba(255,255,255,0.05); color: var(--color-muted);">
                    Tickets — Aujourd'hui
                  </div>
                </div>

                <!-- KPI row -->
                <div class="grid grid-cols-2 gap-3 mb-4">
                  @for (kpi of kpis; track kpi.label) {
                    <div class="rounded-xl p-3" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);">
                      <p class="text-xs mb-1" style="color: var(--color-muted);">{{ kpi.label }}</p>
                      <p class="text-lg font-bold" style="color: var(--color-text);">{{ kpi.value }}</p>
                      <p class="text-xs mt-0.5" [style.color]="kpi.up ? '#10B981' : '#F59E0B'">{{ kpi.change }}</p>
                    </div>
                  }
                </div>

                <!-- Ticket list -->
                <p class="text-xs font-medium mb-3" style="color: var(--color-muted);">Tickets actifs</p>
                <div class="space-y-2">
                  @for (ticket of tickets; track ticket.id) {
                    <div class="flex items-center gap-3 rounded-lg px-3 py-2.5"
                         style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.04);">
                      <div class="w-1.5 h-1.5 rounded-full flex-shrink-0" [style.background]="ticket.dot"></div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-medium truncate" style="color: var(--color-text);">{{ ticket.title }}</p>
                        <p class="text-xs" style="color: var(--color-muted);">{{ ticket.ref }}</p>
                      </div>
                      <span class="badge-status" [class]="ticket.badgeClass">{{ ticket.status }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Floating — WhatsApp notification -->
              <div class="absolute -top-5 -left-6 rounded-xl px-3.5 py-2.5 shadow-xl flex items-center gap-2.5"
                   style="background: var(--color-surface); border: 1px solid rgba(255,255,255,0.08);">
                <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                     style="background: rgba(37,211,102,0.15);">
                  <span class="text-sm">💬</span>
                </div>
                <div>
                  <p class="text-xs font-semibold" style="color: var(--color-text);">WhatsApp envoyé</p>
                  <p class="text-xs" style="color: var(--color-muted);">Client notifié automatiquement</p>
                </div>
              </div>

              <!-- Floating — Feedback badge -->
              <div class="absolute -bottom-5 -right-5 rounded-xl px-3.5 py-2.5 shadow-xl flex items-center gap-2.5"
                   style="background: var(--color-surface); border: 1px solid rgba(255,255,255,0.08);">
                <span class="text-base">⭐</span>
                <div>
                  <p class="text-xs font-semibold" style="color: var(--color-text);">Feedback reçu</p>
                  <p class="text-xs" style="color: #10B981;">5 / 5 — Excellent</p>
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
  kpis = [
    { label: 'Tickets ouverts', value: '24', change: '+3 aujourd\'hui', up: true },
    { label: 'En cours', value: '8', change: '2 urgents', up: false },
    { label: 'Clôturés', value: '142', change: '+12 cette semaine', up: true },
    { label: 'Satisfaction', value: '4.8★', change: '↑ 0.2 pts', up: true },
  ];

  tickets = [
    { id: 1, title: 'Réfrigérateur Samsung — bruit anormal', ref: 'TKT-2026-00241', status: 'REÇU', dot: '#22D3EE', badgeClass: 'badge-recu' },
    { id: 2, title: 'Lave-linge Bosch — fuite eau', ref: 'TKT-2026-00238', status: 'DIAGNOSTIC', dot: '#F59E0B', badgeClass: 'badge-diagnostic' },
    { id: 3, title: 'Four Brandt — résistance HS', ref: 'TKT-2026-00235', status: 'RÉPARÉ', dot: '#10B981', badgeClass: 'badge-repare' },
  ];
}
