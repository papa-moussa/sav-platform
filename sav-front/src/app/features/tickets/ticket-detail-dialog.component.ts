import { Component, inject, signal, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { TicketService } from '../../core/services/ticket.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/auth/auth.service';
import {
  Ticket, TicketStatut, ResultatIntervention, InterventionRequest,
  STATUT_LABELS, STATUT_COLORS, TYPE_APPAREIL_LABELS, TICKET_TRANSITIONS,
  QrCodeResponse,
} from '../../core/models/ticket.model';
import { User } from '../../core/models/user.model';

import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';

@Component({
  selector: 'app-ticket-detail-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    HlmBadgeDirective,
  ],
  templateUrl: './ticket-detail-dialog.component.html',
})
export class TicketDetailDialogComponent implements OnInit {
  @Input() ticket!: Ticket;
  @Input() viewMode: 'standard' | 'technical' = 'standard';
  @Output() updated = new EventEmitter<Ticket>();
  @Output() closed = new EventEmitter<void>();

  private ticketService = inject(TicketService);
  private userService = inject(UserService);
  authService = inject(AuthService);
  private fb = inject(FormBuilder);

  techniciens = signal<User[]>([]);
  activeTab = signal<'info' | 'interventions'>('info');
  savingStatut = signal(false);
  savingAssign = signal(false);
  savingIntervention = signal(false);
  error = signal<string | null>(null);
  successMsg = signal<string | null>(null);

  // ─── Statut Confirmation UX ──────────────────────────────────────────────
  statusConfirmState = signal<{status: TicketStatut | null, confirm: boolean}>({status: null, confirm: false});
  private transitionTimeout: ReturnType<typeof setTimeout> | undefined;

  // ─── QR Code ──────────────────────────────────────────────────────────────
  qrCode = signal<QrCodeResponse | null>(null);
  loadingQr = signal(false);

  readonly statutLabels = STATUT_LABELS;
  readonly statutColors = STATUT_COLORS;
  readonly typeLabels = TYPE_APPAREIL_LABELS;

  interventionForm = this.fb.group({
    diagnostic: ['', Validators.required],
    actionsRealisees: ['', Validators.required],
    observations: [''],
    tempsPasseHeures: [null as number | null],
    resultat: ['EN_COURS' as ResultatIntervention, Validators.required],
  });

  selectedStatut = signal<TicketStatut | null>(null);
  selectedTechnicienId = signal<number | null>(null);

  get allowedTransitions(): TicketStatut[] {
    return TICKET_TRANSITIONS[this.ticket.statut] ?? [];
  }

  get canChangeStatut(): boolean {
    const r = this.authService.currentRole();
    return r === 'ADMIN' || r === 'TECHNICIEN' || r === 'RECEPTIONNISTE';
  }

  get canAssign(): boolean {
    const r = this.authService.currentRole();
    return r === 'ADMIN' || r === 'RECEPTIONNISTE';
  }

  get canAddIntervention(): boolean {
    const r = this.authService.currentRole();
    return r === 'ADMIN' || r === 'TECHNICIEN';
  }

  ngOnInit(): void {
    if (this.viewMode === 'technical') {
      this.activeTab.set('interventions');
    }

    if (this.canAssign) {
      this.userService.getAll('', 0, 200).subscribe({
        next: (resp) => this.techniciens.set(resp.content.filter(x => x.role === 'TECHNICIEN' && x.actif)),
      });
    }
    this.selectedTechnicienId.set(this.ticket.technicienId);

    // Chargement automatique du QR Code si le ticket attend un feedback
    if (this.ticket.statut === 'EN_ATTENTE_FEEDBACK' && !this.ticket.feedbackSoumis) {
      this.loadQrCode();
    }
  }

  setTab(tab: 'info' | 'interventions'): void {
    this.activeTab.set(tab);
    this.error.set(null);
    this.successMsg.set(null);
  }

  requestStatusConfirm(nouveauStatut: TicketStatut): void {
    if (this.statusConfirmState().status === nouveauStatut && this.statusConfirmState().confirm) {
      this.executeChangeStatut(nouveauStatut);
    } else {
      this.statusConfirmState.set({ status: nouveauStatut, confirm: true });
      clearTimeout(this.transitionTimeout);
      this.transitionTimeout = setTimeout(() => {
        this.statusConfirmState.set({ status: null, confirm: false });
      }, 3000);
    }
  }

  private executeChangeStatut(newStatut: TicketStatut): void {
    this.savingStatut.set(true);
    this.error.set(null);
    this.statusConfirmState.set({ status: null, confirm: false });

    this.ticketService.changeStatut(this.ticket.id, newStatut).subscribe({
      next: (t) => {
        this.savingStatut.set(false);
        this.successMsg.set(`Statut mis à jour : ${this.statutLabels[newStatut]}`);
        this.updated.emit({ ...this.ticket, statut: t.statut, updatedAt: t.updatedAt });
        this.ticket = { ...this.ticket, statut: t.statut };
        // Reset success msg after a while
        setTimeout(() => this.successMsg.set(null), 5000);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Échec du changement de statut.');
        this.savingStatut.set(false);
      },
    });
  }

  assignTechnicien(): void {
    const id = this.selectedTechnicienId();
    if (!id) return;
    this.savingAssign.set(true);
    this.error.set(null);
    this.ticketService.assigner(this.ticket.id, { technicienId: id }).subscribe({
      next: (t) => {
        this.savingAssign.set(false);
        this.successMsg.set('Technicien assigné.');
        this.updated.emit({ ...this.ticket, technicienId: t.technicienId, technicienNom: t.technicienNom });
        this.ticket = { ...this.ticket, technicienId: t.technicienId, technicienNom: t.technicienNom };
      },
      error: () => { this.error.set('Erreur lors de l\'assignation.'); this.savingAssign.set(false); },
    });
  }

  addIntervention(): void {
    if (this.interventionForm.invalid) { this.error.set('Remplissez les champs obligatoires.'); return; }
    const v = this.interventionForm.value;
    const request: InterventionRequest = {
      diagnostic: v.diagnostic ?? '',
      actionsRealisees: v.actionsRealisees ?? '',
      observations: v.observations || undefined,
      tempsPasseHeures: v.tempsPasseHeures ?? undefined,
      resultat: (v.resultat as ResultatIntervention) || 'EN_COURS',
    };
    this.savingIntervention.set(true);
    this.error.set(null);
    this.ticketService.addIntervention(this.ticket.id, request).subscribe({
      next: (interv) => {
        this.savingIntervention.set(false);
        this.successMsg.set('Intervention enregistrée.');
        this.interventionForm.reset({ resultat: 'EN_COURS' });
        const updatedTicket = { ...this.ticket, interventions: [...this.ticket.interventions, interv] };
        this.ticket = updatedTicket;
        this.updated.emit(updatedTicket);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Erreur lors de l\'enregistrement.');
        this.savingIntervention.set(false);
      },
    });
  }

  loadQrCode(): void {
    this.loadingQr.set(true);
    this.ticketService.getQrCode(this.ticket.id).subscribe({
      next: (qr) => { this.qrCode.set(qr); this.loadingQr.set(false); },
      error: () => { this.error.set('Erreur lors du chargement du QR Code.'); this.loadingQr.set(false); },
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  formatDateTime(date: string): string {
    return new Date(date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
