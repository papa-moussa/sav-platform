import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../core/services/ticket.service';
import { AuthService } from '../../core/auth/auth.service';
import { Ticket, STATUT_LABELS, STATUT_COLORS, TYPE_APPAREIL_LABELS } from '../../core/models/ticket.model';
import { TicketDetailDialogComponent } from '../tickets/ticket-detail-dialog.component';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { AppCardComponent } from '../../shared/ui/card/app-card.component';
import { AppFilterBarComponent } from '../../shared/ui/filter-bar/app-filter-bar.component';
import { HlmTableDirective, HlmTbodyDirective, HlmTrowDirective, HlmTdDirective } from '@spartan-ng/ui-table-helm';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideWrench, lucideChevronRight } from '@ng-icons/lucide';

@Component({
  selector: 'app-reparations',
  standalone: true,
  imports: [
    CommonModule, TicketDetailDialogComponent,
    HlmBadgeDirective, AppCardComponent, AppFilterBarComponent,
    HlmTableDirective, HlmTbodyDirective, HlmTrowDirective, HlmTdDirective, NgIconComponent
  ],
  providers: [provideIcons({ lucideWrench, lucideChevronRight })],
  templateUrl: './reparations.component.html',
})
export class ReparationsComponent implements OnInit {
  private ticketService = inject(TicketService);
  authService = inject(AuthService);

  tickets = signal<Ticket[]>([]);
  loading = signal(false);
  selectedTicket = signal<Ticket | null>(null);

  searchTerm = signal('');

  readonly statutLabels = STATUT_LABELS;
  readonly statutColors = STATUT_COLORS;
  readonly typeLabels = TYPE_APPAREIL_LABELS;

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading.set(true);
    const role = this.authService.getRole();

    if (role === 'ADMIN') {
      // getAll retourne PageResponse<Ticket>, on extrait le contenu (taille max pour le dashboard réparations)
      this.ticketService.getAll({}, 0, 200).subscribe({
        next: (data) => { this.tickets.set(data.content); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    } else {
      this.ticketService.getMesTickets().subscribe({
        next: (t) => { this.tickets.set(t); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    }
  }

  openDetail(ticket: Ticket): void {
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

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  private matchesSearch(t: Ticket): boolean {
    const s = this.searchTerm().toLowerCase().trim();
    if (!s) return true;
    return t.numero.toLowerCase().includes(s) ||
           t.clientNom.toLowerCase().includes(s) ||
           t.marqueModele.toLowerCase().includes(s) ||
           (t.numeroSerie?.toLowerCase().includes(s) ?? false);
  }

  get ticketsEnCours(): Ticket[] {
    return this.tickets().filter(t =>
      !['REPARE', 'IRREPARABLE', 'CLOTURE'].includes(t.statut) && this.matchesSearch(t)
    );
  }

  get ticketsTermines(): Ticket[] {
    return this.tickets().filter(t =>
      ['REPARE', 'IRREPARABLE', 'CLOTURE'].includes(t.statut) && this.matchesSearch(t)
    );
  }
}
