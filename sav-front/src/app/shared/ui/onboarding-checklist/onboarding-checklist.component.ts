import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OnboardingService } from '../../../core/services/onboarding.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideCheck, lucideBuilding2, lucideWrench,
  lucideTicket, lucidePackage, lucideRocket, lucideX
} from '@ng-icons/lucide';

@Component({
  selector: 'app-onboarding-checklist',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent],
  providers: [provideIcons({ lucideCheck, lucideBuilding2, lucideWrench, lucideTicket, lucidePackage, lucideRocket, lucideX })],
  template: `
    @if (visible()) {
      <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">

        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <ng-icon name="lucideRocket" class="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-800">Bien démarrer avec votre SAV</h3>
              <p class="text-xs text-slate-400">{{ onboarding.progressPercent() }}% complété</p>
            </div>
          </div>
          <button (click)="dismiss()"
                  class="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                  title="Masquer">
            <ng-icon name="lucideX" class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Progress bar -->
        <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-700 ease-out"
               [class.bg-primary]="!onboarding.isFullyActivated()"
               [class.bg-green-500]="onboarding.isFullyActivated()"
               [style.width.%]="onboarding.progressPercent()">
          </div>
        </div>

        <!-- Checklist items -->
        <div class="space-y-2">
          @for (item of checklistItems(); track item.key) {
            <div class="flex items-center justify-between p-3 rounded-2xl transition-all duration-200"
                 [class.bg-green-50]="item.done"
                 [class.bg-slate-50]="!item.done"
                 [class.opacity-70]="item.done">
              <div class="flex items-center gap-3">
                <!-- Status indicator -->
                <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                     [class.bg-green-100]="item.done"
                     [class.bg-white]="!item.done"
                     [class.border]="!item.done"
                     [class.border-slate-200]="!item.done">
                  @if (item.done) {
                    <ng-icon name="lucideCheck" class="w-3 h-3 text-green-600" />
                  }
                </div>
                <!-- Icon + Label -->
                <div class="flex items-center gap-2">
                  <ng-icon [name]="item.icon" class="w-3.5 h-3.5 flex-shrink-0"
                           [class.text-green-500]="item.done"
                           [class.text-slate-400]="!item.done" />
                  <span class="text-sm font-medium"
                        [class.text-green-700]="item.done"
                        [class.line-through]="item.done"
                        [class.text-slate-700]="!item.done">
                    {{ item.label }}
                  </span>
                </div>
              </div>

              <!-- Action link -->
              @if (!item.done) {
                <a [routerLink]="item.route"
                   class="text-[11px] font-bold text-primary hover:underline whitespace-nowrap ml-2">
                  Faire →
                </a>
              }
            </div>
          }
        </div>

        <!-- Fully activated celebration -->
        @if (onboarding.isFullyActivated()) {
          <div class="text-center py-2 text-sm font-semibold text-green-700 bg-green-50 rounded-2xl flex items-center justify-center gap-2">
            🎉 Votre SAV est pleinement activé !
          </div>
        } @else {
          <p class="text-xs text-slate-400 text-center">
            Plus que {{ 4 - onboarding.completionCount() }} étape{{ 4 - onboarding.completionCount() > 1 ? 's' : '' }} pour tout débloquer
          </p>
        }

      </div>
    }
  `,
})
export class OnboardingChecklistComponent {
  onboarding = inject(OnboardingService);

  visible = signal(true);

  checklistItems() {
    const steps = this.onboarding.steps();
    return [
      { key: 'site',       label: 'Créer un site',              icon: 'lucideBuilding2', done: steps.site,       route: '/admin/sites' },
      { key: 'technicien', label: 'Ajouter un technicien',      icon: 'lucideWrench',   done: steps.technicien, route: '/admin/users' },
      { key: 'ticket',     label: 'Créer un premier ticket',    icon: 'lucideTicket',   done: steps.ticket,     route: '/tickets' },
      { key: 'stock',      label: 'Ajouter une pièce au stock', icon: 'lucidePackage',  done: steps.stock,      route: '/stock' },
    ];
  }

  dismiss(): void {
    this.visible.set(false);
    this.onboarding.dismissChecklist();
  }
}
