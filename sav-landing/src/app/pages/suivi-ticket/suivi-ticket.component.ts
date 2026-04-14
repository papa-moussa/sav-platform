import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-suivi-ticket',
  standalone: true,
  imports: [CommonModule, HttpClientModule, HeaderComponent, FooterComponent, RouterModule],
  template: `
    <app-header />
    <main class="min-h-screen bg-slate-50 pt-24 pb-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Chargement -->
        <div *ngIf="loading" class="flex flex-col items-center justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p class="mt-4 text-slate-600 font-medium">Récupération de votre dossier...</p>
        </div>

        <!-- Erreur -->
        <div *ngIf="error" class="bg-white p-8 rounded-2xl shadow-xl text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </div>
            <h2 class="text-2xl font-bold text-slate-900 mb-2">Ticket non trouvé</h2>
            <p class="text-slate-600 mb-6">Le lien utilisé semble invalide ou expiré.</p>
            <a routerLink="/" class="text-indigo-600 font-semibold hover:text-indigo-700">Retour à l'accueil</a>
        </div>

        <!-- Détails du Ticket -->
        <div *ngIf="ticket && !loading" class="space-y-6">
          
          <!-- En-tête -->
          <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span class="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Référence #{{ ticket.numero }}</span>
                <h1 class="text-2xl font-bold text-slate-900 mt-1">{{ ticket.marqueModele }}</h1>
                <p class="text-slate-500">{{ ticket.typeAppareil }}</p>
              </div>
              <div class="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl">
                 <div class="w-3 h-3 rounded-full" [ngClass]="getStatutColor()"></div>
                 <span class="font-bold text-slate-700">{{ ticket.statut }}</span>
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 class="text-lg font-bold text-slate-900 mb-8">Suivi de votre réparation</h3>
            <div class="relative">
              <!-- Ligne verticale -->
              <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100"></div>

              <div class="space-y-12">
                <div *ngFor="let step of steps" class="relative pl-12">
                   <!-- Cercle -->
                  <div class="absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center"
                       [ngClass]="step.completed ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'">
                    <svg *ngIf="step.completed" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                  </div>
                  <div>
                    <h4 class="font-bold" [ngClass]="step.completed ? 'text-slate-900' : 'text-slate-400'">{{ step.label }}</h4>
                    <p class="text-sm text-slate-500 mt-1">{{ step.description }}</p>
                    <p *ngIf="step.date && step.completed" class="text-xs text-slate-400 mt-1">{{ step.date }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Info SLA / Date prévue -->
          <div *ngIf="ticket.dueDate" class="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-start gap-4">
            <div class="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
                <h4 class="font-bold text-indigo-900">Date de disponibilité estimée</h4>
                <p class="text-indigo-700">Votre appareil devrait être prêt aux alentours du <span class="font-bold">{{ ticket.dueDate | date:'longDate':'':'fr' }}</span>.</p>
            </div>
          </div>

          <!-- Devis Section (Si applicable) -->
          <div *ngIf="ticket.statut === 'DEVIS_ENVOYE'" class="bg-amber-50 p-6 rounded-2xl border border-amber-200 shadow-sm ring-2 ring-amber-500 ring-opacity-20">
            <div class="flex items-center gap-3 mb-4">
                <div class="p-2 bg-amber-200 text-amber-700 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 class="text-lg font-bold text-amber-900">Devis à valider</h3>
            </div>
            <p class="text-amber-800 mb-6 font-medium">Le montant estimé pour la réparation est de <span class="text-xl font-black">{{ ticket.quoteAmount | number }} FCFA</span>.</p>
            <div class="flex gap-4">
                <button (click)="approveQuote()" class="flex-1 bg-amber-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-amber-700 transition shadow-lg shadow-amber-200">
                    Accepter le devis pour réparation
                </button>
            </div>
          </div>

        </div>
      </div>
    </main>
    <app-footer />
  `,
  styles: []
})
export class SuiviTicketComponent implements OnInit {
  activeRoute = inject(ActivatedRoute);
  http = inject(HttpClient);

  loading = true;
  error = false;
  ticket: any = null;

  steps: any[] = [];

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.fetchTicket(token);
      } else {
        this.loading = false;
        this.error = true;
      }
    });
  }

  fetchTicket(token: String) {
    this.http.get(`http://localhost:8080/api/public/tickets/track/${token}`)
      .subscribe({
        next: (data: any) => {
          this.ticket = data;
          this.buildSteps();
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = true;
          this.loading = false;
        }
      });
  }

  buildSteps() {
    const s = this.ticket.statut;
    const h = (type: string) => this.ticket.history?.find((x: any) => x.typeAction === type)?.timestamp;

    this.steps = [
      { 
        label: 'Appareil reçu', 
        description: 'Nous avons bien enregistré votre appareil sur notre site.',
        completed: true,
        date: this.ticket.createdAt
      },
      { 
        label: 'Diagnostic technique', 
        description: 'Nos experts analysent la panne.',
        completed: ['EN_DIAGNOSTIC', 'DEVIS_ENVOYE', 'EN_COURS', 'TERMINE', 'PRET_POUR_RECUPERATION', 'CLOTURE'].includes(s),
        date: h('CHANGE_STATUT')
      },
      { 
        label: 'Réparation en cours', 
        description: 'Intervention sur les composants de l\'appareil.',
        completed: ['EN_COURS', 'TERMINE', 'PRET_POUR_RECUPERATION', 'CLOTURE'].includes(s),
        date: h('DIAGNOSTIC')
      },
      { 
        label: 'Prêt pour retrait', 
        description: 'Votre appareil vous attend à l\'agence.',
        completed: ['PRET_POUR_RECUPERATION', 'CLOTURE'].includes(s),
        date: h('TERMINAISON')
      }
    ];
  }

  getStatutColor() {
     switch(this.ticket.statut) {
        case 'RECU': return 'bg-blue-400';
        case 'EN_DIAGNOSTIC': return 'bg-amber-400';
        case 'PRET_POUR_RECUPERATION': return 'bg-green-500';
        case 'TERMINE': return 'bg-indigo-500';
        default: return 'bg-slate-300';
     }
  }

  approveQuote() {
    // Appel API simulate
    alert('Devis accepté ! Nous lançons la réparation.');
    // Dans la réalité, on appellerait handleQuoteApproval sur le backend
  }
}
