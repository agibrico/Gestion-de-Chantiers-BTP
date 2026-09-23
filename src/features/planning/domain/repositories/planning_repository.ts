/**
 * AGB CHANTIER - Interface du Repository Planning & Gantt - AXE 06
 */

import { PhaseEntity, PlanningStats } from "../entities/planning_entity";

export interface PlanningRepository {
  getAllPhases(): Promise<PhaseEntity[]>;
  getPhasesByProject(projectId: string): Promise<PhaseEntity[]>;
  getPhaseById(id: string): Promise<PhaseEntity | null>;
  createPhase(phase: Omit<PhaseEntity, "id" | "createdAt" | "updatedAt">): Promise<PhaseEntity>;
  updatePhase(phase: PhaseEntity): Promise<PhaseEntity>;
  deletePhase(id: string): Promise<void>;
  updatePhaseProgress(id: string, progress: number, status?: PhaseEntity["status"]): Promise<PhaseEntity>;
  toggleMilestone(phaseId: string, milestoneId: string, isReached: boolean): Promise<PhaseEntity>;
  calculatePlanningStats(projectId?: string): Promise<PlanningStats>;
  seedInitialPhasesIfEmpty(): Promise<void>;
}
