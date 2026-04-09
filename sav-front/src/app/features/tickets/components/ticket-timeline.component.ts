import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketHistory } from '@sav/shared-models';

@Component({
  selector: 'app-ticket-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
      @for (event of history; track event.id) {
        <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
          <!-- Icon -->
          <div class="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            @switch (event.typeAction) {
              @case ('CHANGE_STATUT') {
                <svg class="text-slate-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              }
              @case ('AJOUT_ACTION') {
                <svg class="text-blue-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
              }
              @case ('BLOCAGE') {
                <svg class="text-red-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              }
              @case ('REPRISE') {
                <svg class="text-emerald-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m5 3 14 9-14 9V3z"/></svg>
              }
            }
          </div>
          <!-- Content -->
          <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md">
            <div class="flex items-center justify-between space-x-2 mb-1">
              <div class="font-bold text-slate-900">{{ event.utilisateurNom }}</div>
              <time class="font-mono text-[10px] font-bold text-slate-400">{{ event.timestamp | date:'shortTime' }}</time>
            </div>
            <div class="text-[13px] text-slate-600 font-medium leading-relaxed">{{ event.details }}</div>
            <div class="mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">{{ event.timestamp | date:'dd MMM yyyy' }}</div>
          </div>
        </div>
      }
    </div>
  `
})
export class TicketTimelineComponent {
  @Input() history: TicketHistory[] = [];
}
