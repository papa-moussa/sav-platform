import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketWorkflowService } from '../../../core/services/ticket-workflow.service';
import { ResultatIntervention } from '@sav/shared-models';

@Component({
  selector: 'app-finalization-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-slate-50 border-2 border-slate-900 p-8 rounded-[32px] space-y-6 animate-in fade-in zoom-in-95 shadow-xl shadow-slate-200">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div>
          <h3 class="text-lg font-extrabold text-slate-900 tracking-tight">Fin de l'intervention</h3>
          <p class="text-[12px] text-slate-500 font-bold uppercase tracking-widest">Synthèse finale & clôture</p>
        </div>
      </div>

      <div class="space-y-6">
        <div>
          <p class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 px-1">Résultat de l'opération</p>
          <div class="grid grid-cols-2 gap-4">
            <button type="button" 
                    (click)="result = 'REPARE'" 
                    [class]="result === 'REPARE' ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'"
                    class="h-14 rounded-2xl border-2 font-bold text-[13px] transition-all active:scale-[0.98]">
              Appareil Réparé
            </button>
            <button type="button" 
                    (click)="result = 'IRREPARABLE'" 
                    [class]="result === 'IRREPARABLE' ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-100' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'"
                    class="h-14 rounded-2xl border-2 font-bold text-[13px] transition-all active:scale-[0.98]">
              Non réparable
            </button>
          </div>
        </div>

        <div>
          <p class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 px-1">Observations techniques</p>
          <textarea 
            [(ngModel)]="obs" 
            aria-label="Observations finales" 
            class="w-full bg-white border-2 border-slate-100 rounded-2xl p-4 text-[14px] font-medium text-slate-800 h-28 resize-none outline-none focus:border-slate-900 transition-all placeholder:text-slate-300" 
            placeholder="Détaillez les pièces changées ou les conseils client..."></textarea>
        </div>
      </div>

      <button (click)="submit()" [disabled]="!result || loading" 
        class="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-[15px] hover:bg-slate-800 disabled:opacity-20 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200">
        @if (loading) { <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> }
        Confirmer et générer le QR Code
      </button>
    </div>
  `
})
export class FinalizationFormComponent {
  @Input() ticketId!: number;
  @Output() completed = new EventEmitter<void>();
  
  private workflow = inject(TicketWorkflowService);
  loading = false;
  result: ResultatIntervention | null = null;
  obs = '';

  submit() {
    if (!this.result || this.loading) return;
    this.loading = true;
    this.workflow.terminateIntervention(this.ticketId, this.result, this.obs).subscribe({
      next: () => {
        this.loading = false;
        this.completed.emit();
      },
      error: () => this.loading = false
    });
  }
}
