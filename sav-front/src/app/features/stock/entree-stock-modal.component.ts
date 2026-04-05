import { Component, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { StockService } from '../../core/services/stock.service';
import { Piece, EntreeStockRequest } from '../../core/models/stock.model';
import { AppModalComponent } from '../../shared/ui/modal/app-modal.component';
import { AppInputComponent } from '../../shared/ui/input/app-input.component';
import { AppButtonComponent } from '../../shared/ui/button/app-button.component';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
  selector: 'app-entree-stock-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppModalComponent,
    AppInputComponent,
    AppButtonComponent,
    HlmLabelDirective,
  ],
  templateUrl: './entree-stock-modal.component.html',
})
export class EntreeStockModalComponent {
  @Input() piece!: Piece;
  @Output() done = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private stockService = inject(StockService);
  private fb = inject(FormBuilder);

  saving = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    quantite: [1, [Validators.required, Validators.min(1)]],
    motif: [''],
  });

  submit(): void {
    if (this.form.invalid) {
      this.error.set('La quantité doit être au minimum 1.');
      return;
    }
    const v = this.form.value;
    const request: EntreeStockRequest = {
      quantite: v.quantite!,
      motif: v.motif || undefined,
    };

    this.saving.set(true);
    this.error.set(null);

    this.stockService.entreeStock(this.piece.id, request).subscribe({
      next: () => { this.saving.set(false); this.done.emit(); },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Erreur lors de l\'entrée en stock.');
        this.saving.set(false);
      },
    });
  }
}
