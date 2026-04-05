import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideBell, lucidePlus, lucideCircleAlert, lucideLoader,
  lucideInfo, lucideTriangleAlert, lucideWrench, lucideX, lucideRefreshCw
} from '@ng-icons/lucide';
import { NotificationService } from '../../core/services/notification.service';
import { CompanyService } from '../../core/services/company.service';
import { Notification, NotificationType } from '../../core/models/notification.model';
import { Company } from '../../core/models/company.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  viewProviders: [provideIcons({
    lucideBell, lucidePlus, lucideCircleAlert, lucideLoader,
    lucideInfo, lucideTriangleAlert, lucideWrench, lucideX, lucideRefreshCw
  })],
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  private readonly notifService = inject(NotificationService);
  private readonly companyService = inject(CompanyService);
  private readonly fb = inject(FormBuilder);

  readonly notifications = signal<Notification[]>([]);
  readonly companies = signal<Company[]>([]);
  readonly loading = signal(true);
  readonly sending = signal(false);
  readonly error = signal<string | null>(null);
  readonly showForm = signal(false);

  readonly totalElements = signal(0);
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    message: ['', [Validators.required, Validators.maxLength(1000)]],
    type: ['INFO', Validators.required],
    targetCompanyId: [null as number | null]
  });

  ngOnInit(): void {
    this.companyService.getAll().subscribe({ next: (d) => this.companies.set(d) });
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading.set(true);
    this.notifService.getAll(this.currentPage(), 20).subscribe({
      next: (page) => {
        this.notifications.set(page.content);
        this.totalElements.set(page.totalElements);
        this.totalPages.set(page.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les notifications.');
        this.loading.set(false);
      }
    });
  }

  submit(): void {
    if (this.form.invalid || this.sending()) return;
    const { title, message, type, targetCompanyId } = this.form.value;
    this.sending.set(true);
    this.notifService.create({
      title: title!,
      message: message!,
      type: type as NotificationType,
      targetCompanyId: targetCompanyId ?? null
    }).subscribe({
      next: (notif) => {
        this.notifications.update(list => [notif, ...list]);
        this.totalElements.update(n => n + 1);
        this.form.reset({ type: 'INFO', targetCompanyId: null });
        this.showForm.set(false);
        this.sending.set(false);
      },
      error: () => this.sending.set(false)
    });
  }

  typeLabel(type: string): string {
    const map: Record<string, string> = { INFO: 'Information', ALERT: 'Alerte', MAINTENANCE: 'Maintenance' };
    return map[type] ?? type;
  }

  typeBadge(type: string): string {
    const map: Record<string, string> = {
      INFO: 'bg-blue-100 text-blue-700',
      ALERT: 'bg-red-100 text-red-700',
      MAINTENANCE: 'bg-amber-100 text-amber-700'
    };
    return map[type] ?? 'bg-slate-100 text-slate-700';
  }

  typeIcon(type: string): string {
    const map: Record<string, string> = {
      INFO: 'lucideInfo',
      ALERT: 'lucideTriangleAlert',
      MAINTENANCE: 'lucideWrench'
    };
    return map[type] ?? 'lucideBell';
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
