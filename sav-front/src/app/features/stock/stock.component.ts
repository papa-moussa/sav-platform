import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { StockService } from '../../core/services/stock.service';
import { SiteService } from '../../core/services/site.service';
import { AuthService } from '../../core/auth/auth.service';
import { Piece, CategorieAppareil, CATEGORIE_LABELS } from '../../core/models/stock.model';
import { Site } from '../../core/models/site.model';
import { PieceFormModalComponent } from './piece-form-modal.component';
import { EntreeStockModalComponent } from './entree-stock-modal.component';
import { SortieStockModalComponent } from './sortie-stock-modal.component';
import { PieceDetailModalComponent } from './piece-detail-modal.component';
import { AppButtonComponent } from '../../shared/ui/button/app-button.component';
import { AppCardComponent } from '../../shared/ui/card/app-card.component';
import { HlmSelectDirective } from '@spartan-ng/ui-select-helm';
import { HlmTableDirective, HlmTrowDirective, HlmThDirective, HlmTdDirective, HlmTheadDirective, HlmTbodyDirective } from '@spartan-ng/ui-table-helm';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucidePlus, lucideSearch, lucideAlertTriangle, lucidePackage,
  lucideArrowUp, lucideArrowDown, lucideEye, lucidePencil, lucideFilter
} from '@ng-icons/lucide';
import { AppFilterBarComponent, QuickFilter } from '../../shared/ui/filter-bar/app-filter-bar.component';
import { AppPaginationComponent } from '../../shared/ui/pagination/app-pagination.component';


@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PieceFormModalComponent,
    EntreeStockModalComponent,
    SortieStockModalComponent,
    PieceDetailModalComponent,
    AppButtonComponent,
    AppCardComponent,
    HlmSelectDirective,
    HlmTableDirective,
    HlmTrowDirective,
    HlmThDirective,
    HlmTdDirective,
    HlmTheadDirective,
    HlmTbodyDirective,
    AppFilterBarComponent,
    AppPaginationComponent,
    NgIconComponent,
  ],
  providers: [provideIcons({
    lucidePlus, lucideSearch, lucideAlertTriangle, lucidePackage,
    lucideArrowUp, lucideArrowDown, lucideEye, lucidePencil, lucideFilter,
  })],
  templateUrl: './stock.component.html',
})
export class StockComponent implements OnInit, OnDestroy {
  private stockService = inject(StockService);
  private siteService = inject(SiteService);
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  pieces = signal<Piece[]>([]);
  loading = signal(false);
  alertesCount = signal(0);
  searchTerm = signal('');
  filterCategorie = signal<CategorieAppareil | ''>('');
  filterAlerteOnly = signal(false);
  sites = signal<Site[]>([]);

  // Pagination
  currentPage = signal(0);
  pageSize = signal(20);
  totalElements = signal(0);
  totalPages = signal(0);

  selectedPiece = signal<Piece | null>(null);
  showCreateModal = signal(false);
  showEntreeModal = signal(false);
  showSortieModal = signal(false);
  showDetailModal = signal(false);
  showEditModal = signal(false);

  readonly categories: CategorieAppareil[] = [
    'REFRIGERATEUR', 'LAVE_LINGE', 'LAVE_VAISSELLE', 'CLIMATISEUR',
    'CUISINIERE', 'CONGELATEUR', 'FOUR', 'AUTRE',
  ];
  readonly categorieLabels = CATEGORIE_LABELS;

  readonly quickStockFilters: QuickFilter[] = [
    { label: 'Tout le stock', value: 'ALL' },
    { label: 'En alerte stock', value: 'ALERTE' }
  ];

  // Le filtrage est désormais effectué côté backend — pas de computed client-side
  piecesEnAlerte = computed(() => this.pieces().filter(p => p.enAlerteStock).length);

  totalValeurStock = computed(() =>
    this.pieces().reduce((sum, p) => sum + (p.prixUnitaire ?? 0) * p.quantite, 0)
  );

  isAdmin = computed(() => this.authService.currentRole() === 'ADMIN');

