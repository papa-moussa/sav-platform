import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FadeInDirective],
  template: `
    <section id="contact" class="section" style="background: var(--bg);">
      <div class="wrap">

        <!-- Header -->
        <div class="max-w-[720px] mb-14" appFadeIn [fadeInDelay]="0">
          <span class="eyebrow">Contact</span>
          <h2 class="text-[2rem] sm:text-[2.5rem] leading-[1.08] mb-4">
            Organisons votre démo.<br/>
            <span style="color: var(--text-muted);">30 minutes, sans engagement.</span>
          </h2>
          <p class="text-[16.5px] leading-relaxed max-w-[560px]" style="color: var(--text-mid);">
            Notre équipe vous répond en moins de 24h ouvrées pour une démonstration adaptée à votre activité.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">

          <!-- Left: included + contact -->
          <div class="lg:col-span-2" appFadeIn [fadeInDelay]="0">
            <h3 class="text-[14px] font-semibold mb-4 uppercase tracking-[0.06em]" style="color: var(--text);">
              Inclus dans la démo
            </h3>
            <div class="space-y-3 mb-8">
              @for (item of demoIncludes; track item.title) {
                <div class="surface-flat p-4 flex items-start gap-3">
                  <div class="icon-tile flex-shrink-0" [class]="item.iconClass">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path [attr.d]="item.icon"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-[13.5px] font-semibold mb-0.5" style="color: var(--text);">{{ item.title }}</p>
                    <p class="text-[12.5px] leading-relaxed" style="color: var(--text-muted);">{{ item.desc }}</p>
                  </div>
                </div>
              }
            </div>

            <!-- Direct contact -->
            <div class="surface-flat p-5">
              <div class="flex items-center gap-2 mb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span class="text-[11px] font-semibold uppercase tracking-[0.08em]" style="color: var(--text-muted);">
                  Contact direct
                </span>
              </div>
              <p class="text-[14px] font-semibold mono" style="color: var(--text);">contact&#64;sama-sav.com</p>
              <p class="text-[12px] mt-1" style="color: var(--text-muted);">Réponse sous 24h ouvrées garantie</p>
            </div>
          </div>

          <!-- Right: form -->
          <div class="lg:col-span-3" appFadeIn [fadeInDelay]="100">
            @if (!submitted()) {
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="surface-flat p-7 sm:p-8 space-y-5">

                @if (errorMessage()) {
                  <div class="rounded-[8px] px-4 py-3 text-[13px] flex items-start gap-2"
                       style="background: var(--danger-soft); border: 1px solid rgba(220,38,38,0.2); color: var(--danger);">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {{ errorMessage() }}
                  </div>
                }

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="label">Nom complet *</label>
                    <input formControlName="name" type="text" placeholder="Jean Dupont"
                           class="input" [class.input-error]="isInvalid('name')" />
                    @if (isInvalid('name')) {
                      <p class="text-[11.5px] mt-1" style="color: var(--danger);">Nom requis</p>
                    }
                  </div>
                  <div>
                    <label class="label">Entreprise</label>
                    <input formControlName="company" type="text" placeholder="Nom de votre société"
                           class="input" />
                  </div>
                </div>

                <div>
                  <label class="label">Email professionnel *</label>
                  <input formControlName="email" type="email" placeholder="jean@entreprise.com"
                         class="input" [class.input-error]="isInvalid('email')" />
                  @if (isInvalid('email')) {
                    <p class="text-[11.5px] mt-1" style="color: var(--danger);">Email valide requis</p>
                  }
                </div>

                <div>
                  <label class="label">Message *</label>
                  <textarea formControlName="message" rows="4"
                            placeholder="Décrivez votre activité et vos besoins SAV..."
                            class="input resize-none" [class.input-error]="isInvalid('message')"></textarea>
                  @if (isInvalid('message')) {
                    <p class="text-[11.5px] mt-1" style="color: var(--danger);">Message requis (min. 10 caractères)</p>
                  }
                </div>

                <button type="submit" [disabled]="isSubmitting()"
                        class="btn btn-accent btn-lg w-full disabled:opacity-50 disabled:cursor-not-allowed">
                  @if (isSubmitting()) {
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Envoi en cours...
                  } @else {
                    Envoyer ma demande
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  }
                </button>

                <p class="text-[11.5px] text-center pt-1" style="color: var(--text-muted);">
                  Vos données restent confidentielles · Réponse garantie sous 24h
                </p>
              </form>
            } @else {
              <div class="surface-flat p-10 text-center flex flex-col items-center gap-4">
                <div class="icon-tile-lg icon-tile-success">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <h3 class="text-[1.25rem] font-semibold">Demande envoyée.</h3>
                <p class="text-[14.5px] max-w-[400px]" style="color: var(--text-mid);">
                  Notre équipe vous contactera dans les 24h pour organiser votre démo.
                </p>
                <button (click)="resetForm()" class="btn btn-ghost text-[13px]">
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
  errorMessage = signal<string | null>(null);

  demoIncludes = [
    {
      title: 'Démo personnalisée 30 min',
      desc: 'Adaptée à votre secteur, vos volumes et vos contraintes.',
      iconClass: 'icon-tile-primary',
      icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87L8.91 8.26 12 2z',
    },
    {
      title: 'Toutes vos questions',
      desc: 'Pricing, intégrations, déploiement, support — on répond cash.',
      iconClass: 'icon-tile-success',
      icon: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
    },
    {
      title: 'Essai 14 jours gratuit',
      desc: 'Sans carte bancaire. Sans engagement. Données exportables à tout moment.',
      iconClass: 'icon-tile-warning',
      icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    },
  ];

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      name:    ['', Validators.required],
      email:   ['', [Validators.required, Validators.email]],
      company: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  isInvalid(field: string): boolean {
    const c = this.contactForm.get(field);
    return !!(c?.invalid && c?.touched);
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    const { name, email, company, message } = this.contactForm.value;
    this.contactService.send({ name, email, company, message }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submitted.set(true);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Une erreur est survenue. Veuillez réessayer ou contacter contact@sama-sav.com directement.');
      }
    });
  }

  resetForm(): void {
    this.contactForm.reset();
    this.submitted.set(false);
    this.errorMessage.set(null);
  }
}
