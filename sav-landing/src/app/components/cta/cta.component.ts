import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section class="section-padding bg-white">
      <div class="container-max">
        <div appFadeIn
             class="relative overflow-hidden rounded-3xl gradient-primary p-12 sm:p-16 text-center shadow-2xl">

          <!-- Background decoration -->
          <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div class="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div class="relative z-10">
            <span class="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Démo gratuite disponible
            </span>

            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Prêt à améliorer votre SAV ?
            </h2>
            <p class="text-blue-100 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
              Rejoignez plus de 500 entreprises qui ont transformé leur service après-vente avec notre plateforme.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contact"
                 class="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base">
                Demander une démo gratuite
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
              <a href="http://localhost:4200"
                 class="inline-flex items-center justify-center gap-2 px-10 py-4 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200 text-base">
                Se connecter
              </a>
            </div>

            <p class="text-blue-200 text-sm mt-6">
              Aucune carte bancaire requise · Démo personnalisée · Mise en place en 24h
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class CtaComponent {}
