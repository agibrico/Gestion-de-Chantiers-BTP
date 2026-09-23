/**
 * AGB CHANTIER - Modal / Tiroir d'Inspection Complète des Dates Charnières Dépassées
 * Permet à la Direction des Travaux et Conducteurs d'arbitrer l'ensemble des dérives planning
 */

import React, { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Calendar,
  Layers,
  Search,
  X,
  ExternalLink,
  Clock,
  Building2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import {
  DashboardMilestoneAlertsSummary,
  OverdueMilestoneItem,
  ProjectMilestoneAlertInfo,
} from "../features/planning/domain/milestone_alert_helper";
import { AppModal } from "../core/widgets/feedback/app_modal";

interface MilestoneAlertsDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertsSummary: DashboardMilestoneAlertsSummary;
  onSelectProjectAndPhase?: (projectId: string) => void;
  onSelectProject?: (projectId: string) => void;
}

export const MilestoneAlertsDrawerModal: React.FC<MilestoneAlertsDrawerModalProps> = ({
  isOpen,
  onClose,
  alertsSummary,
  onSelectProjectAndPhase,
  onSelectProject,
}) => {
  const handleSelect = (projectId: string) => {
    if (onSelectProject) onSelectProject(projectId);
    if (onSelectProjectAndPhase) onSelectProjectAndPhase(projectId);
  };
  const [filterCriticalOnly, setFilterCriticalOnly] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  if (!isOpen) return null;

  const formatDateFr = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const filteredProjects = alertsSummary.projectsWithAlerts.filter((p) => {
    const matchesSearch =
      searchTerm.trim() === "" ||
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.overdueItems.some((i) => i.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCritical = !filterCriticalOnly || p.criticalOverdueCount > 0;

    return matchesSearch && matchesCritical;
  });

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Registre des Dépassements de Dates Charnières"
      subtitle={`${alertsSummary.totalProjectsWithOverdueMilestones} chantier(s) impacté(s) • ${alertsSummary.totalOverdueMilestonesCount} date(s) charnière(s) identifiée(s)`}
      icon={<ShieldAlert className="w-5 h-5 text-red-600" />}
      size="xl"
    >
      <div className="space-y-6">

        {/* 3 Cartes synthétiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60">
            <span className="text-[11px] font-bold uppercase text-red-600 dark:text-red-400">Chantiers Impactés</span>
            <p className="text-2xl font-black text-red-700 dark:text-red-300 mt-1 tabular-nums">
              {alertsSummary.totalProjectsWithOverdueMilestones}
            </p>
            <span className="text-[11px] text-slate-500">sur l'ensemble du portefeuille</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
            <span className="text-[11px] font-bold uppercase text-amber-700 dark:text-amber-400">Jalons Critiques</span>
            <p className="text-2xl font-black text-amber-800 dark:text-amber-300 mt-1 tabular-nums">
              {alertsSummary.totalCriticalMilestonesCount}
            </p>
            <span className="text-[11px] text-slate-500">structurants pour la réception</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400">Dérive Maximale</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              +{alertsSummary.maxOverdueDaysAcrossAll} j
            </p>
            <span className="text-[11px] text-slate-500">sur le chantier le plus en retard</span>
          </div>
        </div>

        {/* Barre de Recherche & Filtre */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom de chantier, code ou intitulé de jalon..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterCriticalOnly}
              onChange={(e) => setFilterCriticalOnly(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
            />
            <span>Uniquement jalons critiques</span>
          </label>
        </div>

        {/* Liste détaillée des chantiers avec jalons dépassés */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {filteredProjects.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Aucun jalon dépassé ne correspond aux critères
              </p>
            </div>
          ) : (
            filteredProjects.map((projAlert) => (
              <div
                key={projAlert.projectId}
                className="rounded-2xl border-2 border-red-200 dark:border-red-900/60 bg-white dark:bg-slate-900 p-4 space-y-3 shadow-xs hover:border-red-400 transition-all"
              >
                {/* En-tête Chantier */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-300 px-2 py-0.5 rounded border border-red-200 dark:border-red-800">
                        {projAlert.projectCode}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {projAlert.overdueItems.length} jalon{projAlert.overdueItems.length > 1 ? "s" : ""} en retard
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {projAlert.projectName}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      handleSelect(projAlert.projectId);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Ouvrir planning</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Tableau des jalons en dérive pour ce chantier */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-2">
                  {projAlert.overdueItems.map((item) => (
                    <div key={item.id} className="py-2 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              item.isCritical ? "bg-red-500 animate-ping" : "bg-amber-500"
                            }`}
                          />
                          <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                            {item.title}
                          </span>
                          {item.isCritical && (
                            <span className="text-[10px] font-black uppercase text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/80 px-1.5 py-0.2 rounded">
                              Critique
                            </span>
                          )}
                        </div>
                        {item.phaseName && (
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Layers className="w-3 h-3 text-slate-400" />
                            Phase : {item.phaseName}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-slate-500 text-[11px] flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Prévu : <strong>{formatDateFr(item.targetDate)}</strong>
                        </span>
                        <span className="font-mono font-black text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded">
                          +{item.overdueDays} jours
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pied de page */}
        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </AppModal>
  );
};
