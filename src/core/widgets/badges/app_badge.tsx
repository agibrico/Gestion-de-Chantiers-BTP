/**
 * AGB CHANTIER - Badge Statut & Rôle Métier
 */

import React from "react";

export type BadgeVariant =
  | "preparation"
  | "inProgress"
  | "suspended"
  | "delayed"
  | "completed"
  | "archived"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

interface AppBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export const AppBadge: React.FC<AppBadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
}) => {
  const getStyles = () => {
    switch (variant) {
      case "inProgress":
      case "info":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "completed":
      case "success":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "delayed":
      case "danger":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      case "suspended":
      case "warning":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "preparation":
      case "neutral":
      case "archived":
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  const getDotColor = () => {
    switch (variant) {
      case "inProgress":
      case "info":
        return "bg-blue-600";
      case "completed":
      case "success":
        return "bg-emerald-600";
      case "delayed":
      case "danger":
        return "bg-rose-600";
      case "suspended":
      case "warning":
        return "bg-amber-600";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full whitespace-nowrap shrink-0 ${
        size === "sm" ? "px-2 py-0.5 text-[11px] gap-1" : "px-2.5 py-1 text-xs gap-1.5"
      } ${getStyles()} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getDotColor()}`} />}
      <span className="truncate">{children}</span>
    </span>
  );
};
