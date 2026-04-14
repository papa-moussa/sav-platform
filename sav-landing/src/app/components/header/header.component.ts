import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideX, lucideZap } from '@ng-icons/lucide';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  viewProviders: [provideIcons({ lucideMenu, lucideX, lucideZap })],
  template: `
    <header
      class="sticky top-0 z-50 transition-all duration-300"
      [class.bg-transparent]="!isScrolled()"
      [class.bg-gray-950\/90]="isScrolled()"
      [class.backdrop-blur-xl]="isScrolled()"
      [class.border-b]="isScrolled()"
      [style.border-color]="isScrolled() ? 'rgba(31,41,55,0.8)' : 'transparent'"
    >
      <div class="container-max px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <!-- Logo -->
          <a href="#accueil" class="flex items-center gap-2.5 group">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                 style="background: linear-gradient(135deg, #6366F1 0%, #22D3EE 100%);">
              <ng-icon name="lucideZap" size="16" class="text-white" />
            </div>
            <span class="font-bold text-white text-sm tracking-tight">SAV Platform</span>
          </a>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center gap-7">
            <a href="#fonctionnalites"
               class="text-sm font-medium transition-colors"
               style="color: var(--color-muted);"
               onmouseover="this.style.color='var(--color-text)'"
               onmouseout="this.style.color='var(--color-muted)'">
              Fonctionnalités
            </a>
            <a href="#comment-ca-marche"
               class="text-sm font-medium transition-colors"
               style="color: var(--color-muted);"
               onmouseover="this.style.color='var(--color-text)'"
               onmouseout="this.style.color='var(--color-muted)'">
              Workflow
            </a>
            <a href="#avantages"
               class="text-sm font-medium transition-colors"
               style="color: var(--color-muted);"
               onmouseover="this.style.color='var(--color-text)'"
               onmouseout="this.style.color='var(--color-muted)'">
              Résultats
            </a>
            <a href="#contact"
               class="text-sm font-medium transition-colors"
               style="color: var(--color-muted);"
               onmouseover="this.style.color='var(--color-text)'"
               onmouseout="this.style.color='var(--color-muted)'">
              Contact
            </a>
          </nav>

          <!-- Desktop CTA -->
          <div class="hidden md:flex items-center gap-3">
            <a href="http://localhost:4200" class="btn-ghost text-sm py-2 px-4">
              Se connecter
            </a>
            <a href="#contact" class="btn-primary text-sm py-2 px-4">
              Demander une démo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <!-- Mobile menu button -->
          <button
            class="md:hidden p-2 rounded-lg transition-colors"
            style="color: var(--color-muted);"
            (click)="toggleMobileMenu()"
            aria-label="Menu"
          >
            <ng-icon [name]="mobileMenuOpen() ? 'lucideX' : 'lucideMenu'" size="20" />
          </button>
        </div>

        <!-- Mobile menu -->
        @if (mobileMenuOpen()) {
          <div class="md:hidden py-4 border-t animate-fade-in" style="border-color: var(--color-border);">
            <nav class="flex flex-col gap-1">
              <a href="#fonctionnalites" (click)="closeMobileMenu()"
                 class="px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
                 style="color: var(--color-muted);">
                Fonctionnalités
              </a>
              <a href="#comment-ca-marche" (click)="closeMobileMenu()"
                 class="px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
                 style="color: var(--color-muted);">
                Workflow
              </a>
              <a href="#avantages" (click)="closeMobileMenu()"
                 class="px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
                 style="color: var(--color-muted);">
                Résultats
              </a>
              <a href="#contact" (click)="closeMobileMenu()"
                 class="px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
                 style="color: var(--color-muted);">
                Contact
              </a>
              <div class="pt-3 flex flex-col gap-2 mt-2" style="border-top: 1px solid var(--color-border);">
                <a href="http://localhost:4200" class="btn-ghost text-sm text-center justify-center">
                  Se connecter
                </a>
                <a href="#contact" (click)="closeMobileMenu()" class="btn-primary text-sm justify-center">
                  Demander une démo
                </a>
              </div>
            </nav>
          </div>
        }
      </div>
    </header>
  `,
})
export class HeaderComponent {
  isScrolled = signal(false);
  mobileMenuOpen = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
