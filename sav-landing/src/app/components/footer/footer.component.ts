import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideTwitter,
  lucideLinkedin,
  lucideZap,
} from '@ng-icons/lucide';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ lucideTwitter, lucideLinkedin, lucideZap })],
  template: `
    <footer style="background: var(--color-surface); border-top: 1px solid var(--color-border);">

      <div class="container-max px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10">

          <!-- Brand -->
          <div class="md:col-span-2">
            <a href="#accueil" class="flex items-center gap-2.5 mb-5 w-fit">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                   style="background: linear-gradient(135deg, #6366F1 0%, #22D3EE 100%);">
                <ng-icon name="lucideZap" size="16" class="text-white" />
              </div>
              <span class="font-bold text-white">SAV Platform</span>
            </a>
            <p class="text-sm leading-relaxed mb-6 max-w-xs" style="color: var(--color-muted);">
              La plateforme SaaS qui transforme votre Service Après-Vente en avantage concurrentiel.
              Tickets, techniciens, stocks, feedback — tout en un.
            </p>
            <div class="flex items-center gap-3">
              @for (social of socials; track social.label) {
                <a [href]="social.href"
                   class="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                   style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);"
                   [attr.aria-label]="social.label">
                  <ng-icon [name]="social.icon" size="16" style="color: var(--color-muted);" />
                </a>
              }
            </div>
          </div>

          <!-- Fonctionnalités -->
          <div>
            <h4 class="text-sm font-semibold mb-5 uppercase tracking-widest" style="color: var(--color-text);">
              Fonctionnalités
            </h4>
            <ul class="space-y-3">
              @for (link of featureLinks; track link.label) {
                <li>
                  <a [href]="link.href"
                     class="text-sm transition-colors"
                     style="color: var(--color-muted);"
                     onmouseover="this.style.color='var(--color-text)'"
                     onmouseout="this.style.color='var(--color-muted)'">
                    {{ link.label }}
                  </a>
                </li>
              }
            </ul>
          </div>

          <!-- Entreprise -->
          <div>
            <h4 class="text-sm font-semibold mb-5 uppercase tracking-widest" style="color: var(--color-text);">
              Entreprise
            </h4>
            <ul class="space-y-3">
              @for (link of companyLinks; track link.label) {
                <li>
                  <a [href]="link.href"
                     class="text-sm transition-colors"
                     style="color: var(--color-muted);"
                     onmouseover="this.style.color='var(--color-text)'"
                     onmouseout="this.style.color='var(--color-muted)'">
                    {{ link.label }}
                  </a>
                </li>
              }
            </ul>
          </div>

        </div>
      </div>

      <!-- Bottom bar -->
      <div style="border-top: 1px solid var(--color-border);">
        <div class="container-max px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm" style="color: var(--color-muted);">
            © {{ currentYear }} SAV Platform. Tous droits réservés.
          </p>
          <div class="flex items-center gap-6">
            <a href="#" class="text-xs transition-colors" style="color: var(--color-muted);"
               onmouseover="this.style.color='var(--color-text)'"
               onmouseout="this.style.color='var(--color-muted)'">
              Confidentialité
            </a>
            <a href="#" class="text-xs transition-colors" style="color: var(--color-muted);"
               onmouseover="this.style.color='var(--color-text)'"
               onmouseout="this.style.color='var(--color-muted)'">
              CGU
            </a>
            <a href="#" class="text-xs transition-colors" style="color: var(--color-muted);"
               onmouseover="this.style.color='var(--color-text)'"
               onmouseout="this.style.color='var(--color-muted)'">
              Mentions légales
            </a>
          </div>
        </div>
      </div>

    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  socials = [
    { icon: 'lucideLinkedin', label: 'LinkedIn', href: '#' },
    { icon: 'lucideTwitter', label: 'Twitter / X', href: '#' },
  ];

  featureLinks = [
    { label: 'Gestion des tickets', href: '#fonctionnalites' },
    { label: 'Suivi techniciens', href: '#fonctionnalites' },
    { label: 'Notifications WhatsApp', href: '#fonctionnalites' },
    { label: 'Stock & pièces', href: '#fonctionnalites' },
    { label: 'Feedback client', href: '#fonctionnalites' },
  ];

  companyLinks = [
    { label: 'À propos', href: '#' },
    { label: 'Contact', href: '#contact' },
    { label: 'Support', href: '#contact' },
    { label: 'Documentation', href: '#' },
    { label: 'Se connecter', href: 'http://localhost:4200' },
  ];
}
