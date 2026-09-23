/**
 * AGB CHANTIER - Composant Graphique Diagramme de Gantt BTP Interactif - AXE 06
 * Visualisation temporelle hiérarchique des Phases & Tâches de chantier
 * Zoom (Jours / Semaines / Mois), mise à jour interactive de l'avancement, jalons & chemin critique
 */

import React, { useMemo, useState } from "react";
import { PhaseEntity, PhaseTask, PhaseStatus } from "../domain/entities/planning_entity";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Layers,
  Search,
  Filter,
  Users,
  Check,
  Edit2,
  ArrowRight,
  Info,
  Flag,
} from "lucide-react";

interface GanttChartViewProps {
  phases: PhaseEntity[];
  onSelectPhase?: (phase: PhaseEntity) => void;
  onUpdateProgress: (phaseId: string, progress: number) => void;
  onToggleMilestone: (phaseId: string, milestoneId: string, isReached: boolean) => void;
  onUpdateTaskProgress?: (phaseId: string, taskId: string, progress: number) => void;
}

// Sample operational tasks fallback if not explicitly populated
const DEFAULT_TASKS_BY_PHASE: Record<string, PhaseTask[]> = {
  "PH-01": [
    {
      id: "tsk-01-1",
      code: "T-01.1",
      name: "Décapage terre végétale & nivellement",
      lot: "Terrassement",
      startDate: "2026-01-15",
      endDate: "2026-02-10",
      durationDays: 26,
      progressPercentage: 100,
      status: "COMPLETED",
      assignedWorkerOrSubcontractor: "SOTRA-TP Abidjan",
      isCritical: true,
    },
    {
      id: "tsk-01-2",
      code: "T-01.2",
      name: "Fouille en pleine masse & évacuation déblais",
      lot: "Terrassement",
      startDate: "2026-02-11",
      endDate: "2026-03-15",
      durationDays: 32,
      progressPercentage: 100,
      status: "COMPLETED",
      assignedWorkerOrSubcontractor: "Équipe Engins Alpha",
      isCritical: true,
    },
    {
      id: "tsk-01-3",
      code: "T-01.3",
      name: "Pose parois berlinoises & tirants d'ancrage",
      lot: "Soutènement",
      startDate: "2026-03-01",
      endDate: "2026-03-30",
      durationDays: 29,
      progressPercentage: 100,
      status: "COMPLETED",
      assignedWorkerOrSubcontractor: "GEO-FONDATIONS CI",
    },
  ],
  "PH-02": [
    {
      id: "tsk-02-1",
      code: "T-02.1",
      name: "Forage des pieux gros diamètre 1200mm",
      lot: "Fondations",
      startDate: "2026-04-01",
      endDate: "2026-04-28",
      durationDays: 27,
      progressPercentage: 100,
      status: "COMPLETED",
      assignedWorkerOrSubcontractor: "FOREX BTP",
      isCritical: true,
    },
    {
      id: "tsk-02-2",
      code: "T-02.2",
      name: "Ferraillage du radier général (Acier HA FeE500)",
      lot: "Gros Œuvre",
      startDate: "2026-04-20",
      endDate: "2026-05-18",
      durationDays: 28,
      progressPercentage: 90,
      status: "IN_PROGRESS",
      assignedWorkerOrSubcontractor: "Ferrailleurs AGB (16 ouvriers)",
      isCritical: true,
    },
    {
      id: "tsk-02-3",
      code: "T-02.3",
      name: "Coulage continu béton B25 BPE (1400 m³)",
      lot: "Gros Œuvre",
      startDate: "2026-05-15",
      endDate: "2026-06-05",
      durationDays: 21,
      progressPercentage: 80,
      status: "IN_PROGRESS",
      assignedWorkerOrSubcontractor: "Centrale Lafarge / AGB",
      isCritical: true,
    },
  ],
  "PH-03": [
    {
      id: "tsk-03-1",
      code: "T-03.1",
      name: "Coffrage & coulage des voiles périphériques SS-2",
      lot: "Gros Œuvre",
      startDate: "2026-06-16",
      endDate: "2026-07-20",
      durationDays: 34,
      progressPercentage: 35,
      status: "IN_PROGRESS",
      assignedWorkerOrSubcontractor: "Coffreurs AGB Équipe 1",
      isCritical: true,
    },
    {
      id: "tsk-03-2",
      code: "T-03.2",
      name: "Réservations gaines électriques & plomberie SS",
      lot: "Lots Techniques",
      startDate: "2026-07-05",
      endDate: "2026-08-10",
      durationDays: 36,
      progressPercentage: 15,
      status: "IN_PROGRESS",
      assignedWorkerOrSubcontractor: "SOCOELEC & Sanitaire CI",
    },
  ],
};

