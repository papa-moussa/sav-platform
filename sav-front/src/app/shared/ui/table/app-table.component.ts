import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HlmTableDirective,
  HlmTrowDirective,
  HlmThDirective,
  HlmTdDirective,
  HlmCaptionDirective,
} from '@spartan-ng/ui-table-helm';

export interface TableColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, HlmTableDirective, HlmTrowDirective, HlmThDirective, HlmTdDirective, HlmCaptionDirective],
  template: `
    <div class="rounded-md border border-border bg-card overflow-hidden">
      <table hlmTable class="w-full">
        @if (caption()) {
          <caption hlmCaption class="p-4 font-semibold text-left text-lg">{{ caption() }}</caption>
        }
        <thead>
          <tr hlmTrow class="bg-muted/30">
            @for (col of columns(); track col.key) {
              <th hlmTh class="font-semibold text-foreground">{{ col.label }}</th>
            }
            <!-- Slot pour des actions éventuelles -->
            @if (hasActions()) {
              <th hlmTh class="text-right">Actions</th>
            }
          </tr>
        </thead>
        
        <tbody>
          @for (row of data(); track $index) {
            <tr hlmTrow class="hover:bg-muted/50 transition-colors group cursor-pointer" (click)="onRowClick(row)">
              @for (col of columns(); track col.key) {
                <td hlmTd>
                  {{ row[col.key] }}
                </td>
              }
              @if (hasActions()) {
                <td hlmTd class="text-right">
                  <ng-container *ngTemplateOutlet="actionsTpl; context: { $implicit: row }"></ng-container>
                </td>
              }
            </tr>
          } @empty {
            <tr hlmTrow>
              <td hlmTd [attr.colspan]="hasActions() ? columns().length + 1 : columns().length" class="h-24 text-center pb-6 text-muted-foreground">
                <div class="flex flex-col items-center justify-center min-h-[200px]">
                  <span class="text-lg">Aucune donnée disponible.</span>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class AppTableComponent {
  data = input<any[]>([]);
  columns = input<TableColumn[]>([]);
  caption = input<string>('');
  
  hasActions = input<boolean>(false);
  actionsTpl: any; // Ideally an input<TemplateRef<any>> once we implement custom slots

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRowClick(row: any) {
    // optional event emitter
  }
}
