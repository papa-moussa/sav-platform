import { Component, input, inject, forwardRef, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl, NgControl } from '@angular/forms';
import { NgxIntlTelInputModule, CountryISO, SearchCountryField, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxIntlTelInputModule, HlmLabelDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="flex flex-col gap-1 w-full">
      @if (label()) {
        <label hlmLabel [attr.for]="id()" class="font-medium text-[13px] text-slate-600 ml-1">{{ label() }}</label>
      }
      <div class="phone-input-wrapper">
        <ngx-intl-tel-input
          [cssClass]="'iti-inner-input'"
          [preferredCountries]="preferredCountries"
          [enableAutoCountrySelect]="true"
          [enablePlaceholder]="true"
          [searchCountryFlag]="true"
          [searchCountryField]="[SearchCountryField.Iso2, SearchCountryField.Name]"
          [selectFirstCountry]="false"
          [selectedCountryISO]="CountryISO.Senegal"
          [maxLength]="15"
          [phoneValidation]="true"
          [separateDialCode]="true"
          [id]="id()"
          [formControl]="internalControl"
          (focusout)="onTouched()"
        ></ngx-intl-tel-input>
      </div>
      
      @if (control()?.invalid && control()?.touched) {
        <span class="text-[12px] font-medium text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
          Format de numéro invalide.
        </span>
      }
    </div>
  `,
  styles: [`
    :host ::ng-deep .iti {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      width: 100% !important;
      height: 48px !important;
      padding: 4px !important;
      gap: 8px !important;
      background-color: #ffffff !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 14px !important;
      transition: all 0.2s ease !important;
    }
    
    :host ::ng-deep .iti:focus-within {
      border-color: #94a3b8 !important;
      box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.06) !important;
    }

    :host ::ng-deep .iti__flag-container {
      position: relative !important;
      align-items: center !important;
      height: 100% !important;
      flex-shrink: 0 !important;
      background-color: #f8fafc !important;
      border-radius: 10px !important;
      transition: all 0.2s ease !important;
    }

    :host ::ng-deep .iti__flag-container:hover {
      background-color: #f1f5f9 !important;
    }

    :host ::ng-deep .iti__selected-flag {
      background: transparent !important;
      padding: 0 10px 0 12px !important;
      height: 100% !important;
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
      border: none !important;
      outline: none !important;
    }

    :host ::ng-deep .iti__flag {
      border-radius: 3px !important;
      min-width: 20px !important;
      min-height: 14px !important;
      flex-shrink: 0 !important; /* Empêche le drapeau d'être écrasé/rétréci par Flexbox */
    }
    
    :host ::ng-deep .iti--separate-dial-code .iti__selected-dial-code {
      margin-left: 2px !important;
      font-weight: 600 !important;
      color: #334155 !important;
      font-size: 13px !important;
    }

    :host ::ng-deep .iti__arrow {
      border-top-color: #64748b !important;
      margin-left: 2px !important;
    }
    
    :host ::ng-deep .iti__arrow--up {
      border-bottom-color: #64748b !important;
    }

    :host ::ng-deep .iti__tel-input {
      flex: 1 !important;
      min-width: 0 !important;
      height: 100% !important;
      border: none !important;
      background: transparent !important;
      padding: 0 12px 0 4px !important; 
      font-size: 14px !important;
      color: #1e293b !important;
      font-weight: 500 !important;
      outline: none !important;
      box-shadow: none !important;
    }
    
    :host ::ng-deep .iti__tel-input:focus {
      border: none !important;
      box-shadow: none !important;
      outline: none !important;
    }

    :host ::ng-deep .iti__country-list {
      border-radius: 16px !important;
      border: 1px solid #f1f5f9 !important;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
      z-index: 1050 !important;
      max-width: 320px !important;
      max-height: 250px !important;
      overflow-y: auto !important;
      margin-top: 8px !important;
      padding: 8px 0 !important;
    }

    :host ::ng-deep .iti__country {
      padding: 10px 16px !important;
      outline: none !important;
    }

    :host ::ng-deep .iti__country:hover {
      background-color: #f8fafc !important;
    }
    
    :host ::ng-deep .iti__country.iti__highlight {
      background-color: #f1f5f9 !important;
    }
  `]
})
export class PhoneInputComponent implements ControlValueAccessor {
  label = input<string>('');
  id = input<string>(`phone-${Math.random().toString(36).substring(2, 9)}`);
  control = input<any>(null);

  internalControl = new FormControl();
  
  // ngx-intl-tel-input constants
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Senegal];

  onChange: (val: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.internalControl.valueChanges.subscribe(val => {
      // ngx-intl-tel-input returns an object with e164Number
      if (val && val.e164Number) {
        this.onChange(val.e164Number);
      } else {
        this.onChange(null);
      }
    });
  }

  writeValue(val: any): void {
    if (val) {
      this.internalControl.setValue(val, { emitEvent: false });
    } else {
      this.internalControl.setValue(null, { emitEvent: false });
    }
  }

  registerOnChange(fn: (val: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.internalControl.disable();
    } else {
      this.internalControl.enable();
    }
  }
}
