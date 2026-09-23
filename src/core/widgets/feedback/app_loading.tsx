/**
 * AGB CHANTIER - Indicateurs de Chargement & Squelettes Visuels
 */

import React from "react";
import { Loader2 } from "lucide-react";

export const AppLoadingSpinner: React.FC<{ message?: string; size?: "sm" | "md" | "lg" }> = ({
  message = "Chargement des données chantier...",
  size = "md",
}) => {
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "w-5 h-5";
      case "md":
        return "w-8 h-8";
      case "lg":
        return "w-12 h-12";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 min-h-[160px]">
      <Loader2 className={`animate-spin text-orange-600 ${getSizeClass()}`} />
      {message && <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{message}</p>}
    </div>
  );
};

export const AppSkeleton: React.FC<{ className?: string }> = ({ className = "h-6 w-full" }) => {
  return <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg ${className}`} />;
};
