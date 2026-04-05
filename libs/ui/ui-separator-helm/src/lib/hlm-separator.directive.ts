import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmSeparator]',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmSeparatorDirective {
  private readonly _userCls = signal<ClassValue>('');
  @Input()
  set class(userCls: ClassValue) {
    this._userCls.set(userCls);
  }

  protected _computedClass = computed(() =>
    hlm('block h-px w-full bg-gray-200', this._userCls())
  );
}
