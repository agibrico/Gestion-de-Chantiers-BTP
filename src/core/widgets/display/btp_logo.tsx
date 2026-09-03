/**
 * AGB CHANTIER - Logotype Professionnel BTP & Marque AGB
 */

import React from "react";
import { HardHat } from "lucide-react";

interface BtpLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  withText?: boolean;
  withTagline?: boolean;
  variant?: "standard" | "footer" | "badge" | "inverted";
  className?: string;
}

export const BtpLogo: React.FC<BtpLogoProps> = ({
  size = "md",
  withText = true,
  withTagline = false,
  variant = "standard",
  className = "",
}) => {
  const getContainerSize = () => {
    switch (size) {
      case "xs":
        return "w-7 h-7 rounded-md text-xs";
      case "sm":
        return "w-8 h-8 rounded-lg text-sm";
      case "md":
        return "w-10 h-10 rounded-xl text-base";
      case "lg":
        return "w-14 h-14 rounded-2xl text-xl";
      case "xl":
        return "w-16 h-16 rounded-2xl text-2xl";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "xs":
        return "w-4 h-4";
      case "sm":
        return "w-4 h-4";
      case "md":
        return "w-5 h-5";
      case "lg":
        return "w-7 h-7";
      case "xl":
        return "w-9 h-9";
    }
  };

  if (variant === "footer") {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        <div className="w-9 h-9 bg-orange-600 rounded-lg flex items-center justify-center font-black text-white text-sm shadow-md tracking-tight border border-orange-500/40 shrink-0">
          AGB
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-tight">
            <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">
              AGB CHANTIER
            </span>
            <span className="text-[10px] bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 px-1.5 py-0.2 rounded font-bold uppercase">
              SaaS
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            Propulsé par le Groupe AGB • Tous droits réservés
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Emblème AGB BTP */}
      <div
        className={`flex items-center justify-center bg-orange-600 text-white font-black shadow-sm shrink-0 tracking-tight ${getContainerSize()}`}
      >
        <span>AGB</span>
      </div>

      {withText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-black tracking-tight text-slate-900 dark:text-white uppercase text-base sm:text-lg">
              AGB
            </span>
            <span className="font-bold tracking-tight text-orange-600 uppercase text-base sm:text-lg">
              CHANTIER
            </span>
          </div>
          {withTagline && (
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400 mt-1">
              Solution SaaS Professionnelle BTP
            </span>
          )}
        </div>
      )}
    </div>
  );
};
