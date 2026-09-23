/**
 * AGB CHANTIER - Composant Avatar Utilisateur / Ouvrier / Intervenant
 */

import React from "react";
import { StringExtensions } from "../../extensions/string_extensions";

interface AppAvatarProps {
  name: string;
  photoUrl?: string | null;
  roleBadge?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const AppAvatar: React.FC<AppAvatarProps> = ({
  name,
  photoUrl,
  roleBadge,
  size = "md",
  className = "",
}) => {
  const initials = StringExtensions.getInitials(name);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-7 h-7 text-xs";
      case "md":
        return "w-9 h-9 text-sm";
      case "lg":
        return "w-12 h-12 text-base";
      case "xl":
        return "w-16 h-16 text-xl";
    }
  };

  return (
    <div className="relative inline-flex shrink-0">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          className={`rounded-full object-cover border border-slate-200 dark:border-slate-700 ${getSizeClasses()} ${className}`}
        />
      ) : (
        <div
          className={`rounded-full bg-slate-800 text-white font-bold flex items-center justify-center border border-slate-700 select-none ${getSizeClasses()} ${className}`}
        >
          {initials}
        </div>
      )}

      {roleBadge && (
        <span className="absolute -bottom-1 -right-1 px-1 py-0.2 text-[9px] font-bold bg-orange-600 text-white rounded-full border border-white dark:border-slate-900">
          {roleBadge}
        </span>
      )}
    </div>
  );
};
