/**
 * AGB CHANTIER - Composant Graphique Diagramme de Gantt BTP - AXE 06
 */

import React, { useMemo, useState } from "react";
import { PhaseEntity } from "../domain/entities/planning_entity";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Layers,
} from "lucide-react";

interface GanttChartViewProps {
  phases: PhaseEntity[];
  onSelectPhase: (phase: PhaseEntity) => void;
  onUpdateProgress: (phaseId: string, progress: number) => void;
  onToggleMilestone: (phaseId: string, milestoneId: string, isReached: boolean) => void;
}

export const GanttChartView: React.FC<GanttChartViewProps> = ({
  phases,
  onSelectPhase,
  onUpdateProgress,
  onToggleMilestone,
}) => {
  const [zoomLevel, setZoomLevel] = useState<"MONTH" | "WEEK">("MONTH");

  // Calculate global start date and global end date
  const { minDate, maxDate, totalDays, monthsHeader } = useMemo(() => {
    if (phases.length === 0) {
      const now = new Date();
      const end = new Date();
      end.setMonth(end.getMonth() + 6);
      return {
        minDate: now,
        maxDate: end,
        totalDays: 180,
        monthsHeader: [],
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

    // Add margin around dates
    min = new Date(min.getFullYear(), min.getMonth(), 1);
    max = new Date(max.getFullYear(), max.getMonth() + 2, 0);

    const diffTime = Math.abs(max.getTime() - min.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Generate month header columns
    const months: Array<{ name: string; year: number; days: number; widthPercent: number }> = [];
    const current = new Date(min);

    while (current < max) {
      const year = current.getFullYear();
      const month = current.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const monthName = current.toLocaleDateString("fr-FR", { month: "short" });

      months.push({
        name: monthName.toUpperCase(),
        year,
        days: daysInMonth,
        widthPercent: (daysInMonth / days) * 100,
      });

      current.setMonth(current.getMonth() + 1);
    }

    return { minDate: min, maxDate: max, totalDays: days, monthsHeader: months };
  }, [phases]);

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
    return Math.max(1.5, (days / totalDays) * 100);
  };

  const todayPercent = useMemo(() => {
    return getPositionPercent(new Date().toISOString().split("T")[0]);
  }, [minDate, totalDays]);

  return (
    <div className="bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Gantt Controls Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-orange-600" />
            Chronogramme & Chemin Critique BTP
          </span>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            <span>{phases.length} Phases</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Chemin Critique
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rotate-45 bg-amber-400"></span> Jalon Clé
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-blue-500"></span> Aujourd'hui
            </span>
          </div>

          <div className="flex items-center bg-slate-200 dark:bg-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setZoomLevel("MONTH")}
              className={`px-2 py-1 text-xs font-bold rounded cursor-pointer ${
                zoomLevel === "MONTH"
                  ? "bg-white dark:bg-slate-700 text-orange-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => setZoomLevel("WEEK")}
              className={`px-2 py-1 text-xs font-bold rounded cursor-pointer ${
                zoomLevel === "WEEK"
                  ? "bg-white dark:bg-slate-700 text-orange-600 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Semaines
            </button>
          </div>
        </div>
      </div>

      {/* Gantt Body with Two Columns: Left List & Right Timeline */}
      <div className="overflow-x-auto">
        <div className="min-w-[950px]">
          {/* Timeline Header */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400">
            {/* Left Header for Phase Names */}
            <div className="w-72 p-3 border-r border-slate-200 dark:border-slate-800 shrink-0">
              Phases du Projet & Lots
            </div>

            {/* Right Header for Time Columns */}
            <div className="flex-1 flex relative">
              {monthsHeader.map((m, i) => (
                <div
                  key={i}
                  style={{ width: `${m.widthPercent}%` }}
                  className="p-2.5 text-center border-r border-slate-200/80 dark:border-slate-800 text-[11px] truncate"
                >
                  <span className="font-mono text-slate-900 dark:text-white font-bold">{m.name}</span>
                  <span className="text-[9px] text-slate-400 block">{m.year}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Rows */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 relative">
            {/* Today Vertical Line Indicator */}
            {todayPercent >= 0 && todayPercent <= 100 && (
              <div
                className="absolute top-0 bottom-0 z-20 border-l-2 border-blue-500 pointer-events-none"
                style={{ left: `calc(18rem + (100% - 18rem) * ${todayPercent / 100})` }}
              >
                <span className="absolute -top-2 -left-3.5 bg-blue-600 text-white text-[9px] font-bold px-1 rounded shadow-xs">
                  AUJ
                </span>
              </div>
            )}

            {phases.map((phase) => {
              const leftPos = getPositionPercent(phase.startDate);
              const barWidth = getWidthPercent(phase.startDate, phase.endDate);

              return (
                <div
                  key={phase.id}
                  className="flex items-center hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  {/* Left Column: Phase Info & Direct controls */}
                  <div className="w-72 p-3 border-r border-slate-200 dark:border-slate-800 shrink-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                            phase.isCriticalPath
                              ? "bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/50 dark:text-red-400"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {phase.code}
                        </span>
                        <button
                          onClick={() => onSelectPhase(phase)}
                          className="text-xs font-bold text-slate-900 dark:text-white truncate hover:text-orange-600 text-left"
                          title={phase.name}
                        >
                          {phase.name}
                        </button>
                      </div>

                      <span className="text-[10px] font-mono font-bold text-slate-500 shrink-0">
                        {phase.progressPercentage}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="truncate">{phase.assignedTeamName || "Équipe générale"}</span>
                      <span>{phase.durationDays}j</span>
                    </div>
                  </div>

                  {/* Right Column: Gantt Bar & Milestones */}
                  <div className="flex-1 relative h-14 flex items-center px-2">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {monthsHeader.map((m, i) => (
                        <div
                          key={i}
                          style={{ width: `${m.widthPercent}%` }}
                          className="border-r border-slate-100 dark:border-slate-800/40 h-full"
                        ></div>
                      ))}
                    </div>

                    {/* Gantt Bar */}
                    <div
                      onClick={() => onSelectPhase(phase)}
                      style={{
                        left: `${leftPos}%`,
                        width: `${barWidth}%`,
                        backgroundColor: `${phase.colorTag || "#ea580c"}25`,
                        borderColor: phase.isCriticalPath ? "#ef4444" : phase.colorTag || "#ea580c",
                      }}
                      className="absolute h-7 rounded-lg border-2 cursor-pointer shadow-xs group-hover:shadow-md transition-all overflow-hidden flex items-center px-2 z-10"
                    >
                      {/* Inner Progress Fill */}
                      <div
                        style={{
                          width: `${phase.progressPercentage}%`,
                          backgroundColor: phase.isCriticalPath ? "#ef4444" : phase.colorTag || "#ea580c",
                        }}
                        className="absolute inset-y-0 left-0 transition-all opacity-85"
                      ></div>

                      {/* Text inside bar if wide enough */}
                      <div className="relative z-10 flex items-center justify-between w-full text-[10px] font-bold text-white drop-shadow-xs truncate px-1">
                        <span className="truncate">{phase.name}</span>
                        <span className="font-mono ml-1">{phase.progressPercentage}%</span>
                      </div>
                    </div>

                    {/* Milestones Markers */}
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
                            title={`Jalon : ${milestone.name} (${milestone.targetDate}) - ${
                              milestone.isReached ? "Atteint" : "En cours"
                            }`}
                            className={`absolute z-30 cursor-pointer -translate-x-1/2 p-1 group/m`}
                          >
                            <div
                              className={`w-3.5 h-3.5 rotate-45 border-2 transition-transform hover:scale-125 ${
                                milestone.isReached
                                  ? "bg-emerald-500 border-emerald-300"
                                  : milestone.importance === "CRITICAL"
                                  ? "bg-red-500 border-red-200 animate-pulse"
                                  : "bg-amber-400 border-white dark:border-slate-900"
                              }`}
                            ></div>

                            {/* Tooltip on hover */}
                            <div className="hidden group-hover/m:block absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-xl whitespace-nowrap z-40">
                              <div className="font-bold">{milestone.name}</div>
                              <div className="text-slate-400 font-mono">{milestone.targetDate}</div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
