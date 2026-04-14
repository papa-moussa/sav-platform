import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section class="section-padding" style="background: var(--color-surface);">
      <div class="container-max">
        <div appFadeIn [fadeInDelay]="0"
             class="relative overflow-hidden rounded-3xl p-12 sm:p-16 text-center"
             style="background: linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #22D3EE 100%);">

          <!-- Background decorations -->
          <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div class="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20"
                 style="background: white;"></div>
            <div class="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-15"
                 style="background: white;"></div>
            <!-- Grid overlay -->
            <svg class="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="ctaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ctaGrid)" />
            </svg>
          </div>

          <div class="relative z-10 max-w-2xl mx-auto">
            <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
                  style="background: rgba(255,255,255,0.2); color: white;">
              <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Démo gratuite — Réponse en 24h
            </span>

            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
              Prêt à moderniser<br/>votre SAV ?
            </h2>
            <p class="text-lg mb-10" style="color: rgba(255,255,255,0.8);">
              Rejoignez les entreprises qui ont choisi de passer<br/>
              d'un SAV subi à un SAV maîtrisé.
            </p>

            <!-- Inline CTA -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="#contact"
                 class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-1"
                 style="background: white; color: #4F46E5; box-shadow: 0 8px 24px rgba(0,0,0,0.2);">
                Demander une démo gratuite
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="http://localhost:4200"
                 class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200"
                 style="background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.3);">
                Se connecter
              </a>
            </div>

            <!-- Reassurance -->
            <div class="flex flex-wrap items-center justify-center gap-6 text-sm" style="color: rgba(255,255,255,0.75);">
              <span class="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Réponse en moins de 24h
              </span>
              <span class="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Démo personnalisée
              </span>
              <span class="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                Aucune carte bancaire
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class CtaComponent {}
