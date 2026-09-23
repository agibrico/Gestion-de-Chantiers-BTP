/**
 * AGB CHANTIER - Entités Clients & Maîtres d'Ouvrage (MOA) - AXE 03
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type ClientType =
  | "MOA_PUBLIC" // Maître d'Ouvrage Public (Ministère, Collectivité, Mairie, État)
  | "PROMOTEUR_PRIVE" // Promoteur Immobilier Privé
  | "ENTREPRISE_PARTENAIRE" // Entreprise Générale / Co-traitant / Partenaire BTP
  | "PARTICULIER" // Client Particulier / Propriétaire Privé
  | "BAILLEUR_SOCIAL" // Bailleur Social / Agence Foncière
  | "INVESTISSEUR"; // Fonds d'investissement / Bailleur Institutionnel

export type ClientStatus =
  | "ACTIF" // Projets en cours / Relation active
  | "PROSPECT" // En phase de devis / Appel d'offres
  | "EN_NEGOCIATION" // Négociation de contrat / Marché
  | "ARCHIVE" // Projets terminés / Inactif
  | "SUSPENDU"; // Litige ou compte bloqué

export interface ClientContact {
  id: string;
  name: string;
  role: string; // ex: Directeur Technique MOA, Conducteur d'Opérations, Architecte Délégué, DAF, Chef de Projet
  department?: string; // ex: Direction des Marchés, Pôle Travaux, Comptabilité
  phone: string;
  email: string;
  isPrimary: boolean;
  notes?: string;
}

export interface ClientProjectSummary {
  id: string;
  code: string;
  name: string;
  budget: number; // en FCFA
  paidAmount: number; // en FCFA
  status: "PLANIFIE" | "EN_COURS" | "RECEPTIONNE" | "SUSPENDU" | "CLOTURE";
  progressPercentage: number;
  startDate: string;
  endDate: string;
  location: string;
}

export type InteractionType =
  | "REUNION_CHANTIER" // Réunion de chantier / Coordination MOA
  | "APPEL" // Échange téléphonique
  | "EMAIL" // Courrier électronique officiel
  | "VISITE_TERRAIN" // Visite de contrôle MOA sur le site
  | "SIGNATURE_CONTRAT" // Signature Ordre de Service / Marché
  | "AVENANT" // Négociation ou signature d'avenant
  | "VALIDATION_SITUATION" // Approbation du décompte mensuel / PV
  | "RECLAMATION" // Signalement ou réclamation client
  | "PAIEMENT_RECU"; // Notification d'encaissement d'acompte / situation

export interface ClientInteraction {
  id: string;
  clientId: string;
  date: string;
  type: InteractionType;
  title: string;
  summary: string;
  authorName: string;
  followUpDate?: string;
  priority?: "NORMALE" | "IMPORTANTE" | "URGENTE";
  projectId?: string;
  projectName?: string;
}

export interface ClientEntity extends BaseEntity {
  id: string;
  code: string; // Ex: MOA-2026-001
  name: string; // Raison Sociale ou Nom complet
  commercialName?: string; // Nom commercial / Sigle (ex: SIPI, AGEROUTE, PDU)
  type: ClientType;
  status: ClientStatus;
  rccm?: string; // Registre du Commerce et du Crédit Mobilier
  ifuTaxNumber?: string; // Numéro Compte Contribuable / IFU / N° Fiscal
  email: string;
  phone: string;
  altPhone?: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  website?: string;
  rating: number; // 1 à 5 étoiles (Fiabilité & Solvabilité)
  totalContractValue: number; // Valeur cumulée des marchés signés en FCFA
  totalPaidValue: number; // Montant total des situations encaissées en FCFA
  paymentTerms: string; // Modalités de paiement (ex: "Situation mensuelle à 30 jours", "30% acompte, 70% à réception")
  notes?: string;
  contacts: ClientContact[];
  projects: ClientProjectSummary[];
  interactions: ClientInteraction[];
  tags: string[];
}

export interface ClientStats {
  totalClients: number;
  activeClients: number;
  prospects: number;
  totalContractValue: number;
  totalPaidValue: number;
  outstandingBalance: number;
  totalLinkedProjects: number;
  averageRating: number;
}

export interface ClientFilterQuery {
  search?: string;
  type?: ClientType | "ALL";
  status?: ClientStatus | "ALL";
  city?: string;
  minRating?: number;
  sortBy?: "name" | "createdAt" | "totalContractValue" | "rating";
  sortOrder?: "asc" | "desc";
}
