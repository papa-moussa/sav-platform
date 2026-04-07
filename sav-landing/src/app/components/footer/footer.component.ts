import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideTwitter,
  lucideLinkedin,
  lucideGithub,
  lucideMail,
} from '@ng-icons/lucide';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ lucideTwitter, lucideLinkedin, lucideGithub, lucideMail })],
  template: `
    <footer class="bg-slate-900 text-slate-300">

      <!-- Main footer -->
      <div class="container-max section-padding pb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          <!-- Brand -->
          <div class="lg:col-span-2">
            <a href="#accueil" class="flex items-center gap-2 mb-4">
              <img src="assets/sav.png" alt="SAV Platform" class="h-8 w-auto brightness-0 invert" />
            </a>
            <p class="text-slate-400 leading-relaxed mb-6 max-w-sm">
              La plateforme SaaS qui simplifie la gestion de votre service après-vente. Tickets, techniciens, feedback client — tout en un.
            </p>
            <div class="flex items-center gap-3">
              @for (social of socials; track social.label) {
                <a [href]="social.href"
                   class="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                   [attr.aria-label]="social.label">
                  <ng-icon [name]="social.icon" size="16" />
                </a>
              }
            </div>
          </div>

          <!-- Links: Produit -->
          <div>
            <h4 class="text-white font-semibold mb-4">Produit</h4>
            <ul class="space-y-3">
              @for (link of productLinks; track link.label) {
                <li>
                  <a [href]="link.href"
                     class="text-slate-400 hover:text-white transition-colors text-sm">
                    {{ link.label }}
                  </a>
                </li>
              }
            </ul>
          </div>

          <!-- Links: Entreprise -->
          <div>
            <h4 class="text-white font-semibold mb-4">Entreprise</h4>
            <ul class="space-y-3">
              @for (link of companyLinks; track link.label) {
                <li>
                  <a [href]="link.href"
                     class="text-slate-400 hover:text-white transition-colors text-sm">
                    {{ link.label }}
                  </a>
                </li>
              }
            </ul>
          </div>

        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-slate-800">
        <div class="container-max px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-slate-500 text-sm">
            © {{ currentYear }} SAV Platform. Tous droits réservés.
          </p>
          <div class="flex items-center gap-6">
            <a href="#" class="text-slate-500 hover:text-slate-300 text-sm transition-colors">Politique de confidentialité</a>
            <a href="#" class="text-slate-500 hover:text-slate-300 text-sm transition-colors">CGU</a>
            <a href="#" class="text-slate-500 hover:text-slate-300 text-sm transition-colors">Mentions légales</a>
          </div>
        </div>
      </div>

    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  socials = [
    { icon: 'lucideTwitter', label: 'Twitter', href: '#' },
    { icon: 'lucideLinkedin', label: 'LinkedIn', href: '#' },
    { icon: 'lucideGithub', label: 'GitHub', href: '#' },
    { icon: 'lucideMail', label: 'Email', href: 'mailto:contact@sav-platform.fr' },
  ];

  productLinks = [
    { label: 'Fonctionnalités', href: '#fonctionnalites' },
    { label: 'Comment ça marche', href: '#comment-ca-marche' },
    { label: 'Tarifs', href: '#' },
    { label: 'Changelog', href: '#' },
    { label: 'Se connecter', href: 'http://localhost:4200' },
  ];

  companyLinks = [
    { label: 'À propos', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Partenaires', href: '#' },
    { label: 'Contact', href: '#contact' },
    { label: 'Support', href: '#contact' },
  ];
}
