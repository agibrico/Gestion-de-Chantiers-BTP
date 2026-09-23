/**
 * AGB CHANTIER - Interface du Repository Travaux & Tâches - AXE 07
 */

import { TaskEntity, TaskFilterQuery, TasksStats, TaskStatus } from "../entities/task_entity";

export interface TaskRepository {
  getAllTasks(query?: TaskFilterQuery): Promise<TaskEntity[]>;
  getTaskById(id: string): Promise<TaskEntity | null>;
  createTask(task: Omit<TaskEntity, "id" | "createdAt" | "updatedAt">): Promise<TaskEntity>;
  updateTask(task: TaskEntity): Promise<TaskEntity>;
  deleteTask(id: string): Promise<void>;
  updateTaskStatus(id: string, status: TaskStatus, blockingReason?: string): Promise<TaskEntity>;
  updateTaskProgress(id: string, quantityExecuted: number, progressPercentage?: number): Promise<TaskEntity>;
  calculateTasksStats(projectId?: string): Promise<TasksStats>;
  seedInitialTasksIfEmpty(): Promise<void>;
}
