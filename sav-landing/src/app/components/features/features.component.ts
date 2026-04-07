import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideTicket,
  lucideWrench,
  lucideQrCode,
  lucideBarChart2,
  lucideBuilding2,
} from '@ng-icons/lucide';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [NgIconComponent, FadeInDirective],
  viewProviders: [provideIcons({ lucideTicket, lucideWrench, lucideQrCode, lucideBarChart2, lucideBuilding2 })],
  template: `
    <section id="fonctionnalites" class="section-padding bg-slate-50">
      <div class="container-max">

        <!-- Header -->
        <div appFadeIn class="text-center mb-16">
          <span class="inline-block text-primary-600 font-semibold text-sm tracking-widest uppercase mb-4">
            Fonctionnalités
          </span>
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p class="text-lg text-slate-500 max-w-2xl mx-auto">
            Une suite complète d'outils pour gérer votre service après-vente de A à Z.
          </p>
        </div>

        <!-- Feature cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (feature of features; track feature.title; let i = $index) {
            <div appFadeIn [fadeInDelay]="i * 100"
                 class="card-hover p-8 group">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                   [style.background]="feature.bgColor">
                <ng-icon [name]="feature.icon" size="24" [style.color]="feature.iconColor" />
              </div>
              <h3 class="text-lg font-semibold text-slate-900 mb-3">{{ feature.title }}</h3>
              <p class="text-slate-500 leading-relaxed">{{ feature.description }}</p>
            </div>
          }
        </div>

      </div>
    </section>
  `,
})
export class FeaturesComponent {
  features = [
    {
      icon: 'lucideTicket',
      title: 'Gestion des tickets SAV',
      description: 'Créez, assignez et suivez chaque ticket de réparation en temps réel. Historique complet et statuts clairs.',
      bgColor: '#eff6ff',
      iconColor: '#2563eb',
    },
    {
      icon: 'lucideWrench',
      title: 'Suivi des techniciens',
      description: 'Assignez les interventions à vos techniciens, suivez leur charge de travail et mesurez leurs performances.',
      bgColor: '#f0fdf4',
      iconColor: '#16a34a',
    },
    {
      icon: 'lucideQrCode',
      title: 'QR Code & Feedback client',
      description: 'Générez un QR code unique par ticket. Le client scanne et donne son avis directement depuis son smartphone.',
      bgColor: '#fdf4ff',
      iconColor: '#9333ea',
    },
    {
      icon: 'lucideBarChart2',
      title: 'Dashboard & Statistiques',
      description: 'Visualisez vos KPIs en temps réel : délai moyen, taux de satisfaction, volume de tickets, performance équipe.',
      bgColor: '#fff7ed',
      iconColor: '#ea580c',
    },
    {
      icon: 'lucideBuilding2',
      title: 'Multi-entreprise (SaaS)',
      description: 'Chaque entreprise dispose de son espace isolé. Gérez plusieurs sites et équipes depuis une interface centralisée.',
      bgColor: '#eef2ff',
      iconColor: '#4f46e5',
    },
    {
      icon: 'lucideTicket',
      title: 'Gestion du stock',
      description: 'Suivez vos pièces détachées, recevez des alertes de réapprovisionnement et optimisez votre inventaire.',
      bgColor: '#fff1f2',
      iconColor: '#e11d48',
    },
  ];
}
