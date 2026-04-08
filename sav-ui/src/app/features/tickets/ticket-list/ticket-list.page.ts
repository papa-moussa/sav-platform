import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonModal,
  IonRadioGroup,
  IonRadio,
  IonSkeletonText,
  IonItem
} from '@ionic/angular/standalone';
import { TicketStore } from '../ticket.store';
import { TicketCardComponent } from '../../../shared/components/ticket-card/ticket-card.component';
import { OfflineBannerComponent } from '../../../shared/components/offline-banner/offline-banner.component';
import { TicketStatut, Ticket } from '@sav/shared-models';
import { addIcons } from 'ionicons';
import { 
  optionsOutline, 
  searchOutline, 
  chevronDownOutline, 
  ticketOutline,
  filterOutline, 
  callOutline, 
  playCircleOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonModal,
    IonRadioGroup,
    IonRadio,
    IonSkeletonText,
    IonItem,
    TicketCardComponent,
    OfflineBannerComponent,
  ],
  templateUrl: './ticket-list.page.html',
})
export class TicketListPage implements OnInit {
  readonly store  = inject(TicketStore);
  private router  = inject(Router);

  readonly filters: { label: string; value: TicketStatut | 'ALL' }[] = [
    { label: 'Tous',          value: 'ALL' },
    { label: 'Reçus',         value: 'RECU' },
    { label: 'Diagnostic',    value: 'EN_DIAGNOSTIC' },
    { label: 'Réparation',    value: 'EN_REPARATION' },
    { label: 'Attente pièces',value: 'EN_ATTENTE_PIECES' },
    { label: 'Réparés',       value: 'REPARE' },
  ];

  constructor() {
    addIcons({ 
      optionsOutline, 
      searchOutline, 
      chevronDownOutline, 
      ticketOutline,
      filterOutline, 
      callOutline, 
      playCircleOutline 
    });
  }

  ngOnInit(): void {
    this.store.loadTickets();
  }

  async handleRefresh(event: CustomEvent): Promise<void> {
    await this.store.loadTickets();
    (event.target as HTMLIonRefresherElement).complete();
  }

  onFilterChange(event: CustomEvent): void {
    this.store.filterStatut.set(event.detail.value as TicketStatut | 'ALL');
  }

  onSearch(event: Event): void {
    const customEvent = event as CustomEvent;
    if (customEvent.detail && customEvent.detail.value !== undefined) {
      // Pour une implémentation complète, store.filterSearch.set(customEvent.detail.value);
    }
  }

  callClient(): void {
    // Simulation call
  }

  startIntervention(ticket: Ticket): void {
    this.router.navigate(['/tabs/tickets', ticket.id]);
  }

  toggleFilter() {
    // Basic implementation for now as the original code was unclear about the 'MINE' filter
    const current = this.store.filterStatut();
    this.store.filterStatut.set(current === 'ALL' ? 'RECU' : 'ALL');
  }

  openTicket(ticket: Ticket): void {
    this.router.navigate(['/tabs/tickets', ticket.id]);
  }
}
