export type Role = 'ROLE_SUPER_ADMIN';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: Role;
  nom: string;
  companyId: null;
  companyNom: null;
}
