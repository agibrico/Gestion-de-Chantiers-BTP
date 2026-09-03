/**
 * AGB CHANTIER - Écran de Gestion des Travaux, Tâches & Avancement - AXE 07
 */

import React, { useState } from "react";
import { TasksProvider, useTasks } from "./tasks_context";
import { TaskEntity, TaskStatus, TaskTrade, TaskPriority } from "../domain/entities/task_entity";
import { TaskFormModal } from "./task_form_modal";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppBadge, BadgeVariant } from "../../../core/widgets/badges/app_badge";
import { AppEmptyState } from "../../../core/widgets/display/app_empty_state";
import {
  CheckSquare,
  Layers,
  Plus,
  Download,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Search,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  Kanban,
  Table,
} from "lucide-react";

const STATUS_CONFIG: Record<TaskStatus, { label: string; variant: BadgeVariant; columnTitle: string }> = {
  A_FAIRE: { label: "À Faire", variant: "neutral", columnTitle: "📋 À Lancer" },
  EN_COURS: { label: "En Cours", variant: "inProgress", columnTitle: "⚡ En Exécution" },
  EN_ATTENTE_VALIDATION: { label: "Attente Contrôle", variant: "warning", columnTitle: "🔍 Contrôle MOE / BET" },
  VALIDE_CONFORME: { label: "Validé Conforme", variant: "success", columnTitle: "✅ Réceptionné Conforme" },
  BLOQUE: { label: "Bloqué", variant: "danger", columnTitle: "🛑 Bloqué / Arrêt" },
};

const TRADE_LABELS: Record<TaskTrade, string> = {
  GROS_OEUVRE: "🏗️ Gros Œuvre",
  FERRAILLAGE: "⛓️ Ferraillage",
  MACONNERIE: "🧱 Maçonnerie",
  ELECTRICITE: "⚡ Électricité",
  PLOMBERIE: "🚰 Plomberie",
  ETANCHEITE: "🛡️ Étanchéité",
  PEINTURE_FINITION: "🎨 Finitions",
  VRD_TERRASSEMENT: "🛣️ VRD",
  MENUISERIE: "🚪 Menuiseries",
};

