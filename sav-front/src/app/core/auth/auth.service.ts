import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, Role } from '../models/auth.model';
import { environment } from '../../../environments/environment';

const TOKEN_KEY      = 'sav_token';
const ROLE_KEY       = 'sav_role';
const NOM_KEY        = 'sav_nom';
const COMPANY_ID_KEY = 'sav_company_id';
const COMPANY_NOM_KEY = 'sav_company_nom';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  readonly isLoggedIn   = signal(this.hasValidToken());
  readonly currentRole  = signal<Role | null>(this.getRole());
  readonly currentNom   = signal<string | null>(this.getNom());
  readonly currentCompanyId  = signal<number | null>(this.getCompanyId());
  readonly currentCompanyNom = signal<string | null>(this.getCompanyNom());

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap((response) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(TOKEN_KEY, response.token);
          localStorage.setItem(ROLE_KEY, response.role);
          localStorage.setItem(NOM_KEY, response.nom);
          if (response.companyId != null) {
            localStorage.setItem(COMPANY_ID_KEY, String(response.companyId));
          } else {
            localStorage.removeItem(COMPANY_ID_KEY);
          }
          if (response.companyNom) {
            localStorage.setItem(COMPANY_NOM_KEY, response.companyNom);
          } else {
            localStorage.removeItem(COMPANY_NOM_KEY);
          }
        }
        this.isLoggedIn.set(true);
        this.currentRole.set(response.role);
        this.currentNom.set(response.nom);
        this.currentCompanyId.set(response.companyId ?? null);
        this.currentCompanyNom.set(response.companyNom ?? null);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ROLE_KEY);
      localStorage.removeItem(NOM_KEY);
      localStorage.removeItem(COMPANY_ID_KEY);
      localStorage.removeItem(COMPANY_NOM_KEY);
    }
    this.isLoggedIn.set(false);
    this.currentRole.set(null);
    this.currentNom.set(null);
    this.currentCompanyId.set(null);
    this.currentCompanyNom.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) return localStorage.getItem(TOKEN_KEY);
    return null;
  }

  getRole(): Role | null {
    if (isPlatformBrowser(this.platformId)) return localStorage.getItem(ROLE_KEY) as Role | null;
    return null;
  }

  getNom(): string | null {
    if (isPlatformBrowser(this.platformId)) return localStorage.getItem(NOM_KEY);
    return null;
  }

  getCompanyId(): number | null {
    if (isPlatformBrowser(this.platformId)) {
      const val = localStorage.getItem(COMPANY_ID_KEY);
      return val ? Number(val) : null;
    }
    return null;
  }

  getCompanyNom(): string | null {
    if (isPlatformBrowser(this.platformId)) return localStorage.getItem(COMPANY_NOM_KEY);
    return null;
  }

  private hasValidToken(): boolean {
    if (isPlatformBrowser(this.platformId)) return !!localStorage.getItem(TOKEN_KEY);
    return false;
  }
}
