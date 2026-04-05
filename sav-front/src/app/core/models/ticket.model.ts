export type TicketStatut =
  | 'RECU'
  | 'EN_DIAGNOSTIC'
  | 'EN_REPARATION'
  | 'EN_ATTENTE_PIECES'
  | 'REPARE'
  | 'IRREPARABLE'
  | 'EN_ATTENTE_FEEDBACK'
  | 'CLOTURE';

export type TypeAppareil =
  | 'REFRIGERATEUR'
  | 'LAVE_LINGE'
  | 'LAVE_VAISSELLE'
  | 'CLIMATISEUR'
  | 'CUISINIERE'
  | 'CONGELATEUR'
  | 'FOUR'
  | 'AUTRE';

export type ResultatIntervention = 'EN_COURS' | 'REPARE' | 'IRREPARABLE';

// Transitions autorisées (miroir du backend) pour le frontend
export const TICKET_TRANSITIONS: Record<TicketStatut, TicketStatut[]> = {
  RECU: ['EN_DIAGNOSTIC'],
  EN_DIAGNOSTIC: ['EN_REPARATION', 'EN_ATTENTE_PIECES', 'REPARE', 'IRREPARABLE'],
  EN_REPARATION: ['EN_ATTENTE_PIECES', 'REPARE', 'IRREPARABLE'],
  EN_ATTENTE_PIECES: ['EN_REPARATION', 'REPARE', 'IRREPARABLE'],
  REPARE: ['EN_ATTENTE_FEEDBACK'],
  IRREPARABLE: ['EN_ATTENTE_FEEDBACK'],
  EN_ATTENTE_FEEDBACK: ['CLOTURE'],
  CLOTURE: [],
};

export const STATUT_LABELS: Record<TicketStatut, string> = {
  RECU: 'Reçu',
  EN_DIAGNOSTIC: 'En diagnostic',
  EN_REPARATION: 'En réparation',
  EN_ATTENTE_PIECES: 'En attente de pièces',
  REPARE: 'Réparé',
  IRREPARABLE: 'Irréparable',
  EN_ATTENTE_FEEDBACK: 'En attente de feedback',
  CLOTURE: 'Clôturé',
};

export const STATUT_COLORS: Record<TicketStatut, string> = {
  RECU: 'bg-gray-100 text-gray-700',
  EN_DIAGNOSTIC: 'bg-blue-100 text-blue-700',
  EN_REPARATION: 'bg-orange-100 text-orange-700',
  EN_ATTENTE_PIECES: 'bg-yellow-100 text-yellow-700',
  REPARE: 'bg-green-100 text-green-700',
  IRREPARABLE: 'bg-red-100 text-red-700',
  EN_ATTENTE_FEEDBACK: 'bg-purple-100 text-purple-700',
  CLOTURE: 'bg-slate-100 text-slate-600',
};

export const TYPE_APPAREIL_LABELS: Record<TypeAppareil, string> = {
  REFRIGERATEUR: 'Réfrigérateur',
  LAVE_LINGE: 'Lave-linge',
  LAVE_VAISSELLE: 'Lave-vaisselle',
  CLIMATISEUR: 'Climatiseur',
  CUISINIERE: 'Cuisinière',
  CONGELATEUR: 'Congélateur',
  FOUR: 'Four',
  AUTRE: 'Autre',
};

export interface Intervention {
  id: number;
  technicienNom: string;
  diagnostic: string;
  actionsRealisees: string;
  observations: string | null;
  tempsPasseHeures: number | null;
  resultat: ResultatIntervention;
  createdAt: string;
}

export interface Ticket {
  id: number;
  numero: string;
  clientId: number;
  clientNom: string;
  technicienId: number | null;
  technicienNom: string | null;
  siteId: number;
  siteNom: string;
  typeAppareil: TypeAppareil;
  marqueModele: string;
  numeroSerie: string | null;
  descriptionPanne: string;
  statut: TicketStatut;
  sousGarantie: boolean;
  dateAchat: string | null;
  createdAt: string;
  updatedAt: string;
  interventions: Intervention[];
  feedbackSoumis: boolean;
  qrTokenDisponible: boolean;
}

export interface QrCodeResponse {
  base64Image: string;
  expiresAt: string;
}

export interface TicketRequest {
  clientId: number;
  siteId: number;
  typeAppareil: TypeAppareil;
  marqueModele: string;
  numeroSerie?: string;
  descriptionPanne: string;
  sousGarantie: boolean;
  dateAchat?: string;
  technicienId?: number;
}

export interface TicketFilters {
  statut?: TicketStatut;
  siteId?: number;
  technicienId?: number;
  clientId?: number;
  search?: string;
  dateDebut?: string;
  dateFin?: string;
}

export interface InterventionRequest {
  diagnostic: string;
  actionsRealisees: string;
  observations?: string;
  tempsPasseHeures?: number;
  resultat: ResultatIntervention;
}

export interface AssignRequest {
  technicienId: number;
}
