import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  HlmCardDirective, 
  HlmCardHeaderDirective, 
  HlmCardTitleDirective, 
  HlmCardDescriptionDirective, 
  HlmCardContentDirective, 
  HlmCardFooterDirective 
} from '@spartan-ng/ui-card-helm';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule, 
    HlmCardDirective, 
    HlmCardHeaderDirective, 
    HlmCardTitleDirective, 
    HlmCardDescriptionDirective, 
    HlmCardContentDirective, 
    HlmCardFooterDirective
  ],
  template: `
    <div hlmCard [class]="'bg-white rounded-[20px] shadow-sm border border-slate-100 overflow-hidden w-full ' + class()">
      @if (title() || description() || withHeaderTpl()) {
        <div hlmCardHeader class="px-6 pt-6 pb-4">
          @if (title()) {
            <h3 hlmCardTitle class="text-lg font-bold text-slate-800 tracking-tight">{{ title() }}</h3>
          }
          @if (description()) {
            <p hlmCardDescription class="text-sm text-slate-500">{{ description() }}</p>
          }
          <ng-content select="[card-header]"></ng-content>
        </div>
      }
      
      <div hlmCardContent class="px-6 pb-6">
        <ng-content></ng-content>
      </div>

      @if (withFooter()) {
        <div hlmCardFooter class="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
          <ng-content select="[card-footer]"></ng-content>
        </div>
      }
    </div>
  `
})
export class AppCardComponent {
  title = input<string>('');
  description = input<string>('');
  class = input<string>('');
  withFooter = input<boolean>(false);
  withHeaderTpl = input<boolean>(false);
}
