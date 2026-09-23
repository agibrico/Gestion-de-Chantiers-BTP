/**
 * AGB CHANTIER - Entités du Domaine HSE & Sécurité - AXE 16
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type IncidentSeverity = "BENIN_SOINS_SUR_PLACE" | "AVEC_ARRET_TRAVAIL" | "PRESQU_ACCIDENT_NEAR_MISS" | "DOMMAGE_MATERIEL_PUR";

export type IncidentCategory =
  | "CHUTE_DE_HAUTEUR"
  | "CHUTE_OBJET_MANUTENTION"
  | "COUPURE_OUTILLAGE"
  | "ELECTRISATION"
  | "COLLISION_ENGIN"
  | "BRULURE_CHIMIQUE_CIMENT"
  | "COUP_DE_CHALEUR";

export interface HseIncidentEntity extends BaseEntity {
  projectId: string;
  projectName: string;
  incidentNumber: string; // Ex: HSE-2026-012
  title: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  dateTime: string;
  exactLocation: string;
  victimName?: string;
  victimCompany?: string; // AGB ou sous-traitant
  daysOfSickLeave: number; // 0 si bénin
  description: string;
  rootCauseAnalysis: string; // Analyse 5 Pourquoi / Arbre des causes
  correctiveActions: string;
  responsibleFollowUp: string;
  isClosed: boolean;
}

export interface SafetyTalkTopicEntity extends BaseEntity {
  projectId: string;
  projectName: string;
  date: string;
  topicTitle: string; // Ex: Causerie 1/4h : Travail en hauteur et ancrage des harnais
  speakerName: string;
  attendeesCount: number;
  keyPointsDiscussed: string[];
}
