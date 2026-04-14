import { Injectable, inject, signal, PLATFORM_ID, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../auth/auth.service';

export interface OnboardingSteps {
  site: boolean;
  technicien: boolean;
  ticket: boolean;
  stock: boolean;
}

export interface OnboardingState {
  wizardCompleted: boolean;
  dismissed: boolean;
  steps: OnboardingSteps;
  createdSiteId?: number;
  createdSiteName?: string;
  createdTechName?: string;
  createdTicketNumber?: string;
}

const DEFAULT_STATE: OnboardingState = {
  wizardCompleted: false,
  dismissed: false,
  steps: { site: false, technicien: false, ticket: false, stock: false },
};

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);

  private _state = signal<OnboardingState>(this.loadState());

  // Public computed selectors
  readonly state = computed(() => this._state());
  readonly steps = computed(() => this._state().steps);
  readonly wizardCompleted = computed(() => this._state().wizardCompleted);
  readonly dismissed = computed(() => this._state().dismissed);

  readonly completionCount = computed(() => {
    const s = this._state().steps;
    return [s.site, s.technicien, s.ticket, s.stock].filter(Boolean).length;
  });

  readonly isFullyActivated = computed(() => {
    const s = this._state().steps;
    return s.site && s.technicien && s.ticket && s.stock;
  });

  readonly progressPercent = computed(() => Math.round((this.completionCount() / 4) * 100));

  /** Should the wizard be shown? First login + wizard not done */
  needsOnboarding(): boolean {
    const state = this.loadState();
    return !state.wizardCompleted;
  }

  /** Mark the full wizard as done (shown the success screen) */
  completeWizard(): void {
    this.updateState({ wizardCompleted: true });
  }

  /** Dismiss the dashboard checklist */
  dismissChecklist(): void {
    this.updateState({ dismissed: true });
  }

  /** Mark individual step as done */
  markStep(step: keyof OnboardingSteps, extra?: Partial<OnboardingState>): void {
    const current = this._state();
    const updated: OnboardingState = {
      ...current,
      ...extra,
      steps: { ...current.steps, [step]: true },
    };
    this._state.set(updated);
    this.saveState(updated);
  }

  /** Get saved site id for use in subsequent steps */
  getCreatedSiteId(): number | undefined {
    return this._state().createdSiteId;
  }

  private storageKey(): string {
    const companyId = this.authService.getCompanyId();
    return `sav_onboarding_${companyId ?? 'default'}`;
  }

  private loadState(): OnboardingState {
    if (!isPlatformBrowser(this.platformId)) return { ...DEFAULT_STATE };
    try {
      const raw = localStorage.getItem(this.storageKey());
      if (raw) return JSON.parse(raw) as OnboardingState;
    } catch {}
    return { ...DEFAULT_STATE };
  }

  private updateState(partial: Partial<OnboardingState>): void {
    const updated = { ...this._state(), ...partial };
    this._state.set(updated);
    this.saveState(updated);
  }

  private saveState(state: OnboardingState): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.storageKey(), JSON.stringify(state));
      } catch {}
    }
  }
}
