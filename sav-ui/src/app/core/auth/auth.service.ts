import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, firstValueFrom } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { LoginRequest, LoginResponse, Role } from '@sav/shared-models';
import { environment } from '../../../environments/environment';

const TOKEN_KEY       = 'sav_token';
const ROLE_KEY        = 'sav_role';
const NOM_KEY         = 'sav_nom';
const COMPANY_ID_KEY  = 'sav_company_id';
const COMPANY_NOM_KEY = 'sav_company_nom';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http   = inject(HttpClient);
  private router = inject(Router);

  readonly token           = signal<string | null>(null);
  readonly currentRole     = signal<Role | null>(null);
  readonly currentNom      = signal<string | null>(null);
  readonly currentCompanyId  = signal<number | null>(null);
  readonly currentCompanyNom = signal<string | null>(null);

  readonly isLoggedIn = computed(() => !!this.token());

  /** Appelé au démarrage de l'app (AppComponent.ngOnInit) pour charger la session persistée. */
  async init(): Promise<void> {
    const [tokenResult, roleResult, nomResult, companyIdResult, companyNomResult] =
      await Promise.all([
        Preferences.get({ key: TOKEN_KEY }),
        Preferences.get({ key: ROLE_KEY }),
        Preferences.get({ key: NOM_KEY }),
        Preferences.get({ key: COMPANY_ID_KEY }),
        Preferences.get({ key: COMPANY_NOM_KEY }),
      ]);

    this.token.set(tokenResult.value);
    this.currentRole.set(roleResult.value as Role | null);
    this.currentNom.set(nomResult.value);
    this.currentCompanyId.set(companyIdResult.value ? Number(companyIdResult.value) : null);
    this.currentCompanyNom.set(companyNomResult.value);
  }

  login(request: LoginRequest): Promise<LoginResponse> {
    return firstValueFrom(
      this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
        tap(async (response) => {
          await Promise.all([
            Preferences.set({ key: TOKEN_KEY,       value: response.token }),
            Preferences.set({ key: ROLE_KEY,         value: response.role }),
            Preferences.set({ key: NOM_KEY,          value: response.nom }),
            Preferences.set({ key: COMPANY_ID_KEY,   value: response.companyId != null ? String(response.companyId) : '' }),
            Preferences.set({ key: COMPANY_NOM_KEY,  value: response.companyNom ?? '' }),
          ]);
          this.token.set(response.token);
          this.currentRole.set(response.role);
          this.currentNom.set(response.nom);
          this.currentCompanyId.set(response.companyId ?? null);
          this.currentCompanyNom.set(response.companyNom ?? null);
        })
      )
    );
  }

  async logout(): Promise<void> {
    await Preferences.clear();
    this.token.set(null);
    this.currentRole.set(null);
    this.currentNom.set(null);
    this.currentCompanyId.set(null);
    this.currentCompanyNom.set(null);
    this.router.navigate(['/auth/login']);
  }

  /** Synchrone après init() — utilisé par le JWT interceptor. */
  getToken(): string | null {
    return this.token();
  }
}
