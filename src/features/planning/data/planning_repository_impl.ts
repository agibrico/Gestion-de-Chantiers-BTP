/**
 * AGB CHANTIER - Implémentation du Repository Planning & Gantt avec IndexedDB - AXE 06
 */

import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { PhaseEntity, PlanningStats } from "../domain/entities/planning_entity";
import { PlanningRepository } from "../domain/repositories/planning_repository";

const INITIAL_PHASES_MOCK: Array<Omit<PhaseEntity, "id" | "createdAt" | "updatedAt">> = [
  // Chantier 1: Tour Horizon (PRJ-2026-001)
  {
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    code: "PH-01",
    name: "Terrassements Généraux & Soutènement",
    description: "Fouille en pleine masse, parois moulées et tirants d'ancrage",
    orderIndex: 1,
    startDate: "2026-01-15",
    endDate: "2026-03-30",
    durationDays: 74,
    actualStartDate: "2026-01-15",
    actualEndDate: "2026-03-25",
    progressPercentage: 100,
    status: "COMPLETED",
    colorTag: "#64748b",
    dependencies: [],
    assignedTeamName: "Équipe VRD & Terrassement",
    budgetAllocatedFCFA: 420000000,
    isCriticalPath: true,
    milestones: [
      {
        id: "m_001_1",
        name: "Réception de la plateforme terrassement",
        targetDate: "2026-03-20",
        isReached: true,
        reachedDate: "2026-03-20",
        importance: "CRITICAL",
      },
    ],
  },
  {
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    code: "PH-02",
    name: "Fondations Profondes & Radier Général B25",
    description: "Pieux forés gros diamètre 1200mm et coulage du radier épaisseur 1.80m",
    orderIndex: 2,
    startDate: "2026-04-01",
    endDate: "2026-06-15",
    durationDays: 75,
    actualStartDate: "2026-04-02",
    progressPercentage: 85,
    status: "IN_PROGRESS",
    colorTag: "#ea580c",
    dependencies: ["PH-01"],
    assignedTeamName: "Équipe Gros Œuvre Alpha",
    budgetAllocatedFCFA: 680000000,
    isCriticalPath: true,
    milestones: [
      {
        id: "m_001_2",
        name: "Coulage continu du radier 1400 m³",
        targetDate: "2026-05-15",
        isReached: true,
        reachedDate: "2026-05-18",
        importance: "CRITICAL",
      },
      {
        id: "m_001_3",
        name: "Contrôle éprouvettes 28 jours Labo",
        targetDate: "2026-06-15",
        isReached: false,
        importance: "MAJOR",
      },
    ],
  },
  {
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    code: "PH-03",
    name: "Infrastructure Sous-Sols (SS-2 & SS-1)",
    description: "Voiles périphériques étanches, poteaux et dalles pleines",
    orderIndex: 3,
    startDate: "2026-06-16",
    endDate: "2026-08-30",
    durationDays: 75,
    progressPercentage: 20,
    status: "IN_PROGRESS",
    colorTag: "#f59e0b",
    dependencies: ["PH-02"],
    assignedTeamName: "Équipe Gros Œuvre Alpha",
    budgetAllocatedFCFA: 540000000,
    isCriticalPath: true,
    milestones: [
      {
        id: "m_001_4",
        name: "Arrivée au niveau dalle haute SS-1 (Niv 0.00)",
        targetDate: "2026-08-25",
        isReached: false,
        importance: "CRITICAL",
      },
    ],
  },
  {
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    code: "PH-04",
    name: "Superstructure RDC à R+14 (Élévations)",
    description: "Noyau central béton armé, planchers champignons et portiques",
    orderIndex: 4,
    startDate: "2026-09-01",
    endDate: "2027-04-30",
    durationDays: 241,
    progressPercentage: 0,
    status: "PLANNED",
    colorTag: "#3b82f6",
    dependencies: ["PH-03"],
    assignedTeamName: "Équipe Gros Œuvre Alpha",
    budgetAllocatedFCFA: 1850000000,
    isCriticalPath: true,
    milestones: [
      {
        id: "m_001_5",
        name: "Arrivée au plancher R+7 (Mi-hauteur)",
        targetDate: "2026-12-20",
        isReached: false,
        importance: "MAJOR",
      },
      {
        id: "m_001_6",
        name: "Bouquet final & Dernier niveau R+14",
        targetDate: "2027-04-20",
        isReached: false,
        importance: "CRITICAL",
      },
    ],
  },
  {
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    code: "PH-05",
    name: "Corps d'État Secondaires (CFO/CFA, CVC, Plomberie)",
    description: "Installations électriques, gaines de désenfumage, tuyauterie cuivre",
    orderIndex: 5,
    startDate: "2027-01-10",
    endDate: "2027-08-15",
    durationDays: 217,
    progressPercentage: 0,
    status: "PLANNED",
    colorTag: "#8b5cf6",
    dependencies: ["PH-04"],
    assignedTeamName: "Équipe Électricité & Fluides",
    budgetAllocatedFCFA: 890000000,
    isCriticalPath: false,
    milestones: [
      {
        id: "m_001_7",
        name: "Mise sous tension transfo provisoire",
        targetDate: "2027-05-30",
        isReached: false,
        importance: "CRITICAL",
      },
    ],
  },
  {
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    code: "PH-06",
    name: "Façades Rideaux Vitrées & Étanchéité Toiture",
    description: "Murs rideaux double vitrage thermique et isolation complexe terrasse",
    orderIndex: 6,
    startDate: "2027-03-01",
    endDate: "2027-09-30",
    durationDays: 213,
    progressPercentage: 0,
    status: "PLANNED",
    colorTag: "#06b6d4",
    dependencies: ["PH-04"],
    budgetAllocatedFCFA: 650000000,
    isCriticalPath: false,
    milestones: [
      {
        id: "m_001_8",
        name: "Test d'étanchéité à l'eau AEV Façades",
        targetDate: "2027-08-15",
        isReached: false,
        importance: "MAJOR",
      },
    ],
  },
  {
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    code: "PH-07",
    name: "Finitions, Revêtements & Peintures",
    description: "Carrelage grès cérame, faux-plafonds acoustiques, peinture époxy",
    orderIndex: 7,
    startDate: "2027-06-01",
    endDate: "2027-11-15",
    durationDays: 167,
    progressPercentage: 0,
    status: "PLANNED",
    colorTag: "#10b981",
    dependencies: ["PH-05", "PH-06"],
    budgetAllocatedFCFA: 480000000,
    isCriticalPath: true,
    milestones: [
      {
        id: "m_001_9",
        name: "Levée des pré-réserves architecte",
        targetDate: "2027-11-01",
        isReached: false,
        importance: "CRITICAL",
      },
    ],
  },
  {
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    code: "PH-08",
    name: "Essais, Mise en Service & OPR",
    description: "Opérations Préalables à la Réception, commissionnement SSI & CVC",
    orderIndex: 8,
    startDate: "2027-11-16",
    endDate: "2027-12-20",
    durationDays: 34,
    progressPercentage: 0,
    status: "PLANNED",
    colorTag: "#14b8a6",
    dependencies: ["PH-07"],
    budgetAllocatedFCFA: 90000000,
    isCriticalPath: true,
    milestones: [
      {
        id: "m_001_10",
        name: "Procès-Verbal de Réception Provisoire",
        targetDate: "2027-12-20",
        isReached: false,
        importance: "CRITICAL",
      },
    ],
  },

  // Chantier 2: Résidence Riviera (PRJ-2026-002)
  {
    projectId: "prj_002",
    projectName: "Résidence Haut Standing Les Jardins de la Riviera",
    code: "PH-01",
    name: "Infrastructures & Gros Œuvre R+4",
    description: "Fondations superficielles, poteaux, poutres et planchers corps creux",
    orderIndex: 1,
    startDate: "2026-02-01",
    endDate: "2026-07-31",
    durationDays: 180,
    actualStartDate: "2026-02-01",
    progressPercentage: 70,
    status: "IN_PROGRESS",
    colorTag: "#ea580c",
    dependencies: [],
    assignedTeamName: "Équipe Maçonnerie & Finitions",
    budgetAllocatedFCFA: 650000000,
    isCriticalPath: true,
    milestones: [
      {
        id: "m_002_1",
        name: "Plancher haut R+2 achevé",
        targetDate: "2026-05-30",
        isReached: true,
        reachedDate: "2026-05-28",
        importance: "CRITICAL",
      },
    ],
  },
  {
    projectId: "prj_002",
    projectName: "Résidence Haut Standing Les Jardins de la Riviera",
    code: "PH-02",
    name: "Second Œuvre & Lots Techniques",
    description: "Électricité, plomberie sanitaire, étanchéité des terrasses accessibles",
    orderIndex: 2,
    startDate: "2026-06-15",
    endDate: "2026-11-30",
    durationDays: 168,
    progressPercentage: 15,
    status: "IN_PROGRESS",
    colorTag: "#3b82f6",
    dependencies: ["PH-01"],
    assignedTeamName: "Équipe Électricité & Fluides",
    budgetAllocatedFCFA: 420000000,
    isCriticalPath: true,
    milestones: [
      {
        id: "m_002_2",
        name: "Essai d'étanchéité par mise en eau 48h",
        targetDate: "2026-09-15",
        isReached: false,
        importance: "MAJOR",
      },
    ],
  },
];

