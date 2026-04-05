import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FeedbackService } from '../../core/services/feedback.service';
import { FeedbackFormData } from '../../core/models/feedback.model';

/**
 * États possibles de la page :
 *  loading          → chargement initial (initiation OTP)
 *  otp-sent         → OTP envoyé, en attente de saisie
 *  verifying-otp    → vérification OTP en cours
 *  form             → formulaire de notation affiché
 *  submitted        → feedback soumis avec succès
 *  already-submitted → feedback déjà soumis pour ce ticket
 *  error            → erreur irrémédiable
 */
type PageState =
  | 'loading'
  | 'otp-sent'
  | 'verifying-otp'
  | 'form'
  | 'submitted'
  | 'already-submitted'
  | 'error';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.component.html',
})
export class FeedbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private feedbackService = inject(FeedbackService);

  state = signal<PageState>('loading');
  formData = signal<FeedbackFormData | null>(null);
  errorMessage = signal<string>('Une erreur est survenue.');
  submitting = signal(false);

  // ─── OTP ─────────────────────────────────────────────────────────────────
  maskedPhone = signal<string>('');
  otpMessage  = signal<string>('');
  otpInput    = signal<string>('');
  otpError    = signal<string | null>(null);
  resending   = signal(false);

  /** accessToken de session obtenu après vérification OTP */
  private accessToken = '';
  private token = '';

  // ─── Formulaire de notation ───────────────────────────────────────────────
  noteTechnicien     = signal(0);
  commentaireTechnicien = signal('');
  noteEntreprise     = signal(0);
  commentaireEntreprise = signal('');

  canSubmit = computed(() =>
    this.noteTechnicien() > 0 && this.noteEntreprise() > 0 && !this.submitting()
  );

  readonly stars = [1, 2, 3, 4, 5];

  private readonly typeLabels: Record<string, string> = {
    REFRIGERATEUR: 'Réfrigérateur', LAVE_LINGE: 'Lave-linge',
    LAVE_VAISSELLE: 'Lave-vaisselle', CLIMATISEUR: 'Climatiseur',
    CUISINIERE: 'Cuisinière', CONGELATEUR: 'Congélateur',
    FOUR: 'Four', AUTRE: 'Autre',
  };

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.errorMessage.set('Lien de feedback invalide. Vérifiez que vous avez bien scanné le QR Code.');
      this.state.set('error');
      return;
    }
    this.initiateOtp();
  }

  // ─── Étape 1 — Initiation OTP ─────────────────────────────────────────────

  private initiateOtp(): void {
    this.state.set('loading');
    this.feedbackService.initiateOtp(this.token).subscribe({
      next: (res) => {
        if (res.alreadySubmitted) {
          this.state.set('already-submitted');
          return;
        }
        this.maskedPhone.set(res.maskedPhone ?? '');
        this.otpMessage.set(res.message ?? '');
        this.state.set('otp-sent');
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Ce lien de feedback est invalide ou a expiré.');
        this.state.set('error');
      },
    });
  }

  /** Renvoi d'un nouveau code OTP */
  resendOtp(): void {
    this.resending.set(true);
    this.otpInput.set('');
    this.otpError.set(null);
    this.feedbackService.initiateOtp(this.token).subscribe({
      next: (res) => {
        this.resending.set(false);
        if (res.alreadySubmitted) { this.state.set('already-submitted'); return; }
        this.maskedPhone.set(res.maskedPhone ?? '');
        this.otpMessage.set(res.message ?? '');
      },
      error: (err) => {
        this.resending.set(false);
        this.otpError.set(err.error?.message ?? 'Erreur lors du renvoi. Veuillez réessayer.');
      },
    });
  }

  // ─── Étape 2 — Vérification OTP ───────────────────────────────────────────

  verifyOtp(): void {
    const code = this.otpInput().trim();
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      this.otpError.set('Saisissez les 6 chiffres reçus par SMS.');
      return;
    }
    this.otpError.set(null);
    this.state.set('verifying-otp');

    this.feedbackService.verifyOtp(this.token, code).subscribe({
      next: (res) => {
        this.accessToken = res.accessToken;
        this.formData.set(res.formData);
        this.state.set('form');
      },
      error: (err) => {
        this.state.set('otp-sent');
        this.otpError.set(err.error?.message ?? 'Code incorrect. Veuillez réessayer.');
      },
    });
  }

  // ─── Étape 3 — Soumission du feedback ─────────────────────────────────────

  setNoteTechnicien(note: number): void { this.noteTechnicien.set(note); }
  setNoteEntreprise(note: number):  void { this.noteEntreprise.set(note); }

  getTypeLabel(type: string): string {
    return this.typeLabels[type] ?? type;
  }

  submit(): void {
    if (!this.canSubmit()) return;
    this.submitting.set(true);
    this.feedbackService.submit({
      accessToken: this.accessToken,
      noteTechnicien: this.noteTechnicien(),
      commentaireTechnicien: this.commentaireTechnicien() || undefined,
      noteEntreprise: this.noteEntreprise(),
      commentaireEntreprise: this.commentaireEntreprise() || undefined,
    }).subscribe({
      next: () => { this.submitting.set(false); this.state.set('submitted'); },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Erreur lors de la soumission. Veuillez réessayer.');
        this.state.set('error');
        this.submitting.set(false);
      },
    });
  }
}
