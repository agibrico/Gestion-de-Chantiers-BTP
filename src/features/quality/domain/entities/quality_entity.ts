/**
 * AGB CHANTIER - Entités du Domaine Contrôle Qualité & Essais - AXE 15
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type InspectionType =
  | "ARMATURES_FERRAILLAGE"
  | "COULAGE_BETON_EPROUVETTES"
  | "NIVELLEMENT_ALTIMETRIE"
  | "ETANCHEITE_TERRASSE"
  | "RESEAUX_EP_EU_EV"
  | "PLOMBERIE_PRESSION"
  | "ELECTRICITE_ISOLEMENT"
  | "RECEPTION_LOT_FINITIONS";

export type QualityStatus = "CONFORME" | "NON_CONFORME" | "AVEC_RESERVES" | "EN_ATTENTE_RESULTATS";

export interface ConcreteTestCrushResult {
  sampleNumber: string; // Ex: EP-01, EP-02
  crushAgeDays: 7 | 28 | 60;
  targetStrengthMPa: number; // Ex: 25 ou 30 MPa
  measuredStrengthMPa?: number; // Ex: 28.4 MPa
  isCompliant?: boolean;
}

export interface QualityInspectionEntity extends BaseEntity {
  projectId: string;
  projectName: string;
  inspectionNumber: string; // Ex: CQ-2026-042
  inspectionType: InspectionType;
  title: string;
  locationDetails: string; // Ex: Poteaux P1-P4 Bâtiment A R+2
  inspectorName: string;
  inspectorOrganization: string; // AGB, SOCOTEC, LBTP, Bureau d'études
  inspectionDate: string;
  status: QualityStatus;
  criteriaChecked: {
    criterionName: string;
    isOk: boolean;
    remarks?: string;
  }[];
  concreteTests?: ConcreteTestCrushResult[];
  observations?: string;
  actionRequiredIfNonCompliant?: string;
  attachedPhotos?: string[];
  signatureInspector?: string;
}
