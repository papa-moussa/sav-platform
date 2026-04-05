import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgApexchartsModule, ApexChart, ApexAxisChartSeries, ApexXAxis, ApexDataLabels, ApexStroke, ApexGrid, ApexTheme, ApexTooltip, ApexPlotOptions, ApexLegend, ApexYAxis } from 'ng-apexcharts';
import { AppCardComponent } from '../../shared/ui/card/app-card.component';
import { AppDateRangePickerComponent } from '../../shared/ui/date-range-picker/app-date-range-picker.component';
import { ReportingService, DashboardStats } from '../../core/services/reporting.service';
import { SiteService } from '../../core/services/site.service';
import { Site } from '../../core/models/site.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp, lucideActivity, lucideUsers, lucideWrench, lucideDollarSign, lucideCalendar, lucideFilter, lucideRefreshCw } from '@ng-icons/lucide';
import { format, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { HlmSelectDirective } from '@spartan-ng/ui-select-helm';
import { STATUT_LABELS } from '../../core/models/ticket.model';

export type ChartOptions = {
  series: any;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  theme: ApexTheme;
  tooltip: ApexTooltip;
  colors: string[];
  plotOptions?: ApexPlotOptions;
  labels?: string[];
  legend?: ApexLegend;
};

@Component({
  selector: 'app-reporting',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    NgApexchartsModule, 
    AppCardComponent, 
    NgIconComponent, 
    AppDateRangePickerComponent,
    HlmSelectDirective
  ],
  providers: [provideIcons({ lucideTrendingUp, lucideActivity, lucideUsers, lucideWrench, lucideDollarSign, lucideCalendar, lucideFilter, lucideRefreshCw })],
  templateUrl: './reporting.component.html'
})
export class ReportingComponent {
  private fb = inject(FormBuilder);
  private reportingService = inject(ReportingService);
  private siteService = inject(SiteService);

  sites = signal<Site[]>([]);
  stats = signal<DashboardStats | null>(null);
  loading = signal(false);

  filters = this.fb.group({
    siteId: [null as number | null],
    range: [{ 
      start: format(startOfMonth(new Date()), 'yyyy-MM-dd'), 
      end: format(new Date(), 'yyyy-MM-dd') 
    }]
  });

  // Chart References
  public activityChartOptions: any = {};
  public statusChartOptions: any = {};
  public techChartOptions: any = {};

  constructor() {
    this.siteService.getAll().subscribe(s => this.sites.set(s));
    
    // Automatically reload when filters change
    effect(() => {
      this.loadStats();
    }, { allowSignalWrites: true });

    this.initDefaultCharts();
  }

  loadStats() {
    const { siteId, range } = this.filters.value;
    if (!range?.start || !range?.end) return;

    this.loading.set(true);
    this.reportingService.getStats(range.start, range.end, siteId ?? undefined).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.updateCharts(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private initDefaultCharts() {
    // Area Chart - Intervention activity
    this.activityChartOptions = {
      series: [],
      chart: { height: 350, type: 'area', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
      colors: ['#3b82f6', '#10b981'],
      stroke: { curve: 'smooth', width: 2 },
      grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
      xaxis: { categories: [], labels: { style: { colors: '#64748b' } } },
      yaxis: { labels: { style: { colors: '#64748b' } } }
    };

    // Donut - Status distribution
    this.statusChartOptions = {
      series: [],
      chart: { height: 380, type: 'donut', fontFamily: 'Inter, sans-serif', animations: { enabled: true } },
      labels: [],
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1', '#94a3b8'],
      legend: { position: 'bottom', fontFamily: 'Inter, sans-serif', fontWeight: 500 },
      dataLabels: { enabled: true, style: { fontWeight: 'bold' } },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                formatter: (val: number, opts?: any) => {
                  return opts.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                }
              }
            }
          }
        }
      }
    };

    // Bar - Tech performance
    this.techChartOptions = {
      series: [],
      chart: { height: 400, type: 'bar', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
      plotOptions: { 
        bar: { 
          borderRadius: 8, 
          horizontal: false,
          columnWidth: '40%',
          dataLabels: { position: 'top' }
        } 
      },
      colors: ['#6366f1'],
      xaxis: { categories: [], labels: { style: { fontWeight: 600 } } },
      dataLabels: { enabled: true, offsetY: -20, style: { fontSize: '12px', colors: ["#304758"] } }
    };
  }

  private updateCharts(data: DashboardStats) {
    // 1. Activity Trends
    const categories = data.dailyTrends.map(t => format(new Date(t.date), 'dd MMM', { locale: fr }));
    this.activityChartOptions = {
      ...this.activityChartOptions,
      series: [
        { name: 'Tickets Créés', data: data.dailyTrends.map(t => t.creations) },
        { name: 'Tickets Résolus', data: data.dailyTrends.map(t => t.resolutions) }
      ],
      xaxis: { ...this.activityChartOptions.xaxis, categories }
    };

    // 2. Status Donut
    const statusEntries = Object.entries(data.statusDistribution);
    this.statusChartOptions = {
      ...this.statusChartOptions,
      series: statusEntries.map(e => e[1]),
      labels: statusEntries.map(e => ((STATUT_LABELS as Record<string, string>)[e[0]]) || e[0])
    };

    // 3. Technician Performance
    const techEntries = Object.entries(data.technicianPerformance).sort((a, b) => b[1] - a[1]);
    this.techChartOptions = {
      ...this.techChartOptions,
      series: [{ name: 'Interventions', data: techEntries.map(e => e[1]) }],
      xaxis: { ...this.techChartOptions.xaxis, categories: techEntries.map(e => e[0]) }
    };
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(value);
  }
}
