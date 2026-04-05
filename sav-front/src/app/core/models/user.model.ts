import { Role } from './auth.model';

export interface User {
  id: number;
  nom: string;
  email: string;
  role: Role;
  actif: boolean;
  siteId: number | null;
  siteNom: string | null;
}

export interface UserRequest {
  nom: string;
  email: string;
  password: string;
  role: Role;
  siteId?: number;
}
