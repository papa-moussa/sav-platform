import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { AppInputComponent } from '../../../shared/ui/input/app-input.component';
import { AppButtonComponent } from '../../../shared/ui/button/app-button.component';
import { AppCardComponent } from '../../../shared/ui/card/app-card.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff, lucideUser, lucideLock, lucideAlertCircle } from '@ng-icons/lucide';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppInputComponent, AppButtonComponent, AppCardComponent, NgIconComponent],
  providers: [provideIcons({ lucideEye, lucideEyeOff, lucideUser, lucideLock, lucideAlertCircle })],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  error = signal<string | null>(null);
  loading = signal(false);
  showPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update((s) => !s);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.form.value;
    this.authService.login({ email: email ?? '', password: password ?? '' }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error.set(
          err.status === 401 ? 'Email ou mot de passe incorrect.' : 'Erreur de connexion. Réessayez.'
        );
        this.loading.set(false);
      },
    });
  }
}
