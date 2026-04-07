import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideClock,
  lucideSmile,
  lucideActivity,
  lucideDatabase,
} from '@ng-icons/lucide';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-advantages',
  standalone: true,
  imports: [NgIconComponent, FadeInDirective],
  viewProviders: [provideIcons({ lucideClock, lucideSmile, lucideActivity, lucideDatabase })],
  template: `
    <section class="section-padding bg-slate-50">
      <div class="container-max">

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <!-- Left: visual -->
          <div appFadeIn class="relative order-2 lg:order-1">
            <div class="gradient-primary rounded-3xl p-8 text-white shadow-2xl">
              <p class="font-semibold text-lg mb-8 text-blue-100">Vos indicateurs en temps réel</p>
              <div class="space-y-5">
                @for (metric of metrics; track metric.label) {
                  <div>
                    <div class="flex justify-between mb-2">
                      <span class="text-sm text-blue-100">{{ metric.label }}</span>
                      <span class="text-sm font-semibold text-white">{{ metric.value }}</span>
                    </div>
                    <div class="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div class="h-full bg-white rounded-full transition-all duration-1000"
                           [style.width]="metric.percent"></div>
                    </div>
                  </div>
                }
              </div>

              <div class="mt-8 pt-6 border-t border-white/20 flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white font-semibold text-sm">Performance globale</p>
                  <p class="text-blue-200 text-xs">↑ 34% ce trimestre</p>
                </div>
              </div>
            </div>

            <!-- Decorative blob -->
            <div class="absolute -z-10 -bottom-8 -right-8 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
          </div>

          <!-- Right: advantages list -->
          <div class="order-1 lg:order-2">
            <div appFadeIn>
              <span class="inline-block text-primary-600 font-semibold text-sm tracking-widest uppercase mb-4">
                Avantages
              </span>
              <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Pourquoi choisir SAV Platform ?
              </h2>
              <p class="text-lg text-slate-500 mb-10">
                Conçu par des experts du SAV pour résoudre les vrais problèmes terrain.
              </p>
            </div>

            <div class="space-y-6">
              @for (adv of advantages; track adv.title; let i = $index) {
                <div appFadeIn [fadeInDelay]="i * 100" class="flex gap-5 group">
                  <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                       [style.background]="adv.bgColor">
                    <ng-icon [name]="adv.icon" size="22" [style.color]="adv.iconColor" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-slate-900 mb-1">{{ adv.title }}</h3>
                    <p class="text-slate-500 text-sm leading-relaxed">{{ adv.description }}</p>
                  </div>
                </div>
              }
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
})
export class AdvantagesComponent {
  metrics = [
    { label: 'Taux de satisfaction client', value: '98%', percent: '98%' },
    { label: 'Tickets résolus dans les délais', value: '94%', percent: '94%' },
    { label: 'Réduction du temps de traitement', value: '67%', percent: '67%' },
    { label: 'Adoption par les équipes', value: '89%', percent: '89%' },
  ];

  advantages = [
    {
      icon: 'lucideClock',
      title: 'Gain de temps',
      description: 'Réduisez de 60% le temps de traitement des tickets grâce à l\'automatisation et aux workflows intelligents.',
      bgColor: '#eff6ff',
      iconColor: '#2563eb',
    },
    {
      icon: 'lucideSmile',
      title: 'Meilleure satisfaction client',
      description: 'Le système de feedback QR code permet de collecter les avis à chaud et d\'améliorer continuellement votre service.',
      bgColor: '#f0fdf4',
      iconColor: '#16a34a',
    },
    {
      icon: 'lucideActivity',
      title: 'Suivi en temps réel',
      description: 'Visualisez l\'avancement de chaque ticket, la disponibilité des techniciens et les métriques clés en direct.',
      bgColor: '#fff7ed',
      iconColor: '#ea580c',
    },
    {
      icon: 'lucideDatabase',
      title: 'Centralisation des données',
      description: 'Toutes vos données SAV centralisées en un seul endroit, accessibles par toute votre équipe, depuis partout.',
      bgColor: '#eef2ff',
      iconColor: '#4f46e5',
    },
  ];
}
