import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmCheckbox]',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmCheckboxDirective {
  private readonly _userCls = signal<ClassValue>('');
  @Input()
  set class(userCls: ClassValue) {
    this._userCls.set(userCls);
  }

  protected _computedClass = computed(() =>
    hlm(
      'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
      this._userCls()
    )
  );
}
