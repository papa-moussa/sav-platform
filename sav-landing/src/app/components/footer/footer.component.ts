import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer style="background: var(--surface); border-top: 1px solid var(--border);">

      <div class="wrap px-5 sm:px-6 lg:px-8 py-14">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8">

          <!-- Brand -->
          <div class="md:col-span-5">
            <a href="#accueil" class="inline-flex items-center gap-2 mb-5 group" aria-label="Sama SAV">
              <div class="w-7 h-7 rounded-md flex items-center justify-center"
                   style="background: var(--text); color: #fff;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </div>
              <span class="font-semibold text-[15px] tracking-tight" style="color: var(--text); letter-spacing: -0.01em;">
                Sama<span style="color: var(--text-muted);">SAV</span>
              </span>
            </a>
            <p class="text-[13.5px] leading-relaxed mb-6 max-w-[340px]" style="color: var(--text-muted);">
              La plateforme métier qui orchestre votre service après-vente.
            </p>

            <div class="flex items-center gap-2">
              @for (s of socials; track s.label) {
                <a [href]="s.href" [attr.aria-label]="s.label"
                   class="w-8 h-8 rounded-[6px] flex items-center justify-center transition-all duration-150"
                   style="background: var(--surface); border: 1px solid var(--border); color: var(--text-muted);"
                   onmouseover="this.style.borderColor='var(--border-strong)'; this.style.color='var(--text)'"
                   onmouseout="this.style.borderColor='var(--border)'; this.style.color='var(--text-muted)'">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path [attr.d]="s.iconPath"/>
                  </svg>
                </a>
              }
            </div>
          </div>

          <!-- Produit -->
          <div class="md:col-span-3 md:col-start-7">
            <h4 class="text-[11px] font-semibold uppercase tracking-[0.12em] mb-4" style="color: var(--text);">
              Produit
            </h4>
            <ul class="space-y-2.5">
              @for (link of productLinks; track link.label) {
                <li>
                  <a [href]="link.href" class="text-[13.5px] transition-colors"
                     style="color: var(--text-muted);"
                     onmouseover="this.style.color='var(--text)'"
                     onmouseout="this.style.color='var(--text-muted)'">{{ link.label }}</a>
                </li>
              }
            </ul>
          </div>

          <!-- Entreprise -->
          <div class="md:col-span-2">
            <h4 class="text-[11px] font-semibold uppercase tracking-[0.12em] mb-4" style="color: var(--text);">
              Entreprise
            </h4>
            <ul class="space-y-2.5">
              @for (link of companyLinks; track link.label) {
                <li>
                  <a [href]="link.href" class="text-[13.5px] transition-colors"
                     style="color: var(--text-muted);"
                     onmouseover="this.style.color='var(--text)'"
                     onmouseout="this.style.color='var(--text-muted)'">{{ link.label }}</a>
                </li>
              }
            </ul>
          </div>

        </div>
      </div>

      <div style="border-top: 1px solid var(--border);">
        <div class="wrap px-5 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p class="text-[12px]" style="color: var(--text-subtle);">
            © {{ currentYear }} Sama SAV. Tous droits réservés.
          </p>
          <div class="flex items-center gap-5">
            @for (l of legalLinks; track l.label) {
              <a [href]="l.href" class="text-[12px] transition-colors"
                 style="color: var(--text-subtle);"
                 onmouseover="this.style.color='var(--text-muted)'"
                 onmouseout="this.style.color='var(--text-subtle)'">{{ l.label }}</a>
            }
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  appUrl = environment.appUrl;

  socials = [
    {
      label: 'LinkedIn',
      href: '#',
      iconPath: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    },
    {
      label: 'Twitter / X',
      href: '#',
      iconPath: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z',
    },
  ];

  productLinks = [
    { label: 'Fonctionnalités', href: '#fonctionnalites' },
    { label: 'Workflow',        href: '#workflow' },
    { label: 'Cas d’usage',     href: '#cas-usage' },
    { label: 'Résultats',       href: '#resultats' },
    { label: 'Multi-sites',     href: '#produit' },
  ];

  companyLinks = [
    { label: 'Contact',       href: '#contact' },
    { label: 'Support',       href: '#contact' },
    { label: 'Documentation', href: '#' },
    { label: 'Se connecter',  href: this.appUrl },
  ];

  legalLinks = [
    { label: 'Confidentialité',  href: '#' },
    { label: 'CGU',              href: '#' },
    { label: 'Mentions légales', href: '#' },
  ];
}
