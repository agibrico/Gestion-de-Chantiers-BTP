/**
 * AGB CHANTIER - Contexte d'État Pointage & Présences - AXE 08
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  AttendanceRecordEntity,
  AttendanceFilterQuery,
  DailyAttendanceSummary,
  AttendanceStatus,
  WeatherCondition,
} from "../domain/entities/attendance_entity";
import { AttendanceRepositoryImpl } from "../data/attendance_repository_impl";
import { useToast } from "../../../core/widgets/feedback/app_toast";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { ProjectEntity } from "../../projects/domain/entities/project_entity";

interface AttendanceContextType {
  records: AttendanceRecordEntity[];
  projects: ProjectEntity[];
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  summary: DailyAttendanceSummary | null;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  refreshAttendance: () => Promise<void>;
  updateRecordStatus: (recordId: string, status: AttendanceStatus) => Promise<void>;
  updateRecordHours: (recordId: string, regHours: number, otHours: number) => Promise<void>;
  markAllPresent: () => Promise<void>;
  markAllLeft: () => Promise<void>;
  validateShift: (validatorName: string) => Promise<void>;
  changeWeather: (weather: WeatherCondition) => Promise<void>;
  exportAttendanceCsv: () => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast();
  const repository = AttendanceRepositoryImpl.getInstance();

  const [records, setRecords] = useState<AttendanceRecordEntity[]>([]);
  const [projects, setProjects] = useState<ProjectEntity[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("prj_001");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [summary, setSummary] = useState<DailyAttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allRecords, allProjects, dailySum] = await Promise.all([
        repository.getAttendanceRecords({
          date: selectedDate,
          projectId: selectedProjectId,
          search: searchQuery,
        }),
        IdbAdapter.getAll<ProjectEntity>(IdbAdapter.STORES.PROJECTS),
        repository.getDailySummary(selectedDate, selectedProjectId),
      ]);
      setRecords(allRecords);
      setProjects(allProjects);
      setSummary(dailySum);
    } catch (e) {
      console.error("Erreur chargement pointage", e);
      toast.error("Erreur de chargement du registre de pointage");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, selectedProjectId, searchQuery, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateRecordStatus = async (recordId: string, status: AttendanceStatus) => {
    try {
      await repository.quickBatchStatusUpdate([recordId], status);
      await loadData();
    } catch (e) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const updateRecordHours = async (recordId: string, regHours: number, otHours: number) => {
    try {
      const rec = records.find((r) => r.id === recordId);
      if (!rec) return;
      await repository.updateAttendance({
        ...rec,
        regularHours: regHours,
        overtimeHours: otHours,
      });
      await loadData();
    } catch (e) {
      toast.error("Erreur actualisation des heures");
    }
  };

  const markAllPresent = async () => {
    try {
      const ids = records.map((r) => r.id);
      await repository.quickBatchStatusUpdate(ids, "PRESENT", "07:30");
      toast.success("Pointage groupé", "Tous les ouvriers ont été pointés présents à 07:30.");
      await loadData();
    } catch (e) {
      toast.error("Erreur pointage groupé");
    }
  };

  const markAllLeft = async () => {
    try {
      const ids = records.filter((r) => r.status === "PRESENT" || r.status === "RETARD").map((r) => r.id);
      for (const id of ids) {
        const rec = records.find((r) => r.id === id);
        if (rec) {
          await repository.updateAttendance({
            ...rec,
            checkOutTime: "17:00",
          });
        }
      }
      toast.success("Départ pointé", "Sortie enregistrée à 17:00.");
      await loadData();
    } catch (e) {
      toast.error("Erreur pointage départ");
    }
  };

  const validateShift = async (validatorName: string) => {
    try {
      await repository.validateDailyShift(selectedDate, selectedProjectId, validatorName);
      toast.success("Feuille de présence clôturée", `Validée et signée par ${validatorName}.`);
      await loadData();
    } catch (e) {
      toast.error("Erreur clôture journée");
    }
  };

  const changeWeather = async (weather: WeatherCondition) => {
    try {
      await repository.updateWeatherCondition(selectedDate, selectedProjectId, weather);
      toast.success("Météo enregistrée", `Condition : ${weather}`);
      await loadData();
    } catch (e) {
      toast.error("Erreur mise à jour météo");
    }
  };

  const exportAttendanceCsv = () => {
    if (records.length === 0) {
      toast.warning("Aucun pointage à exporter");
      return;
    }
    const headers = [
      "Date",
      "Matricule",
      "Nom Ouvrier",
      "Corps d'État",
      "Équipe",
      "Statut",
      "Arrivée",
      "Départ",
      "Heures Normales",
      "Heures Sup",
      "Taux Jour (FCFA)",
      "Coût Total Jour (FCFA)",
    ];

    const rows = records.map((r) => [
      r.date,
      `"${r.registrationNumber || ""}"`,
      `"${r.workerName}"`,
      `"${r.workerTrade}"`,
      `"${r.teamName || ""}"`,
      r.status,
      r.checkInTime || "",
      r.checkOutTime || "",
      r.regularHours,
      r.overtimeHours,
      r.dailyRateFCFA,
      r.totalDayLaborCostFCFA,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AGB_Pointage_${selectedDate}_${selectedProjectId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exportation réussie", "Registre d'émargement CSV généré.");
  };

  return (
    <AttendanceContext.Provider
      value={{
        records,
        projects,
        selectedDate,
        setSelectedDate,
        selectedProjectId,
        setSelectedProjectId,
        summary,
        isLoading,
        searchQuery,
        setSearchQuery,
        refreshAttendance: loadData,
        updateRecordStatus,
        updateRecordHours,
        markAllPresent,
        markAllLeft,
        validateShift,
        changeWeather,
        exportAttendanceCsv,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = (): AttendanceContextType => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error("useAttendance doit être utilisé au sein de AttendanceProvider");
  }
  return context;
};
