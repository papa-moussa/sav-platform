// Re-export depuis la lib partagée du monorepo
export type {
  TicketStatut,
  TypeAppareil,
  ResultatIntervention,
  Intervention,
  Ticket,
  QrCodeResponse,
  TicketRequest,
  TicketFilters,
  InterventionRequest,
  AssignRequest,
} from '@sav/shared-models';

export {
  TICKET_TRANSITIONS,
  STATUT_LABELS,
  TYPE_APPAREIL_LABELS,
} from '@sav/shared-models';

// STATUT_COLORS reste spécifique à sav-front (classes Tailwind)
import { TicketStatut as TS } from '@sav/shared-models';
export const STATUT_COLORS: Record<TS, string> = {
  RECU: 'bg-gray-100 text-gray-700',
  EN_DIAGNOSTIC: 'bg-blue-100 text-blue-700',
  EN_REPARATION: 'bg-orange-100 text-orange-700',
  EN_ATTENTE_PIECES: 'bg-yellow-100 text-yellow-700',
  REPARE: 'bg-green-100 text-green-700',
  IRREPARABLE: 'bg-red-100 text-red-700',
  EN_ATTENTE_FEEDBACK: 'bg-purple-100 text-purple-700',
  CLOTURE: 'bg-slate-100 text-slate-600',
};
