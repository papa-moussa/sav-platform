import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  providers: [provideIcons({ lucideSearch, lucideX })],
  template: `
    <div class="relative w-full group" [class]="wrapperClass">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
        <ng-icon name="lucideSearch" class="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors"></ng-icon>
      </div>
      <input
        [formControl]="searchControl"
        type="text"
        [placeholder]="placeholder"
        class="w-full h-12 pl-12 pr-12 bg-white border border-slate-200 rounded-[18px] text-[15px] font-medium text-slate-700 placeholder-slate-400 transition-all focus:border-primary focus:ring-8 focus:ring-primary/5 shadow-sm hover:border-slate-300"
      />
      @if (searchControl.value) {
        <button 
          type="button" 
          (click)="clear()"
          class="absolute inset-y-0 right-0 pr-4 flex items-center animate-in fade-in zoom-in duration-200"
        >
          <div class="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <ng-icon name="lucideX" class="w-4 h-4"></ng-icon>
          </div>
        </button>
      }
    </div>
  `
})
export class AppSearchComponent implements OnInit, OnDestroy {
  @Input() placeholder = 'Rechercher...';
  @Input() wrapperClass = '';
  @Input() set value(val: string) {
    if (this.searchControl.value !== val) {
      this.searchControl.setValue(val, { emitEvent: false });
    }
  }

  @Output() searchChange = new EventEmitter<string>();

  searchControl = new FormControl<string>('');
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.searchChange.emit(value || '');
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clear() {
    this.searchControl.setValue('');
  }
}
