import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideTicket, lucideUsers, lucideWrench, lucidePackage, lucideBarChart, lucideSettings, lucideLogOut, lucideMenu, lucideX, lucideChevronLeft, lucideChevronRight, lucideLayoutDashboard, lucideSearch, lucideBuilding } from '@ng-icons/lucide';
import { AppToastComponent } from '../../shared/ui/toast/app-toast.component';
import { AuthService } from '../../core/auth/auth.service';
import { Role } from '../../core/models/auth.model';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: Role[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent, AppToastComponent],
  providers: [provideIcons({ lucideTicket, lucideUsers, lucideWrench, lucidePackage, lucideBarChart, lucideSettings, lucideLogOut, lucideMenu, lucideX, lucideChevronLeft, lucideChevronRight, lucideLayoutDashboard, lucideSearch, lucideBuilding })],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  authService = inject(AuthService);

  sidebarOpen = signal(false);
  isCollapsed = signal(false);
  showProfileMenu = signal(false);

  /** Affiche le nom de la company ou "SAV" si SUPER_ADMIN */
  get companyLabel(): string {
    return this.authService.currentCompanyNom() ?? 'SAV Platform';
  }

  navGroups: NavGroup[] = [
    {
      title: 'Dashboard',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: 'lucideLayoutDashboard', roles: ['ADMIN', 'RECEPTIONNISTE', 'TECHNICIEN'] },
      ]
    },
    {
      title: 'Gestion',
      items: [
        { label: 'Tickets SAV', path: '/tickets', icon: 'lucideTicket', roles: ['ADMIN', 'RECEPTIONNISTE'] },
        { label: 'Clients', path: '/clients', icon: 'lucideUsers', roles: ['ADMIN', 'RECEPTIONNISTE'] },
      ]
    },
    {
      title: 'Interventions',
      items: [
        { label: 'Mes réparations', path: '/reparations', icon: 'lucideWrench', roles: ['ADMIN', 'TECHNICIEN'] },
        { label: 'Stock / Pièces', path: '/stock', icon: 'lucidePackage', roles: ['ADMIN', 'TECHNICIEN'] },
      ]
    },
    {
      title: 'Administration',
      items: [
        { label: 'Reporting', path: '/reporting', icon: 'lucideBarChart', roles: ['ADMIN'] },
        { label: 'Utilisateurs', path: '/admin/users', icon: 'lucideSettings', roles: ['ADMIN'] },
        { label: 'Gestion des sites', path: '/admin/sites', icon: 'lucideBuilding', roles: ['ADMIN'] },
      ]
    }
  ];

  visibleNavGroups = computed(() => {
    const role = this.authService.currentRole();
    if (!role) return [];
    
    return this.navGroups.map(group => ({
      ...group,
      items: group.items
        .filter(item => item.roles.includes(role))
        .map(item => {
          if (item.path === '/reparations' && role === 'ADMIN') {
            return { ...item, label: 'Toutes les réparations' };
          }
          return item;
        })
    })).filter(group => group.items.length > 0);
  });

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
  }

  logout(): void {
    this.authService.logout();
  }
}
