export type TypeMouvement = 'ENTREE' | 'SORTIE';
export type CategorieAppareil = 'REFRIGERATEUR' | 'LAVE_LINGE' | 'LAVE_VAISSELLE' | 'CLIMATISEUR' | 'CUISINIERE' | 'CONGELATEUR' | 'FOUR' | 'AUTRE';

export const CATEGORIE_LABELS: Record<CategorieAppareil, string> = {
  REFRIGERATEUR: 'Réfrigérateur',
  LAVE_LINGE: 'Lave-linge',
  LAVE_VAISSELLE: 'Lave-vaisselle',
  CLIMATISEUR: 'Climatiseur',
  CUISINIERE: 'Cuisinière',
  CONGELATEUR: 'Congélateur',
  FOUR: 'Four',
  AUTRE: 'Autre',
};

export interface Piece {
  id: number;
  reference: string;
  designation: string;
  categorieAppareil: CategorieAppareil;
  marqueCompatible: string | null;
  quantite: number;
  seuilAlerte: number;
  prixUnitaire: number | null;
  siteId: number;
  siteNom: string;
  enAlerteStock: boolean;
}

export interface PieceRequest {
  reference: string;
  designation: string;
  categorieAppareil: CategorieAppareil;
  marqueCompatible?: string;
  quantite: number;
  seuilAlerte: number;
  prixUnitaire?: number;
  siteId: number;
}

export interface MouvementStock {
  id: number;
  type: TypeMouvement;
  quantite: number;
  interventionId: number | null;
  motif: string | null;
  createdByNom: string;
  createdAt: string;
}

export interface EntreeStockRequest {
  quantite: number;
  motif?: string;
}

export interface SortieStockRequest {
  quantite: number;
  interventionId?: number;
  motif?: string;
}
