import { Component } from '@angular/core';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section id="accueil" class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white min-h-screen flex items-center">

      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-3xl"></div>
        <!-- Grid pattern -->
        <svg class="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div class="container-max section-padding relative z-10 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <!-- Text content -->
          <div appFadeIn [fadeInDelay]="0">
            <div class="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 text-blue-200 text-sm font-medium mb-8">
              <span class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              Plateforme SaaS multi-entreprise
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Simplifiez la gestion de votre
              <span class="block mt-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Service Après-Vente
              </span>
            </h1>

            <p class="text-lg sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-xl">
              Gérez vos tickets, suivez vos interventions et mesurez la satisfaction client en toute simplicité.
            </p>

            <div class="flex flex-col sm:flex-row gap-4">
              <a href="#contact"
                 class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Demander une démo
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
              <a href="#fonctionnalites"
                 class="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200">
                Découvrir
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </a>
            </div>

            <!-- Social proof -->
            <div class="mt-12 flex items-center gap-6 border-t border-white/10 pt-8">
              <div class="text-center">
                <p class="text-2xl font-bold text-white">500+</p>
                <p class="text-xs text-slate-400">Entreprises</p>
              </div>
              <div class="w-px h-10 bg-white/20"></div>
              <div class="text-center">
                <p class="text-2xl font-bold text-white">98%</p>
                <p class="text-xs text-slate-400">Satisfaction</p>
              </div>
              <div class="w-px h-10 bg-white/20"></div>
              <div class="text-center">
                <p class="text-2xl font-bold text-white">10x</p>
                <p class="text-xs text-slate-400">Plus rapide</p>
              </div>
            </div>
          </div>

          <!-- Dashboard mockup -->
          <div appFadeIn [fadeInDelay]="200" class="hidden lg:block">
            <div class="relative">
              <!-- Card mockup -->
              <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl">
                <!-- Mock header -->
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-white font-semibold text-sm">Tableau de bord</p>
                      <p class="text-slate-400 text-xs">Aujourd'hui</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <div class="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                    <div class="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                    <div class="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                <!-- Stat cards -->
                <div class="grid grid-cols-2 gap-3 mb-5">
                  @for (stat of mockStats; track stat.label) {
                    <div class="bg-white/10 rounded-xl p-4">
                      <p class="text-slate-300 text-xs mb-1">{{ stat.label }}</p>
                      <p class="text-white font-bold text-xl">{{ stat.value }}</p>
                      <p class="text-green-400 text-xs mt-1">{{ stat.change }}</p>
                    </div>
                  }
                </div>

                <!-- Ticket list mockup -->
                <div class="space-y-2">
                  <p class="text-slate-300 text-xs font-medium mb-3">Tickets récents</p>
                  @for (ticket of mockTickets; track ticket.id) {
                    <div class="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
                      <div class="w-2 h-2 rounded-full flex-shrink-0" [class]="ticket.dotColor"></div>
                      <div class="flex-1 min-w-0">
                        <p class="text-white text-xs font-medium truncate">{{ ticket.title }}</p>
                        <p class="text-slate-400 text-xs">{{ ticket.client }}</p>
                      </div>
                      <span class="text-xs px-2 py-0.5 rounded-full font-medium" [class]="ticket.badgeColor">
                        {{ ticket.status }}
                      </span>
                    </div>
                  }
                </div>
              </div>

              <!-- Floating badge -->
              <div class="absolute -bottom-4 -right-4 bg-green-500 text-white rounded-xl px-4 py-2 shadow-lg flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-xs font-semibold">Ticket clôturé</span>
              </div>

              <!-- Floating notification -->
              <div class="absolute -top-4 -left-4 bg-white text-slate-800 rounded-xl px-4 py-2 shadow-lg flex items-center gap-2">
                <span class="text-lg">⭐</span>
                <div>
                  <p class="text-xs font-semibold">Nouveau feedback</p>
                  <p class="text-xs text-slate-500">Note : 5/5</p>
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
  mockStats = [
    { label: 'Tickets ouverts', value: '24', change: '+3 aujourd\'hui' },
    { label: 'En cours', value: '8', change: '2 urgents' },
    { label: 'Résolus', value: '142', change: '+12 cette semaine' },
    { label: 'Satisfaction', value: '4.8', change: '↑ 0.2 pts' },
  ];

  mockTickets = [
    { id: 1, title: 'Écran cassé — Samsung S22', client: 'Pierre D.', status: 'En cours', dotColor: 'bg-blue-400', badgeColor: 'bg-blue-500/20 text-blue-300' },
    { id: 2, title: 'Batterie défectueuse — iPhone 14', client: 'Marie L.', status: 'Réparé', dotColor: 'bg-green-400', badgeColor: 'bg-green-500/20 text-green-300' },
    { id: 3, title: 'Clavier HS — MacBook Pro', client: 'Jean M.', status: 'Diagnostic', dotColor: 'bg-yellow-400', badgeColor: 'bg-yellow-500/20 text-yellow-300' },
  ];
}
