import { Component, input, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, HlmInputDirective, HlmLabelDirective, ReactiveFormsModule, FormsModule, NgIconComponent],
  template: `
    <div class="flex flex-col gap-1 w-full" [class]="class()">
      @if (label()) {
        <label hlmLabel [attr.for]="id()" class="font-medium text-[13px] text-slate-600 ml-1">{{ label() }}</label>
      }
      <div class="relative group">
        @if (icon()) {
          <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors flex items-center justify-center">
            <ng-icon
              [name]="icon()!"
              class="w-4 h-4"
            ></ng-icon>
          </div>
        }
        <input
          hlmInput
          #inputElement
          [id]="id()"
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="disabled"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [class.pl-[38px]]="icon()"
          [class.pr-10]="type() === 'password' || suffixIcon()"
          class="w-full h-11 px-4 rounded-xl transition-all focus:ring-2 focus:ring-primary/20 text-[14px] text-slate-800 border-slate-200 focus:border-primary/30"
        />
        @if (suffixIcon() && type() !== 'password') {
           <div class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center justify-center">
             <ng-icon [name]="suffixIcon()!" class="w-4 h-4"></ng-icon>
           </div>
        }
      </div>
      <!-- Handle reactive form errors if passed -->
      @if (ngControl?.invalid && ngControl?.touched) {
        <span class="text-[12px] font-medium text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
          @if (errorMessage()) {
            {{ errorMessage() }}
          } @else {
            Ce champ est invalide.
          }
        </span>
      } @else if (hint()) {
        <span class="text-[12px] text-slate-500 mt-1 ml-1">{{ hint() }}</span>
      }
    </div>
  `
})
export class AppInputComponent implements ControlValueAccessor, AfterViewInit {
  label = input<string>('');
  id = input<string>(`input-${Math.random().toString(36).substring(2, 9)}`);
  type = input<string>('text');
  placeholder = input<string>('');
  class = input<string>('');
  icon = input<string | null>(null);
  suffixIcon = input<string | null>(null);
  
  hint = input<string>('');
  errorMessage = input<string>('');
 
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;
 
  value: string | number = '';
  disabled = false;
 
  onChange: (val: any) => void = () => {};
  onTouched: () => void = () => {};
 
  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
 
  constructor() {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }
 
  ngAfterViewInit() {
    this.updateNativeValue(this.value);
  }
 
  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }
 
  writeValue(val: any): void {
    this.value = val;
    this.updateNativeValue(val);
  }
 
  private updateNativeValue(val: any) {
    if (this.inputElement?.nativeElement) {
      this.inputElement.nativeElement.value = val == null ? '' : val;
    }
  }
 
  registerOnChange(fn: (val: any) => void): void {
    this.onChange = fn;
  }
 
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
 
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
