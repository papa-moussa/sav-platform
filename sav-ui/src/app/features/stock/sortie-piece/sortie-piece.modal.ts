import { Component, inject, signal, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonButtons,
  IonSpinner,
  IonText,
  IonLabel,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { StockApiService } from '../../../core/services/stock-api.service';
import { SyncService } from '../../../core/services/sync.service';
import { NetworkService } from '../../../core/network/network.service';
import { Piece } from '@sav/shared-models';

@Component({
  selector: 'app-sortie-piece-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonInput, IonButton, IonButtons,
    IonSpinner, IonText, IonLabel,
  ],
  templateUrl: './sortie-piece.modal.html',
})
export class SortiePieceModal {
  @Input() piece!: Piece;
  @Input() interventionId?: number;

  private fb        = inject(FormBuilder);
  private api       = inject(StockApiService);
  private syncSvc   = inject(SyncService);
  private network   = inject(NetworkService);
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);

  loading = signal(false);
  error   = signal<string | null>(null);

  form = this.fb.group({
    quantite: [1, [Validators.required, Validators.min(1)]],
    motif:    [''],
  });

  dismiss(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async submit(): Promise<void> {
    if (this.form.invalid) return;

    const quantite = this.form.value.quantite!;
    if (quantite > this.piece.quantite) {
      this.error.set(`Quantité insuffisante (stock : ${this.piece.quantite})`);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const payload = {
      quantite,
      motif:         this.form.value.motif || undefined,
      interventionId: this.interventionId,
    };

    try {
      if (this.network.isOnline()) {
        await this.api.sortieStock(this.piece.id, payload);
        this.modalCtrl.dismiss(null, 'confirm');
      } else {
        await this.syncSvc.queueSortie(
          this.piece.id,
          this.interventionId ? this.interventionId : 0,
          payload
        );
        const toast = await this.toastCtrl.create({
          message: 'Sortie stock mise en queue — sera synchronisée dès reconnexion.',
          color: 'warning',
          duration: 4000,
          position: 'bottom',
        });
        await toast.present();
        this.modalCtrl.dismiss(null, 'offline');
      }
    } catch (err: unknown) {
      const msg = (err as { error?: { message?: string } }).error?.message;
      this.error.set(msg ?? 'Erreur lors de la sortie de stock.');
    } finally {
      this.loading.set(false);
    }
  }
}
