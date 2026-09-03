/**
 * AGB CHANTIER - Implémentation Repository Travaux & Tâches - AXE 07
 */

import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { TaskEntity, TaskFilterQuery, TasksStats, TaskStatus } from "../domain/entities/task_entity";
import { TaskRepository } from "../domain/repositories/task_repository";

const INITIAL_TASKS_MOCK: Array<Omit<TaskEntity, "id" | "createdAt" | "updatedAt">> = [
  {
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    code: "TSK-001",
    title: "Coulage radier général béton B25 hydrofugé",
    description: "Coulage continu avec 2 pompes à béton 36m et vibreurs aiguilles",
    trade: "GROS_OEUVRE",
    priority: "URGENT",
    status: "VALIDE_CONFORME",
    assignedTeamName: "Équipe Gros Œuvre Alpha",
    assignedWorkerName: "M. Traoré Souleymane",
    plannedStartDate: "2026-05-10",
    plannedEndDate: "2026-05-20",
    actualStartDate: "2026-05-12",
    actualEndDate: "2026-05-19",
    estimatedHours: 80,
    actualHours: 76,
    unit: "m³",
    quantityPlanned: 1200,
    quantityExecuted: 1200,
    unitPriceFCFA: 125000,
    totalBudgetFCFA: 150000000,
    progressPercentage: 100,
    isInspectedByControlOffice: true,
  },
  {
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    code: "TSK-002",
    title: "Ferraillage & Façonnage Poteaux et Voiles SS-1",
    description: "Pose armatures haute adhérence FeE500 HA14 et HA16 avec cales à béton",
    trade: "FERRAILLAGE",
    priority: "HIGH",
    status: "EN_COURS",
    assignedTeamName: "Équipe Ferraillage & Armatures",
    assignedWorkerName: "Kouakou Jean-Yves",
    plannedStartDate: "2026-06-01",
    plannedEndDate: "2026-06-25",
    actualStartDate: "2026-06-02",
    estimatedHours: 120,
    actualHours: 85,
    unit: "tonne",
    quantityPlanned: 45,
    quantityExecuted: 32,
    unitPriceFCFA: 780000,
    totalBudgetFCFA: 35100000,
    progressPercentage: 71,
    isInspectedByControlOffice: false,
  },
  {
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    code: "TSK-003",
    title: "Coffrage & Banche Métallique Voiles périphériques",
    description: "Mise en place banches manuportables avec tiges d'entretoise et huile de décoffrage",
    trade: "GROS_OEUVRE",
    priority: "HIGH",
    status: "EN_COURS",
    assignedTeamName: "Équipe Gros Œuvre Alpha",
    plannedStartDate: "2026-06-10",
    plannedEndDate: "2026-07-05",
    actualStartDate: "2026-06-12",
    estimatedHours: 95,
    actualHours: 45,
    unit: "m²",
    quantityPlanned: 850,
    quantityExecuted: 420,
    unitPriceFCFA: 32000,
    totalBudgetFCFA: 27200000,
    progressPercentage: 49,
  },
  {
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    code: "TSK-004",
    title: "Tirage Fourreaux Électriques & Réservations Dalle",
    description: "Pose gaines ICTA et boîtes de dérivation encastrées avant coulage plancher",
    trade: "ELECTRICITE",
    priority: "MEDIUM",
    status: "EN_ATTENTE_VALIDATION",
    assignedTeamName: "Équipe Électricité & Fluides",
    plannedStartDate: "2026-06-20",
    plannedEndDate: "2026-07-02",
    actualStartDate: "2026-06-20",
    estimatedHours: 40,
    unit: "ml",
    quantityPlanned: 1600,
    quantityExecuted: 1550,
    unitPriceFCFA: 4500,
    totalBudgetFCFA: 7200000,
    progressPercentage: 97,
  },
  {
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    code: "TSK-005",
    title: "Évacuation des Eaux Vannes & Pluviales en Sous-sol",
    description: "Pose canalisations PVC assainissement Ø160 avec pentes à 2%",
    trade: "PLOMBERIE",
    priority: "MEDIUM",
    status: "BLOQUE",
    blockingReason: "Attente livraison raccords PVC Ø160 coudes 45° par le fournisseur",
    assignedTeamName: "Équipe Électricité & Fluides",
    plannedStartDate: "2026-06-15",
    plannedEndDate: "2026-06-30",
    estimatedHours: 35,
    unit: "ml",
    quantityPlanned: 320,
    quantityExecuted: 60,
    unitPriceFCFA: 12000,
    totalBudgetFCFA: 3840000,
    progressPercentage: 19,
  },
  {
    projectId: "prj_002",
    projectName: "Résidence Haut Standing Les Jardins de la Riviera",
    code: "TSK-006",
    title: "Maçonnerie Agglos Creux 15cm RDC & R+1",
    description: "Montage murs de refend et cloisons en agglos de 15 avec joints au mortier gras",
    trade: "MACONNERIE",
    priority: "HIGH",
    status: "EN_COURS",
    assignedTeamName: "Équipe Maçonnerie & Finitions",
    plannedStartDate: "2026-05-15",
    plannedEndDate: "2026-07-15",
    actualStartDate: "2026-05-18",
    estimatedHours: 160,
    unit: "m²",
    quantityPlanned: 1400,
    quantityExecuted: 980,
    unitPriceFCFA: 14500,
    totalBudgetFCFA: 20300000,
    progressPercentage: 70,
  },
  {
    projectId: "prj_002",
    projectName: "Résidence Haut Standing Les Jardins de la Riviera",
    code: "TSK-007",
    title: "Étanchéité Bicouche élastomère Balcons et Loggias",
    description: "Application primaire d'accrochage bitumineux et membrane soudée à chaud",
    trade: "ETANCHEITE",
    priority: "HIGH",
    status: "A_FAIRE",
    assignedTeamName: "Équipe Maçonnerie & Finitions",
    plannedStartDate: "2026-07-01",
    plannedEndDate: "2026-07-25",
    estimatedHours: 50,
    unit: "m²",
    quantityPlanned: 350,
    quantityExecuted: 0,
    unitPriceFCFA: 22000,
    totalBudgetFCFA: 7700000,
    progressPercentage: 0,
  },
];

