/**
 * AGB CHANTIER - Entités Réception Provisoire, Garantie de Parfait Achèvement & Réception Définitive - AXE 20
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type HandoverType =
  | "RECEPTION_PROVISOIRE_AVEC_RESERVES"
  | "RECEPTION_PROVISOIRE_SANS_RESERVE"
  | "RECEPTION_DEFINITIVE_FIN_GPA"
  | "LIVRAISON_CLIENT_ACQUEREUR";

export type HandoverVerdict = "PRONONCEE_AVEC_RESERVES" | "PRONONCEE_SANS_RESERVE" | "AJOURNEE_NON_CONFORME" | "LEVEE_TOTALE_GPA_VALIDEE";

export interface HandoverSignatory {
  role: "MAITRE_OUVRAGE_MOA" | "MAITRE_OEUVRE_MOE" | "ENTREPRISE_AGB" | "CONTROLEUR_TECHNIQUE";
  name: string;
  organization: string;
  isSigned: boolean;
  signedDate?: string;
}

export interface HandoverPVEntity extends BaseEntity {
  projectId: string;
  projectName: string;
  pvNumber: string; // Ex: PV-REC-2026-001
  handoverType: HandoverType;
  title: string;
  visitDate: string;
  effectiveDate: string; // Date d'effet juridique (début GPA 1 an)
  warrantyEndDate: string; // Date de fin de la garantie de parfait achèvement
  verdict: HandoverVerdict;
  totalReservationsCount: number;
  resolvedReservationsCount: number;
  signatories: HandoverSignatory[];
  observationsMOA?: string;
  observationsMOE?: string;
  observationsAGB?: string;
  retentionGuaranteePercent: number; // Ex: 5% retenue de garantie libérable à la réception définitive
  retentionAmountFCFA: number; // Ex: 42 500 000 FCFA
  isFinalReleaseGranted: boolean; // Mainlevée de caution / caution bancaire
}