export const GanttChartView: React.FC<GanttChartViewProps> = ({
  phases,
  onSelectPhase,
  onUpdateProgress,
  onToggleMilestone,
  onUpdateTaskProgress,
}) => {
  const [zoomLevel, setZoomLevel] = useState<"DAYS" | "WEEKS" | "MONTHS">("MONTHS");
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    "PH-01": false,
    "PH-02": true, // Default open for demonstration
    "PH-03": true,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [criticalOnly, setCriticalOnly] = useState<boolean>(false);

  // Quick edit modal state
  const [editingItem, setEditingItem] = useState<{
    type: "PHASE" | "TASK";
    phaseId: string;
    taskId?: string;
    name: string;
    progress: number;
    status: PhaseStatus;
  } | null>(null);

  // Local state for tasks (to allow instant progress drag/updates)
  const [localTasks, setLocalTasks] = useState<Record<string, PhaseTask[]>>(() => {
    const initial: Record<string, PhaseTask[]> = {};
    phases.forEach((p) => {
      initial[p.id] = p.tasks && p.tasks.length > 0 ? p.tasks : DEFAULT_TASKS_BY_PHASE[p.code] || [];
    });
    return initial;
  });

  const toggleExpand = (phaseCode: string) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseCode]: !prev[phaseCode],
    }));
  };

  // Filter phases based on search and critical path
  const filteredPhases = useMemo(() => {
    return phases.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.assignedTeamName && p.assignedTeamName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCritical = criticalOnly ? p.isCriticalPath : true;
      const matchStatus = statusFilter === "ALL" ? true : p.status === statusFilter;

      return matchSearch && matchCritical && matchStatus;
    });
  }, [phases, searchQuery, criticalOnly, statusFilter]);

  // Calculate timeline bounds
  const { minDate, maxDate, totalDays, headers } = useMemo(() => {
    if (phases.length === 0) {
      const now = new Date();
      const end = new Date();
      end.setMonth(end.getMonth() + 6);
      return {
        minDate: now,
        maxDate: end,
        totalDays: 180,
        headers: [],
      };
    }

    let min = new Date(phases[0].startDate);
    let max = new Date(phases[0].endDate);

    phases.forEach((p) => {
      const s = new Date(p.startDate);
      const e = new Date(p.endDate);
      if (s < min) min = s;
      if (e > max) max = e;
    });

    // Add safe buffer around bounds
    min = new Date(min.getFullYear(), min.getMonth(), 1);
    max = new Date(max.getFullYear(), max.getMonth() + 2, 0);

    const diffTime = Math.abs(max.getTime() - min.getTime());
    const days = Math.max(30, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Generate column headers based on zoom level
    const headerCols: Array<{
      id: string;
      label: string;
      subLabel?: string;
      days: number;
      widthPercent: number;
    }> = [];

    if (zoomLevel === "MONTHS") {
      const current = new Date(min);
      while (current < max) {
        const year = current.getFullYear();
        const month = current.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthName = current.toLocaleDateString("fr-FR", { month: "short" });

        headerCols.push({
          id: `${year}-${month}`,
          label: monthName.toUpperCase(),
          subLabel: String(year),
          days: daysInMonth,
          widthPercent: (daysInMonth / days) * 100,
        });
        current.setMonth(current.getMonth() + 1);
      }
    } else if (zoomLevel === "WEEKS") {
      // Weekly columns
      const weekCount = Math.ceil(days / 7);
      for (let w = 1; w <= weekCount; w++) {
        headerCols.push({
          id: `w-${w}`,
          label: `S${w}`,
          subLabel: `Semaine ${w}`,
          days: 7,
          widthPercent: (7 / days) * 100,
        });
      }
    } else {
      // Days zoom: group by sets of 3-5 days to fit responsive layout
      const step = 5;
      const stepCount = Math.ceil(days / step);
      for (let s = 0; s < stepCount; s++) {
        const curDay = s * step + 1;
        headerCols.push({
          id: `day-${curDay}`,
          label: `J+${curDay}`,
          subLabel: `Jour ${curDay}`,
          days: step,
          widthPercent: (step / days) * 100,
        });
      }
    }

    return { minDate: min, maxDate: max, totalDays: days, headers: headerCols };
  }, [phases, zoomLevel]);

  const getPositionPercent = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = d.getTime() - minDate.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.min(100, (days / totalDays) * 100));
  };

  const getWidthPercent = (startStr: string, endStr: string) => {
    const s = new Date(startStr);
    const e = new Date(endStr);
    const diff = e.getTime() - s.getTime();
    const days = Math.max(1, diff / (1000 * 60 * 60 * 24));
    return Math.max(1.8, (days / totalDays) * 100);
  };

  const todayPercent = useMemo(() => {
    return getPositionPercent(new Date().toISOString().split("T")[0]);
  }, [minDate, totalDays]);

  // Handle Quick Task Progress adjustment
  const handleTaskProgressChange = (phaseId: string, taskId: string, newProgress: number) => {
    setLocalTasks((prev) => {
      const phaseTasks = prev[phaseId] || [];
      const updated = phaseTasks.map((t) =>
        t.id === taskId ? { ...t, progressPercentage: newProgress, status: newProgress === 100 ? ("COMPLETED" as const) : ("IN_PROGRESS" as const) } : t
      );
      return { ...prev, [phaseId]: updated };
    });

    if (onUpdateTaskProgress) {
      onUpdateTaskProgress(phaseId, taskId, newProgress);
    }
  };

  // Save changes from quick edit modal
  const handleSaveModal = () => {
    if (!editingItem) return;

    if (editingItem.type === "PHASE") {
      onUpdateProgress(editingItem.phaseId, editingItem.progress);
    } else if (editingItem.taskId) {
      handleTaskProgressChange(editingItem.phaseId, editingItem.taskId, editingItem.progress);
    }
    setEditingItem(null);
  };

  return (
    <div className="bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col space-y-0">
      {/* Interactive Controls & Filters Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/80 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/15 text-orange-600 dark:text-orange-400">
              <Layers className="w-4 h-4" />
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Planning Gantt Interactif
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <span>{filteredPhases.length} Phases</span>
            <span>•</span>
            <span className="text-orange-600 font-bold">Dépliables en Tâches</span>
          </div>
        </div>

        {/* Filters & Zoom Levels */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-44 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher phase, lot..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Critical Path Toggle */}
          <button
            onClick={() => setCriticalOnly(!criticalOnly)}
            className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border cursor-pointer transition-all flex items-center gap-1.5 ${
              criticalOnly
                ? "bg-red-500 text-white border-red-600 shadow-xs"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Chemin Critique
          </button>

          {/* Zoom Selector */}
          <div className="flex items-center bg-slate-200 dark:bg-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setZoomLevel("DAYS")}
              className={`px-2 py-1 text-xs font-bold rounded-md cursor-pointer transition-all ${
                zoomLevel === "DAYS"
                  ? "bg-white dark:bg-slate-700 text-orange-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Jours
            </button>
            <button
              onClick={() => setZoomLevel("WEEKS")}
              className={`px-2 py-1 text-xs font-bold rounded-md cursor-pointer transition-all ${
                zoomLevel === "WEEKS"
                  ? "bg-white dark:bg-slate-700 text-orange-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Semaines
            </button>
            <button
              onClick={() => setZoomLevel("MONTHS")}
              className={`px-2 py-1 text-xs font-bold rounded-md cursor-pointer transition-all ${
                zoomLevel === "MONTHS"
                  ? "bg-white dark:bg-slate-700 text-orange-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Mois
            </button>
          </div>
        </div>
      </div>

      {/* Gantt Interactive Grid Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[1020px]">
          {/* Timeline Header Columns */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400 select-none">
            {/* Left Header */}
            <div className="w-80 p-3 border-r border-slate-200 dark:border-slate-800 shrink-0 flex items-center justify-between">
              <span>Structure WBS (Phases & Tâches)</span>
              <span className="text-[10px] text-slate-400 font-mono">Avancement</span>
            </div>

            {/* Right Timeline Header */}
            <div className="flex-1 flex relative">
              {headers.map((h) => (
                <div
                  key={h.id}
                  style={{ width: `${h.widthPercent}%` }}
                  className="p-2 text-center border-r border-slate-200/80 dark:border-slate-800 text-[11px] truncate"
                >
                  <span className="font-mono text-slate-900 dark:text-white font-bold block">
                    {h.label}
                  </span>
                  {h.subLabel && <span className="text-[9px] text-slate-400 block">{h.subLabel}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Rows Container */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 relative select-none">
            {/* Persistent Today Vertical Line */}
            {todayPercent >= 0 && todayPercent <= 100 && (
              <div
                className="absolute top-0 bottom-0 z-30 border-l-2 border-blue-500 pointer-events-none"
                style={{ left: `calc(20rem + (100% - 20rem) * ${todayPercent / 100})` }}
              >
                <div className="sticky top-2 -left-4 -ml-4 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md uppercase tracking-wider w-max">
                  Aujourd'hui
                </div>
              </div>
            )}

            {filteredPhases.map((phase) => {
              const leftPos = getPositionPercent(phase.startDate);
              const barWidth = getWidthPercent(phase.startDate, phase.endDate);
              const isExpanded = !!expandedPhases[phase.code];
              const phaseTasks = localTasks[phase.id] || DEFAULT_TASKS_BY_PHASE[phase.code] || [];

              return (
                <React.Fragment key={phase.id}>
                  {/* PHASE ROW */}
                  <div className="flex items-center hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group bg-slate-50/30 dark:bg-slate-900/20">
                    {/* Left Column: Phase Info */}
                    <div className="w-80 p-3 border-r border-slate-200 dark:border-slate-800 shrink-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          {/* Chevron for Task Expansion */}
                          <button
                            onClick={() => toggleExpand(phase.code)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 cursor-pointer"
                            title={isExpanded ? "Replier les tâches" : "Déplier les tâches opérationnelles"}
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-orange-600" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                          </button>

                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              phase.isCriticalPath
                                ? "bg-red-100 text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-400"
                                : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {phase.code}
                          </span>

                          <button
                            onClick={() =>
                              setEditingItem({
                                type: "PHASE",
                                phaseId: phase.id,
                                name: phase.name,
                                progress: phase.progressPercentage,
                                status: phase.status,
                              })
                            }
                            className="text-xs font-bold text-slate-900 dark:text-white truncate hover:text-orange-600 text-left cursor-pointer"
                            title="Cliquer pour éditer la phase"
                          >
                            {phase.name}
                          </button>
                        </div>

                        {/* Interactive Progress % Pill */}
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-mono font-black text-slate-800 dark:text-slate-100">
                            {phase.progressPercentage}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pl-6">
                        <span className="truncate">{phase.assignedTeamName || "Équipe générale BTP"}</span>
                        <span className="font-mono">{phase.durationDays}j</span>
                      </div>
                    </div>

                    {/* Right Column: Phase Bar on Timeline */}
                    <div className="flex-1 relative h-14 flex items-center px-2">
                      {/* Background Vertical Guidelines */}
                      <div className="absolute inset-0 flex pointer-events-none">
                        {headers.map((h) => (
                          <div
                            key={h.id}
                            style={{ width: `${h.widthPercent}%` }}
                            className="border-r border-slate-100 dark:border-slate-800/40 h-full"
                          />
                        ))}
                      </div>

                      {/* Main Phase Bar */}
                      <div
                        onClick={() =>
                          setEditingItem({
                            type: "PHASE",
                            phaseId: phase.id,
                            name: phase.name,
                            progress: phase.progressPercentage,
                            status: phase.status,
                          })
                        }
                        style={{
                          left: `${leftPos}%`,
                          width: `${barWidth}%`,
                          borderColor: phase.isCriticalPath ? "#ef4444" : phase.colorTag || "#ea580c",
                        }}
                        className={`absolute h-8 rounded-lg border-2 cursor-pointer shadow-xs group-hover:shadow-md transition-all overflow-hidden flex items-center px-2 z-10 ${
                          phase.isCriticalPath ? "ring-1 ring-red-400/50" : ""
                        }`}
                      >
                        {/* Inner Progress Bar */}
                        <div
                          style={{
                            width: `${phase.progressPercentage}%`,
                            backgroundColor: phase.isCriticalPath ? "#ef4444" : phase.colorTag || "#ea580c",
                          }}
                          className="absolute inset-y-0 left-0 transition-all opacity-85"
                        />

                        {/* Text inside bar */}
                        <div className="relative z-10 flex items-center justify-between w-full text-[11px] font-bold text-white drop-shadow-xs truncate px-1">
                          <span className="truncate">{phase.name}</span>
                          <span className="font-mono ml-1">{phase.progressPercentage}%</span>
                        </div>
                      </div>

                      {/* Interactive Milestones */}
                      {phase.milestones &&
                        phase.milestones.map((milestone) => {
                          const mPos = getPositionPercent(milestone.targetDate);
                          return (
                            <div
                              key={milestone.id}
                              style={{ left: `${mPos}%` }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleMilestone(phase.id, milestone.id, !milestone.isReached);
                              }}
                              title={`Jalon : ${milestone.name} (${milestone.targetDate}) - Cliquez pour valider`}
                              className="absolute z-20 cursor-pointer -translate-x-1/2 p-1 group/m"
                            >
                              <div
                                className={`w-3.5 h-3.5 rotate-45 border-2 shadow-xs transition-transform hover:scale-135 ${
                                  milestone.isReached
                                    ? "bg-emerald-500 border-emerald-300"
                                    : milestone.importance === "CRITICAL"
                                    ? "bg-red-500 border-red-200 animate-pulse"
                                    : "bg-amber-400 border-white dark:border-slate-900"
                                }`}
                              />

                              {/* Tooltip on Hover */}
                              <div className="hidden group-hover/m:block absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1.5 px-2.5 rounded-lg shadow-2xl whitespace-nowrap z-40 border border-slate-700">
                                <div className="font-bold flex items-center gap-1">
                                  <Flag className="w-3 h-3 text-amber-400" />
                                  {milestone.name}
                                </div>
                                <div className="text-slate-400 font-mono text-[9px] mt-0.5">
                                  {milestone.targetDate} • {milestone.isReached ? "Validé ✅" : "Non atteint ⏳"}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* CHILD TASKS ROWS (Visible when phase is expanded) */}
                  {isExpanded &&
                    phaseTasks.map((task) => {
                      const taskLeft = getPositionPercent(task.startDate);
                      const taskWidth = getWidthPercent(task.startDate, task.endDate);

                      return (
                        <div
                          key={task.id}
                          className="flex items-center hover:bg-orange-50/30 dark:hover:bg-orange-950/20 transition-colors bg-white dark:bg-[#131D31] border-l-4 border-l-orange-500"
                        >
                          {/* Left Column: Task details */}
                          <div className="w-80 p-2.5 pl-9 border-r border-slate-200 dark:border-slate-800 shrink-0 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 overflow-hidden">
                                <span className="text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 px-1 rounded">
                                  {task.code}
                                </span>
                                <button
                                  onClick={() =>
                                    setEditingItem({
                                      type: "TASK",
                                      phaseId: phase.id,
                                      taskId: task.id,
                                      name: task.name,
                                      progress: task.progressPercentage,
                                      status: task.status,
                                    })
                                  }
                                  className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate hover:text-orange-600 text-left"
                                >
                                  {task.name}
                                </button>
                              </div>

                              <span className="text-[10px] font-mono font-bold text-orange-600">
                                {task.progressPercentage}%
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="truncate">{task.assignedWorkerOrSubcontractor}</span>
                              <span className="font-mono">{task.durationDays}j</span>
                            </div>
                          </div>

                          {/* Right Column: Task Bar with direct progress control */}
                          <div className="flex-1 relative h-10 flex items-center px-2">
                            {/* Background Grid Lines */}
                            <div className="absolute inset-0 flex pointer-events-none">
                              {headers.map((h) => (
                                <div
                                  key={h.id}
                                  style={{ width: `${h.widthPercent}%` }}
                                  className="border-r border-slate-100 dark:border-slate-800/30 h-full"
                                />
                              ))}
                            </div>

                            {/* Task Bar */}
                            <div
                              onClick={() =>
                                setEditingItem({
                                  type: "TASK",
                                  phaseId: phase.id,
                                  taskId: task.id,
                                  name: task.name,
                                  progress: task.progressPercentage,
                                  status: task.status,
                                })
                              }
                              style={{
                                left: `${taskLeft}%`,
                                width: `${taskWidth}%`,
                                borderColor: "#cbd5e1",
                              }}
                              className="absolute h-5 rounded border cursor-pointer bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center z-10 hover:ring-2 hover:ring-orange-400 transition-all"
                            >
                              <div
                                style={{ width: `${task.progressPercentage}%` }}
                                className={`h-full transition-all ${
                                  task.progressPercentage === 100
                                    ? "bg-emerald-500"
                                    : task.isCritical
                                    ? "bg-red-500"
                                    : "bg-blue-600"
                                }`}
                              />
                              <span className="absolute left-1.5 text-[9px] font-bold text-slate-700 dark:text-slate-200 drop-shadow-xs truncate">
                                {task.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Edit Task / Phase Interactive Modal */}
      {editingItem && (
        <AppModal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          title={`Ajustement Temporel & Avancement : ${editingItem.name}`}
          subtitle="Modifiez l'avancement physique et le statut en temps réel pour recalculer le planning"
          icon={<Edit2 className="w-5 h-5 text-orange-600" />}
          size="md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-orange-50/60 dark:bg-orange-950/30 rounded-xl border border-orange-200 dark:border-orange-900/50 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-orange-600">
                {editingItem.type === "PHASE" ? "Phase Principale" : "Tâche Opérationnelle"}
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{editingItem.name}</h4>
            </div>

            {/* Slider for Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Taux d'Avancement Réalisé :
                </label>
                <span className="text-base font-black font-mono text-orange-600">
                  {editingItem.progress}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={editingItem.progress}
                onChange={(e) =>
                  setEditingItem((prev) => (prev ? { ...prev, progress: Number(e.target.value) } : null))
                }
                className="w-full accent-orange-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />

              {/* Fast Buttons */}
              <div className="flex gap-2 pt-1">
                {[0, 25, 50, 75, 100].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() =>
                      setEditingItem((prev) => (prev ? { ...prev, progress: val } : null))
                    }
                    className={`flex-1 py-1 text-[11px] font-bold rounded border cursor-pointer ${
                      editingItem.progress === val
                        ? "bg-orange-600 text-white border-orange-600"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <AppButton variant="outline" size="sm" onClick={() => setEditingItem(null)}>
                Annuler
              </AppButton>
              <AppButton variant="primary" size="sm" onClick={handleSaveModal} leftIcon={<Check className="w-4 h-4" />}>
                Appliquer la mise à jour
              </AppButton>
            </div>
          </div>
        </AppModal>
      )}
    </div>
  );
};
