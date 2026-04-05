import { Component, input, output, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrnDialogComponent, BrnDialogContentDirective } from '@spartan-ng/ui-dialog-brain';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, BrnDialogComponent, BrnDialogContentDirective, NgIconComponent],
  providers: [provideIcons({ lucideX })],
  template: `
    <brn-dialog [state]="isOpen() ? 'open' : 'closed'" (stateChanged)="onStateChange($event)">
      <ng-template brnDialogContent let-context>
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            class="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            [class]="class()"
          >
            <!-- Header -->
            <div class="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div>
                <h2 class="text-lg font-semibold text-foreground tracking-tight">{{ title() }}</h2>
                @if (description()) {
                  <p class="text-sm text-muted-foreground mt-0.5">{{ description() }}</p>
                }
              </div>
              @if (showCloseButton()) {
                <button 
                  (click)="closed.emit()"
                  class="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ng-icon name="lucideX" class="w-5 h-5"></ng-icon>
                </button>
              }
            </div>

            <!-- Content -->
            <div class="px-6 py-5 max-h-[70vh] overflow-y-auto">
              <ng-content></ng-content>
            </div>

            <!-- Footer -->
            @if (hasFooter()) {
              <div class="px-6 py-4 border-t border-border bg-muted/20 flex flex-col sm:flex-row justify-end gap-3">
                <ng-content select="[modal-footer]"></ng-content>
              </div>
            }
          </div>
        </div>
      </ng-template>
    </brn-dialog>
  `
})
export class AppModalComponent {
  title = input<string>('');
  description = input<string>('');
  isOpen = input(false, { transform: booleanAttribute });
  showCloseButton = input(true, { transform: booleanAttribute });
  hasFooter = input(true, { transform: booleanAttribute });
  class = input<string>('');

  closed = output<void>();

  onStateChange(state: 'open' | 'closed') {
    if (state === 'closed') {
      this.closed.emit();
    }
  }
}
