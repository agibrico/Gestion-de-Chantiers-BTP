/**
 * AGB CHANTIER - Composant Carte de Contenu Métier BTP
 */

import React from "react";

interface AppCardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  highlighted?: boolean;
  variant?: "default" | "subtle" | "accent";
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  className = "",
  onClick,
  hoverable = false,
  highlighted = false,
  variant = "default",
}) => {
  const getVariantStyles = () => {
    if (highlighted) {
      return "bg-orange-50/40 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/50";
    }
    switch (variant) {
      case "subtle":
        return "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800";
      case "accent":
        return "bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700";
      default:
        return "bg-white dark:bg-[#131D31] border-slate-200/90 dark:border-slate-800";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`border rounded-xl transition-all ${getVariantStyles()} ${
        hoverable ? "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer" : ""
      } ${className}`}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            {typeof title === "string" ? (
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
            ) : (
              title
            )}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      <div className="p-5">{children}</div>

      {footer && (
        <div className="px-5 py-3 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
};
