import { Route } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    // Route publique — accessible sans authentification (scan QR Code)
    path: 'feedback',
    loadComponent: () =>
      import('./features/feedback/feedback.component').then((m) => m.FeedbackComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'tickets',
        loadComponent: () =>
          import('./features/tickets/tickets-list.component').then((m) => m.TicketsListComponent),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./features/clients/clients-list.component').then((m) => m.ClientsListComponent),
      },
      {
        path: 'reparations',
        loadComponent: () =>
          import('./features/reparations/reparations.component').then(
            (m) => m.ReparationsComponent
          ),
      },
      {
        path: 'stock',
        loadComponent: () =>
          import('./features/stock/stock.component').then((m) => m.StockComponent),
      },
      {
        path: 'reporting',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./features/reporting/reporting.component').then((m) => m.ReportingComponent),
      },
      {
        path: 'admin/users',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./features/admin/users/users-list.component').then((m) => m.UsersListComponent),
      },
      {
        path: 'admin/sites',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./features/admin/sites/sites-list.component').then((m) => m.SitesListComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
