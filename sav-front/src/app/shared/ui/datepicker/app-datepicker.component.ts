import {
  Component,
  Input,
  forwardRef,
  signal,
  computed,
  booleanAttribute,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [HlmDatePickerImports, HlmFieldImports],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppDatePickerComponent),
      multi: true,
    },
  ],
  template: `
    <hlm-field class="w-full">
      @if (label) {
        <label hlmFieldLabel [attr.for]="buttonId">{{ label }}</label>
      }
      <hlm-date-picker
        [buttonId]="buttonId"
        [disabled]="disabled"
        [max]="maxDate()"
        [date]="currentDate()"
        [formatDate]="formatDateFn"
        class="w-full"
        (dateChange)="onDateChange($event)"
      >
        <span class="text-muted-foreground">{{ placeholder }}</span>
      </hlm-date-picker>
    </hlm-field>
  `,
  styles: [':host { display: block; width: 100%; }'],
})
export class AppDatePickerComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Choisir une date';
  @Input() buttonId = `datepicker-${Math.random().toString(36).substring(2, 9)}`;
  @Input({ transform: booleanAttribute }) limitToToday = true;

  disabled = false;
  currentDate = signal<Date | undefined>(undefined);

  maxDate = computed<Date | undefined>(() =>
    this.limitToToday ? new Date() : undefined
  );

  readonly formatDateFn = (date: Date): string =>
    isValid(date) ? format(date, 'dd/MM/yyyy', { locale: fr }) : '';

  private _onChange: (val: string | null) => void = () => { /* placeholder */ };
  private _onTouched: () => void = () => { /* placeholder */ };

  onDateChange(date: Date | undefined): void {
    this.currentDate.set(date);
    this._onChange(date && isValid(date) ? format(date, 'yyyy-MM-dd') : null);
    this._onTouched();
  }

  writeValue(val: string | Date | null): void {
    if (!val) {
      this.currentDate.set(undefined);
      return;
    }
    const date = typeof val === 'string' ? parseISO(val) : val;
    this.currentDate.set(isValid(date) ? date : undefined);
  }

  registerOnChange(fn: (val: string | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
