/**
 * AGB CHANTIER - Entités du Domaine Réserves & Non-Conformités (OPR) - AXE 17
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type ReservationSeverity = "BLOQUANTE_CRITIQUE" | "MAJEURE" | "MINEURE" | "FINITIONS_ESTHETIQUE";

export type ReservationStatus = "OUVERTE" | "EN_COURS_TRAITEMENT" | "LEVEE_A_VERIFIER" | "CLOTUREE_VALIDEE";

export interface ReservationEntity extends BaseEntity {
  projectId: string;
  projectName: string;
  reservationNumber: string; // Ex: RES-2026-0051
  title: string;
  lotName: string; // Peinture, Plomberie, Menuiserie alu, Électricité...
  location: string; // Bâtiment A - Appartement 204 - Séjour
  severity: ReservationSeverity;
  status: ReservationStatus;
  companyResponsible: string; // Entreprise ou sous-traitant
  description: string;
  photoBeforeUrl?: string;
  photoAfterUrl?: string;
  reportedDate: string;
  deadlineDate: string;
  resolvedDate?: string;
  authorName: string;
  verifiedBy?: string;
}
