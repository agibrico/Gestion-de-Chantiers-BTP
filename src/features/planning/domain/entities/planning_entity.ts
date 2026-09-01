/**
 * AGB CHANTIER - Entités du Domaine Planning & Diagramme de Gantt - AXE 06
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type PhaseStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "DELAYED" | "BLOCKED";

export interface PhaseMilestone {
  id: string;
  name: string;
  targetDate: string;
  isReached: boolean;
  reachedDate?: string;
  importance: "CRITICAL" | "MAJOR" | "STANDARD";
  description?: string;
}

export interface PhaseEntity extends BaseEntity {
  projectId: string;
  projectName: string;
  code: string; // Ex: PH-01, PH-02
  name: string; // Ex: "Terrassement & Fondations Spéciales"
  description?: string;
  orderIndex: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  durationDays: number;
  actualStartDate?: string;
  actualEndDate?: string;
  progressPercentage: number; // 0 - 100
  status: PhaseStatus;
  colorTag: string; // Hex color for Gantt bar
  dependencies: string[]; // Phase IDs that must finish before this phase starts
  assignedTeamId?: string;
  assignedTeamName?: string;
  milestones: PhaseMilestone[];
  budgetAllocatedFCFA?: number;
  notes?: string;
  isCriticalPath?: boolean;
}

export interface PlanningStats {
  totalPhases: number;
  completedPhases: number;
  inProgressPhases: number;
  delayedPhases: number;
  plannedPhases: number;
  totalMilestones: number;
  reachedMilestones: number;
  overallProgressPercentage: number;
  criticalPathPhaseCount: number;
}
