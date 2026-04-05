// ─── Étape 1 — Initiation OTP ─────────────────────────────────────────────────

export interface OtpInitiateResponse {
  alreadySubmitted: boolean;
  maskedPhone: string | null;
  message: string | null;
}

// ─── Étape 2 — Vérification OTP ───────────────────────────────────────────────

export interface OtpVerifyRequest {
  token: string;
  otp: string;
}

export interface OtpVerifyResponse {
  accessToken: string;
  formData: FeedbackFormData;
}

// ─── Étape 3 — Soumission du feedback ─────────────────────────────────────────

export interface FeedbackFormData {
  ticketId: number;
  ticketNumero: string;
  typeAppareil: string;
  marqueModele: string;
  descriptionPanne: string;
  technicienNom: string | null;
  siteNom: string;
  feedbackDejaSoumis: boolean;
}

export interface FeedbackRequest {
  accessToken: string;
  noteTechnicien: number;
  commentaireTechnicien?: string;
  noteEntreprise: number;
  commentaireEntreprise?: string;
}
