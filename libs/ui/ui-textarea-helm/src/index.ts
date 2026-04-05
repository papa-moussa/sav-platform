import { NgModule } from '@angular/core';
import { HlmTextareaDirective } from './lib/hlm-textarea.directive';
export * from './lib/hlm-textarea.directive';
@NgModule({ imports: [HlmTextareaDirective], exports: [HlmTextareaDirective] })
export class HlmTextareaModule {}
