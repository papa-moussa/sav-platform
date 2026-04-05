import { Component, forwardRef, signal, input, computed } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { format, parseISO, isValid } from 'date-fns';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [
    CommonModule,
    HlmDatePickerImports,
    HlmFieldImports
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppDateRangePickerComponent),
      multi: true,
    },
  ],
  template: `
    <hlm-field class="w-full">
      <hlm-date-range-picker
        [date]="currentRange()"
        (dateChange)="onRangeChange($event)"
        class="w-full"
      >
        Choisir une période
      </hlm-date-range-picker>
    </hlm-field>
  `,
  styles: [`
    :host { display: block; width: 100%; }
  `]
})
export class AppDateRangePickerComponent implements ControlValueAccessor {
  startDate = input<string | Date | null>(null);
  endDate = input<string | Date | null>(null);

  range = signal<[Date | undefined, Date | undefined]>([undefined, undefined]);

  currentRange = computed(() => {
    const s = this.startDate();
    const e = this.endDate();
    const r = this.range();
    
    const start = s ? (typeof s === 'string' ? parseISO(s) : s) : r[0];
    const end = e ? (typeof e === 'string' ? parseISO(e) : e) : r[1];
    
    return [isValid(start) ? start : undefined, isValid(end) ? end : undefined] as [Date | undefined, Date | undefined];
  });

  private _onChange: (val: { start: string, end: string } | null) => void = () => {
    // Default implementation
  };
  private _onTouched: () => void = () => {
    // Default implementation
  };

  onRangeChange(dates: [Date, Date] | null): void {
    if (dates && dates[0] && dates[1]) {
      this.range.set([dates[0], dates[1]]);
      this._onChange({
        start: format(dates[0], 'yyyy-MM-dd'),
        end: format(dates[1], 'yyyy-MM-dd')
      });
    } else {
      this.range.set([undefined, undefined]);
      this._onChange(null);
    }
    this._onTouched();
  }

  writeValue(val: { start: string, end: string } | null): void {
    if (val && val.start && val.end) {
      this.range.set([parseISO(val.start), parseISO(val.end)]);
    } else {
      this.range.set([undefined, undefined]);
    }
  }

  registerOnChange(fn: (val: { start: string, end: string } | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
}
