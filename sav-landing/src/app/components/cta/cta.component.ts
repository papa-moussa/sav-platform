import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section class="section" style="background: var(--surface);">
      <div class="wrap">
        <div appFadeIn [fadeInDelay]="0"
             class="relative overflow-hidden rounded-[20px]"
             style="background: var(--text); border: 1px solid #18181B;">

          <!-- Subtle grid overlay -->
          <svg class="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <pattern id="ctaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ctaGrid)"/>
          </svg>

          <!-- Subtle radial glow -->
          <div class="absolute inset-0 pointer-events-none" aria-hidden="true"
               style="background: radial-gradient(ellipse 50% 60% at 70% 0%, rgba(79,70,229,0.22), transparent 70%);"></div>

          <div class="relative px-6 sm:px-12 lg:px-16 py-14 sm:py-20">
            <div class="max-w-[760px]">

              <!-- Eyebrow -->
              <div class="inline-flex items-center gap-2 mb-6 text-[11.5px] font-semibold uppercase tracking-[0.1em]"
                   style="color: rgba(255,255,255,0.7);">
                <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background: #34D399;"></span>
                Démo disponible · réponse en 24h
              </div>

              <!-- Headline -->
              <h2 class="text-[2rem] sm:text-[2.75rem] lg:text-[3rem] leading-[1.08] mb-5"
                  style="color: #fff; font-weight: 600;">
                Passez d'un SAV subi<br/>
                <span style="color: rgba(255,255,255,0.6);">à un SAV piloté.</span>
              </h2>

              <p class="text-[16px] sm:text-[17px] leading-[1.55] mb-9 max-w-[560px]"
                 style="color: rgba(255,255,255,0.7);">
                Rejoignez les entreprises qui ont repris le contrôle de leurs interventions, de leurs stocks et de leur relation client.
              </p>

              <!-- CTAs -->
              <div class="flex flex-col sm:flex-row gap-2.5 mb-8">
                <a href="#contact" class="btn btn-lg"
                   style="background: #fff; color: var(--text);"
                   onmouseover="this.style.background='#F4F4F5'"
                   onmouseout="this.style.background='#fff'">
                  Demander une démo
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
                <a [href]="appUrl" class="btn btn-lg"
                   style="background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.22);"
                   onmouseover="this.style.background='rgba(255,255,255,0.08)'"
                   onmouseout="this.style.background='transparent'">
                  Se connecter à l'app
                </a>
              </div>

              <!-- Reassurance strip -->
              <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]"
                   style="color: rgba(255,255,255,0.55);">
                @for (item of reassurances; track item) {
                  <span class="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {{ item }}
                  </span>
                }
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class CtaComponent {
  appUrl = environment.appUrl;

  reassurances = [
    'Déploiement en 48h',
    'Démo personnalisée',
    'Sans carte bancaire',
    'Support inclus 30 jours',
  ];
}
