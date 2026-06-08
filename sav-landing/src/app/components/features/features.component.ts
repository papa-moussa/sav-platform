import { Component, signal } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="fonctionnalites" class="section" style="background: var(--surface);">
      <div class="wrap">

        <!-- Header -->
        <div class="max-w-[720px]" appFadeIn [fadeInDelay]="0">
          <span class="eyebrow">Fonctionnalités</span>
          <h2 class="text-[2rem] sm:text-[2.5rem] leading-[1.08] mb-4">
            Tout ce dont votre SAV a besoin,<br/>
            <span style="color: var(--text-muted);">rien de superflu.</span>
          </h2>
          <p class="text-[16.5px] leading-relaxed max-w-[580px]" style="color: var(--text-mid);">
            Chaque fonctionnalité est pensée pour réduire la friction et fiabiliser vos opérations.
          </p>
        </div>

        <!-- Primary feature showcase : Mobile technicien -->
        <div class="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">

          <!-- Mobile tech showcase -->
          <div class="lg:col-span-3 surface-flat overflow-hidden relative" appFadeIn [fadeInDelay]="0">
            <div class="p-8 sm:p-10">
              <span class="pill-primary w-fit mb-4">
                <span class="dot" style="background: var(--primary);"></span>
                Application mobile
              </span>
              <h3 class="text-[1.5rem] sm:text-[1.75rem] leading-[1.12] mb-3">
                Vos techniciens, pilotés depuis le terrain.
              </h3>
              <p class="text-[14.5px] leading-relaxed mb-6 max-w-[520px]" style="color: var(--text-mid);">
                Interventions du jour, diagnostic guidé, pièces utilisées, photo avant/après,
                signature client. Tout depuis un smartphone — même sans réseau.
              </p>
              <ul class="space-y-2.5">
                @for (f of mobileFeatures; track f) {
                  <li class="flex items-start gap-2.5 text-[13.5px]" style="color: var(--text-sub);">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {{ f }}
                  </li>
                }
              </ul>
            </div>

            <!-- Phone mockup (bottom) -->
            <div class="relative px-6 pb-6" aria-hidden="true">
              <div class="surface-flat p-3">
                <div class="flex items-center justify-between mb-2 px-1">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.1em]" style="color: var(--text-subtle);">Mes interventions — aujourd'hui</p>
                  <span class="mono text-[11px] font-semibold" style="color: var(--text-mid);">4 / 6</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  @for (intv of dayInterventions; track intv.ref) {
                    <div class="p-2.5 rounded-[8px]" style="background: var(--surface); border: 1px solid var(--border);">
                      <div class="flex items-center justify-between mb-1">
                        <span class="mono text-[10.5px] font-semibold px-1.5 py-0.5 rounded"
                              style="background: var(--surface-2); color: var(--text-mid);">{{ intv.ref }}</span>
                        <span class="status" [class]="intv.class">{{ intv.status }}</span>
                      </div>
                      <p class="text-[12px] font-semibold leading-tight mb-0.5" style="color: var(--text);">{{ intv.title }}</p>
                      <p class="text-[11px]" style="color: var(--text-muted);">{{ intv.time }} · {{ intv.site }}</p>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Side: stock management -->
          <div class="lg:col-span-2 surface-flat p-8 sm:p-10 flex flex-col" appFadeIn [fadeInDelay]="120">
            <span class="pill-success w-fit mb-4">
              <span class="dot" style="background: var(--success);"></span>
              Gestion de stock
            </span>
            <h3 class="text-[1.375rem] sm:text-[1.5rem] leading-[1.12] mb-3">
              Stock connecté aux interventions.
            </h3>
            <p class="text-[14px] leading-relaxed mb-5" style="color: var(--text-mid);">
              Mouvements tracés, seuils d'alerte, pièces liées automatiquement aux tickets.
              Plus de ruptures découvertes sur le terrain.
            </p>

            <!-- Stock visualization -->
            <div class="mt-auto space-y-2">
              @for (sku of stockSkus; track sku.ref) {
                <div class="flex items-center gap-3 px-3 py-2.5 rounded-[8px]"
                     style="background: var(--surface); border: 1px solid var(--border);">
                  <span class="mono text-[10.5px] font-semibold px-1.5 py-0.5 rounded"
                        style="background: var(--surface-2); color: var(--text-mid);">{{ sku.ref }}</span>
                  <p class="flex-1 text-[12.5px] font-medium truncate" style="color: var(--text-sub);">{{ sku.name }}</p>
                  <div class="flex items-center gap-2">
                    <div class="w-16 h-1 rounded-full overflow-hidden" style="background: var(--surface-3);">
                      <div class="h-full rounded-full" [style.width]="sku.fill + '%'" [style.background]="sku.color"></div>
                    </div>
                    <span class="mono text-[11px] font-semibold" [style.color]="sku.color">{{ sku.qty }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Feature grid -->
        <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (feat of features; track feat.title; let i = $index) {
            <div class="surface-card p-6" appFadeIn [fadeInDelay]="i * 60">
              <div class="icon-tile-lg mb-5" [class]="feat.iconClass">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path [attr.d]="feat.iconPath"/>
                </svg>
              </div>
              <h3 class="text-[15px] font-semibold mb-2 leading-snug">{{ feat.title }}</h3>
              <p class="text-[13.5px] leading-relaxed" style="color: var(--text-muted);">{{ feat.description }}</p>
            </div>
          }
        </div>

      </div>
    </section>
  `,
})
export class FeaturesComponent {
  mobileFeatures = [
    'Liste des interventions du jour, par priorité',
    'Diagnostic guidé avec notes et photos',
    'Temps passé tracé automatiquement',
    'Pièces consommées déduites du stock',
    'Signature client directement sur l\'écran',
  ];

  dayInterventions = [
    { ref: 'TKT-241', status: 'À faire', class: 'status-new',      title: 'Frigo Samsung', time: '09:30', site: 'Dakar' },
    { ref: 'TKT-240', status: 'En cours', class: 'status-progress', title: 'Lave-linge',   time: '11:00', site: 'Dakar' },
    { ref: 'TKT-239', status: 'Terminé', class: 'status-done',     title: 'Four Brandt',   time: '14:15', site: 'Dakar' },
  ];

  stockSkus = [
    { ref: 'SKU-14', name: 'Résistance four 2400W',  qty: '12', fill: 60, color: 'var(--success)' },
    { ref: 'SKU-28', name: 'Pompe vidange LG',        qty: '3',  fill: 18, color: 'var(--warning)' },
    { ref: 'SKU-07', name: 'Carte mère réfrigérateur', qty: '0',  fill: 5,  color: 'var(--danger)' },
  ];

  features = [
    {
      title: 'Tickets structurés',
      description: 'Réception, diagnostic, devis, réparation, clôture. Workflow guidé, SLA calculé, historique complet.',
      iconClass: 'icon-tile-primary',
      iconPath: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M9 12h6 M9 16h4',
    },
    {
      title: 'Devis validé en 1 clic',
      description: 'Envoi par QR code sécurisé. Le client approuve depuis son smartphone. Zéro appel, traçabilité complète.',
      iconClass: 'icon-tile-primary',
      iconPath: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 15l2 2 4-4',
    },
    {
      title: 'Notifications automatiques',
      description: 'WhatsApp et SMS à chaque étape clé. "Votre appareil est prêt" — sans qu\'aucun humain ne le tape.',
      iconClass: 'icon-tile-success',
      iconPath: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    },
    {
      title: 'CRM client intégré',
      description: 'Historique des appareils, interventions passées, préférences. Vos équipes ont tout le contexte en 1 clic.',
      iconClass: 'icon-tile-warning',
      iconPath: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    },
    {
      title: 'Feedback mesuré',
      description: 'QR code de satisfaction à la clôture. Note technicien, note entreprise. Identifiez les axes d\'amélioration.',
      iconClass: 'icon-tile-warning',
      iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87L8.91 8.26 12 2z',
    },
    {
      title: 'Rapports & exports',
      description: 'Volumes par site, délais moyens, taux de ré-ouverture, productivité technicien. Export PDF & CSV.',
      iconClass: 'icon-tile-orange',
      iconPath: 'M3 3v18h18 M7 14l4-4 4 4 5-5',
    },
  ];
}
