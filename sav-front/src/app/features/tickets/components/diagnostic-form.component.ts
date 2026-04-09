import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketWorkflowService } from '../../../core/services/ticket-workflow.service';

@Component({
  selector: 'app-diagnostic-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-blue-50/50 p-6 rounded-[24px] border border-blue-100 space-y-4 animate-in fade-in zoom-in-95 duration-300">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        </div>
        <div>
          <h3 class="text-[15px] font-bold text-slate-800">Évaluation Technique</h3>
          <p class="text-[12px] text-slate-500 font-medium tracking-tight">Veuillez renseigner le diagnostic pour démarrer</p>
        </div>
      </div>
      
      <textarea 
        [(ngModel)]="diagnosticValue"
        aria-label="Diagnostic de la panne"
        rows="3"
        class="w-full rounded-2xl border-slate-200 p-4 text-[14px] font-medium focus:ring-4 focus:ring-blue-100 transition-all resize-none outline-none border"
        placeholder="Décrivez précisément la panne..."
      ></textarea>

      <button (click)="submit()" 
        [disabled]="!diagnosticValue.trim() || loading"
        class="w-full h-12 rounded-xl bg-blue-600 text-white font-bold text-[13px] hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
        @if (loading) { <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> }
        Valider diagnostic et commencer réparation
      </button>
    </div>
  `
})
export class DiagnosticFormComponent {
  @Input() ticketId!: number;
  @Output() completed = new EventEmitter<void>();
  
  private workflow = inject(TicketWorkflowService);
  loading = false;
  diagnosticValue = '';

  submit() {
    if (!this.diagnosticValue.trim() || this.loading) return;
    this.loading = true;
    this.workflow.completeDiagnostic(this.ticketId, this.diagnosticValue).subscribe({
      next: () => {
        this.loading = false;
        this.completed.emit();
      },
      error: () => this.loading = false
    });
  }
}
