/**
 * AGB CHANTIER - Écran Principal Planning & Diagramme de Gantt BTP - AXE 06
 */

import React, { useState } from "react";
import { PlanningProvider, usePlanning } from "./planning_context";
import { PhaseEntity, PhaseStatus } from "../domain/entities/planning_entity";
import { GanttChartView } from "./gantt_chart_view";
import { PhaseFormModal } from "./phase_form_modal";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppBadge, BadgeVariant } from "../../../core/widgets/badges/app_badge";
import { AppEmptyState } from "../../../core/widgets/display/app_empty_state";
import {
  Calendar,
  Layers,
  Plus,
  Download,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flag,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const STATUS_CONFIG: Record<PhaseStatus, { label: string; variant: BadgeVariant }> = {
  PLANNED: { label: "🗓️ Planifié", variant: "neutral" },
  IN_PROGRESS: { label: "⚡ En Cours", variant: "inProgress" },
  COMPLETED: { label: "✅ Achevé", variant: "success" },
  DELAYED: { label: "⚠️ En Retard", variant: "warning" },
  BLOCKED: { label: "🛑 Bloqué", variant: "neutral" },
};

const PlanningManagementContent: React.FC = () => {
  const {
    phases,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    stats,
    isLoading,
    activeView,
    setActiveView,
    createPhase,
    updatePhase,
    deletePhase,
    updateProgress,
    toggleMilestone,
    exportPlanningCsv,
  } = usePlanning();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phaseToEdit, setPhaseToEdit] = useState<PhaseEntity | null>(null);

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val) + " FCFA";
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Confirmez-vous la suppression de la phase "${name}" du planning ?`)) {
      await deletePhase(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <AppBadge variant="success" dot={true}>
              AXE 06 OPÉRATIONNEL
            </AppBadge>
            <span className="text-xs text-orange-400 font-mono font-bold">Ordonnancement & Suivi Temporel BTP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            Planning & Diagramme de Gantt
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Pilotage des phases de construction, calcul du chemin critique, ordonnancement des lots techniques et suivi des jalons de réception.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <AppButton
            variant="primary"
            onClick={() => {
              setPhaseToEdit(null);
              setIsModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nouvelle Phase
          </AppButton>
          <AppButton
            variant="secondary"
            onClick={exportPlanningCsv}
            leftIcon={<Download className="w-4 h-4 text-emerald-600" />}
          >
            Export Gantt CSV
          </AppButton>
        </div>
      </div>

      {/* KPI Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Avancement Global Moyen"
            value={`${stats.overallProgressPercentage}%`}
            subValue={`${stats.completedPhases} sur ${stats.totalPhases} phases terminées`}
            icon={<TrendingUp className="w-6 h-6" />}
            iconColor="text-emerald-600"
            badgeText="Rythme Chantier"
            badgeVariant="success"
          />

          <StatCard
            label="Phases en Exécution"
            value={`${stats.inProgressPhases} Lots Actifs`}
            subValue={`${stats.plannedPhases} phases à venir`}
            icon={<Clock className="w-6 h-6" />}
            iconColor="text-blue-600"
            badgeText="En Cours"
            badgeVariant="info"
          />

          <StatCard
            label="Chemin Critique"
            value={`${stats.criticalPathPhaseCount} Phases`}
            subValue="Impact direct sur la livraison finale"
            icon={<AlertTriangle className="w-6 h-6" />}
            iconColor="text-red-600"
            badgeText="Priorité Zéro Retard"
            badgeVariant="warning"
          />

          <StatCard
            label="Jalons & Points d'Arrêt"
            value={`${stats.reachedMilestones} / ${stats.totalMilestones}`}
            subValue="Jalons de contrôle validés"
            icon={<Flag className="w-6 h-6" />}
            iconColor="text-amber-500"
            badgeText="Contrôles MOE/Labo"
            badgeVariant="neutral"
          />
        </div>
      )}

      {/* Project Selector & View Tabs */}
      <div className="p-4 bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Chantier :</span>
          <AppSelect
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            options={[
              { value: "ALL", label: "🏢 Tous les Chantiers du Portefeuille" },
              ...projects.map((p) => ({ value: p.id, label: `${p.code} - ${p.name}` })),
            ]}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView("GANTT")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
              activeView === "GANTT"
                ? "bg-orange-600 text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            Diagramme de Gantt
          </button>

          <button
            onClick={() => setActiveView("LIST")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
              activeView === "LIST"
                ? "bg-orange-600 text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Tableau Synthétique
          </button>

          <button
            onClick={() => setActiveView("MILESTONES")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
              activeView === "MILESTONES"
                ? "bg-orange-600 text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Flag className="w-4 h-4" />
            Jalons & Réceptions
          </button>
        </div>
      </div>

      {/* Main View Display */}
      {phases.length === 0 ? (
        <AppEmptyState
          icon={<Calendar className="w-8 h-8 text-orange-500" />}
          title="Aucune phase planifiée"
          description="Aucune phase de travaux n'est enregistrée pour ce chantier."
          actionLabel="Créer une Phase"
          onAction={() => {
            setPhaseToEdit(null);
            setIsModalOpen(true);
          }}
        />
      ) : activeView === "GANTT" ? (
        <GanttChartView
          phases={phases}
          onSelectPhase={(phase) => {
            setPhaseToEdit(phase);
            setIsModalOpen(true);
          }}
          onUpdateProgress={updateProgress}
          onToggleMilestone={toggleMilestone}
        />
      ) : activeView === "LIST" ? (
        <div className="bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-3.5">Phase & Code</th>
                  <th className="p-3.5">Chantier / Projet</th>
                  <th className="p-3.5">Dates Prévisionnelles</th>
                  <th className="p-3.5">Durée</th>
                  <th className="p-3.5">Avancement</th>
                  <th className="p-3.5">Statut</th>
                  <th className="p-3.5">Équipe Assignée</th>
                  <th className="p-3.5">Budget (FCFA)</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {phases.map((phase) => {
                  const statusInfo = STATUS_CONFIG[phase.status] || {
                    label: phase.status,
                    variant: "neutral" as const,
                  };

                  return (
                    <tr key={phase.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: phase.colorTag || "#ea580c" }}
                          ></span>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{phase.name}</span>
                            <span className="font-mono text-[10px] text-slate-400">{phase.code}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 max-w-xs truncate font-medium">
                        {phase.projectName}
                      </td>

                      <td className="p-3.5 font-mono text-[11px]">
                        {phase.startDate} &rarr; {phase.endDate}
                      </td>

                      <td className="p-3.5 font-mono font-bold">
                        {phase.durationDays} j
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-orange-500 h-full rounded-full"
                              style={{ width: `${phase.progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="font-mono font-bold text-[11px]">{phase.progressPercentage}%</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <AppBadge variant={statusInfo.variant} size="sm">
                          {statusInfo.label}
                        </AppBadge>
                      </td>

                      <td className="p-3.5 text-slate-500">
                        {phase.assignedTeamName || "Non affectée"}
                      </td>

                      <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                        {formatFCFA(phase.budgetAllocatedFCFA || 0)}
                      </td>

                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => {
                            setPhaseToEdit(phase);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-orange-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(phase.id, phase.name)}
                          className="p-1.5 text-slate-500 hover:text-red-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Milestones View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {phases.flatMap((p) =>
            (p.milestones || []).map((m) => (
              <div
                key={m.id}
                className="bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 rounded">
                      {p.code} • {p.projectName.substring(0, 20)}...
                    </span>
                    <AppBadge
                      variant={m.isReached ? "success" : m.importance === "CRITICAL" ? "warning" : "neutral"}
                      size="sm"
                    >
                      {m.isReached ? "VALIDÉ" : m.importance}
                    </AppBadge>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {m.name}
                  </h3>

                  <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Date Cible : {m.targetDate}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {m.isReached ? `Atteint le ${m.reachedDate}` : "En attente validation"}
                  </span>
                  <button
                    onClick={() => toggleMilestone(p.id, m.id, !m.isReached)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                      m.isReached
                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {m.isReached ? "Annuler validation" : "Valider le Jalon"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      <PhaseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
          if (phaseToEdit) {
            await updatePhase(data);
          } else {
            await createPhase(data);
          }
        }}
        phaseToEdit={phaseToEdit}
        defaultProjectId={selectedProjectId !== "ALL" ? selectedProjectId : undefined}
      />
    </div>
  );
};

export const PlanningManagementScreen: React.FC = () => {
  return (
    <PlanningProvider>
      <PlanningManagementContent />
    </PlanningProvider>
  );
};
