/**
 * AGB CHANTIER - Composant Bouton Métier Standard
 */

import React from "react";
import { Loader2 } from "lucide-react";
import { AppTooltip, TooltipPosition } from "../feedback/app_tooltip";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost" | "amber";
export type ButtonSize = "sm" | "md" | "lg";

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  tooltip?: string | React.ReactNode;
  tooltipPosition?: TooltipPosition;
}

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  tooltip,
  tooltipPosition = "top",
  disabled,
  className = "",
  title,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white shadow-sm";
      case "secondary":
        return "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100";
      case "outline":
        return "border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200";
      case "danger":
        return "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm";
      case "amber":
        return "bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white shadow-sm";
      case "ghost":
        return "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-xs rounded-md gap-1.5 h-8";
      case "md":
        return "px-4 py-2 text-sm rounded-lg gap-2 h-10";
      case "lg":
        return "px-5 py-2.5 text-base rounded-lg gap-2.5 h-12";
    }
  };

  const buttonElement = (
    <button
      disabled={disabled || isLoading}
      title={typeof tooltip === "string" ? tooltip : title}
      className={`inline-flex items-center justify-center font-medium transition-all select-none whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${getVariantStyles()} ${getSizeStyles()} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span className="truncate">{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );

  if (tooltip) {
    return (
      <AppTooltip content={tooltip} position={tooltipPosition} disabled={disabled || isLoading}>
        {buttonElement}
      </AppTooltip>
    );
  }

  return buttonElement;
};
