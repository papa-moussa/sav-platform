import { Component, inject, signal, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockService } from '../../core/services/stock.service';
import { Piece, MouvementStock, CATEGORIE_LABELS } from '../../core/models/stock.model';
import { AppModalComponent } from '../../shared/ui/modal/app-modal.component';
import { AppButtonComponent } from '../../shared/ui/button/app-button.component';
import { HlmTableDirective, HlmTrowDirective, HlmThDirective, HlmTdDirective, HlmTheadDirective, HlmTbodyDirective } from '@spartan-ng/ui-table-helm';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideAlertTriangle, lucidePackage, lucideArrowUp, lucideArrowDown } from '@ng-icons/lucide';

@Component({
  selector: 'app-piece-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    AppModalComponent,
    AppButtonComponent,
    HlmTableDirective,
    HlmTrowDirective,
    HlmThDirective,
    HlmTdDirective,
    HlmTheadDirective,
    HlmTbodyDirective,
    NgIconComponent,
  ],
  providers: [provideIcons({ lucideAlertTriangle, lucidePackage, lucideArrowUp, lucideArrowDown })],
  templateUrl: './piece-detail-modal.component.html',
})
export class PieceDetailModalComponent implements OnInit {
  @Input() piece!: Piece;
  @Output() closed = new EventEmitter<void>();

  private stockService = inject(StockService);

  mouvements = signal<MouvementStock[]>([]);
  loadingMouvements = signal(false);

  readonly categorieLabels = CATEGORIE_LABELS;

  ngOnInit(): void {
    this.loadingMouvements.set(true);
    this.stockService.getMouvements(this.piece.id).subscribe({
      next: (m) => { this.mouvements.set(m); this.loadingMouvements.set(false); },
      error: () => this.loadingMouvements.set(false),
    });
  }

  formatDateTime(date: string): string {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  formatPrice(price: number | null): string {
    if (price == null) return '—';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(price);
  }
}
