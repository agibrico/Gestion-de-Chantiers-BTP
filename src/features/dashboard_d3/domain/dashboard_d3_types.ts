/**
 * AGB CHANTIER - Types & Modèles de Données pour le Tableau de Bord D3.js
 */

export interface ProjectProgressData {
  id: string;
  code: string;
  name: string;
  progressPercentage: number; // 0-100
  targetProgressPercentage: number; // Prévisionnel Gantt
  status: string;
  siteManager: string;
  surfaceM2: number;
}

export interface ProjectBudgetData {
  id: string;
  code: string;
  name: string;
  allocatedBudgetFCFA: number; // Budget marché / contracté
  spentBudgetFCFA: number; // Dépenses réelles engagées
  billedAmountFCFA: number; // Situations facturées
  consumptionRate: number; // (spent / allocated) * 100
  remainingBudgetFCFA: number; // allocated - spent
}

export interface ProjectReservationsData {
  id: string;
  code: string;
  name: string;
  criticalCount: number; // Réserves bloquantes OPR
  majorCount: number; // Réserves majeures
  minorCount: number; // Réserves mineures / esthétiques
  resolvedCount: number; // Réserves levées et validées
  totalOpen: number; // critical + major + minor
}

export interface GlobalDashboardKpis {
  weightedGlobalProgress: number;
  totalAllocatedBudgetFCFA: number;
  totalSpentBudgetFCFA: number;
  globalConsumptionRate: number;
  totalOpenReservations: number;
  criticalBlockingReservations: number;
  activeProjectsCount: number;
}
