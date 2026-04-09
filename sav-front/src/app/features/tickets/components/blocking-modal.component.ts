import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BlockingReason } from '../../../core/models/ticket.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucidePauseCircle, lucideX, lucideAlertTriangle } from '@ng-icons/lucide';

@Component({
  selector: 'app-blocking-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  providers: [provideIcons({ lucidePauseCircle, lucideX, lucideAlertTriangle })],
  template: `
    <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div class="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-orange-50/50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <ng-icon name="lucidePauseCircle" size="20"></ng-icon>
            </div>
            <div>
              <h3 class="font-bold text-slate-900 leading-none">Suspendre l'intervention</h3>
              <p class="text-[11px] text-slate-500 font-medium mt-1">L'intervention passera en état bloqué</p>
            </div>
          </div>
          <button (click)="onCancel()" class="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <ng-icon name="lucideX" size="18"></ng-icon>
          </button>
        </div>

        <form [formGroup]="blockForm" (ngSubmit)="onSubmit()" class="p-6 space-y-6">
          <!-- Raison -->
          <div class="space-y-3">
            <h4 class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-1">Raison du blocage</h4>
            <div class="grid grid-cols-1 gap-2">
              @for (reason of reasons; track reason.id) {
                <label class="relative flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer group"
                  [attr.for]="'reason-' + reason.id"
                  [ngClass]="blockForm.get('reason')?.value === reason.id 
                    ? 'border-orange-500 bg-orange-50/50' 
                    : 'border-slate-100 hover:border-slate-200 bg-white'">
                  <input type="radio" [id]="'reason-' + reason.id" formControlName="reason" [value]="reason.id" class="sr-only">
                  <div class="flex-1">
                    <p class="font-bold text-[13px]" [class.text-orange-900]="blockForm.get('reason')?.value === reason.id" [class.text-slate-700]="blockForm.get('reason')?.value !== reason.id">
                      {{ reason.label }}
                    </p>
                    <p class="text-[11px] text-slate-500 font-medium">{{ reason.desc }}</p>
                  </div>
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    [ngClass]="blockForm.get('reason')?.value === reason.id 
                      ? 'border-orange-500 bg-orange-500 text-white' 
                      : 'border-slate-200 group-hover:border-slate-300'">
                    @if (blockForm.get('reason')?.value === reason.id) {
                      <div class="w-2 h-2 rounded-full bg-white"></div>
                    }
                  </div>
                </label>
              }
            </div>
          </div>

          <!-- Observations -->
          <div class="space-y-2">
            <label for="obs-input" class="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-1">Observations détaillées</label>
            <textarea 
              id="obs-input"
              formControlName="observation"
              placeholder="Ex: En attente de la pièce X commandée le JJ/MM..."
              rows="3"
              class="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-orange-500 focus:ring-0 text-[13px] font-medium transition-all resize-none placeholder:text-slate-300"
            ></textarea>
          </div>

          <!-- Alert -->
          <div class="flex items-start gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100 text-orange-800">
            <ng-icon name="lucideAlertTriangle" size="14" class="mt-0.5"></ng-icon>
            <p class="text-[11px] font-medium leading-relaxed">
              Le ticket restera dans votre file d'attente mais sera marqué comme suspendu dans les rapports.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-2">
            <button type="button" (click)="onCancel()" 
              class="flex-1 h-12 rounded-xl border border-slate-200 text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-all">
              Annuler
            </button>
            <button type="submit" [disabled]="blockForm.invalid"
              class="flex-1 h-12 rounded-xl bg-orange-600 text-white font-bold text-[13px] hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 disabled:opacity-50">
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class BlockingModalComponent {
  @Output() confirmed = new EventEmitter<{ reason: BlockingReason, observation?: string }>();
  @Output() cancelled = new EventEmitter<void>();

  reasons = [
    { id: 'PIECES' as BlockingReason, label: 'Pièces de rechange', desc: 'En attente de disponibilité des pièces' },
    { id: 'CLIENT' as BlockingReason, label: 'Client absent / Indisponible', desc: 'Le client ne peut pas recevoir le tech' },
    { id: 'AUTRE' as BlockingReason, label: 'Autre raison', desc: 'Précisez dans les observations' }
  ];

  blockForm = new FormBuilder().group({
    reason: ['PIECES' as BlockingReason, Validators.required],
    observation: ['']
  });

  onCancel() {
    this.cancelled.emit();
  }

  onSubmit() {
    if (this.blockForm.valid) {
      this.confirmed.emit(this.blockForm.value as any);
    }
  }
}
