/**
 * AGB CHANTIER - Bannière d'Alerte Contextuelle des Dates Charnières Dépassées
 * Présente de manière synthétique et actionnable les chantiers et jalons en dérive de planning
 */

import React, { useState } from "react";
import {
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  Clock,
  ArrowRight,
  X,
  Layers,
  Calendar,
  Filter,
} from "lucide-react";
import { DashboardMilestoneAlertsSummary } from "../features/planning/domain/milestone_alert_helper";

interface MilestoneAlertsBannerProps {
  alertsSummary: DashboardMilestoneAlertsSummary;
  onFilterOverdue: () => void;
  onSelectProject: (projectId: string) => void;
  onOpenDetailModal: () => void;
  isFilterActive?: boolean;
}

export const MilestoneAlertsBanner: React.FC<MilestoneAlertsBannerProps> = ({
  alertsSummary,
  onFilterOverdue,
  onSelectProject,
  onOpenDetailModal,
  isFilterActive = false,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (alertsSummary.totalProjectsWithOverdueMilestones === 0 || isDismissed) {
    return null;
  }

  const {
    totalProjectsWithOverdueMilestones,
    totalOverdueMilestonesCount,
    totalCriticalMilestonesCount,
    maxOverdueDaysAcrossAll,
    projectsWithAlerts,
  } = alertsSummary;

  return (
    <div
      id="milestone-overdue-alert-banner"
      className="relative rounded-2xl border-2 border-red-300 dark:border-red-900/60 bg-gradient-to-r from-red-50 via-amber-50/70 to-red-50/40 dark:from-red-950/40 dark:via-slate-900 dark:to-red-950/20 p-4 sm:p-5 shadow-sm transition-all"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Contenu Principal */}
        <div className="flex items-start gap-3.5">
          <div className="relative p-2.5 rounded-2xl bg-red-600 text-white shadow-md shadow-red-600/30 shrink-0 mt-0.5">
            <ShieldAlert className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-white dark:border-slate-900"></span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                Alerte Délais Planning
              </span>
              <span className="text-xs font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-800">
                {totalCriticalMilestonesCount} jalon{totalCriticalMilestonesCount > 1 ? "s" : ""} critique{totalCriticalMilestonesCount > 1 ? "s" : ""} dépassé{totalCriticalMilestonesCount > 1 ? "s" : ""}
              </span>
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                Retard max : <strong>+{maxOverdueDaysAcrossAll} jours</strong>
              </span>
            </div>

            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Dépassement de date charnière constaté sur {totalProjectsWithOverdueMilestones} chantier{totalProjectsWithOverdueMilestones > 1 ? "s" : ""} ({totalOverdueMilestonesCount} jalon{totalOverdueMilestonesCount > 1 ? "s" : ""} au total)
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl">
              Des jalons structurants (radier, gros œuvre, lots techniques ou livraison finale) ont franchi leur date butoir sans validation. Risque immédiat de pénalités contractuelles et de décalage des corps d'état secondaires.
            </p>

            {/* Puces cliquables par chantier impacté */}
            <div className="flex flex-wrap gap-2 pt-2">
              {projectsWithAlerts.map((alert) => (
                <button
                  key={alert.projectId}
                  onClick={() => onSelectProject(alert.projectId)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800/80 text-slate-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-400 transition-all cursor-pointer shadow-2xs group"
                  title={`Cliquer pour examiner ${alert.projectName} - ${alert.mostCriticalItem?.title}`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="font-mono text-red-600 dark:text-red-400 font-black">{alert.projectCode}</span>
                  <span className="truncate max-w-[130px] sm:max-w-[180px]">{alert.mostCriticalItem?.title}</span>
                  <span className="font-mono text-[10px] bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-300 px-1 rounded">
                    +{alert.maxOverdueDays}j
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions à droite */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-red-200 dark:border-red-900/40">
          <button
            onClick={onFilterOverdue}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isFilterActive
                ? "bg-red-700 text-white hover:bg-red-800 ring-2 ring-red-400"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{isFilterActive ? "Filtre Jalons Actif" : "Filtrer ces chantiers"}</span>
          </button>

          <button
            onClick={onOpenDetailModal}
            className="inline-flex items-center gap-1 text-xs font-bold text-red-700 dark:text-red-300 hover:underline cursor-pointer"
          >
            <span>Détail des {totalOverdueMilestonesCount} jalons</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1 rounded-md transition-colors"
            title="Masquer cette bannière pour le moment"
          >
            <span className="sr-only">Fermer</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