export class TaskRepositoryImpl implements TaskRepository {
  private static instance: TaskRepositoryImpl | null = null;

  public static getInstance(): TaskRepositoryImpl {
    if (!this.instance) {
      this.instance = new TaskRepositoryImpl();
    }
    return this.instance;
  }

  public async seedInitialTasksIfEmpty(): Promise<void> {
    try {
      const existing = await IdbAdapter.getAll<TaskEntity>(IdbAdapter.STORES.TASKS);
      if (existing.length === 0) {
        const now = new Date().toISOString();
        for (const task of INITIAL_TASKS_MOCK) {
          const entity: TaskEntity = {
            ...task,
            id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          };
          await IdbAdapter.put<TaskEntity>(IdbAdapter.STORES.TASKS, entity);
        }
      }
    } catch (e) {
      console.warn("Seeding initial tasks warning", e);
    }
  }

  public async getAllTasks(query?: TaskFilterQuery): Promise<TaskEntity[]> {
    await this.seedInitialTasksIfEmpty();
    let tasks = await IdbAdapter.getAll<TaskEntity>(IdbAdapter.STORES.TASKS);

    if (query) {
      if (query.projectId && query.projectId !== "ALL") {
        tasks = tasks.filter((t) => t.projectId === query.projectId);
      }
      if (query.trade && query.trade !== "ALL") {
        tasks = tasks.filter((t) => t.trade === query.trade);
      }
      if (query.status && query.status !== "ALL") {
        tasks = tasks.filter((t) => t.status === query.status);
      }
      if (query.priority && query.priority !== "ALL") {
        tasks = tasks.filter((t) => t.priority === query.priority);
      }
      if (query.search && query.search.trim()) {
        const s = query.search.toLowerCase();
        tasks = tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(s) ||
            t.code.toLowerCase().includes(s) ||
            (t.description && t.description.toLowerCase().includes(s)) ||
            (t.assignedTeamName && t.assignedTeamName.toLowerCase().includes(s))
        );
      }
    }

