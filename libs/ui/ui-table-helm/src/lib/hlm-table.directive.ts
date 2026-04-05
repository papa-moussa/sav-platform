import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({ selector: '[hlmTable]', standalone: true, host: { '[class]': '_computedClass()' } })
export class HlmTableDirective {
  private readonly _userCls = signal<ClassValue>('');
  @Input() set class(v: ClassValue) { this._userCls.set(v); }
  protected _computedClass = computed(() => hlm('w-full caption-bottom text-sm', this._userCls()));
}

@Directive({ selector: '[hlmThead]', standalone: true, host: { '[class]': '_computedClass()' } })
export class HlmTheadDirective {
  private readonly _userCls = signal<ClassValue>('');
  @Input() set class(v: ClassValue) { this._userCls.set(v); }
  protected _computedClass = computed(() => hlm('border-b border-gray-200 bg-gray-50', this._userCls()));
}

@Directive({ selector: '[hlmTbody]', standalone: true, host: { '[class]': '_computedClass()' } })
export class HlmTbodyDirective {
  private readonly _userCls = signal<ClassValue>('');
  @Input() set class(v: ClassValue) { this._userCls.set(v); }
  protected _computedClass = computed(() => hlm('divide-y divide-gray-100', this._userCls()));
}

@Directive({ selector: '[hlmTfoot]', standalone: true, host: { '[class]': '_computedClass()' } })
export class HlmTfootDirective {
  private readonly _userCls = signal<ClassValue>('');
  @Input() set class(v: ClassValue) { this._userCls.set(v); }
  protected _computedClass = computed(() => hlm('border-t border-gray-200 bg-gray-50 font-medium', this._userCls()));
}

@Directive({ selector: '[hlmTrow]', standalone: true, host: { '[class]': '_computedClass()' } })
export class HlmTrowDirective {
  private readonly _userCls = signal<ClassValue>('');
  @Input() set class(v: ClassValue) { this._userCls.set(v); }
  protected _computedClass = computed(() => hlm('transition-colors hover:bg-gray-50 data-[state=selected]:bg-blue-50', this._userCls()));
}

@Directive({ selector: '[hlmTh]', standalone: true, host: { '[class]': '_computedClass()' } })
export class HlmThDirective {
  private readonly _userCls = signal<ClassValue>('');
  @Input() set class(v: ClassValue) { this._userCls.set(v); }
  protected _computedClass = computed(() => hlm('px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide', this._userCls()));
}

@Directive({ selector: '[hlmTd]', standalone: true, host: { '[class]': '_computedClass()' } })
export class HlmTdDirective {
  private readonly _userCls = signal<ClassValue>('');
  @Input() set class(v: ClassValue) { this._userCls.set(v); }
  protected _computedClass = computed(() => hlm('px-4 py-3 text-sm text-gray-700', this._userCls()));
}

@Directive({ selector: '[hlmCaption]', standalone: true, host: { '[class]': '_computedClass()' } })
export class HlmCaptionDirective {
  private readonly _userCls = signal<ClassValue>('');
  @Input() set class(v: ClassValue) { this._userCls.set(v); }
  protected _computedClass = computed(() => hlm('mt-4 text-sm text-gray-500', this._userCls()));
}
