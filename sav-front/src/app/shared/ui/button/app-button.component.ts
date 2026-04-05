import { Component, input, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideLoader2 } from '@ng-icons/lucide';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, HlmButtonDirective, NgIconComponent],
  providers: [provideIcons({ lucideLoader2 })],
  template: `
    <button
      hlmBtn
      [variant]="variant()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="'rounded-xl transition-all active:scale-[0.98] ' + class()"
      [type]="type()"
      (click)="onClick($event)"
    >
      @if (loading()) {
        <ng-icon name="lucideLoader2" class="mr-2 h-4 w-4 animate-spin"></ng-icon>
      }
      <ng-content></ng-content>
    </button>
  `,
})
export class AppButtonComponent {
  variant = input<ButtonVariant>('default');
  size = input<ButtonSize>('default');
  loading = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  class = input('');
  type = input<'button' | 'submit' | 'reset'>('button');

  onClick(event: Event) {
    if (this.loading() || this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
