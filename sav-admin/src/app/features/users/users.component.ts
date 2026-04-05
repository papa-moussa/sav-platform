import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideSearch, lucideToggleLeft, lucideToggleRight, lucideRefreshCw,
  lucideKeyRound, lucideCircleAlert, lucideLoader, lucideUsers,
  lucideFilter, lucideCircleCheck, lucideCircleX, lucideChevronLeft, lucideChevronRight
} from '@ng-icons/lucide';
import { AdminUserService } from '../../core/services/admin-user.service';
import { CompanyService } from '../../core/services/company.service';
import { AdminUser } from '../../core/models/admin-user.model';
import { Company } from '../../core/models/company.model';
import { PageResponse } from '../../core/models/page.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  viewProviders: [provideIcons({
    lucideSearch, lucideToggleLeft, lucideToggleRight, lucideRefreshCw,
    lucideKeyRound, lucideCircleAlert, lucideLoader, lucideUsers,
    lucideFilter, lucideCircleCheck, lucideCircleX, lucideChevronLeft, lucideChevronRight
  })],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  private readonly userService = inject(AdminUserService);
  private readonly companyService = inject(CompanyService);

  readonly users = signal<AdminUser[]>([]);
  readonly companies = signal<Company[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly actionLoading = signal<number | null>(null);
  readonly confirmReset = signal<AdminUser | null>(null);

  // Filters
  readonly searchQuery = signal('');
  readonly selectedCompanyId = signal<number | undefined>(undefined);

  // Pagination
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);
  readonly pageSize = 20;

  ngOnInit(): void {
    this.companyService.getAll().subscribe({
      next: (data) => this.companies.set(data)
    });
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);
    this.userService.getAll(
      this.searchQuery(),
      this.selectedCompanyId(),
      this.currentPage(),
      this.pageSize
    ).subscribe({
      next: (page) => {
        this.users.set(page.content);
        this.totalPages.set(page.totalPages);
        this.totalElements.set(page.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les utilisateurs.');
        this.loading.set(false);
      }
    });
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(0);
    this.loadUsers();
  }

  onCompanyFilter(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedCompanyId.set(val ? Number(val) : undefined);
    this.currentPage.set(0);
    this.loadUsers();
  }

  toggleActif(user: AdminUser): void {
    if (this.actionLoading() !== null) return;
    this.actionLoading.set(user.id);
    this.userService.toggleActif(user.id).subscribe({
      next: (updated) => {
        this.users.update(list => list.map(u => u.id === updated.id ? updated : u));
        this.actionLoading.set(null);
      },
      error: () => this.actionLoading.set(null)
    });
  }

  openResetConfirm(user: AdminUser): void {
    this.confirmReset.set(user);
  }

  closeResetConfirm(): void {
    this.confirmReset.set(null);
  }

  confirmResetPassword(): void {
    const user = this.confirmReset();
    if (!user || this.actionLoading() !== null) return;
    this.actionLoading.set(user.id);
    this.userService.resetPassword(user.id).subscribe({
      next: () => {
        this.actionLoading.set(null);
        this.confirmReset.set(null);
      },
      error: () => {
        this.actionLoading.set(null);
        this.confirmReset.set(null);
      }
    });
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;
    this.currentPage.set(page);
    this.loadUsers();
  }

  roleLabel(role: AdminUser['role']): string {
    const labels: Record<string, string> = {
      SUPER_ADMIN: 'Super Admin',
      ADMIN: 'Admin',
      TECHNICIEN: 'Technicien',
      RECEPTIONNISTE: 'Réceptionniste'
    };
    return labels[role] ?? role;
  }

  roleBadge(role: AdminUser['role']): string {
    const classes: Record<string, string> = {
      SUPER_ADMIN: 'bg-purple-100 text-purple-700',
      ADMIN: 'bg-blue-100 text-blue-700',
      TECHNICIEN: 'bg-amber-100 text-amber-700',
      RECEPTIONNISTE: 'bg-teal-100 text-teal-700'
    };
    return classes[role] ?? 'bg-slate-100 text-slate-700';
  }
}
