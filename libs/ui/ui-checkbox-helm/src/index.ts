import { NgModule } from '@angular/core';
import { HlmCheckboxDirective } from './lib/hlm-checkbox.directive';
export * from './lib/hlm-checkbox.directive';
@NgModule({ imports: [HlmCheckboxDirective], exports: [HlmCheckboxDirective] })
export class HlmCheckboxModule {}
