import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketWorkflowService } from '../../../core/services/ticket-workflow.service';
import { TicketAction } from '@sav/shared-models';

@Component({
  selector: 'app-action-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <h3 class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">Actions réalisées</h3>
      
      <div class="space-y-3">
        @for (action of actions; track action.id) {
          <div class="bg-white shadow-sm rounded-xl border border-slate-100 p-4 transition-all hover:border-slate-200">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[12px] font-bold text-slate-800">{{ action.technicienNom }}</span>
              <span class="text-[10px] font-medium text-slate-400">{{ action.createdAt | date:'short' }}</span>
            </div>
            <p class="text-[13px] text-slate-600 font-medium">{{ action.description }}</p>
          </div>
        } @empty {
          <p class="p-8 text-center text-slate-400 text-[13px] font-medium border-2 border-dashed border-slate-100 rounded-2xl">
            Aucune action spécifique enregistrée.
          </p>
        }
      </div>

      <!-- Add Action Inline -->
      @if (editable) {
        <div class="pt-4 mt-4 border-t border-slate-50">
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </div>
            <input 
              [(ngModel)]="newAction" 
              (keyup.enter)="submitAction()"
              [disabled]="loading"
              type="text" 
              placeholder="Décrire une action réalisée..."
              class="w-full h-12 pl-12 pr-12 bg-slate-50 border-transparent rounded-[14px] text-[13px] font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:ring-4 focus:ring-slate-800/5 transition-all outline-none border"
            />
            <button 
              (click)="submitAction()"
              [disabled]="!newAction.trim() || loading"
              class="absolute right-2 top-2 w-8 h-8 rounded-[10px] bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-all active:scale-90 disabled:opacity-0 disabled:scale-75 pointer-events-auto"
              aria-label="Ajouter l'action"
            >
              @if (loading) {
                <div class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              } @else {
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
              }
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class ActionListComponent {
  @Input() actions: TicketAction[] = [];
  @Input() editable = false;
  @Input() ticketId!: number;
  @Output() actionAdded = new EventEmitter<void>();

  private workflowService = inject(TicketWorkflowService);
  newAction = '';
  loading = false;

  submitAction() {
    if (!this.newAction.trim() || this.loading) return;
    
    this.loading = true;
    this.workflowService.addAction(this.ticketId, this.newAction).subscribe({
      next: () => {
        this.newAction = '';
        this.loading = false;
        this.actionAdded.emit();
      },
      error: () => this.loading = false
    });
  }
}
