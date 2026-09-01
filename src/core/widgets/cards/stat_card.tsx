/**
 * AGB CHANTIER - Composant Carte Métrique / KPI Chantier
 */

import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  badgeText?: string;
  badgeVariant?: "success" | "warning" | "danger" | "info" | "neutral";
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  icon,
  iconBgColor = "bg-orange-50 dark:bg-orange-950/40",
  iconColor = "text-orange-600 dark:text-orange-400",
  badgeText,
  badgeVariant = "neutral",
  onClick,
}) => {
  const getBadgeClass = () => {
    switch (badgeVariant) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300";
      case "warning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300";
      case "danger":
        return "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300";
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-[#131D31] border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 transition-all ${
        onClick ? "hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer shadow-sm" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{value}</p>
        </div>
        <div className={`p-3 rounded-xl shrink-0 ${iconBgColor} ${iconColor}`}>{icon}</div>
      </div>

      {(subValue || badgeText) && (
        <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          {badgeText && (
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${getBadgeClass()}`}>
              {badgeText}
            </span>
          )}
          {subValue && <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{subValue}</span>}
        </div>
      )}
    </div>
  );
};
