export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'TECHNICIEN' | 'RECEPTIONNISTE';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: Role;
  nom: string;
  /** ID de l'entreprise — null si SUPER_ADMIN */
  companyId: number | null;
  /** Nom de l'entreprise — null si SUPER_ADMIN */
  companyNom: string | null;
}
