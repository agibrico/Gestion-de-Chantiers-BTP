/**
 * AGB CHANTIER - Interface du Repository Intervenants & Équipes BTP - AXE 05
 */

import { StakeholderEntity, StakeholderCategory } from "../entities/stakeholder_entity";
import { TeamEntity, TeamCategory } from "../entities/team_entity";
import { WorkerEntity, WorkerTrade, WorkerStatus } from "../entities/worker_entity";

export interface StakeholdersFilterQuery {
  search?: string;
  category?: StakeholderCategory | "ALL";
  projectId?: string;
}

export interface WorkersFilterQuery {
  search?: string;
  trade?: WorkerTrade | "ALL";
  status?: WorkerStatus | "ALL";
  projectId?: string;
  teamId?: string;
  hasValidCertifications?: boolean;
}

export interface Axe05Stats {
  totalStakeholders: number;
  totalSubcontractors: number;
  totalControlOffices: number;
  totalTeams: number;
  totalWorkers: number;
  workersOnSiteToday: number;
  expiringCertificationsCount: number;
}

export interface IStakeholdersTeamsRepository {
  // Stakeholders
  getAllStakeholders(query?: StakeholdersFilterQuery): Promise<StakeholderEntity[]>;
  getStakeholderById(id: string): Promise<StakeholderEntity | null>;
  createStakeholder(stakeholder: Omit<StakeholderEntity, "id" | "createdAt" | "updatedAt">): Promise<StakeholderEntity>;
  updateStakeholder(stakeholder: StakeholderEntity): Promise<StakeholderEntity>;
  deleteStakeholder(id: string): Promise<boolean>;

  // Teams
  getAllTeams(projectId?: string): Promise<TeamEntity[]>;
  getTeamById(id: string): Promise<TeamEntity | null>;
  createTeam(team: Omit<TeamEntity, "id" | "createdAt" | "updatedAt">): Promise<TeamEntity>;
  updateTeam(team: TeamEntity): Promise<TeamEntity>;
  deleteTeam(id: string): Promise<boolean>;

  // Workers
  getAllWorkers(query?: WorkersFilterQuery): Promise<WorkerEntity[]>;
  getWorkerById(id: string): Promise<WorkerEntity | null>;
  createWorker(worker: Omit<WorkerEntity, "id" | "createdAt" | "updatedAt">): Promise<WorkerEntity>;
  updateWorker(worker: WorkerEntity): Promise<WorkerEntity>;
  deleteWorker(id: string): Promise<boolean>;
  updateWorkerStatus(id: string, status: WorkerStatus, projectId?: string): Promise<void>;

  // Stats & Export
  getAxe05Stats(): Promise<Axe05Stats>;
  exportWorkersToCsv(workers: WorkerEntity[]): string;
  exportStakeholdersToCsv(stakeholders: StakeholderEntity[]): string;
}
