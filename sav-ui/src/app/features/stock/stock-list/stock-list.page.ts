import { Component, inject, OnInit, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonButtons,
  IonButton,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  cubeOutline, 
  searchOutline, 
  alertCircleOutline, 
  chevronForwardOutline 
} from 'ionicons/icons';
import { StockApiService } from '../../../core/services/stock-api.service';
import { NetworkService } from '../../../core/network/network.service';
import { OfflineBannerComponent } from '../../../shared/components/offline-banner/offline-banner.component';
import { Piece } from '@sav/shared-models';
import { SortiePieceModal } from '../sortie-piece/sortie-piece.modal';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonButton, IonIcon,
    IonSpinner, IonRefresher, IonRefresherContent,
    OfflineBannerComponent,
  ],
  templateUrl: './stock-list.page.html',
})
export class StockListPage implements OnInit {
  private api       = inject(StockApiService);
  private network   = inject(NetworkService);
  private modalCtrl = inject(ModalController);

  pieces  = signal<Piece[]>([]);
  loading = signal(false);
  search  = signal('');

  constructor() {
    addIcons({ cubeOutline, searchOutline, alertCircleOutline, chevronForwardOutline });
  }

  ngOnInit(): void {
    this.loadPieces();
  }

  async loadPieces(search = ''): Promise<void> {
    if (!this.network.isOnline()) return;
    this.loading.set(true);
    try {
      const resp = await this.api.getPieces(search);
      this.pieces.set(resp.content);
    } finally {
      this.loading.set(false);
    }
  }

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.loadPieces(this.search());
    (event.target as HTMLIonRefresherElement).complete();
  }

  onSearch(event: Event): void {
    const val = (event.target as HTMLInputElement).value ?? '';
    this.search.set(val);
    this.loadPieces(val);
  }

  async openSortie(piece: Piece): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SortiePieceModal,
      componentProps: { piece },
      breakpoints: [0, 0.6],
      initialBreakpoint: 0.6,
    });
    await modal.present();
    const { role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      await this.loadPieces(this.search());
    }
  }
}
