import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideBuilding2,
  lucideUsers,
  lucideTicket,
  lucideStar,
  lucideCircleCheck,
  lucideCirclePause,
  lucideActivity,
  lucideRefreshCw,
  lucideCircleAlert,
  lucideMessageSquare
} from '@ng-icons/lucide';
import { AdminStatsService } from '../../core/services/admin-stats.service';
import { AdminStats, ActivityItem } from '../../core/models/admin-stats.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent],
  viewProviders: [provideIcons({
    lucideBuilding2, lucideUsers, lucideTicket, lucideStar,
    lucideCircleCheck, lucideCirclePause, lucideActivity,
    lucideRefreshCw, lucideCircleAlert, lucideMessageSquare
  })],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private readonly statsService = inject(AdminStatsService);

  readonly stats = signal<AdminStats | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading.set(true);
    this.error.set(null);
    this.statsService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les statistiques.');
        this.loading.set(false);
      }
    });
  }

  activityIcon(type: ActivityItem['type']): string {
    switch (type) {
      case 'COMPANY_CREATED': return 'lucideBuilding2';
      case 'USER_CREATED': return 'lucideUsers';
      case 'TICKET_CREATED': return 'lucideTicket';
      case 'FEEDBACK_SUBMITTED': return 'lucideStar';
      default: return 'lucideActivity';
    }
  }

  activityColor(type: ActivityItem['type']): string {
    switch (type) {
      case 'COMPANY_CREATED': return 'bg-blue-100 text-blue-600';
      case 'USER_CREATED': return 'bg-violet-100 text-violet-600';
      case 'TICKET_CREATED': return 'bg-amber-100 text-amber-600';
      case 'FEEDBACK_SUBMITTED': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  }

  formatRating(rating: number): string {
    return rating.toFixed(1);
  }
}
