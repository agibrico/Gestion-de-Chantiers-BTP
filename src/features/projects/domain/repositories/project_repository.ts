/**
 * AGB CHANTIER - Interface du Repository Chantiers & Projets - AXE 04
 */

import {
  ProjectEntity,
  ProjectPhase,
  ProjectMilestone,
  ProjectFilterQuery,
  ProjectStats,
} from "../entities/project_entity";

export interface CreateProjectDTO {
  code?: string;
  name: string;
  description: string;
  type: ProjectEntity["type"];
  status?: ProjectEntity["status"];
  riskLevel?: ProjectEntity["riskLevel"];
  clientId: string;
  clientName: string;
  clientType?: string;
  clientContactPerson?: string;
  clientPhone?: string;
  location: ProjectEntity["location"];
  startDate: string;
  estimatedEndDate: string;
  surfaceAreaM2?: number;
  numberOfFloors?: string;
  buildingPermitNumber?: string;
  totalBudgetEstimated: number;
  totalBudgetContracted: number;
  retentionGuaranteeRate?: number;
  managementTeam: ProjectEntity["managementTeam"];
  tags?: string[];
  notes?: string;
}

export interface IProjectRepository {
  getAllProjects(query?: ProjectFilterQuery): Promise<ProjectEntity[]>;
  getProjectById(id: string): Promise<ProjectEntity | null>;
  createProject(dto: CreateProjectDTO): Promise<ProjectEntity>;
  updateProject(project: ProjectEntity): Promise<ProjectEntity>;
  deleteProject(id: string): Promise<boolean>;
  updateProgress(id: string, progress: number): Promise<ProjectEntity>;
  addPhase(projectId: string, phase: Omit<ProjectPhase, "id">): Promise<ProjectEntity>;
  updatePhase(projectId: string, phase: ProjectPhase): Promise<ProjectEntity>;
  deletePhase(projectId: string, phaseId: string): Promise<ProjectEntity>;
  addMilestone(projectId: string, milestone: Omit<ProjectMilestone, "id">): Promise<ProjectEntity>;
  updateMilestone(projectId: string, milestone: ProjectMilestone): Promise<ProjectEntity>;
  deleteMilestone(projectId: string, milestoneId: string): Promise<ProjectEntity>;
  getProjectStats(): Promise<ProjectStats>;
  exportToCsv(projects: ProjectEntity[]): string;
  initializeSeedData(): Promise<void>;
}
