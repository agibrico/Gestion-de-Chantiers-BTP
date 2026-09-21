/**
 * AGB CHANTIER - Helper & Moteur d'Analyse des Alertes de Dépassement de Dates Charnières
 * Calcule en temps réel les dépassements de jalons, phases et échéances contractuelles
 * pour alimenter les notifications contextuelles visuelles des widgets du Dashboard.
 */

import { ProjectEntity, ProjectMilestone, ProjectPhase } from "../../projects/domain/entities/project_entity";

export type MilestoneAlertSeverity = "CRITIQUE" | "MAJEURE" | "ATTENTION";

export type MilestoneAlertType =
  | "JALON_CRITIQUE" // Jalon avec isCritical === true
  | "JALON_STANDARD" // Jalon standard
  | "PHASE_ECHEANCE" // Échéance de phase terminée non tenue
  | "LIVRAISON_CONTRACTUELLE"; // Dépassement de la date de livraison finale

export interface OverdueMilestoneItem {
  id: string;
  title: string;
  targetDate: string; // YYYY-MM-DD
  overdueDays: number;
  isCritical: boolean;
  type: MilestoneAlertType;
  severity: MilestoneAlertSeverity;
  phaseName?: string;
  notes?: string;
}

export interface ProjectMilestoneAlertInfo {
  projectId: string;
  projectCode: string;
  projectName: string;
  hasOverdueMilestones: boolean;
  overdueItems: OverdueMilestoneItem[];
  criticalOverdueCount: number;
  standardOverdueCount: number;
  maxOverdueDays: number;
  mostCriticalItem: OverdueMilestoneItem | null;
  overallSeverity: MilestoneAlertSeverity;
}

export interface DashboardMilestoneAlertsSummary {
  totalProjectsWithOverdueMilestones: number;
  totalOverdueMilestonesCount: number;
  totalCriticalMilestonesCount: number;
  maxOverdueDaysAcrossAll: number;
  alertsByProjectId: Record<string, ProjectMilestoneAlertInfo>;
  projectsWithAlerts: ProjectMilestoneAlertInfo[];
}

/**
 * Calcule le nombre de jours d'écart entre deux dates ISO (YYYY-MM-DD)
 */
