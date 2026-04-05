import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TicketService } from '../../core/services/ticket.service';
import { SiteService } from '../../core/services/site.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/auth/auth.service';
import {
  Ticket, TicketStatut, TicketFilters,
  STATUT_LABELS, STATUT_COLORS, TYPE_APPAREIL_LABELS
} from '../../core/models/ticket.model';
import { Site } from '../../core/models/site.model';
import { User } from '../../core/models/user.model';
import { TicketCreateDialogComponent } from './ticket-create-dialog.component';
import { TicketDetailDialogComponent } from './ticket-detail-dialog.component';
import { AppDatePickerComponent } from '../../shared/ui/datepicker/app-datepicker.component';
import { AppPaginationComponent } from '../../shared/ui/pagination/app-pagination.component';

import { AppFilterBarComponent, QuickFilter } from '../../shared/ui/filter-bar/app-filter-bar.component';
import { AppButtonComponent } from '../../shared/ui/button/app-button.component';
import { AppCardComponent } from '../../shared/ui/card/app-card.component';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmTableDirective, HlmTrowDirective, HlmThDirective, HlmTdDirective } from '@spartan-ng/ui-table-helm';
import { HlmSelectDirective } from '@spartan-ng/ui-select-helm';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideAlertTriangle, lucideChevronRight, lucideTicket } from '@ng-icons/lucide';

@Component({
  selector: 'app-tickets-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TicketCreateDialogComponent,
    TicketDetailDialogComponent,
    AppFilterBarComponent, AppButtonComponent, AppCardComponent, AppPaginationComponent,
    HlmBadgeDirective, HlmTableDirective, HlmTrowDirective, HlmThDirective, HlmTdDirective,
    HlmSelectDirective, NgIconComponent, AppDatePickerComponent
  ],
  providers: [provideIcons({ lucidePlus, lucideAlertTriangle, lucideChevronRight, lucideTicket })],
  templateUrl: './tickets-list.component.html',
})
export class TicketsListComponent implements OnInit {
  private ticketService = inject(TicketService);
  private siteService = inject(SiteService);
  private userService = inject(UserService);
  authService = inject(AuthService);
  private fb = inject(FormBuilder);

  tickets = signal<Ticket[]>([]);
  sites = signal<Site[]>([]);
  techniciens = signal<User[]>([]);
  loading = signal(false);
  showCreateDialog = signal(false);
  selectedTicket = signal<Ticket | null>(null);

  // Pagination
  currentPage = signal(0);
  pageSize = signal(20);
  totalElements = signal(0);
  totalPages = signal(0);

  readonly allStatuts: TicketStatut[] = [
    'RECU', 'EN_DIAGNOSTIC', 'EN_REPARATION', 'EN_ATTENTE_PIECES',
    'REPARE', 'IRREPARABLE', 'EN_ATTENTE_FEEDBACK', 'CLOTURE'
  ];

  filters = this.fb.group({
    statut: [null as TicketStatut | null],
    siteId: [null as number | null],
    technicienId: [null as number | null],
    search: [''],
    dateDebut: [null as string | null],
    dateFin: [null as string | null],
  });

  readonly statutLabels = STATUT_LABELS;
  readonly statutColors = STATUT_COLORS;
  readonly typeLabels = TYPE_APPAREIL_LABELS;

  // Filtres rapides pour les jetons (chips)
  readonly quickStatusFilters: QuickFilter[] = [
    { label: 'Tous', value: null },
    ...this.allStatuts.map(s => ({
      label: this.statutLabels[s],
      value: s
    }))
  ];

  ngOnInit(): void {
    this.loadTickets();
    this.siteService.getAll().subscribe({ next: (s) => this.sites.set(s) });

    const role = this.authService.currentRole();
    if (role === 'ADMIN' || role === 'RECEPTIONNISTE') {
      this.userService.getAll('', 0, 200).subscribe({
        next: (resp) => this.techniciens.set(resp.content.filter(x => x.role === 'TECHNICIEN' && x.actif)),
      });
    }

    this.filters.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage.set(0); // Retour page 1 à chaque changement de filtre
        this.loadTickets();
      });
  }

  loadTickets(): void {
    const v = this.filters.value;
    const filters: TicketFilters = {
      statut: v.statut ?? undefined,
      siteId: v.siteId ?? undefined,
      technicienId: v.technicienId ?? undefined,
      search: v.search ?? undefined,
      dateDebut: v.dateDebut ?? undefined,
      dateFin: v.dateFin ?? undefined,
    };
    this.loading.set(true);
    this.ticketService.getAll(filters, this.currentPage(), this.pageSize()).subscribe({
      next: (data) => {
        this.tickets.set(data.content);
        this.totalElements.set(data.totalElements);
        this.totalPages.set(data.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  resetFilters(): void {
    this.filters.reset({
      statut: null,
      siteId: null,
      technicienId: null,
      search: '',
      dateDebut: null,
      dateFin: null
    });
  }

  openCreate(): void {
    this.showCreateDialog.set(true);
  }

  onTicketCreated(_ticket: Ticket): void {
    this.showCreateDialog.set(false);
    this.currentPage.set(0);
    this.loadTickets();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadTickets();
  }

  openDetail(ticket: Ticket): void {
    // Recharge le ticket avec ses interventions
    this.ticketService.getById(ticket.id).subscribe({
      next: (t) => this.selectedTicket.set(t),
    });
  }

  onTicketUpdated(updated: Ticket): void {
    this.tickets.update((list) => list.map((t) => (t.id === updated.id ? updated : t)));
    this.selectedTicket.set(updated);
  }

  closeDetail(): void {
    this.selectedTicket.set(null);
  }

  isAdmin(): boolean {
    return this.authService.currentRole() === 'ADMIN';
  }

  isAdminOrReception(): boolean {
    const r = this.authService.currentRole();
    return r === 'ADMIN' || r === 'RECEPTIONNISTE';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  isUrgent(ticket: Ticket): boolean {
    const days = (Date.now() - new Date(ticket.createdAt).getTime()) / 86400000;
    return days > 7 && !['REPARE', 'IRREPARABLE', 'CLOTURE'].includes(ticket.statut);
  }

  onSearchChange(val: string): void {
    this.filters.patchValue({ search: val });
  }

  onQuickFilterChange(val: unknown): void {
    this.filters.patchValue({ statut: val as TicketStatut });
  }
}
