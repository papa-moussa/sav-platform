import { Component, inject, OnInit, signal, computed } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSkeletonText,
  IonRefresher,
  IonRefresherContent,
  IonButtons,
  IonButton,
  IonIcon,
  ModalController,
  IonModal,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  cubeOutline, 
  searchOutline, 
  alertCircleOutline, 
  chevronForwardOutline,
  optionsOutline,
  filterOutline,
  checkmarkCircleOutline,
  alertOutline,
  barcodeOutline,
  businessOutline
} from 'ionicons/icons';
import { StockApiService } from '../../../core/services/stock-api.service';
import { NetworkService } from '../../../core/network/network.service';
import { OfflineBannerComponent } from '../../../shared/components/offline-banner/offline-banner.component';
import { Piece, CATEGORIE_LABELS, CategorieAppareil } from '@sav/shared-models';
import { SortiePieceModal } from '../sortie-piece/sortie-piece.modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonButton, IonIcon,
    IonSkeletonText, IonRefresher, IonRefresherContent,
    IonModal,
    OfflineBannerComponent,
  ],
  templateUrl: './stock-list.page.html',
})
export class StockListPage implements OnInit {
  private api       = inject(StockApiService);
  private network   = inject(NetworkService);
  private modalCtrl = inject(ModalController);

  readonly pieces  = signal<Piece[]>([]);
  readonly loading = signal(false);
  readonly search  = signal('');
  
  readonly filterLevel    = signal<'ALL' | 'CRITIQUE'>('ALL');
  readonly filterCategory = signal<CategorieAppareil | 'ALL'>('ALL');

  readonly CATEGORIE_LABELS = CATEGORIE_LABELS;
  readonly CATEGORIES = Object.keys(CATEGORIE_LABELS) as CategorieAppareil[];

  readonly filteredPieces = computed(() => {
    let list = this.pieces();
    
    // Filtre niveau
    if (this.filterLevel() === 'CRITIQUE') {
      list = list.filter(p => p.enAlerteStock);
    }

    // Filtre catégorie
    if (this.filterCategory() !== 'ALL') {
      list = list.filter(p => p.categorieAppareil === this.filterCategory());
    }

    return list;
  });

  constructor() {
    addIcons({ 
      cubeOutline, 
      searchOutline, 
      alertCircleOutline, 
      chevronForwardOutline,
      optionsOutline,
      filterOutline,
      checkmarkCircleOutline,
      alertOutline,
      barcodeOutline,
      businessOutline
    });
  }

  ngOnInit(): void {
    this.loadPieces();
  }

  async loadPieces(search = ''): Promise<void> {
    if (!this.network.isOnline()) {
      // Pour une vraie app hors-ligne, on lirait le cache ici.
      return;
    }
    this.loading.set(true);
    try {
      const resp = await this.api.getPieces(search);
      this.pieces.set(resp.content);
    } catch (err) {
      console.error('Erreur chargement stock', err);
    } finally {
      this.loading.set(false);
    }
  }

  async handleRefresh(event: any): Promise<void> {
    await this.loadPieces(this.search());
    event.target.complete();
  }

  onSearch(event: Event): void {
    const val = (event.target as HTMLInputElement).value ?? '';
    this.search.set(val);
    this.loadPieces(val);
  }

  setFilterLevel(level: 'ALL' | 'CRITIQUE') {
    this.filterLevel.set(level);
  }

  setFilterCategory(cat: CategorieAppareil | 'ALL') {
    this.filterCategory.set(cat);
  }

  async openSortie(piece: Piece): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SortiePieceModal,
      componentProps: { piece },
      breakpoints: [0, 0.65],
      initialBreakpoint: 0.65,
    });
    await modal.present();
    const { role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      await this.loadPieces(this.search());
    }
  }
}
