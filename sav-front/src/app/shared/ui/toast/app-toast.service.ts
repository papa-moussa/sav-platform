import { Injectable, signal, computed } from '@angular/core';

export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class AppToastService {
  private _toasts = signal<Toast[]>([]);
  toasts = computed(() => this._toasts());

  show(message: string, type: ToastType = 'info') {
    const id = Math.random().toString(36).substring(2, 9);
    this._toasts.update(t => [...t, { id, message, type }]);
    
    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }

  remove(id: string) {
    this._toasts.update(t => t.filter(x => x.id !== id));
  }
}