const TasksManagementContent: React.FC = () => {
  const {
    tasks,
    projects,
    filters,
    setFilters,
    stats,
    isLoading,
    activeView,
    setActiveView,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskProgress,
    exportTasksCsv,
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskEntity | null>(null);
  const [editingMeterId, setEditingMeterId] = useState<string | null>(null);
  const [tempMeterValue, setTempMeterValue] = useState<number>(0);

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val) + " FCFA";
  };

  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`Confirmez-vous la suppression de la tâche "${code}" ?`)) {
      await deleteTask(id);
    }
  };

  const handleSaveMeter = async (task: TaskEntity) => {
    await updateTaskProgress(task.id, tempMeterValue);
    setEditingMeterId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <AppBadge variant="success" dot={true}>
              AXE 07 OPÉRATIONNEL
            </AppBadge>
            <span className="text-xs text-orange-400 font-mono font-bold">Métrés, Décomptes & Tâches BTP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            Travaux, Tâches & Avancement
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Suivi opérationnel des corps d'état, Kanban de chantier, validation des métrés exécutés et contrôle des points d'arrêt.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <AppButton
            variant="primary"
            onClick={() => {
              setTaskToEdit(null);
              setIsModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nouvelle Tâche / Métré
          </AppButton>
          <AppButton
            variant="secondary"
            onClick={exportTasksCsv}
            leftIcon={<Download className="w-4 h-4 text-emerald-600" />}
          >
            Export Décompte CSV
          </AppButton>
        </div>
      </div>

      {/* KPI Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Avancement Global Travaux"
            value={`${stats.overallAverageProgress}%`}
            subValue={`${stats.validatedCount} sur ${stats.totalTasks} tâches validées conformes`}
            icon={<TrendingUp className="w-6 h-6" />}
            iconColor="text-emerald-600"
            badgeText="Progression Moyenne"
            badgeVariant="success"
          />

          <StatCard
            label="En Cours d'Exécution"
            value={`${stats.inProgressCount} Chantiers`}
            subValue={`${stats.inValidationCount} en attente visa BET/Labo`}
            icon={<Clock className="w-6 h-6" />}
            iconColor="text-blue-600"
            badgeText="En Chantier"
            badgeVariant="info"
          />

          <StatCard
            label="Points de Blocage"
            value={`${stats.blockedCount} Arrêts`}
            subValue={`${stats.urgentTasksCount} tâches urgentes`}
            icon={<AlertTriangle className="w-6 h-6" />}
            iconColor="text-red-600"
            badgeText="Points d'Arrêt"
            badgeVariant={stats.blockedCount > 0 ? "danger" : "neutral"}
          />

          <StatCard
            label="Volume Financier Travaux"
            value={formatFCFA(stats.totalQuantitiesVolumeBudgetFCFA)}
            subValue="Valorisation cumulée des décomptes"
            icon={<FileSpreadsheet className="w-6 h-6" />}
            iconColor="text-orange-500"
            badgeText="Total Marché"
            badgeVariant="neutral"
          />
        </div>
      )}

      {/* Filters & View Switcher */}
      <div className="p-4 bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* View Mode Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView("KANBAN")}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
                activeView === "KANBAN"
                  ? "bg-orange-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Kanban className="w-4 h-4" />
              Tableau Kanban
            </button>

            <button
              onClick={() => setActiveView("METRICS_TABLE")}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
                activeView === "METRICS_TABLE"
                  ? "bg-orange-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Table className="w-4 h-4" />
              Tableau Décomptes & Métrés
            </button>

            <button
              onClick={() => setActiveView("TRADES_GRID")}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
                activeView === "TRADES_GRID"
                  ? "bg-orange-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Par Corps d'État
            </button>
          </div>

          <div className="w-full sm:w-72">
            <AppTextField
              placeholder="Rechercher tâche, code, équipe..."
              value={filters.search || ""}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <AppSelect
            label="Chantier"
            value={filters.projectId || "ALL"}
            onChange={(e) => setFilters((prev) => ({ ...prev, projectId: e.target.value }))}
            options={[
              { value: "ALL", label: "🏢 Tous les chantiers" },
              ...projects.map((p) => ({ value: p.id, label: `${p.code} - ${p.name}` })),
            ]}
          />

          <AppSelect
            label="Corps d'État / Métier"
            value={filters.trade || "ALL"}
            onChange={(e) => setFilters((prev) => ({ ...prev, trade: e.target.value as any }))}
            options={[
              { value: "ALL", label: "🏗️ Tous les corps d'état" },
              ...Object.entries(TRADE_LABELS).map(([k, v]) => ({ value: k, label: v })),
            ]}
          />

          <AppSelect
            label="Priorité"
            value={filters.priority || "ALL"}
            onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value as any }))}
            options={[
              { value: "ALL", label: "⚡ Toutes les priorités" },
              { value: "URGENT", label: "🔴 URGENT" },
              { value: "HIGH", label: "🟠 Haute" },
              { value: "MEDIUM", label: "🟡 Moyenne" },
              { value: "LOW", label: "🟢 Basse" },
            ]}
          />
        </div>
      </div>

      {/* Main View Render */}
      {tasks.length === 0 ? (
        <AppEmptyState
          icon={<CheckSquare className="w-8 h-8 text-orange-500" />}
          title="Aucune tâche correspondante"
          description="Ajustez vos filtres ou créez une nouvelle tâche de chantier."
          actionLabel="Créer une Tâche"
          onAction={() => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          }}
        />
      ) : activeView === "KANBAN" ? (
        /* KANBAN BOARD */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto">
          {(["A_FAIRE", "EN_COURS", "EN_ATTENTE_VALIDATION", "VALIDE_CONFORME", "BLOQUE"] as TaskStatus[]).map(
            (colStatus) => {
              const colConfig = STATUS_CONFIG[colStatus];
              const colTasks = tasks.filter((t) => t.status === colStatus);

              return (
                <div
                  key={colStatus}
                  className="bg-slate-100/70 dark:bg-[#131D31] rounded-2xl p-3 border border-slate-200 dark:border-slate-800 flex flex-col min-w-[260px]"
                >
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {colConfig.columnTitle}
                    </span>
                    <span className="text-xs font-mono font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-1">
                    {colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-1.5 py-0.5 rounded">
                            {task.code}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              task.priority === "URGENT"
                                ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                                : task.priority === "HIGH"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                          {task.title}
                        </h4>

                        <div className="text-[11px] text-slate-500 flex items-center justify-between">
                          <span>{TRADE_LABELS[task.trade] || task.trade}</span>
                          <span className="font-mono">{task.quantityExecuted}/{task.quantityPlanned} {task.unit}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-slate-500">
                            <span>Avancement</span>
                            <span className="font-bold">{task.progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                task.status === "VALIDE_CONFORME"
                                  ? "bg-emerald-500"
                                  : task.status === "BLOQUE"
                                  ? "bg-red-500"
                                  : "bg-orange-500"
                              }`}
                              style={{ width: `${task.progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>

                        {task.blockingReason && (
                          <div className="text-[10px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-1.5 rounded border border-red-200 dark:border-red-900/40">
                            ⚠️ {task.blockingReason}
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 truncate max-w-[120px]">
                            {task.assignedTeamName || "Équipe générale"}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setTaskToEdit(task);
                                setIsModalOpen(true);
                              }}
                              className="p-1 text-slate-400 hover:text-orange-600 rounded"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(task.id, task.code)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
      ) : activeView === "METRICS_TABLE" ? (
        /* METRICS QUANTITATIVE TABLE */
        <div className="bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-3.5">Code & Ouvrage</th>
                  <th className="p-3.5">Corps d'État</th>
                  <th className="p-3.5">Chantier</th>
                  <th className="p-3.5">Unité</th>
                  <th className="p-3.5 text-right">Qté Prévue</th>
                  <th className="p-3.5 text-right">Qté Réalisée</th>
                  <th className="p-3.5">Avancement (%)</th>
                  <th className="p-3.5 text-right">P.U (FCFA)</th>
                  <th className="p-3.5 text-right">Montant Total</th>
                  <th className="p-3.5">Statut</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {tasks.map((task) => {
                  const isEditingMeter = editingMeterId === task.id;
                  const statusInfo = STATUS_CONFIG[task.status] || {
                    label: task.status,
                    variant: "neutral" as const,
                  };

                  return (
                    <tr key={task.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <span className="font-mono text-[10px] text-orange-600 font-bold block">{task.code}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{task.title}</span>
                      </td>

                      <td className="p-3.5">{TRADE_LABELS[task.trade] || task.trade}</td>
                      <td className="p-3.5 max-w-xs truncate font-medium">{task.projectName}</td>

                      <td className="p-3.5 font-mono font-bold text-slate-500">{task.unit}</td>

                      <td className="p-3.5 text-right font-mono font-bold">{task.quantityPlanned}</td>

                      <td className="p-3.5 text-right">
                        {isEditingMeter ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={tempMeterValue}
                              onChange={(e) => setTempMeterValue(Number(e.target.value))}
                              className="w-20 p-1 text-right text-xs font-mono font-bold rounded border border-orange-500 bg-white dark:bg-slate-900"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveMeter(task)}
                              className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-bold"
                            >
                              OK
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingMeterId(task.id);
                              setTempMeterValue(task.quantityExecuted);
                            }}
                            className="font-mono font-bold text-orange-600 hover:underline cursor-pointer"
                            title="Cliquer pour actualiser la quantité réalisée"
                          >
                            {task.quantityExecuted}
                          </button>
                        )}
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-orange-500 h-full rounded-full"
                              style={{ width: `${task.progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="font-mono font-bold text-[11px]">{task.progressPercentage}%</span>
                        </div>
                      </td>

                      <td className="p-3.5 text-right font-mono">{formatFCFA(task.unitPriceFCFA || 0)}</td>
                      <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatFCFA(task.totalBudgetFCFA || 0)}
                      </td>

                      <td className="p-3.5">
                        <AppBadge variant={statusInfo.variant} size="sm">
                          {statusInfo.label}
                        </AppBadge>
                      </td>

                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => {
                            setTaskToEdit(task);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-orange-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id, task.code)}
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
        /* TRADES GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(TRADE_LABELS).map(([tradeKey, tradeName]) => {
            const tradeTasks = tasks.filter((t) => t.trade === tradeKey);
            if (tradeTasks.length === 0) return null;

            const completed = tradeTasks.filter((t) => t.status === "VALIDE_CONFORME").length;
            const progressAvg = Math.round(
              tradeTasks.reduce((acc, t) => acc + (t.progressPercentage || 0), 0) / tradeTasks.length
            );

            return (
              <div
                key={tradeKey}
                className="bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      {tradeName}
                    </h3>
                    <span className="text-xs font-mono font-bold bg-orange-50 dark:bg-orange-950/60 text-orange-600 px-2 py-0.5 rounded-full">
                      {tradeTasks.length} tâches
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Avancement Corps d'État</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{progressAvg}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full rounded-full" style={{ width: `${progressAvg}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    {tradeTasks.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        className="text-xs flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                      >
                        <span className="truncate max-w-[180px] font-medium">{t.title}</span>
                        <span className="font-mono font-bold text-[11px] text-slate-600 dark:text-slate-400">
                          {t.progressPercentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>{completed} / {tradeTasks.length} validés</span>
                  <button
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, trade: tradeKey as TaskTrade }));
                      setActiveView("METRICS_TABLE");
                    }}
                    className="text-orange-600 font-bold hover:underline flex items-center gap-1"
                  >
                    Voir détails <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
          if (taskToEdit) {
            await updateTask(data);
          } else {
            await createTask(data);
          }
        }}
        taskToEdit={taskToEdit}
        defaultProjectId={filters.projectId !== "ALL" ? filters.projectId : undefined}
      />
    </div>
  );
};

export const TasksManagementScreen: React.FC = () => {
  return (
    <TasksProvider>
      <TasksManagementContent />
    </TasksProvider>
  );
};
