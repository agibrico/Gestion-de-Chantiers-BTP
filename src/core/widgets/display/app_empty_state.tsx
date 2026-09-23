/**
 * AGB CHANTIER - État Vide Métier (Empty State Actionnable)
 */

import React from "react";
import { FolderOpen } from "lucide-react";
import { AppButton } from "../buttons/app_button";

interface AppEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  className?: string;
}

export const AppEmptyState: React.FC<AppEmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-4 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center">
        {icon || <FolderOpen className="w-7 h-7" />}
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <AppButton variant="primary" size="md" onClick={onAction} leftIcon={actionIcon}>
            {actionLabel}
          </AppButton>
        </div>
      )}
    </div>
  );
};
