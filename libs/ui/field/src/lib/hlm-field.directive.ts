import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnField } from '@spartan-ng/brain/field';
import { ClassValue } from 'clsx';

@Directive({
	selector: 'hlm-field, [hlmField]',
	standalone: true,
	hostDirectives: [BrnField],
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmFieldDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('grid gap-1.5', this.userClass()));
}
