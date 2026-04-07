import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideMail,
  lucidePhone,
  lucideMapPin,
  lucideSend,
  lucideCheckCircle,
} from '@ng-icons/lucide';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent, FadeInDirective],
  viewProviders: [provideIcons({ lucideMail, lucidePhone, lucideMapPin, lucideSend, lucideCheckCircle })],
  template: `
    <section id="contact" class="section-padding bg-slate-50">
      <div class="container-max">

        <div appFadeIn class="text-center mb-16">
          <span class="inline-block text-primary-600 font-semibold text-sm tracking-widest uppercase mb-4">
            Contact
          </span>
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Parlons de votre projet
          </h2>
          <p class="text-lg text-slate-500 max-w-2xl mx-auto">
            Notre équipe vous répond sous 24h pour organiser une démo personnalisée.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

          <!-- Contact info -->
          <div appFadeIn class="space-y-8">
            <div>
              <h3 class="text-xl font-semibold text-slate-900 mb-6">Nous contacter</h3>
              <div class="space-y-5">
                @for (info of contactInfo; track info.label) {
                  <div class="flex items-center gap-4">
                    <div class="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ng-icon [name]="info.icon" size="20" class="text-primary-600" />
                    </div>
                    <div>
                      <p class="text-xs text-slate-400 mb-0.5">{{ info.label }}</p>
                      <p class="text-slate-800 font-medium">{{ info.value }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Features list -->
            <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <p class="font-semibold text-slate-900 mb-4">Ce que vous obtiendrez :</p>
              <ul class="space-y-3">
                @for (item of demoIncludes; track item) {
                  <li class="flex items-center gap-3 text-sm text-slate-600">
                    <ng-icon name="lucideCheckCircle" size="16" class="text-green-500 flex-shrink-0" />
                    {{ item }}
                  </li>
                }
              </ul>
            </div>
          </div>

          <!-- Form -->
          <div appFadeIn [fadeInDelay]="100">
            @if (!submitted()) {
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()"
                    class="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-5">

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5">Nom complet *</label>
                  <input formControlName="name" type="text" placeholder="Jean Dupont"
                         class="w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                         [class.border-red-300]="isInvalid('name')"
                         [class.border-slate-200]="!isInvalid('name')" />
                  @if (isInvalid('name')) {
                    <p class="text-xs text-red-500 mt-1">Nom requis</p>
                  }
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5">Email professionnel *</label>
                  <input formControlName="email" type="email" placeholder="jean&#64;entreprise.com"
                         class="w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                         [class.border-red-300]="isInvalid('email')"
                         [class.border-slate-200]="!isInvalid('email')" />
                  @if (isInvalid('email')) {
                    <p class="text-xs text-red-500 mt-1">Email valide requis</p>
                  }
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5">Entreprise</label>
                  <input formControlName="company" type="text" placeholder="Nom de votre entreprise"
                         class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5">Message *</label>
                  <textarea formControlName="message" rows="4" placeholder="Décrivez vos besoins..."
                            class="w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary-200 focus:border-primary-400 resize-none"
                            [class.border-red-300]="isInvalid('message')"
                            [class.border-slate-200]="!isInvalid('message')"></textarea>
                  @if (isInvalid('message')) {
                    <p class="text-xs text-red-500 mt-1">Message requis (min. 10 caractères)</p>
                  }
                </div>

                <button type="submit"
                        [disabled]="isSubmitting()"
                        class="w-full flex items-center justify-center gap-2 py-3.5 px-6 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                  @if (isSubmitting()) {
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Envoi en cours...
                  } @else {
                    <ng-icon name="lucideSend" size="16" />
                    Envoyer ma demande
                  }
                </button>

                <p class="text-xs text-center text-slate-400">
                  Réponse garantie sous 24h. Vos données restent confidentielles.
                </p>
              </form>
            } @else {
              <div class="bg-white rounded-2xl border border-green-100 shadow-sm p-10 text-center flex flex-col items-center gap-4">
                <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                  <ng-icon name="lucideCheckCircle" size="32" class="text-green-500" />
                </div>
                <h3 class="text-xl font-semibold text-slate-900">Message envoyé !</h3>
                <p class="text-slate-500">Nous avons bien reçu votre demande. Notre équipe vous contactera sous 24h.</p>
                <button (click)="resetForm()"
                        class="mt-2 text-sm text-primary-600 font-medium hover:underline">
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

  contactInfo = [
    { icon: 'lucideMail', label: 'Email', value: 'contact@sav-platform.fr' },
    { icon: 'lucidePhone', label: 'Téléphone', value: '+33 1 23 45 67 89' },
    { icon: 'lucideMapPin', label: 'Adresse', value: 'Paris, France' },
  ];

  demoIncludes = [
    'Démo personnalisée de 30 minutes',
    'Présentation des fonctionnalités clés',
    'Réponses à toutes vos questions',
    'Offre tarifaire adaptée à votre taille',
    'Accès à un essai gratuit de 14 jours',
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
    // Simulate API call
    setTimeout(() => {
      console.log('Contact form submitted:', this.contactForm.value);
      this.isSubmitting.set(false);
      this.submitted.set(true);
    }, 1200);
  }

  resetForm(): void {
    this.contactForm.reset();
    this.submitted.set(false);
  }
}
