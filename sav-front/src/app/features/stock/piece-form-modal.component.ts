import { Component, inject, signal, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { StockService } from '../../core/services/stock.service';
import { SiteService } from '../../core/services/site.service';
import { Piece, PieceRequest, CategorieAppareil, CATEGORIE_LABELS } from '../../core/models/stock.model';
import { Site } from '../../core/models/site.model';
import { AppModalComponent } from '../../shared/ui/modal/app-modal.component';
import { AppInputComponent } from '../../shared/ui/input/app-input.component';
import { AppButtonComponent } from '../../shared/ui/button/app-button.component';
import { HlmSelectDirective } from '@spartan-ng/ui-select-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
  selector: 'app-piece-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppModalComponent,
    AppInputComponent,
    AppButtonComponent,
    HlmSelectDirective,
    HlmLabelDirective,
  ],
  templateUrl: './piece-form-modal.component.html',
})
export class PieceFormModalComponent implements OnInit {
  @Input() piece: Piece | null = null;
  @Output() saved = new EventEmitter<Piece>();
  @Output() cancelled = new EventEmitter<void>();

  private stockService = inject(StockService);
  private siteService = inject(SiteService);
  private fb = inject(FormBuilder);

  saving = signal(false);
  error = signal<string | null>(null);
  sites = signal<Site[]>([]);

  readonly categories: CategorieAppareil[] = [
    'REFRIGERATEUR', 'LAVE_LINGE', 'LAVE_VAISSELLE', 'CLIMATISEUR',
    'CUISINIERE', 'CONGELATEUR', 'FOUR', 'AUTRE',
  ];
  readonly categorieLabels = CATEGORIE_LABELS;

  form = this.fb.group({
    reference: ['', Validators.required],
    designation: ['', Validators.required],
    categorieAppareil: [null as CategorieAppareil | null, Validators.required],
    marqueCompatible: [''],
    quantite: [0, [Validators.required, Validators.min(0)]],
    seuilAlerte: [5, [Validators.required, Validators.min(0)]],
    prixUnitaire: [null as number | null],
    siteId: [null as number | null, Validators.required],
  });

  get isEdit(): boolean {
    return this.piece !== null;
  }

  get title(): string {
    return this.isEdit ? 'Modifier la pièce' : 'Nouvelle pièce détachée';
  }

  ngOnInit(): void {
    this.siteService.getAll().subscribe({ next: (s) => this.sites.set(s) });

    if (this.piece) {
      this.form.patchValue({
        reference: this.piece.reference,
        designation: this.piece.designation,
        categorieAppareil: this.piece.categorieAppareil,
        marqueCompatible: this.piece.marqueCompatible ?? '',
        quantite: this.piece.quantite,
        seuilAlerte: this.piece.seuilAlerte,
        prixUnitaire: this.piece.prixUnitaire,
        siteId: this.piece.siteId,
      });
      // Disable quantite in edit mode
      this.form.get('quantite')!.disable();
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.error.set('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    const v = this.form.getRawValue();
    const request: PieceRequest = {
      reference: v.reference!,
      designation: v.designation!,
      categorieAppareil: v.categorieAppareil!,
      marqueCompatible: v.marqueCompatible || undefined,
      quantite: v.quantite!,
      seuilAlerte: v.seuilAlerte!,
      prixUnitaire: v.prixUnitaire ?? undefined,
      siteId: v.siteId!,
    };

    this.saving.set(true);
    this.error.set(null);

    const obs$ = this.isEdit
      ? this.stockService.updatePiece(this.piece!.id, request)
      : this.stockService.createPiece(request);

    obs$.subscribe({
      next: (p) => { this.saving.set(false); this.saved.emit(p); },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Erreur lors de l\'enregistrement.');
        this.saving.set(false);
      },
    });
  }
}
