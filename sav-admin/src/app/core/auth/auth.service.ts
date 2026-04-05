import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'sav_admin_token';
const NOM_KEY = 'sav_admin_nom';
const ROLE_KEY = 'sav_admin_role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly isLoggedIn = signal<boolean>(!!localStorage.getItem(TOKEN_KEY));
  readonly currentNom = signal<string | null>(localStorage.getItem(NOM_KEY));
  readonly currentRole = signal<string | null>(localStorage.getItem(ROLE_KEY));

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap(response => {
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(NOM_KEY, response.nom);
        localStorage.setItem(ROLE_KEY, response.role);
        this.isLoggedIn.set(true);
        this.currentNom.set(response.nom);
        this.currentRole.set(response.role);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NOM_KEY);
    localStorage.removeItem(ROLE_KEY);
    this.isLoggedIn.set(false);
    this.currentNom.set(null);
    this.currentRole.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  hasRole(): boolean {
    const role = localStorage.getItem(ROLE_KEY);
    return role === 'ROLE_SUPER_ADMIN';
  }
}
