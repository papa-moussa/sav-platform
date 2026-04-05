import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppToastService } from './app-toast.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideCheckCircle, lucideAlertCircle, lucideInfo, lucideXCircle, lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ lucideCheckCircle, lucideAlertCircle, lucideInfo, lucideXCircle, lucideX })],
  template: `
    <div class="fixed bottom-0 right-0 z-[100] p-4 md:p-6 flex flex-col gap-3 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="flex items-center gap-3 p-4 rounded-lg bg-card border border-border shadow-xl min-w-[300px] pointer-events-auto animate-in slide-in-from-right-full duration-300 transform transition-all"
          [ngClass]="{
            'border-l-4 border-l-success': toast.type === 'success',
            'border-l-4 border-l-danger': toast.type === 'danger',
            'border-l-4 border-l-warning': toast.type === 'warning',
            'border-l-4 border-l-primary': toast.type === 'info'
          }"
        >
          <div class="w-8 h-8 rounded-full flex items-center justify-center"
               [ngClass]="{
                 'bg-success/10 text-success': toast.type === 'success',
                 'bg-danger/10 text-destructive': toast.type === 'danger',
                 'bg-warning/10 text-warning': toast.type === 'warning',
                 'bg-primary/10 text-primary': toast.type === 'info'
               }">
            @if (toast.type === 'success') { <ng-icon name="lucideCheckCircle"></ng-icon> }
            @if (toast.type === 'danger') { <ng-icon name="lucideXCircle"></ng-icon> }
            @if (toast.type === 'warning') { <ng-icon name="lucideAlertCircle"></ng-icon> }
            @if (toast.type === 'info') { <ng-icon name="lucideInfo"></ng-icon> }
          </div>
          
          <div class="flex-1">
            <p class="text-sm font-medium text-foreground">{{ toast.message }}</p>
          </div>

          <button 
            (click)="toastService.remove(toast.id)"
            class="p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors outline-none"
          >
            <ng-icon name="lucideX"></ng-icon>
          </button>
        </div>
      }
    </div>
  `
})
export class AppToastComponent {
  toastService = inject(AppToastService);
}
