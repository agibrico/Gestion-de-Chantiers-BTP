/**
 * AGB CHANTIER - Contexte d'État Travaux, Tâches & Avancement - AXE 07
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  TaskEntity,
  TaskFilterQuery,
  TasksStats,
  TaskStatus,
  TaskTrade,
} from "../domain/entities/task_entity";
import { TaskRepositoryImpl } from "../data/task_repository_impl";
import { useToast } from "../../../core/widgets/feedback/app_toast";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { ProjectEntity } from "../../projects/domain/entities/project_entity";

interface TasksContextType {
  tasks: TaskEntity[];
  projects: ProjectEntity[];
  filters: TaskFilterQuery;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilterQuery>>;
  stats: TasksStats | null;
  isLoading: boolean;
  activeView: "KANBAN" | "METRICS_TABLE" | "TRADES_GRID";
  setActiveView: (v: "KANBAN" | "METRICS_TABLE" | "TRADES_GRID") => void;
  refreshTasks: () => Promise<void>;
  createTask: (data: any) => Promise<void>;
  updateTask: (data: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus, blockingReason?: string) => Promise<void>;
  updateTaskProgress: (id: string, quantityExecuted: number, progressPercentage?: number) => Promise<void>;
  exportTasksCsv: () => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast();
  const repository = TaskRepositoryImpl.getInstance();

  const [tasks, setTasks] = useState<TaskEntity[]>([]);
  const [projects, setProjects] = useState<ProjectEntity[]>([]);
  const [filters, setFilters] = useState<TaskFilterQuery>({
    projectId: "ALL",
    trade: "ALL",
    status: "ALL",
    priority: "ALL",
    search: "",
  });
  const [stats, setStats] = useState<TasksStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<"KANBAN" | "METRICS_TABLE" | "TRADES_GRID">("KANBAN");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allTasks, allProjects, calculatedStats] = await Promise.all([
        repository.getAllTasks(filters),
        IdbAdapter.getAll<ProjectEntity>(IdbAdapter.STORES.PROJECTS),
        repository.calculateTasksStats(filters.projectId),
      ]);
      setTasks(allTasks);
      setProjects(allProjects);
      setStats(calculatedStats);
    } catch (e) {
      console.error("Erreur chargement tâches", e);
      toast.error("Erreur de chargement des tâches");
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createTask = async (data: any) => {
    try {
      await repository.createTask(data);
      toast.success("Tâche créée", `L'ouvrage "${data.title}" a été planifié.`);
      await loadData();
    } catch (e) {
      toast.error("Erreur création tâche");
      throw e;
    }
  };

  const updateTask = async (data: any) => {
    try {
      await repository.updateTask(data);
      toast.success("Tâche mise à jour", `"${data.title}" a été enregistrée.`);
      await loadData();
    } catch (e) {
      toast.error("Erreur mise à jour tâche");
      throw e;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await repository.deleteTask(id);
      toast.success("Tâche supprimée");
      await loadData();
    } catch (e) {
      toast.error("Erreur lors de la suppression");
      throw e;
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus, blockingReason?: string) => {
    try {
      await repository.updateTaskStatus(id, status, blockingReason);
      toast.success("Statut actualisé", `Nouveau statut : ${status}`);
      await loadData();
    } catch (e) {
      toast.error("Erreur actualisation statut");
    }
  };

  const updateTaskProgress = async (id: string, quantityExecuted: number, progressPercentage?: number) => {
    try {
      await repository.updateTaskProgress(id, quantityExecuted, progressPercentage);
      toast.success("Métré actualisé", `Quantité réalisée : ${quantityExecuted}`);
      await loadData();
    } catch (e) {
      toast.error("Erreur mise à jour avancement");
    }
  };

  const exportTasksCsv = () => {
    if (tasks.length === 0) {
      toast.warning("Aucune tâche à exporter");
      return;
    }
    const headers = [
      "Code",
      "Chantier",
      "Ouvrage/Titre",
      "Corps d'État",
      "Priorité",
      "Statut",
      "Unité",
      "Quantité Prévue",
      "Quantité Réalisée",
      "Avancement %",
      "Équipe",
      "Budget Total FCFA",
    ];

    const rows = tasks.map((t) => [
      `"${t.code}"`,
      `"${t.projectName}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      t.trade,
      t.priority,
      t.status,
      t.unit,
      t.quantityPlanned,
      t.quantityExecuted,
      t.progressPercentage,
      `"${t.assignedTeamName || ""}"`,
      t.totalBudgetFCFA || 0,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AGB_Taches_Avancement_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exportation réussie", "Fichier CSV généré.");
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        projects,
        filters,
        setFilters,
        stats,
        isLoading,
        activeView,
        setActiveView,
        refreshTasks: loadData,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        updateTaskProgress,
        exportTasksCsv,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = (): TasksContextType => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks doit être utilisé au sein de TasksProvider");
  }
  return context;
};
