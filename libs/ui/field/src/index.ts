import { HlmFieldDirective } from './lib/hlm-field.directive';
import { HlmFieldLabelDirective } from './lib/hlm-field-label.directive';

export * from './lib/hlm-field.directive';
export * from './lib/hlm-field-label.directive';

export const HlmFieldImports = [HlmFieldDirective, HlmFieldLabelDirective] as const;
