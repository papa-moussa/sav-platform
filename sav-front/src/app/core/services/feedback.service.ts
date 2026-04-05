import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  OtpInitiateResponse,
  OtpVerifyRequest,
  OtpVerifyResponse,
  FeedbackRequest,
} from '../models/feedback.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private http = inject(HttpClient);
  /** Base URL publique — pas de /api puisque ces endpoints ne requièrent pas d'auth */
  private base = `${environment.apiUrl.replace('/api', '')}/public/feedback`;

  /**
   * Étape 1 — Valide le token QR et envoie l'OTP par SMS.
   * Retourne le numéro masqué et un message informatif.
   */
  initiateOtp(token: string): Observable<OtpInitiateResponse> {
    return this.http.get<OtpInitiateResponse>(this.base, { params: { token } });
  }

  /**
   * Étape 2 — Vérifie le code OTP saisi par le client.
   * En cas de succès, retourne un accessToken + les données du formulaire.
   */
  verifyOtp(token: string, otp: string): Observable<OtpVerifyResponse> {
    const body: OtpVerifyRequest = { token, otp };
    return this.http.post<OtpVerifyResponse>(`${this.base}/verify-otp`, body);
  }

  /**
   * Étape 3 — Soumet le feedback. L'accessToken est à usage unique (one-shot).
   */
  submit(request: FeedbackRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/submit`, request);
  }
}
