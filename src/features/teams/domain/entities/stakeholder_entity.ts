/**
 * AGB CHANTIER - Entités Intervenants, Partenaires & Sous-Traitants BTP - AXE 05
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type StakeholderCategory =
  | "BUREAU_CONTROLE" // Bureau de Contrôle Technique (Veritas, Socotec, LBTP)
  | "BUREAU_ETUDES_TECHNIQUES" // BET Structure, BET Fluides, BET Géotechnique
  | "MAITRISE_OEUVRE_ARCHI" // Cabinet d'Architecture / Maîtrise d'Œuvre d'Exécution
  | "COORDONNATEUR_SPS" // Coordonnateur Sécurité et Protection de la Santé
  | "SOUS_TRAITANT_SPECIALISE" // Sous-traitant (Électricité, Plomberie, Climatisation, Peinture, etc.)
  | "GEOMETRE_EXPERT" // Cabinet de Géomètre-Topographe
  | "LABORATOIRE_SOLS_BETON"; // Laboratoire d'Essais et Contrôle Béton

export type StakeholderStatus = "ACTIF" | "EN_ATTENTE_DOCUMENTS" | "AGREE" | "SUSPENDU";

export interface StakeholderDocument {
  id: string;
  name: string; // Ex: Attestation Décennale 2026, Quitus Fiscal, Agrément Ministère
  fileType: string;
  expirationDate?: string;
  isValid: boolean;
}

export interface StakeholderContact {
  id: string;
  name: string;
  role: string; // Ex: Ingénieur Contrôleur, Chargé d'Affaires, Conducteur de Travaux ST
  phone: string;
  email: string;
  isPrimary: boolean;
}

export interface StakeholderEntity extends BaseEntity {
  id: string;
  code: string; // Ex: STK-2026-001
  name: string; // Ex: Bureau Veritas Côte d'Ivoire
  category: StakeholderCategory;
  specialty: string; // Ex: Contrôle Solidité & Sécurité Incendie, BET Béton Armé
  status: StakeholderStatus;
  rccm?: string;
  taxNumber?: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  assignedProjectIds: string[]; // Chantiers sur lesquels l'intervenant opère
  assignedProjectNames?: string[];
  contacts: StakeholderContact[];
  documents: StakeholderDocument[];
  insurancePolicyNumber?: string;
  insuranceCompany?: string;
  rating: number; // 1 à 5 étoiles
  notes?: string;
}
