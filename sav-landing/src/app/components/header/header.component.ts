import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header
      class="sticky top-0 z-50 transition-all duration-200"
      [class.is-scrolled]="isScrolled()"
      [style]="isScrolled()
        ? 'background: rgba(250,250,250,0.85); backdrop-filter: blur(14px) saturate(180%); -webkit-backdrop-filter: blur(14px) saturate(180%); border-bottom: 1px solid var(--border);'
        : 'background: transparent; border-bottom: 1px solid transparent;'"
    >
      <div class="wrap">
        <div class="flex items-center justify-between h-[62px] px-5 sm:px-6 lg:px-8">

          <!-- ── Logo ── -->
          <a href="#accueil" class="flex items-center gap-2 group" aria-label="Sama SAV — accueil">
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

          <!-- ── Desktop nav ── -->
          <nav class="hidden md:flex items-center gap-1" aria-label="Navigation principale">
            @for (link of navLinks; track link.label) {
              <a [href]="link.href"
                 class="px-3 py-1.5 text-[13.5px] font-medium rounded-md transition-colors"
                 style="color: var(--text-mid);"
                 onmouseover="this.style.color='var(--text)'; this.style.background='var(--surface-2)'"
                 onmouseout="this.style.color='var(--text-mid)'; this.style.background='transparent'">
                {{ link.label }}
              </a>
            }
          </nav>

          <!-- ── Desktop CTAs ── -->
          <div class="hidden md:flex items-center gap-1.5">
            <a [href]="appUrl" class="btn btn-link text-[13.5px]">Se connecter</a>
            <a href="#contact" class="btn btn-primary text-[13.5px] !min-h-[36px] !py-1.5">
              Demander une démo
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <!-- ── Mobile toggle ── -->
          <button
            class="md:hidden w-9 h-9 flex items-center justify-center rounded-md transition-colors"
            style="color: var(--text-sub); border: 1px solid var(--border); background: var(--surface);"
            (click)="toggleMobileMenu()"
            [attr.aria-expanded]="mobileMenuOpen()"
            aria-label="Ouvrir le menu"
          >
            @if (mobileMenuOpen()) {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            } @else {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="6"  x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            }
          </button>
        </div>

        <!-- ── Mobile panel ── -->
        @if (mobileMenuOpen()) {
          <div class="md:hidden px-5 pb-5 pt-2" style="border-top: 1px solid var(--border);">
            <nav class="flex flex-col gap-0.5 mb-4">
              @for (link of navLinks; track link.label) {
                <a [href]="link.href" (click)="closeMobileMenu()"
                   class="px-3 py-2.5 text-[14px] font-medium rounded-md transition-colors"
                   style="color: var(--text-sub);">
                  {{ link.label }}
                </a>
              }
            </nav>
            <div class="flex flex-col gap-2 pt-3" style="border-top: 1px solid var(--border);">
              <a [href]="appUrl" class="btn btn-ghost justify-center">Se connecter</a>
              <a href="#contact" (click)="closeMobileMenu()" class="btn btn-primary justify-center">
                Demander une démo
              </a>
            </div>
          </div>
        }
      </div>
    </header>
  `,
})
export class HeaderComponent {
  isScrolled = signal(false);
  mobileMenuOpen = signal(false);
  appUrl = environment.appUrl;

  navLinks = [
    { label: 'Produit',     href: '#produit' },
    { label: 'Workflow',    href: '#workflow' },
    { label: 'Cas d’usage', href: '#cas-usage' },
    { label: 'Résultats',   href: '#resultats' },
    { label: 'Contact',     href: '#contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void { this.isScrolled.set(window.scrollY > 8); }

  toggleMobileMenu(): void { this.mobileMenuOpen.update(v => !v); }
  closeMobileMenu(): void  { this.mobileMenuOpen.set(false); }
}
