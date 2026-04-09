import { Component, inject, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TicketService } from '../../core/services/ticket.service';
import { TicketWorkflowService } from '../../core/services/ticket-workflow.service';
import { AuthService } from '../../core/auth/auth.service';
import { 
  Ticket, TicketStatut, STATUT_LABELS, STATUT_COLORS, 
  TYPE_APPAREIL_LABELS, ResultatIntervention, BlockingReason,
  QrCodeResponse
} from '../../core/models/ticket.model';

// Sub-components
import { DiagnosticFormComponent } from './components/diagnostic-form.component';
import { ActionListComponent } from './components/action-list.component';
import { FinalizationFormComponent } from './components/finalization-form.component';
import { TicketTimelineComponent } from './components/ticket-timeline.component';
import { BlockingModalComponent } from './components/blocking-modal.component';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  lucideX, lucideWrench, lucideHistory, lucideChevronRight, 
  lucideAlertCircle, lucideCheckCircle2, lucidePauseCircle,
  lucideQrCode, lucideDownload, lucideShare2, lucideChevronLeft
} from '@ng-icons/lucide';

@Component({
  selector: 'app-ticket-detail-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, 
    NgIconComponent,
    DiagnosticFormComponent, ActionListComponent, 
    FinalizationFormComponent, TicketTimelineComponent,
    BlockingModalComponent
  ],
  providers: [provideIcons({ 
    lucideX, lucideWrench, lucideHistory, lucideChevronRight, 
    lucideAlertCircle, lucideCheckCircle2, lucidePauseCircle,
    lucideQrCode, lucideDownload, lucideShare2, lucideChevronLeft
  })],
  templateUrl: './ticket-detail-dialog.component.html'
})
export class TicketDetailDialogComponent {
  private ticketService = inject(TicketService);
  private workflowService = inject(TicketWorkflowService);
  authService = inject(AuthService);

  // Utilisation d'un signal interne pour garantir la réactivité des computed
  ticketSignal = signal<Ticket | null>(null);

  @Input() set ticket(t: Ticket | null) {
    this.ticketSignal.set(t);
    if (t) {
      // Auto-switch to history if closed, or workflow if active
      this.activeTab.set(['TERMINE', 'CLOTURE'].includes(t.statut) ? 'history' : 'workflow');
      
      // Reset workflow view when ticket changes (e.g. fresh load or status change)
      this.workflowView.set('main');

      // If TERMINE, check for QR Code
      if (t.statut === 'TERMINE' && !this.qrCode()) {
        this.loadQrCode();
      }
    }
  }
  get ticket(): Ticket | null { return this.ticketSignal(); }

  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<Ticket>();

  activeTab = signal<'workflow' | 'history'>('workflow');
  workflowView = signal<'main' | 'finalizing'>('main');
  loading = signal(false);
  qrCode = signal<QrCodeResponse | null>(null);
  showBlockModal = signal(false);

  readonly labels = STATUT_LABELS;
  readonly colors = STATUT_COLORS;
  readonly types = TYPE_APPAREIL_LABELS;

  // Visibility Flags basés sur le signal pour mise à jour immédiate
  showDiagnosticForm = computed(() => this.ticketSignal()?.statut === 'EN_DIAGNOSTIC');
  showActionList = computed(() => this.ticketSignal()?.statut === 'EN_COURS');
  
  isBlocked = computed(() => !!this.ticketSignal()?.blockingReason);
  canStartDiagnostic = computed(() => this.ticketSignal()?.statut === 'RECU');
  
  showQrCodeSection = computed(() => 
    this.ticketSignal()?.statut === 'TERMINE' && !this.ticketSignal()?.feedbackSoumis
  );

  loadQrCode() {
    const t = this.ticketSignal();
    if (!t) return;
    this.ticketService.getQrCode(t.id).subscribe({
      next: (resp) => this.qrCode.set(resp),
      error: () => console.error('Erreur QR Code')
    });
  }

  onStartDiagnostic() {
    const t = this.ticketSignal();
    if (!t) return;
    this.loading.set(true);
    this.workflowService.startDiagnostic(t.id).subscribe({
      next: (updated) => {
        this.loading.set(false);
        this.updated.emit(updated);
      },
      error: () => this.loading.set(false)
    });
  }

  onWorkflowStepCompleted() {
    const t = this.ticketSignal();
    if (!t) return;
    // Refresh to get new history and status
    this.ticketService.getById(t.id).subscribe({
      next: (updated) => {
        this.updated.emit(updated);
        this.workflowView.set('main'); // Reset view on success
      }
    });
  }

  onResume() {
    const t = this.ticketSignal();
    if (!t) return;
    this.loading.set(true);
    this.workflowService.resumeTicket(t.id).subscribe({
      next: (updated) => {
        this.loading.set(false);
        this.updated.emit(updated);
      },
      error: () => this.loading.set(false)
    });
  }

  // Navigation interne au workflow EN_COURS
  onStartFinalizing() {
    this.workflowView.set('finalizing');
  }

  onCancelFinalizing() {
    this.workflowView.set('main');
  }

  onOpenBlockModal() {
    this.showBlockModal.set(true);
  }

  onBlockConfirmed(event: { reason: BlockingReason, observation?: string }) {
    const t = this.ticketSignal();
    if (!t) return;
    this.loading.set(true);
    this.workflowService.blockTicket(t.id, event.reason, event.observation).subscribe({
      next: (updated) => {
        this.loading.set(false);
        this.showBlockModal.set(false);
        this.updated.emit(updated);
      },
      error: () => {
        this.loading.set(false);
        this.showBlockModal.set(false);
      }
    });
  }

  onBlockCancelled() {
    this.showBlockModal.set(false);
  }

  downloadQr() {
    const t = this.ticketSignal();
    if (!this.qrCode() || !t) return;
    const link = document.createElement('a');
    link.href = 'data:image/png;base64,' + this.qrCode()?.base64Image;
    link.download = `QR_Feedback_${t.numero}.png`;
    link.click();
  }
}
