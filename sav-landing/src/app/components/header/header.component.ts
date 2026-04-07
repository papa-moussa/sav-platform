import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  viewProviders: [provideIcons({ lucideMenu, lucideX })],
  template: `
    <header
      class="sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-all duration-300"
      [class.shadow-md]="isScrolled()"
      [class.border-b]="!isScrolled()"
      [class.border-slate-100]="!isScrolled()"
    >
      <div class="container-max px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <!-- Logo -->
          <a href="#accueil" class="flex items-center gap-2">
            <img src="assets/sav.png" alt="SAV Platform" class="h-8 w-auto" />
          </a>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center gap-8">
            <a href="#accueil"
               class="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
              Accueil
            </a>
            <a href="#fonctionnalites"
               class="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
              Fonctionnalités
            </a>
            <a href="#comment-ca-marche"
               class="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
              Comment ça marche
            </a>
            <a href="#contact"
               class="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
              Contact
            </a>
          </nav>

          <!-- Desktop CTA -->
          <div class="hidden md:flex items-center gap-3">
            <a href="http://localhost:4200"
               class="text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50">
              Se connecter
            </a>
            <a href="#contact"
               class="text-sm font-semibold text-white px-5 py-2.5 rounded-xl gradient-primary shadow-sm hover:opacity-90 transition-all duration-200 hover:shadow-md">
              Demander une démo
            </a>
          </div>

          <!-- Mobile menu button -->
          <button
            class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            (click)="toggleMobileMenu()"
            aria-label="Menu"
          >
            <ng-icon [name]="mobileMenuOpen() ? 'lucideX' : 'lucideMenu'" size="20" />
          </button>
        </div>

        <!-- Mobile menu -->
        @if (mobileMenuOpen()) {
          <div class="md:hidden border-t border-slate-100 py-4 animate-fade-in">
            <nav class="flex flex-col gap-2">
              <a href="#accueil" (click)="closeMobileMenu()"
                 class="px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-colors">
                Accueil
              </a>
              <a href="#fonctionnalites" (click)="closeMobileMenu()"
                 class="px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-colors">
                Fonctionnalités
              </a>
              <a href="#comment-ca-marche" (click)="closeMobileMenu()"
                 class="px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-colors">
                Comment ça marche
              </a>
              <a href="#contact" (click)="closeMobileMenu()"
                 class="px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-colors">
                Contact
              </a>
              <div class="pt-3 flex flex-col gap-2 border-t border-slate-100 mt-2">
                <a href="http://localhost:4200"
                   class="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg text-center border border-slate-200 transition-colors">
                  Se connecter
                </a>
                <a href="#contact" (click)="closeMobileMenu()"
                   class="px-3 py-2 text-sm font-semibold text-white rounded-xl gradient-primary text-center hover:opacity-90 transition-opacity">
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
    this.isScrolled.set(window.scrollY > 10);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