export function calculateDaysOverdue(targetDateStr: string, referenceDate: Date = new Date()): number {
  if (!targetDateStr) return 0;
  const target = new Date(targetDateStr);
  if (isNaN(target.getTime())) return 0;

  // Comparer sur la base de minuit pour éviter les biais d'heure
  const refMidnight = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const diffMs = refMidnight.getTime() - targetMidnight.getTime();
  if (diffMs <= 0) return 0;

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Analyse un chantier spécifique et extrait tous les dépassements de dates charnières
 */
export function analyzeProjectMilestoneAlerts(
  project: ProjectEntity,
  referenceDate: Date = new Date()
): ProjectMilestoneAlertInfo {
  const overdueItems: OverdueMilestoneItem[] = [];
  const refDateIso = referenceDate.toISOString().split("T")[0];

  // 1. Analyse des jalons explicites du chantier (milestones)
  if (project.milestones && Array.isArray(project.milestones)) {
    for (const milestone of project.milestones) {
      const isStatusOverdue = milestone.status === "EN_RETARD";
      const isPastTarget = milestone.targetDate < refDateIso;
      const isNotCompleted = !milestone.completedDate && milestone.status !== "VALIDE";

      if (isStatusOverdue || (isPastTarget && isNotCompleted)) {
        const days = calculateDaysOverdue(milestone.targetDate, referenceDate) || 1;
        const severity: MilestoneAlertSeverity =
          milestone.isCritical || days > 30 ? "CRITIQUE" : days > 14 ? "MAJEURE" : "ATTENTION";

        overdueItems.push({
          id: milestone.id,
          title: milestone.title,
          targetDate: milestone.targetDate,
          overdueDays: days,
          isCritical: !!milestone.isCritical,
          type: milestone.isCritical ? "JALON_CRITIQUE" : "JALON_STANDARD",
          severity,
        });
      }
    }
  }

  // 2. Analyse des phases en retard (échéances intermédiaires charnières)
  if (project.phases && Array.isArray(project.phases)) {
    for (const phase of project.phases) {
      const isPhaseOverdueStatus = phase.status === "RETARDEE";
      const isPhasePast = phase.endDate < refDateIso && phase.status !== "TERMINEE";

      if (isPhaseOverdueStatus || isPhasePast) {
        const days = calculateDaysOverdue(phase.endDate, referenceDate) || (isPhaseOverdueStatus ? 21 : 7);
        const severity: MilestoneAlertSeverity = days > 30 ? "CRITIQUE" : days > 14 ? "MAJEURE" : "ATTENTION";

        overdueItems.push({
          id: phase.id,
          title: `Échéance Phase : ${phase.name}`,
          targetDate: phase.endDate,
          overdueDays: days,
          isCritical: true, // Une phase clé de travaux est toujours structurante
          type: "PHASE_ECHEANCE",
          severity,
          phaseName: phase.name,
          notes: phase.description,
        });
      }
    }
  }

  // 3. Analyse du terme contractuel global (date de livraison prévisionnelle)
  if (
    project.status === "EN_COURS" &&
    project.estimatedEndDate &&
    project.estimatedEndDate < refDateIso &&
    project.progressPercentage < 100
  ) {
    const days = calculateDaysOverdue(project.estimatedEndDate, referenceDate) || 1;
    overdueItems.push({
      id: `delivery_${project.id}`,
      title: `Livraison Contractuelle Clé en Main`,
      targetDate: project.estimatedEndDate,
      overdueDays: days,
      isCritical: true,
      type: "LIVRAISON_CONTRACTUELLE",
      severity: "CRITIQUE",
      notes: `Avancement physique actuel : ${project.progressPercentage}%`,
    });
  }

  // Tri par criticité (critique d'abord) puis par nombre de jours de retard décroissant
  overdueItems.sort((a, b) => {
    if (a.isCritical !== b.isCritical) {
      return a.isCritical ? -1 : 1;
    }
    return b.overdueDays - a.overdueDays;
  });

  const criticalOverdueCount = overdueItems.filter((i) => i.isCritical).length;
  const standardOverdueCount = overdueItems.filter((i) => !i.isCritical).length;
  const maxOverdueDays = overdueItems.reduce((max, i) => Math.max(max, i.overdueDays), 0);
  const mostCriticalItem = overdueItems.length > 0 ? overdueItems[0] : null;

  let overallSeverity: MilestoneAlertSeverity = "ATTENTION";
  if (criticalOverdueCount > 0 || maxOverdueDays > 25) {
    overallSeverity = "CRITIQUE";
  } else if (maxOverdueDays > 10 || overdueItems.length > 1) {
    overallSeverity = "MAJEURE";
  }

  return {
    projectId: project.id,
    projectCode: project.code,
    projectName: project.name,
    hasOverdueMilestones: overdueItems.length > 0,
    overdueItems,
    criticalOverdueCount,
    standardOverdueCount,
    maxOverdueDays,
    mostCriticalItem,
    overallSeverity,
  };
}

/**
 * Analyse l'ensemble d'une liste de chantiers pour consolider les indicateurs de dépassement
 */
export function analyzeAllProjectsMilestoneAlerts(
  projects: ProjectEntity[],
  referenceDate: Date = new Date()
): DashboardMilestoneAlertsSummary {
  const alertsByProjectId: Record<string, ProjectMilestoneAlertInfo> = {};
  const projectsWithAlerts: ProjectMilestoneAlertInfo[] = [];

  let totalOverdueMilestonesCount = 0;
  let totalCriticalMilestonesCount = 0;
  let maxOverdueDaysAcrossAll = 0;

  for (const project of projects) {
    const alertInfo = analyzeProjectMilestoneAlerts(project, referenceDate);
    alertsByProjectId[project.id] = alertInfo;

    if (alertInfo.hasOverdueMilestones) {
      projectsWithAlerts.push(alertInfo);
      totalOverdueMilestonesCount += alertInfo.overdueItems.length;
      totalCriticalMilestonesCount += alertInfo.criticalOverdueCount;
      if (alertInfo.maxOverdueDays > maxOverdueDaysAcrossAll) {
        maxOverdueDaysAcrossAll = alertInfo.maxOverdueDays;
      }
    }
  }

  // Trier les projets avec alertes par sévérité puis par retard max
  projectsWithAlerts.sort((a, b) => {
    if (a.overallSeverity !== b.overallSeverity) {
      if (a.overallSeverity === "CRITIQUE") return -1;
      if (b.overallSeverity === "CRITIQUE") return 1;
      if (a.overallSeverity === "MAJEURE") return -1;
      if (b.overallSeverity === "MAJEURE") return 1;
    }
    return b.maxOverdueDays - a.maxOverdueDays;
  });

  return {
    totalProjectsWithOverdueMilestones: projectsWithAlerts.length,
    totalOverdueMilestonesCount,
    totalCriticalMilestonesCount,
    maxOverdueDaysAcrossAll,
    alertsByProjectId,
    projectsWithAlerts,
  };
}