    return tasks.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  public async getTaskById(id: string): Promise<TaskEntity | null> {
    return IdbAdapter.getById<TaskEntity>(IdbAdapter.STORES.TASKS, id);
  }

  public async createTask(taskData: Omit<TaskEntity, "id" | "createdAt" | "updatedAt">): Promise<TaskEntity> {
    const now = new Date().toISOString();
    const newEntity: TaskEntity = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };
    await IdbAdapter.put<TaskEntity>(IdbAdapter.STORES.TASKS, newEntity);
    return newEntity;
  }

  public async updateTask(task: TaskEntity): Promise<TaskEntity> {
    const updated: TaskEntity = {
      ...task,
      updatedAt: new Date().toISOString(),
      syncStatus: "local",
    };
    await IdbAdapter.put<TaskEntity>(IdbAdapter.STORES.TASKS, updated);
    return updated;
  }

  public async deleteTask(id: string): Promise<void> {
    await IdbAdapter.delete(IdbAdapter.STORES.TASKS, id);
  }

  public async updateTaskStatus(id: string, status: TaskStatus, blockingReason?: string): Promise<TaskEntity> {
    const task = await this.getTaskById(id);
    if (!task) throw new Error("Tâche introuvable");

    let progress = task.progressPercentage;
    if (status === "VALIDE_CONFORME") {
      progress = 100;
    } else if (status === "A_FAIRE" && progress === 100) {
      progress = 0;
    }

    const updated: TaskEntity = {
      ...task,
      status,
      progressPercentage: progress,
      blockingReason: status === "BLOQUE" ? blockingReason || "Blocage technique terrain" : undefined,
      updatedAt: new Date().toISOString(),
    };
    await IdbAdapter.put<TaskEntity>(IdbAdapter.STORES.TASKS, updated);
    return updated;
  }

  public async updateTaskProgress(
    id: string,
    quantityExecuted: number,
    progressPercentage?: number
  ): Promise<TaskEntity> {
    const task = await this.getTaskById(id);
    if (!task) throw new Error("Tâche introuvable");

    const exec = Math.max(0, quantityExecuted);
    let progress = progressPercentage;
    if (progress === undefined) {
      progress = task.quantityPlanned > 0 ? Math.min(100, Math.round((exec / task.quantityPlanned) * 100)) : 0;
    }

    let status = task.status;
    if (progress >= 100 && status !== "VALIDE_CONFORME") {
      status = "EN_ATTENTE_VALIDATION";
    } else if (progress > 0 && status === "A_FAIRE") {
      status = "EN_COURS";
    }

    const updated: TaskEntity = {
      ...task,
      quantityExecuted: exec,
      progressPercentage: progress,
      status,
      updatedAt: new Date().toISOString(),
    };
    await IdbAdapter.put<TaskEntity>(IdbAdapter.STORES.TASKS, updated);
    return updated;
  }

  public async calculateTasksStats(projectId?: string): Promise<TasksStats> {
    const tasks = await this.getAllTasks(projectId && projectId !== "ALL" ? { projectId } : undefined);

    const totalTasks = tasks.length;
    const todoCount = tasks.filter((t) => t.status === "A_FAIRE").length;
    const inProgressCount = tasks.filter((t) => t.status === "EN_COURS").length;
    const inValidationCount = tasks.filter((t) => t.status === "EN_ATTENTE_VALIDATION").length;
    const validatedCount = tasks.filter((t) => t.status === "VALIDE_CONFORME").length;
    const blockedCount = tasks.filter((t) => t.status === "BLOQUE").length;
    const urgentTasksCount = tasks.filter((t) => t.priority === "URGENT").length;

    let totalProgressSum = 0;
    let totalBudget = 0;

    for (const t of tasks) {
      totalProgressSum += t.progressPercentage || 0;
      totalBudget += t.totalBudgetFCFA || 0;
    }

    const overallAverageProgress = totalTasks > 0 ? Math.round(totalProgressSum / totalTasks) : 0;

    return {
      totalTasks,
      todoCount,
      inProgressCount,
      inValidationCount,
      validatedCount,
      blockedCount,
      overallAverageProgress,
      urgentTasksCount,
      totalQuantitiesVolumeBudgetFCFA: totalBudget,
    };
  }
}
