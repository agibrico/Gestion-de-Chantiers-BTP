/**
 * AGB CHANTIER - Contexte d'État Planning & Gantt - AXE 06
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PhaseEntity, PlanningStats } from "../domain/entities/planning_entity";
import { PlanningRepositoryImpl } from "../data/planning_repository_impl";
import { useToast } from "../../../core/widgets/feedback/app_toast";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { ProjectEntity } from "../../projects/domain/entities/project_entity";

interface PlanningContextType {
  phases: PhaseEntity[];
  projects: ProjectEntity[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  stats: PlanningStats | null;
  isLoading: boolean;
  activeView: "GANTT" | "LIST" | "MILESTONES";
  setActiveView: (v: "GANTT" | "LIST" | "MILESTONES") => void;
  refreshPhases: () => Promise<void>;
  createPhase: (data: any) => Promise<void>;
  updatePhase: (data: any) => Promise<void>;
  deletePhase: (id: string) => Promise<void>;
  updateProgress: (phaseId: string, progress: number) => Promise<void>;
  toggleMilestone: (phaseId: string, milestoneId: string, isReached: boolean) => Promise<void>;
  exportPlanningCsv: () => void;
}

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

export const PlanningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast();
  const repository = PlanningRepositoryImpl.getInstance();

  const [phases, setPhases] = useState<PhaseEntity[]>([]);
  const [projects, setProjects] = useState<ProjectEntity[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("ALL");
  const [stats, setStats] = useState<PlanningStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<"GANTT" | "LIST" | "MILESTONES">("GANTT");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allPhases, allProjects, calculatedStats] = await Promise.all([
        repository.getPhasesByProject(selectedProjectId),
        IdbAdapter.getAll<ProjectEntity>(IdbAdapter.STORES.PROJECTS),
        repository.calculatePlanningStats(selectedProjectId),
      ]);
      setPhases(allPhases);
      setProjects(allProjects);
      setStats(calculatedStats);
    } catch (e) {
      console.error("Erreur chargement planning", e);
      toast.error("Erreur de chargement du planning");
    } finally {
      setIsLoading(false);
    }
  }, [selectedProjectId, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createPhase = async (data: any) => {
    try {
      await repository.createPhase(data);
      toast.success("Phase créée avec succès", `La phase "${data.name}" a été intégrée au Gantt.`);
      await loadData();
    } catch (e) {
      toast.error("Erreur lors de la création de la phase");
      throw e;
    }
  };

  const updatePhase = async (data: any) => {
    try {
      await repository.updatePhase(data);
      toast.success("Phase mise à jour", `La phase "${data.name}" a été enregistrée.`);
      await loadData();
    } catch (e) {
      toast.error("Erreur lors de la mise à jour");
      throw e;
    }
  };

  const deletePhase = async (id: string) => {
    try {
      await repository.deletePhase(id);
      toast.success("Phase supprimée");
      await loadData();
    } catch (e) {
      toast.error("Erreur lors de la suppression");
      throw e;
    }
  };

  const updateProgress = async (phaseId: string, progress: number) => {
    try {
      await repository.updatePhaseProgress(phaseId, progress);
      toast.success("Avancement actualisé", `Niveau : ${progress}%`);
      await loadData();
    } catch (e) {
      toast.error("Erreur lors de l'actualisation");
    }
  };

  const toggleMilestone = async (phaseId: string, milestoneId: string, isReached: boolean) => {
    try {
      await repository.toggleMilestone(phaseId, milestoneId, isReached);
      toast.success(isReached ? "Jalon validé !" : "Jalon réinitialisé");
      await loadData();
    } catch (e) {
      toast.error("Erreur mise à jour jalon");
    }
  };

  const exportPlanningCsv = () => {
    if (phases.length === 0) {
      toast.warning("Aucune donnée à exporter");
      return;
    }
    const headers = ["Chantier", "Code", "Phase", "Date Debut", "Date Fin", "Duree Jours", "Avancement %", "Statut", "Chemin Critique", "Budget FCFA"];
    const rows = phases.map((p) => [
      `"${p.projectName}"`,
      `"${p.code}"`,
      `"${p.name}"`,
      p.startDate,
      p.endDate,
      p.durationDays,
      p.progressPercentage,
      p.status,
      p.isCriticalPath ? "OUI" : "NON",
      p.budgetAllocatedFCFA || 0,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AGB_Planning_Gantt_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exportation réussie", "Fichier CSV généré.");
  };

  return (
    <PlanningContext.Provider
      value={{
        phases,
        projects,
        selectedProjectId,
        setSelectedProjectId,
        stats,
        isLoading,
        activeView,
        setActiveView,
        refreshPhases: loadData,
        createPhase,
        updatePhase,
        deletePhase,
        updateProgress,
        toggleMilestone,
        exportPlanningCsv,
      }}
    >
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanning = (): PlanningContextType => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error("usePlanning doit être utilisé au sein de PlanningProvider");
  }
  return context;
};
