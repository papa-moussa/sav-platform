import { NgModule } from '@angular/core';
import { HlmCardDirective, HlmCardHeaderDirective, HlmCardTitleDirective, HlmCardDescriptionDirective, HlmCardContentDirective, HlmCardFooterDirective } from './lib/hlm-card.directive';

export * from './lib/hlm-card.directive';

const all = [HlmCardDirective, HlmCardHeaderDirective, HlmCardTitleDirective, HlmCardDescriptionDirective, HlmCardContentDirective, HlmCardFooterDirective];

@NgModule({ imports: all, exports: all })
export class HlmCardModule {}
