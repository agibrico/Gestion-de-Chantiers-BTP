/**
 * AGB CHANTIER - Entités Chantiers & Projets BTP - AXE 04
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type ProjectType =
  | "BATIMENT_RESIDENTIEL" // Immeubles résidentiels, villas, lotissements
  | "BATIMENT_TERTIAIRE" // Bureaux, sièges sociaux, centres commerciaux
  | "TRAVAUX_PUBLICS_VRD" // Routes, voiries, assainissement, réseaux
  | "GENIE_CIVIL_OUVRAGES" // Ponts, échangeurs, barrages, châteaux d'eau
  | "RENOVATION_REHABILITATION" // Rénovation lourde, surélévation, ravalement
  | "INDUSTRIEL_ENTREPOT" // Hangars métalliques, usines, plateformes logistiques
  | "AMENAGEMENT_INTERIEUR"; // Second œuvre, agencement, finitions haut de gamme

export type ProjectStatus =
  | "ETUDE_PREPARATION" // Phase d'études, consultation, installation de chantier
  | "EN_COURS" // Travaux actifs sur le terrain
  | "EN_PAUSE" // Travaux suspendus (intempéries, avenant, administratif)
  | "RECEPTIONNE" // Réception provisoire prononcée avec ou sans réserves
  | "CLOTURE" // DGD signé, parfait achèvement validé
  | "ANNULE"; // Marché résilié ou abandonné

export type ProjectRiskLevel = "FAIBLE" | "MOYEN" | "ELEVE";

export interface ProjectPhase {
  id: string;
  name: string;
  order: number;
  startDate: string;
  endDate: string;
  progressPercentage: number;
  status: "NON_DEBUTEE" | "EN_COURS" | "TERMINEE" | "RETARDEE";
  budgetAllocated: number; // FCFA
  budgetSpent: number; // FCFA
  description?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  targetDate: string;
  completedDate?: string;
  isCritical: boolean;
  status: "EN_ATTENTE" | "VALIDE" | "EN_RETARD";
}

export interface ProjectManagementTeam {
  projectManagerId?: string;
  projectManagerName: string; // Directeur de Travaux
  siteManagerId?: string;
  siteManagerName: string; // Conducteur de Travaux Principal
  foremanId?: string;
  foremanName: string; // Chef de Chantier Principal
  safetyOfficerName?: string; // Responsable HSE
}

export interface ProjectLocation {
  address: string;
  city: string;
  district?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  accessNotes?: string;
}

export interface ProjectKeyMetrics {
  workersOnSiteToday: number;
  totalHoursWorked: number;
  openReservationsCount: number;
  safetyIncidentsCount: number;
  siteDiaryEntriesCount: number;
  photosCount: number;
  activeAlertsCount: number;
}

export interface ProjectEntity extends BaseEntity {
  id: string;
  code: string; // Ex: CH-2026-001
  name: string; // Ex: Tour Horizon Plateau R+14
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  riskLevel: ProjectRiskLevel;

  // Maîtrise d'Ouvrage (Liaison Axe 03)
  clientId: string;
  clientName: string;
  clientType?: string;
  clientContactPerson?: string;
  clientPhone?: string;

  // Localisation
  location: ProjectLocation;

  // Calendrier
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string;
  receptionDate?: string;

  // Caractéristiques Techniques
  surfaceAreaM2?: number;
  numberOfFloors?: string; // Ex: R+4, 2 Sous-sols + R+14
  buildingPermitNumber?: string; // N° Permis de Construire

  // Finances BTP (en FCFA)
  totalBudgetEstimated: number; // Devis / Budget d'objectif prévisionnel
  totalBudgetContracted: number; // Montant du Marché Initial TTC
  totalExpensesRealized: number; // Coûts réels engagés (matériaux, MO, sous-traitance)
  totalBilledAmount: number; // Montant cumulé des situations facturées
  totalPaidAmount: number; // Montant total des situations encaissées
  retentionGuaranteeRate: number; // Taux de retenue de garantie (ex: 5%)

  // Avancement
  progressPercentage: number; // Avancement physique global (0-100%)
  financialProgressPercentage: number; // Avancement financier (Facturé / Marché)

  // Encadrement
  managementTeam: ProjectManagementTeam;

  // Phases & Jalons
  phases: ProjectPhase[];
  milestones: ProjectMilestone[];

  // Métriques directes
  metrics: ProjectKeyMetrics;

  // Météo actuelle du chantier
  weatherCondition?: "ENSOLEILLE" | "NUAGEUX" | "PLUIE" | "ORAGE";
  temperatureCelsius?: number;

  tags: string[];
  notes?: string;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  planningProjects: number;
  completedProjects: number;
  totalContractedValue: number; // FCFA
  totalExpensesRealized: number; // FCFA
  totalPaidValue: number; // FCFA
  averageProgress: number; // %
  totalWorkersOnSites: number;
  activeAlerts: number;
}

export interface ProjectFilterQuery {
  search?: string;
  type?: ProjectType | "ALL";
  status?: ProjectStatus | "ALL";
  riskLevel?: ProjectRiskLevel | "ALL";
  clientId?: string;
  city?: string;
  siteManagerName?: string;
  sortBy?: "code" | "name" | "startDate" | "progressPercentage" | "totalBudgetContracted" | "createdAt";
  sortOrder?: "asc" | "desc";
}
