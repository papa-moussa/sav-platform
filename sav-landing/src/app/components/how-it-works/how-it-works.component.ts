import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucidePlusCircle,
  lucideUserCheck,
  lucideQrCode,
  lucideStar,
  lucideTrendingUp,
} from '@ng-icons/lucide';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [NgIconComponent, FadeInDirective],
  viewProviders: [provideIcons({ lucidePlusCircle, lucideUserCheck, lucideQrCode, lucideStar, lucideTrendingUp })],
  template: `
    <section id="comment-ca-marche" class="section-padding bg-white">
      <div class="container-max">

        <!-- Header -->
        <div appFadeIn class="text-center mb-16">
          <span class="inline-block text-primary-600 font-semibold text-sm tracking-widest uppercase mb-4">
            Processus
          </span>
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Comment ça marche ?
          </h2>
          <p class="text-lg text-slate-500 max-w-2xl mx-auto">
            Un flux de travail simple et efficace, de la création du ticket jusqu'à la clôture.
          </p>
        </div>

        <!-- Steps — desktop: horizontal, mobile: vertical -->
        <div class="relative">

          <!-- Horizontal connector line (desktop) -->
          <div class="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-200 z-0 mx-40"></div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
            @for (step of steps; track step.title; let i = $index) {
              <div appFadeIn [fadeInDelay]="i * 120" class="flex flex-col items-center text-center group">

                <!-- Step number + icon -->
                <div class="relative mb-6">
                  <div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                       [style.background]="step.bgColor">
                    <ng-icon [name]="step.icon" size="26" [style.color]="step.iconColor" />
                  </div>
                  <span class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-primary-200 text-primary-700 text-xs font-bold flex items-center justify-center shadow-sm">
                    {{ i + 1 }}
                  </span>
                </div>

                <h3 class="text-base font-semibold text-slate-900 mb-2">{{ step.title }}</h3>
                <p class="text-sm text-slate-500 leading-relaxed">{{ step.description }}</p>
              </div>
            }
          </div>
        </div>

      </div>
    </section>
  `,
})
export class HowItWorksComponent {
  steps = [
    {
      icon: 'lucidePlusCircle',
      title: 'Créez un ticket',
      description: 'Le réceptionniste enregistre la panne et les informations de l\'appareil.',
      bgColor: '#eff6ff',
      iconColor: '#2563eb',
    },
    {
      icon: 'lucideUserCheck',
      title: 'Intervention technicien',
      description: 'Un technicien est assigné, diagnostique et répare l\'appareil.',
      bgColor: '#f0fdf4',
      iconColor: '#16a34a',
    },
    {
      icon: 'lucideQrCode',
      title: 'Scan du QR code',
      description: 'À la remise, le client scanne le QR code généré sur le ticket.',
      bgColor: '#fdf4ff',
      iconColor: '#9333ea',
    },
    {
      icon: 'lucideStar',
      title: 'Client donne son avis',
      description: 'Le client note la prestation et laisse un commentaire instantanément.',
      bgColor: '#fff7ed',
      iconColor: '#ea580c',
    },
    {
      icon: 'lucideTrendingUp',
      title: 'Analyse des performances',
      description: 'Le manager consulte les KPIs et améliore continuellement le service.',
      bgColor: '#eef2ff',
      iconColor: '#4f46e5',
    },
  ];
}
