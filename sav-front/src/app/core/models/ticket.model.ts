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
  DiagnosticRequest,
  BlockingReason,
  BlockingRequest,
  TerminationRequest,
  TicketActionRequest,
  TicketAction,
  TicketHistory
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
  EN_COURS: 'bg-orange-100 text-orange-700',
  TERMINE: 'bg-green-100 text-green-700',
  CLOTURE: 'bg-slate-100 text-slate-600',
};
