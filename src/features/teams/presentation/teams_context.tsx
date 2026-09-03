/**
 * AGB CHANTIER - Contexte Réactif Intervenants, Équipes & Compagnons BTP (Axe 05)
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { StakeholderEntity, StakeholderCategory } from "../domain/entities/stakeholder_entity";
import { TeamEntity } from "../domain/entities/team_entity";
import { WorkerEntity, WorkerTrade, WorkerStatus } from "../domain/entities/worker_entity";
import {
  StakeholdersFilterQuery,
  WorkersFilterQuery,
  Axe05Stats,
} from "../domain/repositories/stakeholders_teams_repository";
import { StakeholdersTeamsRepositoryImpl } from "../data/stakeholders_teams_repository_impl";
import { useToast } from "../../../core/widgets/feedback/app_toast";

interface TeamsContextType {
  stakeholders: StakeholderEntity[];
  teams: TeamEntity[];
  workers: WorkerEntity[];
  stats: Axe05Stats | null;
  isLoading: boolean;
  activeTab: "stakeholders" | "teams" | "workers";
  setActiveTab: (tab: "stakeholders" | "teams" | "workers") => void;

  // Filters
  stakeholderQuery: StakeholdersFilterQuery;
  setStakeholderQuery: React.Dispatch<React.SetStateAction<StakeholdersFilterQuery>>;
  workerQuery: WorkersFilterQuery;
  setWorkerQuery: React.Dispatch<React.SetStateAction<WorkersFilterQuery>>;

  // Actions
  loadAllData: () => Promise<void>;

  // Stakeholders
  createStakeholder: (dto: Omit<StakeholderEntity, "id" | "createdAt" | "updatedAt">) => Promise<StakeholderEntity | null>;
  updateStakeholder: (stk: StakeholderEntity) => Promise<StakeholderEntity | null>;
  deleteStakeholder: (id: string) => Promise<boolean>;

  // Teams
  createTeam: (dto: Omit<TeamEntity, "id" | "createdAt" | "updatedAt">) => Promise<TeamEntity | null>;
  updateTeam: (team: TeamEntity) => Promise<TeamEntity | null>;
  deleteTeam: (id: string) => Promise<boolean>;

  // Workers
  createWorker: (dto: Omit<WorkerEntity, "id" | "createdAt" | "updatedAt">) => Promise<WorkerEntity | null>;
  updateWorker: (worker: WorkerEntity) => Promise<WorkerEntity | null>;
  deleteWorker: (id: string) => Promise<boolean>;
  updateWorkerStatus: (id: string, status: WorkerStatus, projectId?: string) => Promise<void>;

  // Exports
  exportWorkersCsv: () => void;
  exportStakeholdersCsv: () => void;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);
const repository = StakeholdersTeamsRepositoryImpl.getInstance();

export const TeamsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const toast = useToast();
  const [stakeholders, setStakeholders] = useState<StakeholderEntity[]>([]);
  const [teams, setTeams] = useState<TeamEntity[]>([]);
  const [workers, setWorkers] = useState<WorkerEntity[]>([]);
  const [stats, setStats] = useState<Axe05Stats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"stakeholders" | "teams" | "workers">("stakeholders");

  const [stakeholderQuery, setStakeholderQuery] = useState<StakeholdersFilterQuery>({
    category: "ALL",
  });

  const [workerQuery, setWorkerQuery] = useState<WorkersFilterQuery>({
    trade: "ALL",
    status: "ALL",
  });

  const loadAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [stkData, teamsData, workersData, statsData] = await Promise.all([
        repository.getAllStakeholders(stakeholderQuery),
        repository.getAllTeams(),
        repository.getAllWorkers(workerQuery),
        repository.getAxe05Stats(),
      ]);
      setStakeholders(stkData);
      setTeams(teamsData);
      setWorkers(workersData);
      setStats(statsData);
    } catch {
      toast.error("Erreur lors du chargement des intervenants & équipes");
    } finally {
      setIsLoading(false);
    }
  }, [stakeholderQuery, workerQuery, toast]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // STAKEHOLDERS
  const createStakeholder = async (dto: Omit<StakeholderEntity, "id" | "createdAt" | "updatedAt">) => {
    try {
      const created = await repository.createStakeholder(dto);
      toast.success("Intervenant créé", `${created.name} (${created.code}) a été enregistré.`);
      await loadAllData();
      return created;
    } catch (e: any) {
      toast.error("Erreur création intervenant", e.message);
      return null;
    }
  };

  const updateStakeholder = async (stk: StakeholderEntity) => {
    try {
      const updated = await repository.updateStakeholder(stk);
      toast.success("Intervenant mis à jour", `${updated.name} a été actualisé.`);
      await loadAllData();
      return updated;
    } catch (e: any) {
      toast.error("Erreur modification intervenant", e.message);
      return null;
    }
  };

  const deleteStakeholder = async (id: string) => {
    try {
      const ok = await repository.deleteStakeholder(id);
      if (ok) {
        toast.success("Intervenant supprimé");
        await loadAllData();
      }
      return ok;
    } catch (e: any) {
      toast.error("Erreur suppression", e.message);
      return false;
    }
  };

  // TEAMS
  const createTeam = async (dto: Omit<TeamEntity, "id" | "createdAt" | "updatedAt">) => {
    try {
      const created = await repository.createTeam(dto);
      toast.success("Équipe créée", `${created.name} (${created.code}) a été configurée.`);
      await loadAllData();
      return created;
    } catch (e: any) {
      toast.error("Erreur création équipe", e.message);
      return null;
    }
  };

  const updateTeam = async (team: TeamEntity) => {
    try {
      const updated = await repository.updateTeam(team);
      toast.success("Équipe mise à jour", `${updated.name} a été modifiée.`);
      await loadAllData();
      return updated;
    } catch (e: any) {
      toast.error("Erreur modification équipe", e.message);
      return null;
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      const ok = await repository.deleteTeam(id);
      if (ok) {
        toast.success("Équipe supprimée");
        await loadAllData();
      }
      return ok;
    } catch (e: any) {
      toast.error("Erreur suppression", e.message);
      return false;
    }
  };

  // WORKERS
  const createWorker = async (dto: Omit<WorkerEntity, "id" | "createdAt" | "updatedAt">) => {
    try {
      const created = await repository.createWorker(dto);
      toast.success("Compagnon enregistré", `${created.firstName} ${created.lastName} (${created.registrationNumber})`);
      await loadAllData();
      return created;
    } catch (e: any) {
      toast.error("Erreur création compagnon", e.message);
      return null;
    }
  };

  const updateWorker = async (worker: WorkerEntity) => {
    try {
      const updated = await repository.updateWorker(worker);
      toast.success("Fiche compagnon mise à jour", `${updated.firstName} ${updated.lastName}`);
      await loadAllData();
      return updated;
    } catch (e: any) {
      toast.error("Erreur modification compagnon", e.message);
      return null;
    }
  };

  const deleteWorker = async (id: string) => {
    try {
      const ok = await repository.deleteWorker(id);
      if (ok) {
        toast.success("Compagnon retiré de la base");
        await loadAllData();
      }
      return ok;
    } catch (e: any) {
      toast.error("Erreur suppression", e.message);
      return false;
    }
  };

  const updateWorkerStatus = async (id: string, status: WorkerStatus, projectId?: string) => {
    try {
      await repository.updateWorkerStatus(id, status, projectId);
      toast.success("Statut compagnon actualisé", `Nouveau statut : ${status}`);
      await loadAllData();
    } catch (e: any) {
      toast.error("Erreur statut", e.message);
    }
  };

  // EXPORTS
  const exportWorkersCsv = () => {
    try {
      const csv = repository.exportWorkersToCsv(workers);
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `agb_compagnons_btp_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Exportation terminée", `${workers.length} compagnons exportés.`);
    } catch {
      toast.error("Erreur exportation CSV");
    }
  };

  const exportStakeholdersCsv = () => {
    try {
      const csv = repository.exportStakeholdersToCsv(stakeholders);
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `agb_intervenants_btp_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Exportation terminée", `${stakeholders.length} intervenants exportés.`);
    } catch {
      toast.error("Erreur exportation CSV");
    }
  };

  return (
    <TeamsContext.Provider
      value={{
        stakeholders,
        teams,
        workers,
        stats,
        isLoading,
        activeTab,
        setActiveTab,
        stakeholderQuery,
        setStakeholderQuery,
        workerQuery,
        setWorkerQuery,
        loadAllData,
        createStakeholder,
        updateStakeholder,
        deleteStakeholder,
        createTeam,
        updateTeam,
        deleteTeam,
        createWorker,
        updateWorker,
        deleteWorker,
        updateWorkerStatus,
        exportWorkersCsv,
        exportStakeholdersCsv,
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
};

export const useTeams = (): TeamsContextType => {
  const context = useContext(TeamsContext);
  if (!context) {
    throw new Error("useTeams doit être utilisé à l'intérieur de TeamsProvider");
  }
  return context;
};
