import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonSpinner,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { AuthService } from '../../../core/auth/auth.service';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  lockClosedOutline,
  alertCircleOutline,
  arrowForwardOutline,
  eyeOutline,
  eyeOffOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonSpinner,
    IonIcon,
  ],
  templateUrl: './login.page.html',
})
export class LoginPage {
  private fb           = inject(FormBuilder);
  private authService  = inject(AuthService);
  private router       = inject(Router);
  private toastCtrl    = inject(ToastController);

  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      alertCircleOutline,
      arrowForwardOutline,
      eyeOutline,
      eyeOffOutline,
    });
  }

  loading      = signal(false);
  error        = signal<string | null>(null);
  showPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      await this.authService.login({
        email:    this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      });
      this.router.navigate(['/tabs/tickets']);
    } catch {
      this.error.set('Identifiants incorrects. Vérifiez votre email et mot de passe.');
    } finally {
      this.loading.set(false);
    }
  }
}
