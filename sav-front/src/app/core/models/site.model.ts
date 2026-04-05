export interface Site {
  id: number;
  nom: string;
  adresse: string | null;
}

export interface SiteRequest {
  nom: string;
  adresse?: string;
}
