import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'track/:token',
    loadComponent: () =>
      import('./pages/suivi-ticket/suivi-ticket.component').then(
        m => m.SuiviTicketComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
