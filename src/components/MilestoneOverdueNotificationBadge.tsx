/**
 * AGB CHANTIER - Composant Visuel de Notification Contextuelle de Dépassement de Date Charnière
 * Conçu pour s'intégrer directement dans les widgets du Dashboard (cartes chantiers, indicateurs clés, bandeau d'alerte)
 */

import React, { useState } from "react";
import {
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import {
  OverdueMilestoneItem,
  ProjectMilestoneAlertInfo,
} from "../features/planning/domain/milestone_alert_helper";

interface MilestoneOverdueNotificationBadgeProps {
  alertInfo: ProjectMilestoneAlertInfo;
  onOpenProjectPhases?: (projectId: string) => void;
  variant?: "card_header" | "compact_badge" | "kpi_inline" | "full_banner";
  className?: string;
}

export const MilestoneOverdueNotificationBadge: React.FC<MilestoneOverdueNotificationBadgeProps> = ({
  alertInfo,
  onOpenProjectPhases,
  variant = "card_header",
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!alertInfo || !alertInfo.hasOverdueMilestones) {
    return null;
  }

  const mostCritical = alertInfo.mostCriticalItem;
  const isCritical = alertInfo.overallSeverity === "CRITIQUE";
  const itemsCount = alertInfo.overdueItems.length;

  const formatDateFr = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // 1. Variante compacte pour l'intérieur d'un badge ou sous-indicateur KPI
  if (variant === "compact_badge") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-tight transition-all ${
          isCritical
            ? "bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-800 animate-pulse"
            : "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
        } ${className}`}
        title={`${itemsCount} date(s) charnière(s) dépassée(s) sur le planning - Retard max : +${alertInfo.maxOverdueDays}j`}
      >
        <AlertTriangle className="w-3 h-3 shrink-0" />
        <span>
          Jalon charnière dépassé (+{alertInfo.maxOverdueDays}j)
        </span>
      </span>
    );
  }

  // 2. Variante KPI Inline (pour insertion dans les cartes KPI Projets Actifs ou Retard)
  if (variant === "kpi_inline") {
    return (
      <div
        className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${
          isCritical
            ? "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/25"
            : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25"
        } ${className}`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isCritical ? "bg-red-400" : "bg-amber-400"
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isCritical ? "bg-red-500" : "bg-amber-500"
              }`}
            ></span>
          </span>
          <span className="truncate">
            <strong>{itemsCount}</strong> jalon{itemsCount > 1 ? "s" : ""} charnière{itemsCount > 1 ? "s" : ""} en dérive
          </span>
        </div>
        <span className="shrink-0 font-mono font-black text-[11px] tabular-nums bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded shadow-2xs">
          +{alertInfo.maxOverdueDays}j
        </span>
      </div>
    );
  }

  // 3. Variante Standard pour l'en-tête de carte Chantier (avec expansion contextuelle)
  return (
    <div
      className={`rounded-xl border transition-all ${
        isCritical
          ? "bg-gradient-to-r from-red-50/90 via-red-50/40 to-amber-50/30 dark:from-red-950/40 dark:via-red-950/20 dark:to-slate-900 border-red-300 dark:border-red-800/80 shadow-xs"
          : "bg-gradient-to-r from-amber-50/90 via-amber-50/40 to-yellow-50/20 dark:from-amber-950/40 dark:via-amber-950/20 dark:to-slate-900 border-amber-300 dark:border-amber-800/80 shadow-xs"
      } p-2.5 space-y-2 ${className}`}
    >
      {/* Ligne principale du jalon charnière le plus critique */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <div
            className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
              isCritical
                ? "bg-red-500 text-white shadow-xs shadow-red-500/30"
                : "bg-amber-500 text-white shadow-xs shadow-amber-500/30"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded ${
                  isCritical
                    ? "bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300"
                    : "bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300"
                }`}
              >
                Date Charnière Dépassée
              </span>

              <span className="text-[11px] font-mono font-black text-red-600 dark:text-red-400 bg-white/80 dark:bg-slate-900/80 px-1.5 py-0.2 rounded border border-red-200 dark:border-red-800 tabular-nums">
                +{alertInfo.maxOverdueDays} jours
              </span>
            </div>

            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1 truncate">
              {mostCritical?.title || "Jalon critique non respecté"}
            </p>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Cible : <strong className="text-slate-700 dark:text-slate-300">{formatDateFr(mostCritical?.targetDate || "")}</strong>
              </span>
              {mostCritical?.phaseName && (
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-slate-400" />
                  Phase : <span className="italic truncate max-w-[140px]">{mostCritical.phaseName}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Boutons d'action contextuelle */}
        <div className="flex items-center gap-1 shrink-0">
          {itemsCount > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800 text-[11px] font-semibold flex items-center gap-0.5 cursor-pointer"
              title={isExpanded ? "Replier la liste" : `Voir les ${itemsCount} jalons dépassés`}
            >
              <span>{itemsCount} jalons</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          {onOpenProjectPhases && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenProjectPhases(alertInfo.projectId);
              }}
              className="px-2 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60 transition-colors shadow-2xs cursor-pointer flex items-center gap-1 shrink-0"
              title="Consulter le planning et les jalons de ce chantier"
            >
              <span>Voir jalon</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>

      {/* Accordéon déroulant si plusieurs jalons sont dépassés */}
      {isExpanded && itemsCount > 1 && (
        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-1.5 mt-1 text-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Détail des {itemsCount} dates charnières en dérive :
          </p>
          <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
            {alertInfo.overdueItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 text-[11px]"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      item.isCritical ? "bg-red-500" : "bg-amber-500"
                    }`}
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                  <span className="text-slate-500">{formatDateFr(item.targetDate)}</span>
                  <span className="font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-1 py-0.2 rounded">
                    +{item.overdueDays}j
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
