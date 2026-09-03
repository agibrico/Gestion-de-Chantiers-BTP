/**
 * AGB CHANTIER - Contexte & État Réactif des Chantiers (Axe 04)
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  ProjectEntity,
  ProjectFilterQuery,
  ProjectStats,
  ProjectPhase,
  ProjectMilestone,
} from "../domain/entities/project_entity";
import { ProjectRepositoryImpl } from "../data/project_repository_impl";
import { CreateProjectDTO } from "../domain/repositories/project_repository";
import { useToast } from "../../../core/widgets/feedback/app_toast";

interface ProjectsContextType {
  projects: ProjectEntity[];
  selectedProject: ProjectEntity | null;
  stats: ProjectStats | null;
  isLoading: boolean;
  filterQuery: ProjectFilterQuery;
  setFilterQuery: React.Dispatch<React.SetStateAction<ProjectFilterQuery>>;
  loadProjects: () => Promise<void>;
  selectProject: (project: ProjectEntity | null) => void;
  createProject: (dto: CreateProjectDTO) => Promise<ProjectEntity | null>;
  updateProject: (project: ProjectEntity) => Promise<ProjectEntity | null>;
  deleteProject: (id: string) => Promise<boolean>;
  updateProgress: (id: string, progress: number) => Promise<void>;
  addPhase: (projectId: string, phase: Omit<ProjectPhase, "id">) => Promise<void>;
  updatePhase: (projectId: string, phase: ProjectPhase) => Promise<void>;
  deletePhase: (projectId: string, phaseId: string) => Promise<void>;
  addMilestone: (projectId: string, milestone: Omit<ProjectMilestone, "id">) => Promise<void>;
  updateMilestone: (projectId: string, milestone: ProjectMilestone) => Promise<void>;
  deleteMilestone: (projectId: string, milestoneId: string) => Promise<void>;
  exportToCsv: () => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const repository = new ProjectRepositoryImpl();

export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const toast = useToast();
  const [projects, setProjects] = useState<ProjectEntity[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectEntity | null>(null);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterQuery, setFilterQuery] = useState<ProjectFilterQuery>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const [data, statsData] = await Promise.all([
        repository.getAllProjects(filterQuery),
        repository.getProjectStats(),
      ]);
      setProjects(data);
      setStats(statsData);

      if (selectedProject) {
        const updatedSelected = data.find((p) => p.id === selectedProject.id) || null;
        setSelectedProject(updatedSelected);
      }
    } catch {
      toast.error("Erreur lors du chargement des chantiers");
    } finally {
      setIsLoading(false);
    }
  }, [filterQuery, selectedProject, toast]);

  useEffect(() => {
    loadProjects();
  }, [filterQuery]);

  const selectProject = (project: ProjectEntity | null) => {
    setSelectedProject(project);
  };

  const createProject = async (dto: CreateProjectDTO): Promise<ProjectEntity | null> => {
    try {
      const created = await repository.createProject(dto);
      toast.success("Chantier créé avec succès", `Le chantier "${created.name}" (${created.code}) a été initialisé.`);
      await loadProjects();
      return created;
    } catch (e: any) {
      toast.error("Erreur création chantier", e.message || "Une erreur est survenue.");
      return null;
    }
  };

  const updateProject = async (project: ProjectEntity): Promise<ProjectEntity | null> => {
    try {
      const updated = await repository.updateProject(project);
      toast.success("Chantier mis à jour", `Les modifications du chantier "${updated.name}" ont été enregistrées.`);
      await loadProjects();
      return updated;
    } catch (e: any) {
      toast.error("Erreur modification chantier", e.message || "Une erreur est survenue.");
      return null;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const success = await repository.deleteProject(id);
      if (success) {
        toast.success("Chantier archivé", "Le chantier a été retiré de la liste active.");
        if (selectedProject?.id === id) {
          setSelectedProject(null);
        }
        await loadProjects();
      }
      return success;
    } catch (e: any) {
      toast.error("Erreur suppression", e.message || "Impossible de supprimer ce chantier.");
      return false;
    }
  };

  const updateProgress = async (id: string, progress: number) => {
    try {
      await repository.updateProgress(id, progress);
      toast.success("Avancement actualisé", `Nouveau taux d'avancement physique : ${progress}%`);
      await loadProjects();
    } catch (e: any) {
      toast.error("Erreur d'avancement", e.message);
    }
  };

  const addPhase = async (projectId: string, phase: Omit<ProjectPhase, "id">) => {
    try {
      await repository.addPhase(projectId, phase);
      toast.success("Phase ajoutée", `La phase "${phase.name}" a été intégrée.`);
      await loadProjects();
    } catch (e: any) {
      toast.error("Erreur ajout phase", e.message);
    }
  };

  const updatePhase = async (projectId: string, phase: ProjectPhase) => {
    try {
      await repository.updatePhase(projectId, phase);
      toast.success("Phase mise à jour", `La phase "${phase.name}" a été actualisée.`);
      await loadProjects();
    } catch (e: any) {
      toast.error("Erreur mise à jour phase", e.message);
    }
  };

  const deletePhase = async (projectId: string, phaseId: string) => {
    try {
      await repository.deletePhase(projectId, phaseId);
      toast.success("Phase supprimée");
      await loadProjects();
    } catch (e: any) {
      toast.error("Erreur suppression phase", e.message);
    }
  };

  const addMilestone = async (projectId: string, milestone: Omit<ProjectMilestone, "id">) => {
    try {
      await repository.addMilestone(projectId, milestone);
      toast.success("Jalon enregistré", `Le jalon "${milestone.title}" a été ajouté.`);
      await loadProjects();
    } catch (e: any) {
      toast.error("Erreur ajout jalon", e.message);
    }
  };

  const updateMilestone = async (projectId: string, milestone: ProjectMilestone) => {
    try {
      await repository.updateMilestone(projectId, milestone);
      toast.success("Jalon mis à jour", `Le jalon "${milestone.title}" a été modifié.`);
      await loadProjects();
    } catch (e: any) {
      toast.error("Erreur mise à jour jalon", e.message);
    }
  };

  const deleteMilestone = async (projectId: string, milestoneId: string) => {
    try {
      await repository.deleteMilestone(projectId, milestoneId);
      toast.success("Jalon supprimé");
      await loadProjects();
    } catch (e: any) {
      toast.error("Erreur suppression jalon", e.message);
    }
  };

  const exportToCsv = () => {
    try {
      const csv = repository.exportToCsv(projects);
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `agb_chantiers_export_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Exportation terminée", `${projects.length} chantiers exportés au format CSV.`);
    } catch {
      toast.error("Erreur lors de l'exportation CSV");
    }
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        selectedProject,
        stats,
        isLoading,
        filterQuery,
        setFilterQuery,
        loadProjects,
        selectProject,
        createProject,
        updateProject,
        deleteProject,
        updateProgress,
        addPhase,
        updatePhase,
        deletePhase,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        exportToCsv,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects doit être utilisé à l'intérieur de ProjectsProvider");
  }
  return context;
};
