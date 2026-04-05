import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSearchComponent } from '../search/app-search.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSlidersHorizontal, lucideChevronDown, lucideChevronUp, lucideRotateCcw } from '@ng-icons/lucide';

export interface QuickFilter {
  label: string;
  value: unknown;
  icon?: string;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, AppSearchComponent, NgIconComponent],
  providers: [provideIcons({ lucideSlidersHorizontal, lucideChevronDown, lucideChevronUp, lucideRotateCcw })],
  template: `
    <div class="mb-6 space-y-3">
      <!-- Ligne principale : Recherche + Toggle -->
      <div class="flex items-center gap-3">
        @if (hasSearch) {
          <div class="flex-1 min-w-0">
            <app-search
              [placeholder]="searchPlaceholder"
              [value]="searchValue"
              (searchChange)="onSearchChange($event)"
              wrapperClass="w-full"
            ></app-search>
          </div>
        }

        @if (hasFilters) {
          <button 
            (click)="toggleAdvanced()"
            [class.bg-slate-900]="showAdvanced()"
            [class.text-white]="showAdvanced()"
            [class.border-slate-900]="showAdvanced()"
            class="h-12 px-5 flex items-center gap-2.5 bg-white border border-slate-200 rounded-[18px] text-[14px] font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm flex-shrink-0"
          >
            <ng-icon name="lucideSlidersHorizontal" class="w-4 h-4"></ng-icon>
            <span class="hidden sm:inline">Filtres</span>
            <ng-icon [name]="showAdvanced() ? 'lucideChevronUp' : 'lucideChevronDown'" class="w-3.5 h-3.5 opacity-60"></ng-icon>
          </button>
        }

        @if (hasReset) {
          <button 
            (click)="resetFilters.emit()"
            class="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-[18px] text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all shadow-sm flex-shrink-0"
            title="Réinitialiser"
          >
            <ng-icon name="lucideRotateCcw" class="w-4 h-4"></ng-icon>
          </button>
        }
      </div>

      <!-- Quick Filters (Chips) -->
      @if (quickFilters.length > 0) {
        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar animate-in fade-in slide-in-from-left-2 duration-300">
          <span class="text-[12px] font-bold text-slate-400 uppercase tracking-wider mr-1 whitespace-nowrap">Filtrer par :</span>
          @for (filter of quickFilters; track filter.value) {
            <button
              (click)="selectQuickFilter(filter.value)"
              class="px-4 py-1.5 rounded-full text-[13px] font-bold border-2 transition-all whitespace-nowrap"
              [ngClass]="activeQuickFilter === filter.value
                ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 scale-[1.05]'
                : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:text-slate-700'"
            >
              {{ filter.label }}
            </button>
          }
        </div>
      }

      <!-- Filtres avancés (Collapsible) -->
      @if (showAdvanced()) {
        <div class="bg-white border border-slate-100 rounded-[24px] p-6 shadow-xl shadow-slate-200/50 animate-in slide-in-from-top-4 duration-300 overflow-hidden">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ng-content></ng-content>
          </div>
        </div>
      }
    </div>
  `
})
export class AppFilterBarComponent {
  @Input() hasSearch = true;
  @Input() hasFilters = true;
  @Input() hasReset = true;
  @Input() searchPlaceholder = 'Rechercher...';
  @Input() searchValue = '';
  
  @Input() quickFilters: QuickFilter[] = [];
  @Input() activeQuickFilter: unknown = null;

  @Output() searchChange = new EventEmitter<string>();
  @Output() quickFilterChange = new EventEmitter<unknown>();
  @Output() resetFilters = new EventEmitter<void>();

  showAdvanced = signal(false);

  onSearchChange(val: string) {
    this.searchChange.emit(val);
  }

  toggleAdvanced() {
    this.showAdvanced.update(v => !v);
  }

  selectQuickFilter(val: unknown) {
    this.quickFilterChange.emit(val);
  }
}
