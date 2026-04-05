export interface Client {
  id: number;
  nom: string;
  telephone: string;
  email: string | null;
  adresse: string | null;
  createdAt: string;
}

export interface ClientRequest {
  nom: string;
  telephone: string;
  email?: string;
  adresse?: string;
}
