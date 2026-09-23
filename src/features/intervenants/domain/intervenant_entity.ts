/**
 * AGB CHANTIER - Entité Gestion des Intervenants & Sous-traitants
 */

import { BaseEntity } from "../../../core/storage/idb_adapter";

export type IntervenantType =
  | "SOUS_TRAITANT"
  | "PERSONNEL_SITE"
  | "BUREAU_CONTROLE"
  | "BET"
  | "FOURNISSEUR";

export type IntervenantStatus =
  | "ACTIF_SUR_SITE"
  | "EN_ATTENTE_INTERVENTION"
  | "INTERVENTION_TERMINEE"
  | "ACCES_SUSPENDU";

export type ComplianceStatus = "CONFORME" | "DOCS_MANQUANTS" | "EPI_A_VERIFIER";

export interface IntervenantEntity {
  id: string;
  type: IntervenantType;
  name: string; // Nom de la personne ou responsable
  company: string; // Entreprise ou raison sociale
  roleOrTrade: string; // Métier, Corps d'état (ex: Électricité, Gros-Œuvre, Plomberie)
  phone: string;
  email: string;
  assignedProjectId: string;
  assignedProjectName: string;
  zoneAssignment: string; // Zone ou niveau d'affectation sur le chantier
  badgeNumber: string;
  headcountOnSite: number; // Nombre d'ouvriers/compagnons présents sous sa responsabilité
  status: IntervenantStatus;
  complianceStatus: ComplianceStatus;
  safetyClearanceDate: string; // Date accueil sécurité HSE
  insuranceValidUntil: string; // Date fin assurance RC / Décennale
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
