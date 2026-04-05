import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppButtonComponent } from '../button/app-button.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, AppButtonComponent],
  template: `
    @if (totalPages() > 0) {
      <div class="flex items-center justify-between px-1 py-3">
        <span class="text-sm text-muted-foreground">
          {{ startItem() }}–{{ endItem() }} sur {{ totalElements() }} résultats
        </span>
        <div class="flex items-center gap-2">
          <app-button
            variant="outline"
            size="sm"
            [disabled]="page() === 0"
            (click)="prev()"
          >
            Précédent
          </app-button>
          <span class="text-sm text-muted-foreground min-w-[80px] text-center">
            Page {{ page() + 1 }} / {{ totalPages() }}
          </span>
          <app-button
            variant="outline"
            size="sm"
            [disabled]="page() >= totalPages() - 1"
            (click)="next()"
          >
            Suivant
          </app-button>
        </div>
      </div>
    }
  `,
})
export class AppPaginationComponent {
  page = input.required<number>();
  totalPages = input.required<number>();
  totalElements = input.required<number>();
  size = input(20);

  pageChange = output<number>();

  startItem = computed(() => this.totalElements() === 0 ? 0 : this.page() * this.size() + 1);
  endItem = computed(() => Math.min((this.page() + 1) * this.size(), this.totalElements()));

  prev(): void {
    if (this.page() > 0) {
      this.pageChange.emit(this.page() - 1);
    }
  }

  next(): void {
    if (this.page() < this.totalPages() - 1) {
      this.pageChange.emit(this.page() + 1);
    }
  }
}
