import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideBuilding2,
  lucideLayoutDashboard,
  lucideLogOut,
  lucideChevronLeft,
  lucideChevronRight,
  lucideMenu,
  lucideX,
  lucideShield,
  lucideUsers,
  lucideBell
} from '@ng-icons/lucide';
import { AuthService } from '../../core/auth/auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  exact?: boolean;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NgIconComponent],
  viewProviders: [provideIcons({
    lucideBuilding2,
    lucideLayoutDashboard,
    lucideLogOut,
    lucideChevronLeft,
    lucideChevronRight,
    lucideMenu,
    lucideX,
    lucideShield,
    lucideUsers,
    lucideBell
  })],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {
  readonly authService = inject(AuthService);

  readonly isCollapsed = signal(false);
  readonly mobileOpen = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'Tableau de bord', path: '/dashboard', icon: 'lucideLayoutDashboard', exact: true },
    { label: 'Entreprises', path: '/companies', icon: 'lucideBuilding2' },
    { label: 'Utilisateurs', path: '/users', icon: 'lucideUsers' },
    { label: 'Notifications', path: '/notifications', icon: 'lucideBell' }
  ];

  toggleCollapse(): void {
    this.isCollapsed.update(v => !v);
  }

  toggleMobile(): void {
    this.mobileOpen.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
  }
}
