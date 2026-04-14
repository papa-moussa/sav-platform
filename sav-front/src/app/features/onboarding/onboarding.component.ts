import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import { OnboardingService } from '../../core/services/onboarding.service';
import { SiteService } from '../../core/services/site.service';
import { UserService } from '../../core/services/user.service';
import { ClientService } from '../../core/services/client.service';
import { TicketService } from '../../core/services/ticket.service';
import { StockService } from '../../core/services/stock.service';
import { AppButtonComponent } from '../../shared/ui/button/app-button.component';
import { AppInputComponent } from '../../shared/ui/input/app-input.component';
import { AppToastService } from '../../shared/ui/toast/app-toast.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideBuilding2, lucideUser, lucideTicket, lucidePackage,
  lucideCheck, lucideChevronRight, lucideSkipForward, lucideZap,
  lucideArrowRight, lucideWrench, lucideSmartphone
} from '@ng-icons/lucide';

// Steps: 0=splash, 1=site, 2=tech, 3=ticket, 4=stock, 5=success
type WizardStep = 0 | 1 | 2 | 3 | 4 | 5;
type TicketMode = 'choose' | 'example' | 'real';
type TicketSubStep = 1 | 2 | 3; // 1=client, 2=appareil, 3=panne

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppButtonComponent, AppInputComponent, NgIconComponent],
  providers: [provideIcons({
    lucideBuilding2, lucideUser, lucideTicket, lucidePackage,
    lucideCheck, lucideChevronRight, lucideSkipForward, lucideZap,
    lucideArrowRight, lucideWrench, lucideSmartphone
  })],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col">

      <!-- Top bar -->
      <div class="w-full bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ng-icon name="lucideZap" class="text-white w-4 h-4" />
          </div>
          <span class="font-bold text-slate-800 text-sm">SAV Platform</span>
        </div>

        <!-- Stepper (hidden on splash & success) -->
        @if (currentStep() > 0 && currentStep() < 5) {
          <div class="hidden sm:flex items-center gap-1">
            @for (s of wizardSteps; track s.step) {
              <div class="flex items-center gap-1">
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all duration-300"
                     [class.bg-primary]="currentStep() === s.step"
                     [class.text-white]="currentStep() === s.step"
                     [class.bg-green-100]="currentStep() > s.step"
                     [class.text-green-700]="currentStep() > s.step"
                     [class.bg-slate-100]="currentStep() < s.step"
                     [class.text-slate-400]="currentStep() < s.step">
                  @if (currentStep() > s.step) {
                    <ng-icon name="lucideCheck" class="w-3 h-3" />
                  } @else {
                    <ng-icon [name]="s.icon" class="w-3 h-3" />
                  }
                  {{ s.label }}
                </div>
                @if (!$last) {
                  <div class="w-4 h-px"
                       [class.bg-primary]="currentStep() > s.step"
                       [class.bg-slate-200]="currentStep() <= s.step"></div>
                }
              </div>
            }
          </div>
          <!-- Mobile progress -->
          <div class="sm:hidden text-xs font-semibold text-slate-500">
            Étape {{ currentStep() }} / 4
          </div>
        }

        <!-- Skip wizard link -->
        @if (currentStep() > 0 && currentStep() < 5) {
          <button (click)="skipWizard()"
                  class="text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
            <ng-icon name="lucideSkipForward" class="w-3 h-3" />
            Passer
          </button>
        }
        @if (currentStep() === 0 || currentStep() === 5) {
          <div></div>
        }
      </div>

      <!-- Progress bar (steps 1-4) -->
      @if (currentStep() > 0 && currentStep() < 5) {
        <div class="w-full h-1 bg-slate-100">
          <div class="h-1 bg-primary transition-all duration-500 ease-out"
               [style.width.%]="((currentStep() - 1) / 4) * 100"></div>
        </div>
      }

      <!-- Main content -->
      <div class="flex-1 flex items-center justify-center p-6">
        <div class="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-300">

          <!-- ─────────── STEP 0: SPLASH ─────────── -->
          @if (currentStep() === 0) {
            <div class="text-center space-y-8">
              <div class="space-y-3">
                <p class="text-4xl">👋</p>
                <h1 class="text-3xl font-bold text-slate-800 tracking-tight">
                  Bienvenue, {{ authService.currentNom() }} !
                </h1>
                <p class="text-slate-500 text-lg leading-relaxed">
                  On va configurer votre SAV <strong>en moins de 2 minutes</strong>.<br/>
                  4 étapes. C'est tout.
                </p>
              </div>

              <!-- 4 étapes visuelles -->
              <div class="grid grid-cols-4 gap-3">
                @for (s of wizardSteps; track s.step) {
                  <div class="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center" [style.background]="s.color + '20'">
                      <ng-icon [name]="s.icon" class="w-5 h-5" [style.color]="s.color" />
                    </div>
                    <span class="text-[11px] font-semibold text-slate-500 text-center leading-tight">{{ s.label }}</span>
                  </div>
                }
              </div>

              <div class="space-y-3">
                <app-button class="w-full" size="lg" (click)="goToStep(1)">
                  Commencer la configuration
                  <ng-icon name="lucideArrowRight" class="w-4 h-4 ml-2" />
                </app-button>
                <button (click)="skipWizard()"
                        class="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors py-2">
                  Je configure ça plus tard
                </button>
              </div>
            </div>
          }

          <!-- ─────────── STEP 1: SITE ─────────── -->
          @if (currentStep() === 1) {
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
              <div class="space-y-2">
                <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <ng-icon name="lucideBuilding2" class="w-6 h-6" />
                </div>
                <h2 class="text-2xl font-bold text-slate-800">Où exercez-vous ?</h2>
                <p class="text-slate-500 text-sm">
                  Un site = une agence, un atelier ou un point de réception client.
                </p>
              </div>

              <form [formGroup]="siteForm" (ngSubmit)="submitSite()" class="space-y-4">
                <app-input
                  formControlName="nom"
                  label="Nom du site *"
                  placeholder="ex : Site principal, Atelier Paris, Agence Sud..."
                  icon="lucideBuilding2"
                  errorMessage="Nom du site requis"
                />
                <app-input
                  formControlName="adresse"
                  label="Adresse (optionnel)"
                  placeholder="ex : 12 rue des Ateliers, Paris..."
                />

                @if (stepError()) {
                  <p class="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{{ stepError() }}</p>
                }

                <div class="pt-2 flex flex-col gap-3">
                  <app-button type="submit" class="w-full" size="lg" [loading]="saving()">
                    Créer mon site
                    <ng-icon name="lucideArrowRight" class="w-4 h-4 ml-2" />
                  </app-button>
                  <button type="button" (click)="skipStep()"
                          class="text-sm text-slate-400 hover:text-slate-600 text-center transition-colors">
                    Passer cette étape
                  </button>
                </div>
              </form>
            </div>
          }

          <!-- ─────────── STEP 2: TECHNICIEN ─────────── -->
          @if (currentStep() === 2) {
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
              <!-- Step success badge -->
              @if (onboardingService.steps().site) {
                <div class="flex items-center gap-2 text-xs font-semibold text-green-600 bg-green-50 rounded-full px-3 py-1 w-fit">
                  <ng-icon name="lucideCheck" class="w-3 h-3" />
                  {{ onboardingService.state().createdSiteName || 'Site' }} créé ✓
                </div>
              }

              <div class="space-y-2">
                <div class="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
                  <ng-icon name="lucideWrench" class="w-6 h-6" />
                </div>
                <h2 class="text-2xl font-bold text-slate-800">Qui répare les appareils ?</h2>
                <p class="text-slate-500 text-sm">
                  Ajoutez votre premier technicien. Vous pourrez en ajouter d'autres après.
                </p>
              </div>

              <form [formGroup]="techForm" (ngSubmit)="submitTech()" class="space-y-4">
                <app-input
                  formControlName="nom"
                  label="Nom complet *"
                  placeholder="ex : Ahmed Benali"
                  icon="lucideUser"
                  errorMessage="Nom requis"
                />
                <app-input
                  formControlName="email"
                  type="email"
                  label="Email professionnel *"
                  placeholder="ahmed@monentreprise.fr"
                  errorMessage="Email valide requis"
                />
                <app-input
                  formControlName="password"
                  type="password"
                  label="Mot de passe provisoire *"
                  placeholder="min. 8 caractères"
                  hint="Le technicien pourra le modifier lors de sa première connexion"
                  errorMessage="Min. 8 caractères"
                />

                @if (stepError()) {
                  <p class="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{{ stepError() }}</p>
                }

                <div class="pt-2 flex flex-col gap-3">
                  <app-button type="submit" class="w-full" size="lg" [loading]="saving()">
                    Ajouter mon technicien
                    <ng-icon name="lucideArrowRight" class="w-4 h-4 ml-2" />
                  </app-button>
                  <button type="button" (click)="useCurrentUserAsTech()"
                          class="text-sm text-primary hover:underline text-center transition-colors">
                    C'est moi le technicien (pré-remplir mes infos)
                  </button>
                  <button type="button" (click)="skipStep()"
                          class="text-sm text-slate-400 hover:text-slate-600 text-center transition-colors">
                    Passer cette étape
                  </button>
                </div>
              </form>
            </div>
          }

          <!-- ─────────── STEP 3: TICKET ─────────── -->
          @if (currentStep() === 3) {
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
              <!-- Breadcrumb badges -->
              <div class="flex items-center gap-2 flex-wrap">
                @if (onboardingService.steps().site) {
                  <span class="text-xs font-semibold text-green-600 bg-green-50 rounded-full px-3 py-1">
                    <ng-icon name="lucideCheck" class="w-3 h-3 inline mr-1" />Site ✓
                  </span>
                }
                @if (onboardingService.steps().technicien) {
                  <span class="text-xs font-semibold text-green-600 bg-green-50 rounded-full px-3 py-1">
                    <ng-icon name="lucideCheck" class="w-3 h-3 inline mr-1" />Technicien ✓
                  </span>
                }
              </div>

              <div class="space-y-2">
                <div class="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <ng-icon name="lucideTicket" class="w-6 h-6" />
                </div>
                <h2 class="text-2xl font-bold text-slate-800">Créons votre premier ticket</h2>
                <p class="text-slate-500 text-sm">
                  Vous avez un vrai appareil à enregistrer ?
                </p>
              </div>

              <!-- Mode choice -->
              @if (ticketMode() === 'choose') {
                <div class="space-y-3">
                  <button (click)="ticketMode.set('real')"
                          class="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-primary/40 hover:bg-primary/5 transition-all group text-left">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                        <ng-icon name="lucideTicket" class="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p class="font-semibold text-slate-800 text-sm">Créer un vrai ticket</p>
                        <p class="text-xs text-slate-500">Pour un client et un appareil réels</p>
                      </div>
                    </div>
                    <ng-icon name="lucideChevronRight" class="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                  </button>

                  <button (click)="submitExampleTicket()"
                          class="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-violet-300 hover:bg-violet-50/50 transition-all group text-left"
                          [disabled]="saving()">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                        <ng-icon name="lucideSmartphone" class="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <p class="font-semibold text-slate-800 text-sm">Utiliser un ticket d'exemple</p>
                        <p class="text-xs text-slate-500">On pré-remplit tout pour vous</p>
                      </div>
                    </div>
                    @if (saving()) {
                      <div class="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
                    } @else {
                      <ng-icon name="lucideChevronRight" class="w-4 h-4 text-slate-300 group-hover:text-violet-500 transition-colors" />
                    }
                  </button>
                </div>
              }

              <!-- Real ticket sub-steps -->
              @if (ticketMode() === 'real') {
                <!-- Sub-step indicator -->
                <div class="flex items-center gap-2">
                  @for (sub of [1,2,3]; track sub) {
                    <div class="h-1 flex-1 rounded-full transition-all duration-300"
                         [class.bg-primary]="ticketSubStep() >= sub"
                         [class.bg-slate-100]="ticketSubStep() < sub"></div>
                  }
                </div>
                <p class="text-xs text-slate-400 font-medium">
                  @switch(ticketSubStep()) {
                    @case(1) { Qui est le client ? }
                    @case(2) { Quel appareil ? }
                    @case(3) { Quelle panne ? }
                  }
                </p>

                <form [formGroup]="ticketForm" (ngSubmit)="submitTicket()" class="space-y-4">
                  <!-- Sub-step 1: Client -->
                  @if (ticketSubStep() === 1) {
                    <app-input
                      formControlName="clientNom"
                      label="Nom du client *"
                      placeholder="ex : Marie Lefebvre"
                      icon="lucideUser"
                      errorMessage="Nom requis"
                    />
                    <app-input
                      formControlName="clientTelephone"
                      label="Téléphone *"
                      placeholder="ex : 06 12 34 56 78"
                      errorMessage="Téléphone requis"
                    />
                    <app-button type="button" class="w-full" (click)="nextTicketSubStep()">
                      Suivant
                      <ng-icon name="lucideArrowRight" class="w-4 h-4 ml-2" />
                    </app-button>
                  }

                  <!-- Sub-step 2: Appareil -->
                  @if (ticketSubStep() === 2) {
                    <div class="space-y-3">
                      <label class="text-[13px] font-medium text-slate-600 ml-1">Type d'appareil *</label>
                      <select formControlName="typeAppareil"
                              class="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30">
                        <option value="">Sélectionner...</option>
                        @for (type of typeAppareils; track type.value) {
                          <option [value]="type.value">{{ type.label }}</option>
                        }
                      </select>
                    </div>
                    <app-input
                      formControlName="marqueModele"
                      label="Marque / Modèle *"
                      placeholder="ex : Samsung RT38K5400SA"
                      errorMessage="Marque/Modèle requis"
                    />
                    <div class="flex gap-3">
                      <app-button type="button" variant="outline" class="flex-1" (click)="ticketSubStep.set(1)">
                        ← Retour
                      </app-button>
                      <app-button type="button" class="flex-1" (click)="nextTicketSubStep()">
                        Suivant →
                      </app-button>
                    </div>
                  }

                  <!-- Sub-step 3: Panne -->
                  @if (ticketSubStep() === 3) {
                    <div class="space-y-1">
                      <label class="text-[13px] font-medium text-slate-600 ml-1">Description du problème *</label>
                      <textarea formControlName="descriptionPanne" rows="3"
                                placeholder="ex : Ne chauffe plus depuis lundi, bruit au démarrage..."
                                class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none">
                      </textarea>
                    </div>

                    @if (stepError()) {
                      <p class="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{{ stepError() }}</p>
                    }

                    <div class="flex gap-3">
                      <app-button type="button" variant="outline" class="flex-1" (click)="ticketSubStep.set(2)">
                        ← Retour
                      </app-button>
                      <app-button type="submit" class="flex-1" [loading]="saving()">
                        Créer le ticket ✓
                      </app-button>
                    </div>
                  }
                </form>
              }

              @if (ticketMode() === 'choose') {
                <button (click)="skipStep()"
                        class="w-full text-sm text-slate-400 hover:text-slate-600 text-center transition-colors">
                  Passer cette étape
                </button>
              }
              @if (ticketMode() === 'real') {
                <button (click)="ticketMode.set('choose')"
                        class="w-full text-sm text-slate-400 hover:text-slate-600 text-center transition-colors">
                  ← Changer de mode
                </button>
              }
            </div>
          }

          <!-- ─────────── STEP 4: STOCK ─────────── -->
          @if (currentStep() === 4) {
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
              <!-- Breadcrumb badges -->
              <div class="flex items-center gap-2 flex-wrap">
                @if (onboardingService.steps().site) {
                  <span class="text-xs font-semibold text-green-600 bg-green-50 rounded-full px-3 py-1">Site ✓</span>
                }
                @if (onboardingService.steps().technicien) {
                  <span class="text-xs font-semibold text-green-600 bg-green-50 rounded-full px-3 py-1">Technicien ✓</span>
                }
                @if (onboardingService.steps().ticket) {
                  <span class="text-xs font-semibold text-green-600 bg-green-50 rounded-full px-3 py-1">
                    Ticket {{ onboardingService.state().createdTicketNumber }} ✓
                  </span>
                }
              </div>

              <div class="space-y-2">
                <div class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <ng-icon name="lucidePackage" class="w-6 h-6" />
                </div>
                <h2 class="text-2xl font-bold text-slate-800">Dernière étape — votre stock</h2>
                <p class="text-slate-500 text-sm">
                  Ajoutez une pièce pour tester. Vous pourrez enrichir votre catalogue après.
                </p>
              </div>

              <form [formGroup]="stockForm" (ngSubmit)="submitStock()" class="space-y-4">
                <app-input
                  formControlName="designation"
                  label="Nom de la pièce *"
                  placeholder="ex : Thermostat réfrigérateur, Courroie lave-linge..."
                  icon="lucidePackage"
                  errorMessage="Nom requis"
                />
                <app-input
                  formControlName="reference"
                  label="Référence *"
                  placeholder="ex : REF-001"
                  hint="Identifiant unique pour retrouver cette pièce facilement"
                  errorMessage="Référence requise"
                />
                <div class="grid grid-cols-2 gap-4">
                  <app-input
                    formControlName="quantite"
                    type="number"
                    label="Quantité *"
                    placeholder="5"
                    errorMessage="Requis"
                  />
                  <app-input
                    formControlName="seuilAlerte"
                    type="number"
                    label="Seuil d'alerte *"
                    placeholder="2"
                    hint="Alerte si stock ≤ ce nombre"
                    errorMessage="Requis"
                  />
                </div>
                <p class="text-xs text-slate-400 bg-slate-50 rounded-xl px-4 py-3">
                  💡 Quand votre stock passe sous ce seuil, SAV Platform vous prévient automatiquement dans le dashboard.
                </p>

                @if (stepError()) {
                  <p class="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{{ stepError() }}</p>
                }

                <div class="pt-2 flex flex-col gap-3">
                  <app-button type="submit" class="w-full" size="lg" [loading]="saving()">
                    Ajouter au stock
                    <ng-icon name="lucideArrowRight" class="w-4 h-4 ml-2" />
                  </app-button>
                  <button type="button" (click)="skipStep()"
                          class="text-sm text-slate-400 hover:text-slate-600 text-center transition-colors">
                    Passer — je ferai mon stock plus tard
                  </button>
                </div>
              </form>
            </div>
          }

          <!-- ─────────── STEP 5: SUCCESS ─────────── -->
          @if (currentStep() === 5) {
            <div class="text-center space-y-8">
              <div class="space-y-4">
                <div class="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto text-4xl border-4 border-green-100">
                  🎉
                </div>
                <h1 class="text-3xl font-bold text-slate-800">Votre SAV est prêt !</h1>
                <p class="text-slate-500 leading-relaxed">
                  Vous avez tout ce qu'il faut pour gérer vos premières réparations.
                </p>
              </div>

              <!-- Summary checklist -->
              <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3 text-left">
                @for (item of successItems(); track item.label) {
                  <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                         [class.bg-green-100]="item.done"
                         [class.bg-slate-100]="!item.done">
                      @if (item.done) {
                        <ng-icon name="lucideCheck" class="w-3.5 h-3.5 text-green-600" />
                      } @else {
                        <span class="w-2 h-2 rounded-full bg-slate-300"></span>
                      }
                    </div>
                    <div>
                      <span class="text-sm font-semibold text-slate-700">{{ item.label }}</span>
                      @if (item.detail) {
                        <span class="text-xs text-slate-400 ml-2">{{ item.detail }}</span>
                      }
                    </div>
                  </div>
                }
              </div>

              <app-button class="w-full" size="lg" (click)="goToDashboard()">
                Accéder à mon dashboard
                <ng-icon name="lucideArrowRight" class="w-4 h-4 ml-2" />
              </app-button>
            </div>
          }

        </div>
      </div>
    </div>
  `,
})
export class OnboardingComponent implements OnInit {
  authService = inject(AuthService);
  onboardingService = inject(OnboardingService);
  private siteService = inject(SiteService);
  private userService = inject(UserService);
  private clientService = inject(ClientService);
  private ticketService = inject(TicketService);
  private stockService = inject(StockService);
  private toastService = inject(AppToastService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  currentStep = signal<WizardStep>(0);
  ticketMode = signal<TicketMode>('choose');
  ticketSubStep = signal<TicketSubStep>(1);
  saving = signal(false);
  stepError = signal<string | null>(null);

  // Stepper definition
  wizardSteps = [
    { step: 1, label: 'Site', icon: 'lucideBuilding2', color: '#3b82f6' },
    { step: 2, label: 'Technicien', icon: 'lucideWrench', color: '#8b5cf6' },
    { step: 3, label: 'Ticket', icon: 'lucideTicket', color: '#f97316' },
    { step: 4, label: 'Stock', icon: 'lucidePackage', color: '#10b981' },
  ];

  typeAppareils = [
    { value: 'REFRIGERATEUR', label: 'Réfrigérateur' },
    { value: 'LAVE_LINGE', label: 'Lave-linge' },
    { value: 'LAVE_VAISSELLE', label: 'Lave-vaisselle' },
    { value: 'CLIMATISEUR', label: 'Climatiseur' },
    { value: 'CUISINIERE', label: 'Cuisinière' },
    { value: 'CONGELATEUR', label: 'Congélateur' },
    { value: 'FOUR', label: 'Four' },
    { value: 'AUTRE', label: 'Autre' },
  ];

  // Forms
  siteForm = this.fb.group({
    nom: ['Site principal', Validators.required],
    adresse: [''],
  });

  techForm = this.fb.group({
    nom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  ticketForm = this.fb.group({
    clientNom: ['', Validators.required],
    clientTelephone: ['', Validators.required],
    typeAppareil: ['', Validators.required],
    marqueModele: ['', Validators.required],
    descriptionPanne: ['', Validators.required],
  });

  stockForm = this.fb.group({
    designation: ['', Validators.required],
    reference: ['', Validators.required],
    quantite: [5, [Validators.required, Validators.min(1)]],
    seuilAlerte: [2, [Validators.required, Validators.min(0)]],
  });

  // Success summary items
  successItems() {
    const state = this.onboardingService.state();
    return [
      {
        done: state.steps.site,
        label: 'Site créé',
        detail: state.createdSiteName || '',
      },
      {
        done: state.steps.technicien,
        label: 'Technicien ajouté',
        detail: state.createdTechName || '',
      },
      {
        done: state.steps.ticket,
        label: 'Premier ticket créé',
        detail: state.createdTicketNumber || '',
      },
      {
        done: state.steps.stock,
        label: 'Stock initialisé',
        detail: '',
      },
    ];
  }

  ngOnInit(): void {
    // Auto-fill reference when designation changes
    this.stockForm.get('designation')?.valueChanges.subscribe(val => {
      if (val && !this.stockForm.get('reference')?.dirty) {
        const ref = 'REF-' + val.toUpperCase().slice(0, 6).replace(/\s/g, '-');
        this.stockForm.get('reference')?.setValue(ref, { emitEvent: false });
      }
    });
  }

  goToStep(step: WizardStep): void {
    this.stepError.set(null);
    this.currentStep.set(step);
  }

  skipStep(): void {
    const next = (this.currentStep() + 1) as WizardStep;
    this.goToStep(next <= 5 ? next : 5);
  }

  skipWizard(): void {
    this.onboardingService.completeWizard();
    this.router.navigate(['/dashboard']);
  }

  useCurrentUserAsTech(): void {
    const nom = this.authService.currentNom() ?? '';
    this.techForm.patchValue({ nom });
  }

  // ─── Step 1: Site ───
  submitSite(): void {
    if (this.siteForm.invalid) {
      this.siteForm.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.stepError.set(null);
    const { nom, adresse } = this.siteForm.value;
    this.siteService.create({ nom: nom!, adresse: adresse || undefined }).subscribe({
      next: (site) => {
        this.saving.set(false);
        this.onboardingService.markStep('site', {
          createdSiteId: site.id,
          createdSiteName: site.nom,
        });
        this.toastService.show(`✓ ${site.nom} créé avec succès`, 'success');
        this.goToStep(2);
      },
      error: (err) => {
        this.saving.set(false);
        this.stepError.set(err.error?.message ?? 'Erreur lors de la création du site.');
      },
    });
  }

  // ─── Step 2: Technicien ───
  submitTech(): void {
    if (this.techForm.invalid) {
      this.techForm.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.stepError.set(null);
    const { nom, email, password } = this.techForm.value;
    const siteId = this.onboardingService.getCreatedSiteId();
    this.userService.create({
      nom: nom!,
      email: email!,
      password: password!,
      role: 'TECHNICIEN',
      siteId: siteId ?? undefined,
    } as any).subscribe({
      next: () => {
        this.saving.set(false);
        this.onboardingService.markStep('technicien', { createdTechName: nom! });
        this.toastService.show(`✓ ${nom} ajouté comme technicien`, 'success');
        this.goToStep(3);
      },
      error: (err) => {
        this.saving.set(false);
        this.stepError.set(err.error?.message ?? 'Erreur lors de la création du technicien.');
      },
    });
  }

  // ─── Step 3: Ticket — sub-step navigation ───
  nextTicketSubStep(): void {
    if (this.ticketSubStep() === 1) {
      const clientNom = this.ticketForm.get('clientNom');
      const clientTel = this.ticketForm.get('clientTelephone');
      clientNom?.markAsTouched();
      clientTel?.markAsTouched();
      if (clientNom?.invalid || clientTel?.invalid) return;
      this.ticketSubStep.set(2);
    } else if (this.ticketSubStep() === 2) {
      const typeAppareil = this.ticketForm.get('typeAppareil');
      const marqueModele = this.ticketForm.get('marqueModele');
      typeAppareil?.markAsTouched();
      marqueModele?.markAsTouched();
      if (typeAppareil?.invalid || marqueModele?.invalid) return;
      this.ticketSubStep.set(3);
    }
  }

  submitTicket(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.stepError.set(null);
    const { clientNom, clientTelephone, typeAppareil, marqueModele, descriptionPanne } = this.ticketForm.value;
    const siteId = this.onboardingService.getCreatedSiteId();

    if (!siteId) {
      this.stepError.set('Veuillez d\'abord créer un site (étape 1) pour associer le ticket.');
      this.saving.set(false);
      return;
    }

    // Create client then ticket
    this.clientService.create({ nom: clientNom!, telephone: clientTelephone! }).pipe(
      switchMap(client => this.ticketService.create({
        clientId: client.id,
        siteId: siteId,
        typeAppareil: typeAppareil as any,
        marqueModele: marqueModele!,
        descriptionPanne: descriptionPanne!,
        sousGarantie: false,
      }))
    ).subscribe({
      next: (ticket) => {
        this.saving.set(false);
        this.onboardingService.markStep('ticket', { createdTicketNumber: ticket.numero });
        this.toastService.show(`✓ Ticket ${ticket.numero} créé`, 'success');
        this.goToStep(4);
      },
      error: (err) => {
        this.saving.set(false);
        this.stepError.set(err.error?.message ?? 'Erreur lors de la création du ticket.');
      },
    });
  }

  submitExampleTicket(): void {
    const siteId = this.onboardingService.getCreatedSiteId();
    if (!siteId) {
      // Skip with mock data if no site yet
      this.onboardingService.markStep('ticket', { createdTicketNumber: 'TKT-EXEMPLE' });
      this.goToStep(4);
      return;
    }
    this.saving.set(true);
    this.clientService.create({ nom: 'Martin Dupont (exemple)', telephone: '0600000000' }).pipe(
      switchMap(client => this.ticketService.create({
        clientId: client.id,
        siteId: siteId,
        typeAppareil: 'REFRIGERATEUR',
        marqueModele: 'Samsung RT38K5400SA',
        descriptionPanne: 'Ne refroidit plus, bruit anormal au démarrage',
        sousGarantie: false,
      }))
    ).subscribe({
      next: (ticket) => {
        this.saving.set(false);
        this.onboardingService.markStep('ticket', { createdTicketNumber: ticket.numero });
        this.toastService.show(`✓ Ticket d'exemple ${ticket.numero} créé`, 'success');
        this.goToStep(4);
      },
      error: () => {
        this.saving.set(false);
        // Graceful fallback
        this.onboardingService.markStep('ticket', { createdTicketNumber: 'TKT-EXEMPLE' });
        this.goToStep(4);
      },
    });
  }

  // ─── Step 4: Stock ───
  submitStock(): void {
    if (this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.stepError.set(null);
    const { designation, reference, quantite, seuilAlerte } = this.stockForm.value;
    const siteId = this.onboardingService.getCreatedSiteId();

    if (!siteId) {
      this.stepError.set('Veuillez d\'abord créer un site (étape 1) pour associer les pièces.');
      this.saving.set(false);
      return;
    }

    this.stockService.createPiece({
      designation: designation!,
      reference: reference!,
      quantite: quantite!,
      seuilAlerte: seuilAlerte!,
      siteId: siteId,
      categorieAppareil: 'AUTRE',
    } as any).subscribe({
      next: () => {
        this.saving.set(false);
        this.onboardingService.markStep('stock');
        this.toastService.show('✓ Pièce ajoutée au stock', 'success');
        this.goToStep(5);
      },
      error: (err) => {
        this.saving.set(false);
        this.stepError.set(err.error?.message ?? 'Erreur lors de l\'ajout au stock.');
      },
    });
  }

  goToDashboard(): void {
    this.onboardingService.completeWizard();
    this.router.navigate(['/dashboard']);
  }
}
