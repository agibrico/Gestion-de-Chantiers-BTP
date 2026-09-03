/**
 * AGB CHANTIER - Composant Bouton Icône
 */

import React from "react";
import { AppTooltip, TooltipPosition } from "../feedback/app_tooltip";

interface AppIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  label: string; // Pour l'accessibilité aria-label
  tooltip?: string | React.ReactNode;
  tooltipPosition?: TooltipPosition;
  showTooltip?: boolean;
}

export const AppIconButton: React.FC<AppIconButtonProps> = ({
  icon,
  variant = "ghost",
  size = "md",
  label,
  tooltip,
  tooltipPosition = "top",
  showTooltip = true,
  className = "",
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-orange-600 hover:bg-orange-700 text-white shadow-sm";
      case "secondary":
        return "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200";
      case "outline":
        return "border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200";
      case "danger":
        return "bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/60";
      case "ghost":
        return "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "w-8 h-8 rounded-md p-1.5";
      case "md":
        return "w-10 h-10 rounded-lg p-2";
      case "lg":
        return "w-12 h-12 rounded-xl p-2.5";
    }
  };

  const tooltipText = tooltip || label;

  const buttonElement = (
    <button
      aria-label={label}
      title={typeof tooltipText === "string" ? tooltipText : label}
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );

  if (showTooltip && tooltipText) {
    return (
      <AppTooltip content={tooltipText} position={tooltipPosition} disabled={disabled}>
        {buttonElement}
      </AppTooltip>
    );
  }

  return buttonElement;
};
