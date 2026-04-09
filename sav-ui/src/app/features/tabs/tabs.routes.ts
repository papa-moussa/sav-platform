import { Route } from '@angular/router';
import { TabsPage } from './tabs.page';

export const tabsRoutes: Route[] = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'tickets',
        loadComponent: () =>
          import('../tickets/ticket-list/ticket-list.page').then(
            (m) => m.TicketListPage
          ),
      },
      {
        path: 'tickets/:id',
        loadComponent: () =>
          import('../tickets/ticket-detail/ticket-detail.page').then(
            (m) => m.TicketDetailPage
          ),
      },
      {
        path: 'stock',
        loadComponent: () =>
          import('../stock/stock-list/stock-list.page').then(
            (m) => m.StockListPage
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../profile/profile.page').then((m) => m.ProfilePage),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];
