import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { interval, Subscription, forkJoin } from 'rxjs';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AuthService } from '../../core/auth/auth.service';
import { TicketService } from '../../core/services/ticket.service';
import { StockService } from '../../core/services/stock.service';
import { Ticket, STATUT_LABELS, STATUT_COLORS, TYPE_APPAREIL_LABELS } from '../../core/models/ticket.model';
import { Piece } from '../../core/models/stock.model';
import { AppCardComponent } from '../../shared/ui/card/app-card.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideClock, lucideAlertTriangle, lucideChevronRight, lucideBuilding, lucideTrendingUp, lucideActivity, lucideCheckCircle, lucidePackage2 } from '@ng-icons/lucide';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';


// Add chart types for convenience
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexGrid,
  ApexMarkers,
  ApexYAxis,
  ApexFill,
  ApexLegend,
  ApexTheme
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: ApexTooltip;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  fill: ApexFill;
  legend: ApexLegend;
  theme: ApexTheme;
  colors: string[];
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    NgApexchartsModule,
    AppCardComponent,
    NgIconComponent,
    HlmBadgeDirective
  ],
  providers: [provideIcons({ lucideCalendar, lucideClock, lucideAlertTriangle, lucideChevronRight, lucideBuilding, lucideTrendingUp, lucideActivity, lucideCheckCircle, lucidePackage2 })],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  private ticketService = inject(TicketService);
  private stockService = inject(StockService);

  tickets = signal<Ticket[]>([]);
  stockItems = signal<Piece[]>([]);
  loading = signal(true);
  
  currentTime = signal(new Date());
  private clockSubscription?: Subscription;

  readonly statutLabels = STATUT_LABELS;
  readonly statutColors = STATUT_COLORS;
  readonly typeLabels = TYPE_APPAREIL_LABELS;

  // KPIs
  stats = computed(() => {
    const ts = this.tickets();
    const sk = this.stockItems();
    
    return {
      actifs: ts.filter(t => t.statut !== 'CLOTURE' && t.statut !== 'REPARE').length,
      enCours: ts.filter(t => t.statut === 'EN_REPARATION' || t.statut === 'EN_DIAGNOSTIC').length,
      stockAlerte: sk.filter(p => p.enAlerteStock).length,
      repares: ts.filter(t => t.statut === 'REPARE' || t.statut === 'CLOTURE').length
    };
  });

  // Items Filtrés pour les smart lists
  urgentTickets = computed(() => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - 3); // Plus de 3 jours
    
    return this.tickets()
      .filter(t => t.statut !== 'CLOTURE' && t.statut !== 'REPARE' && new Date(t.createdAt) < threshold)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(0, 5);
  });

  alertPieces = computed(() => {
    return this.stockItems()
      .filter(p => p.enAlerteStock)
      .slice(0, 5);
  });

  // ApexCharts Options
  public chartOptions!: Partial<ChartOptions>;

  ngOnInit() {
    this.loadData();
    this.clockSubscription = interval(1000).subscribe(() => {
      this.currentTime.set(new Date());
    });
  }

  ngOnDestroy() {
    this.clockSubscription?.unsubscribe();
  }

  loadData() {
    this.loading.set(true);
    
    forkJoin({
      tickets: this.ticketService.getAll({}, 0, 200),
      stock: this.stockService.getPieces(undefined, undefined, undefined, 0, 200)
    }).subscribe({
      next: (data) => {
        this.tickets.set(data.tickets.content);
        this.stockItems.set(data.stock.content);
        this.initChart();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  initChart() {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const dayLabels = last7Days.map(dateStr => {
      return new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric' }).format(new Date(dateStr));
    });

    const creationsData = last7Days.map(day => {
      return this.tickets().filter(t => t.createdAt.startsWith(day)).length;
    });

    const closedData = last7Days.map(day => {
      // Simplification: based on updatedAt if status is REPARE/CLOTURE
      // Note: Real data would need more specific history
      return this.tickets().filter(t => 
        (t.statut === 'REPARE' || t.statut === 'CLOTURE') && 
        t.updatedAt?.startsWith(day)
      ).length;
    });

    this.chartOptions = {
      series: [
        { name: 'Tickets Créés', data: creationsData },
        { name: 'Tickets Clôturés', data: closedData }
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'Inter, sans-serif'
      },
      colors: ['#3b82f6', '#10b981'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      xaxis: {
        categories: dayLabels,
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: '#94a3b8' }
        }
      },
      grid: {
        borderColor: '#f1f5f9',
        strokeDashArray: 4
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [20, 100]
        }
      },
      legend: { position: 'top', horizontalAlign: 'right' },
      theme: { mode: 'light' }
    };
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  }
}
