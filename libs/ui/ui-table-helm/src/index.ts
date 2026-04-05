import { NgModule } from '@angular/core';
import { HlmTableDirective, HlmTheadDirective, HlmTbodyDirective, HlmTfootDirective, HlmTrowDirective, HlmThDirective, HlmTdDirective, HlmCaptionDirective } from './lib/hlm-table.directive';

export * from './lib/hlm-table.directive';

const all = [HlmTableDirective, HlmTheadDirective, HlmTbodyDirective, HlmTfootDirective, HlmTrowDirective, HlmThDirective, HlmTdDirective, HlmCaptionDirective];

@NgModule({ imports: all, exports: all })
export class HlmTableModule {}