  ngOnInit(): void {
    this.loadPieces();
    this.loadAlertesCount();
    this.siteService.getAll().subscribe({ next: (s) => this.sites.set(s) });

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe((term) => {
      this.searchTerm.set(term);
      this.currentPage.set(0);
      this.loadPieces();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPieces(): void {
    this.loading.set(true);
    this.stockService.getPieces(
      this.searchTerm() || undefined,
      undefined,
      this.filterAlerteOnly() || undefined,
      this.currentPage(),
      this.pageSize(),
    ).subscribe({
      next: (data) => {
        this.pieces.set(data.content);
        this.totalElements.set(data.totalElements);
        this.totalPages.set(data.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadPieces();
  }

  loadAlertesCount(): void {
    this.stockService.getAlertesCount().subscribe({
      next: (r) => this.alertesCount.set(r.count),
    });
  }

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchSubject.next(val);
  }

  onSearchChange(val: string): void {
    this.searchSubject.next(val);
  }

  onQuickFilterChange(val: unknown): void {
    if (val === 'ALERTE') {
      this.filterAlerteOnly.set(true);
    } else {
      this.filterAlerteOnly.set(false);
    }
    this.currentPage.set(0);
    this.loadPieces();
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.filterCategorie.set('');
    this.filterAlerteOnly.set(false);
    this.currentPage.set(0);
    this.loadPieces();
  }

  onCategorieChange(event: Event): void {
    this.filterCategorie.set((event.target as HTMLSelectElement).value as CategorieAppareil | '');
    this.currentPage.set(0);
    this.loadPieces();
  }

  toggleAlerteOnly(): void {
    this.filterAlerteOnly.update(v => !v);
    this.loadPieces();
  }

  openCreate(): void {
    this.selectedPiece.set(null);
    this.showCreateModal.set(true);
  }

  openEdit(piece: Piece): void {
    this.selectedPiece.set(piece);
    this.showEditModal.set(true);
  }

  openEntree(piece: Piece): void {
    this.selectedPiece.set(piece);
    this.showEntreeModal.set(true);
  }

  openSortie(piece: Piece): void {
    this.selectedPiece.set(piece);
    this.showSortieModal.set(true);
  }

  openDetail(piece: Piece): void {
    this.selectedPiece.set(piece);
    this.showDetailModal.set(true);
  }

  onPieceSaved(): void {
    this.showCreateModal.set(false);
    this.showEditModal.set(false);
    this.loadPieces();
    this.loadAlertesCount();
  }

  onMouvementDone(): void {
    this.showEntreeModal.set(false);
    this.showSortieModal.set(false);
    this.selectedPiece.set(null);
    this.loadPieces();
    this.loadAlertesCount();
  }

  closeAllModals(): void {
    this.showCreateModal.set(false);
    this.showEditModal.set(false);
    this.showEntreeModal.set(false);
    this.showSortieModal.set(false);
    this.showDetailModal.set(false);
    this.selectedPiece.set(null);
  }

  formatPrice(price: number | null): string {
    if (price == null) return '—';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(price);
  }

  formatValeurTotale(): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(this.totalValeurStock());
  }

  getRowTotal(piece: Piece): number {
    return (piece.prixUnitaire ?? 0) * piece.quantite;
  }

  formatRowTotal(piece: Piece): string {
    return this.formatPrice(this.getRowTotal(piece));
  }

  quickEntree(piece: Piece): void {
    if (!this.isAdmin()) return;
    this.stockService.entreeStock(piece.id, { quantite: 1, motif: 'Ajustement rapide (+1)' }).subscribe({
      next: () => {
        this.loadPieces();
        this.loadAlertesCount();
      }
    });
  }

  quickSortie(piece: Piece): void {
    if (!this.isAdmin()) return;
    if (piece.quantite <= 0) return;
    this.stockService.sortieStock(piece.id, { quantite: 1, motif: 'Ajustement rapide (-1)' }).subscribe({
      next: () => {
        this.loadPieces();
        this.loadAlertesCount();
      }
    });
  }
}