export class PlanningRepositoryImpl implements PlanningRepository {
  private static instance: PlanningRepositoryImpl | null = null;

  public static getInstance(): PlanningRepositoryImpl {
    if (!this.instance) {
      this.instance = new PlanningRepositoryImpl();
    }
    return this.instance;
  }

  public async seedInitialPhasesIfEmpty(): Promise<void> {
    try {
      const existing = await IdbAdapter.getAll<PhaseEntity>(IdbAdapter.STORES.PHASES);
      if (existing.length === 0) {
        const now = new Date().toISOString();
        for (const phase of INITIAL_PHASES_MOCK) {
          const entity: PhaseEntity = {
            ...phase,
            id: `phase_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          };
          await IdbAdapter.put<PhaseEntity>(IdbAdapter.STORES.PHASES, entity);
        }
      }
    } catch (e) {
      console.warn("Seeding initial phases warning", e);
    }
  }

  public async getAllPhases(): Promise<PhaseEntity[]> {
    await this.seedInitialPhasesIfEmpty();
    const phases = await IdbAdapter.getAll<PhaseEntity>(IdbAdapter.STORES.PHASES);
    return phases.sort((a, b) => a.orderIndex - b.orderIndex || a.startDate.localeCompare(b.startDate));
  }

  public async getPhasesByProject(projectId: string): Promise<PhaseEntity[]> {
    const all = await this.getAllPhases();
    if (!projectId || projectId === "ALL") return all;
    return all.filter((p) => p.projectId === projectId);
  }

  public async getPhaseById(id: string): Promise<PhaseEntity | null> {
    return IdbAdapter.getById<PhaseEntity>(IdbAdapter.STORES.PHASES, id);
  }

  public async createPhase(
    phaseData: Omit<PhaseEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<PhaseEntity> {
    const now = new Date().toISOString();
    const newEntity: PhaseEntity = {
      ...phaseData,
      id: `phase_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };
    await IdbAdapter.put<PhaseEntity>(IdbAdapter.STORES.PHASES, newEntity);
    return newEntity;
  }

  public async updatePhase(phase: PhaseEntity): Promise<PhaseEntity> {
    const updated: PhaseEntity = {
      ...phase,
      updatedAt: new Date().toISOString(),
      syncStatus: "local",
    };
    await IdbAdapter.put<PhaseEntity>(IdbAdapter.STORES.PHASES, updated);
    return updated;
  }

  public async deletePhase(id: string): Promise<void> {
    await IdbAdapter.delete(IdbAdapter.STORES.PHASES, id);
  }

  public async updatePhaseProgress(
    id: string,
    progress: number,
    status?: PhaseEntity["status"]
  ): Promise<PhaseEntity> {
    const phase = await this.getPhaseById(id);
    if (!phase) throw new Error("Phase introuvable");

    const clampedProgress = Math.min(100, Math.max(0, progress));
    let newStatus = status || phase.status;
    if (clampedProgress === 100) newStatus = "COMPLETED";
    else if (clampedProgress > 0 && newStatus === "PLANNED") newStatus = "IN_PROGRESS";

    const updated: PhaseEntity = {
      ...phase,
      progressPercentage: clampedProgress,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      syncStatus: "local",
    };
    await IdbAdapter.put<PhaseEntity>(IdbAdapter.STORES.PHASES, updated);
    return updated;
  }

  public async toggleMilestone(
    phaseId: string,
    milestoneId: string,
    isReached: boolean
  ): Promise<PhaseEntity> {
    const phase = await this.getPhaseById(phaseId);
    if (!phase) throw new Error("Phase introuvable");

    const updatedMilestones = phase.milestones.map((m) => {
      if (m.id === milestoneId) {
        return {
          ...m,
          isReached,
          reachedDate: isReached ? new Date().toISOString().split("T")[0] : undefined,
        };
      }
      return m;
    });

    const updated: PhaseEntity = {
      ...phase,
      milestones: updatedMilestones,
      updatedAt: new Date().toISOString(),
    };
    await IdbAdapter.put<PhaseEntity>(IdbAdapter.STORES.PHASES, updated);
    return updated;
  }

  public async calculatePlanningStats(projectId?: string): Promise<PlanningStats> {
    const phases = await this.getPhasesByProject(projectId || "ALL");
    const totalPhases = phases.length;
    const completedPhases = phases.filter((p) => p.status === "COMPLETED").length;
    const inProgressPhases = phases.filter((p) => p.status === "IN_PROGRESS").length;
    const delayedPhases = phases.filter((p) => p.status === "DELAYED").length;
    const plannedPhases = phases.filter((p) => p.status === "PLANNED").length;
    const criticalPathPhaseCount = phases.filter((p) => p.isCriticalPath).length;

    let totalMilestones = 0;
    let reachedMilestones = 0;
    let totalProgressSum = 0;

    for (const p of phases) {
      totalProgressSum += p.progressPercentage;
      if (p.milestones) {
        totalMilestones += p.milestones.length;
        reachedMilestones += p.milestones.filter((m) => m.isReached).length;
      }
    }

    const overallProgressPercentage = totalPhases > 0 ? Math.round(totalProgressSum / totalPhases) : 0;

    return {
      totalPhases,
      completedPhases,
      inProgressPhases,
      delayedPhases,
      plannedPhases,
      totalMilestones,
      reachedMilestones,
      overallProgressPercentage,
      criticalPathPhaseCount,
    };
  }
}
