import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FadeInDirective],
  template: `
    <section id="contact" class="section-padding" style="background: var(--color-bg);">
      <div class="container-max">

        <!-- Header -->
        <div class="text-center max-w-2xl mx-auto mb-16" appFadeIn [fadeInDelay]="0">
          <div class="section-badge w-fit mx-auto">Contact</div>
          <h2 class="text-3xl sm:text-4xl font-bold leading-tight mb-5" style="color: var(--color-text);">
            Organisons votre démo
          </h2>
          <p class="text-lg" style="color: var(--color-muted);">
            Notre équipe vous répond en moins de 24h pour une démo personnalisée, sans engagement.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">

          <!-- Left: Value props -->
          <div appFadeIn [fadeInDelay]="0">
            <h3 class="text-lg font-bold mb-6" style="color: var(--color-text);">Ce que vous obtiendrez :</h3>
            <div class="space-y-4 mb-10">
              @for (item of demoIncludes; track item.title) {
                <div class="flex items-start gap-4 card-glass p-4">
                  <span class="text-xl flex-shrink-0">{{ item.icon }}</span>
                  <div>
                    <p class="text-sm font-semibold mb-0.5" style="color: var(--color-text);">{{ item.title }}</p>
                    <p class="text-sm" style="color: var(--color-muted);">{{ item.desc }}</p>
                  </div>
                </div>
              }
            </div>

            <div class="rounded-xl p-5" style="background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2);">
              <p class="text-sm font-semibold mb-1" style="color: #A5B4FC;">
                📧 contact&#64;sav-platform.fr
              </p>
              <p class="text-xs" style="color: var(--color-muted);">Réponse sous 24h ouvrées garantie</p>
            </div>
          </div>

          <!-- Right: Form -->
          <div appFadeIn [fadeInDelay]="100">
            @if (!submitted()) {
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()"
                    class="card-glass p-8 space-y-5">

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style="color: var(--color-muted);">
                      Nom complet *
                    </label>
                    <input formControlName="name" type="text" placeholder="Jean Dupont"
                           class="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                           style="background: rgba(255,255,255,0.04); border: 1px solid; color: var(--color-text);"
                           [style.border-color]="isInvalid('name') ? '#EF4444' : 'rgba(255,255,255,0.08)'" />
                    @if (isInvalid('name')) {
                      <p class="text-xs mt-1" style="color: #EF4444;">Nom requis</p>
                    }
                  </div>
                  <div>
                    <label class="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style="color: var(--color-muted);">
                      Entreprise
                    </label>
                    <input formControlName="company" type="text" placeholder="Nom de votre société"
                           class="w-full px-4 py-3 rounded-lg text-sm outline-none"
                           style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: var(--color-text);" />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style="color: var(--color-muted);">
                    Email professionnel *
                  </label>
                  <input formControlName="email" type="email" placeholder="jean&#64;entreprise.com"
                         class="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                         style="background: rgba(255,255,255,0.04); border: 1px solid; color: var(--color-text);"
                         [style.border-color]="isInvalid('email') ? '#EF4444' : 'rgba(255,255,255,0.08)'" />
                  @if (isInvalid('email')) {
                    <p class="text-xs mt-1" style="color: #EF4444;">Email valide requis</p>
                  }
                </div>

                <div>
                  <label class="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style="color: var(--color-muted);">
                    Message *
                  </label>
                  <textarea formControlName="message" rows="4"
                            placeholder="Décrivez votre activité et vos besoins SAV..."
                            class="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none transition-all duration-200"
                            style="background: rgba(255,255,255,0.04); border: 1px solid; color: var(--color-text);"
                            [style.border-color]="isInvalid('message') ? '#EF4444' : 'rgba(255,255,255,0.08)'"></textarea>
                  @if (isInvalid('message')) {
                    <p class="text-xs mt-1" style="color: #EF4444;">Message requis (min. 10 caractères)</p>
                  }
                </div>

                <button type="submit"
                        [disabled]="isSubmitting()"
                        class="btn-primary w-full justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed">
                  @if (isSubmitting()) {
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Envoi en cours...
                  } @else {
                    Envoyer ma demande
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  }
                </button>

                <p class="text-xs text-center" style="color: var(--color-muted);">
                  Vos données restent confidentielles · Réponse garantie sous 24h
                </p>
              </form>
            } @else {
              <div class="card-glass p-10 text-center flex flex-col items-center gap-5">
                <div class="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                     style="background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3);">
                  ✅
                </div>
                <h3 class="text-xl font-bold" style="color: var(--color-text);">Demande envoyée !</h3>
                <p style="color: var(--color-muted);">Notre équipe vous contactera dans les 24h pour organiser votre démo.</p>
                <button (click)="resetForm()"
                        class="text-sm font-medium mt-2" style="color: #A5B4FC;">
                  Envoyer un autre message
                </button>
              </div>
            }
          </div>

        </div>
      </div>
    </section>
  `,
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = signal(false);
  submitted = signal(false);

  demoIncludes = [
    { icon: '🎯', title: 'Démo personnalisée 30 min', desc: 'Adaptée à votre secteur et votre volume de tickets' },
    { icon: '💬', title: 'Réponses à toutes vos questions', desc: 'Pricing, intégrations, déploiement, support' },
    { icon: '🚀', title: 'Accès essai gratuit 14 jours', desc: 'Sans carte bancaire, sans engagement' },
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  isInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submitted.set(true);
    }, 1200);
  }

  resetForm(): void {
    this.contactForm.reset();
    this.submitted.set(false);
  }
}
