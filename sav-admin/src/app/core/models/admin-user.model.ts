export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'TECHNICIEN' | 'RECEPTIONNISTE';

export interface AdminUser {
  id: number;
  nom: string;
  email: string;
  role: Role;
  actif: boolean;
  siteId: number | null;
  siteNom: string | null;
  companyId: number | null;
  companyNom: string | null;
}
