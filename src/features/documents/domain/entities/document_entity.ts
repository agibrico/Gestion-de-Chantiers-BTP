/**
 * AGB CHANTIER - Entités du Domaine Documents, Plans & GED - AXE 18
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type DocumentType =
  | "PLAN_ARCHITECTE"
  | "PLAN_STRUCTURE_BETON_ARME"
  | "PLAN_TECHNIQUE_MEP"
  | "CCTP_DESCRIPTIF"
  | "CONTRAT_MARCHE_TRAVAUX"
  | "FACTURE_DECOMPTE_PROVISOIRE"
  | "PV_REUNION_CHANTIER"
  | "RAPPORT_SOL_ETUDE_GEOTECH";

export type DocumentApprovalStatus =
  | "BON_POUR_EXECUTION_BPE"
  | "EN_COURS_DE_REVUE"
  | "APPROUVE_AVEC_OBSERVATIONS"
  | "REFUSE_A_REVISER"
  | "OBSOLETE_ARCHIVE";

export interface ProjectDocumentEntity extends BaseEntity {
  projectId: string;
  projectName: string;
  documentNumber: string; // Ex: DOC-PL-ARCHI-004
  title: string;
  documentType: DocumentType;
  version: string; // Ex: Indice C, V2.1
  fileName: string;
  fileSizeMb: number;
  fileUrl: string;
  approvalStatus: DocumentApprovalStatus;
  authorOrganization: string; // Cabinet Archi, SOCOTEC, LBTP, AGB...
  uploadDate: string;
  tags: string[];
  approvedBy?: string;
  approvalDate?: string;
}
