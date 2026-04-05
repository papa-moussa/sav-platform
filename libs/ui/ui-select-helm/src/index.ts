import { NgModule } from '@angular/core';
import { HlmSelectDirective } from './lib/hlm-select.directive';
export * from './lib/hlm-select.directive';
@NgModule({ imports: [HlmSelectDirective], exports: [HlmSelectDirective] })
export class HlmSelectModule {}
