import { Directive } from '@angular/core';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Directive({
	selector: '[hlmFieldLabel]',
	standalone: true,
	hostDirectives: [HlmLabelDirective],
})
export class HlmFieldLabelDirective {}
