/**
 * AGB CHANTIER - Entités du Domaine Travaux, Tâches & Avancement - AXE 07
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type TaskStatus = "A_FAIRE" | "EN_COURS" | "EN_ATTENTE_VALIDATION" | "VALIDE_CONFORME" | "BLOQUE";
export type TaskPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";
export type TaskTrade =
  | "GROS_OEUVRE"
  | "FERRAILLAGE"
  | "MACONNERIE"
  | "ELECTRICITE"
  | "PLOMBERIE"
  | "ETANCHEITE"
  | "PEINTURE_FINITION"
  | "VRD_TERRASSEMENT"
  | "MENUISERIE";

export type MetricUnit = "m³" | "m²" | "ml" | "tonne" | "unité" | "kg" | "forfait";

export interface TaskEntity extends BaseEntity {
  projectId: string;
  projectName: string;
  phaseId?: string;
  phaseName?: string;
  code: string; // Ex: TSK-GO-014
  title: string; // Ex: "Coulage voile béton armé axe 3-5 niveau R+2"
  description?: string;
  trade: TaskTrade;
  priority: TaskPriority;
  status: TaskStatus;
  
  // Assignation
  assignedTeamId?: string;
  assignedTeamName?: string;
  assignedWorkerName?: string;
  
  // Planning & Timing
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  estimatedHours: number;
  actualHours?: number;
  
  // Suivi Métrique & Quantitatif (Décompte des Ouvrages BTP)
  unit: MetricUnit;
  quantityPlanned: number;
  quantityExecuted: number;
  unitPriceFCFA?: number;
  totalBudgetFCFA?: number;
  progressPercentage: number; // calculated from executed/planned or direct

  // Contrôle & Blocage
  blockingReason?: string;
  isInspectedByControlOffice?: boolean;
  notes?: string;
  attachmentsCount?: number;
}

export interface TaskFilterQuery {
  search?: string;
  projectId?: string;
  phaseId?: string;
  trade?: TaskTrade | "ALL";
  status?: TaskStatus | "ALL";
  priority?: TaskPriority | "ALL";
  assignedTeamId?: string;
}

export interface TasksStats {
  totalTasks: number;
  todoCount: number;
  inProgressCount: number;
  inValidationCount: number;
  validatedCount: number;
  blockedCount: number;
  overallAverageProgress: number;
  urgentTasksCount: number;
  totalQuantitiesVolumeBudgetFCFA: number;
}
