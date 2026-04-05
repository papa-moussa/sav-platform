import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({ selector: '[hlmCard]', standalone: true, host: { '[class]': '_computedClass()' } })
export class HlmCardDirective {
  private readonly _userCls = signal<ClassValue>('');
  @Input() set class(v: ClassValue) { this._userCls.set(v); }
  protected _computedClass = computed(() => hlm('bg-white rounded-xl border border-gray-200 shadow-sm', this._userCls()));
}

@Directive({ selector: '[hlmCardHeader]', standalone: true, host: { '[class]': '_computedClass()' } })
export class HlmCardHeaderDirective {
  private readonly _userCls = signal<ClassValue>('');
  @Input() set class(v: ClassValue) { this._userCls.set(v); }
  protected _computedClass = computed(() => hlm('flex flex-col space-y-1.5 p-6', this._userCls()));
}

@Directive({ selector: '[hlmCardTitle]', standalone: true, host: { '[class]': '_computedClass()' } })
export class HlmCardTitleDirective {
  private readonly _userCls = signal<ClassValue>('');
  @Input() set class(v: ClassValue) { this._userCls.set(v); }
  protected _computedClass = computed(() => hlm('text-base font-semibold text-gray-900', this._userCls()));
}

@Directive({ selector: '[hlmCardDescription]', standalone: true, host: { '[class]': '_computedClass()' } })
export class HlmCardDescriptionDirective {
  private readonly _userCls = signal<ClassValue>('');
  @Input() set class(v: ClassValue) { this._userCls.set(v); }
  protected _computedClass = computed(() => hlm('text-sm text-gray-500', this._userCls()));
}

@Directive({ selector: '[hlmCardContent]', standalone: true, host: { '[class]': '_computedClass()' } })
export class HlmCardContentDirective {
  private readonly _userCls = signal<ClassValue>('');
  @Input() set class(v: ClassValue) { this._userCls.set(v); }
  protected _computedClass = computed(() => hlm('p-6 pt-0', this._userCls()));
}

@Directive({ selector: '[hlmCardFooter]', standalone: true, host: { '[class]': '_computedClass()' } })
export class HlmCardFooterDirective {
  private readonly _userCls = signal<ClassValue>('');
  @Input() set class(v: ClassValue) { this._userCls.set(v); }
  protected _computedClass = computed(() => hlm('flex items-center p-6 pt-0', this._userCls()));
}
