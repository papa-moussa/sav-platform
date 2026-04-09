import { Component, inject, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { CommonModule, DatePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { 
  homeOutline, 
  scanOutline, 
  statsChartOutline, 
  notificationsOutline,
  constructOutline,
  cubeOutline,
  personOutline,
  syncOutline,
  chevronForwardOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  timeOutline,
  hammerOutline,
  flashOutline,
  playCircleOutline
} from 'ionicons/icons';
import { AuthService } from '../../core/auth/auth.service';
import { TicketStore } from '../tickets/ticket.store';
import { SyncService } from '../../core/services/sync.service';
import { NetworkService } from '../../core/network/network.service';
import { OfflineBannerComponent } from '../../shared/components/offline-banner/offline-banner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    OfflineBannerComponent
  ],
  providers: [DatePipe],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage implements OnInit {
  readonly auth        = inject(AuthService);
  readonly store       = inject(TicketStore);
  readonly syncService = inject(SyncService);
  readonly network     = inject(NetworkService);
  router               = inject(Router);

  // Stats computed from the store
  readonly activeIntervention = computed(() => 
    this.store.tickets().find(t => t.statut === 'EN_COURS')
  );

  readonly stats = computed(() => {
    const all = this.store.tickets();
    return {
      todo: all.filter(t => t.statut === 'RECU').length,
      diag: all.filter(t => t.statut === 'EN_DIAGNOSTIC').length,
      done: all.filter(t => t.statut === 'TERMINE' || t.statut === 'CLOTURE').length,
      urgent: all.filter(t => t.statut === 'RECU' && t.sousGarantie).length // Simplified urgency
    };
  });

  constructor() {
    addIcons({
      homeOutline,
      scanOutline,
      statsChartOutline,
      notificationsOutline,
      constructOutline,
      cubeOutline,
      personOutline,
      syncOutline,
      chevronForwardOutline,
      alertCircleOutline,
      checkmarkCircleOutline,
      timeOutline,
      hammerOutline,
      flashOutline,
      playCircleOutline
    });
  }

  ngOnInit() {
    this.store.loadTickets();
  }

  async handleRefresh(event: any) {
    await this.store.loadTickets();
    event.target.complete();
  }

  goToTicket(id: number) {
    this.router.navigate(['/tabs/tickets', id]);
  }

  goToScan() {
    // Placeholder for scanning logic
    console.log('Open Scanner');
  }

  goToStock() {
    this.router.navigate(['/tabs/stock']);
  }
}
