/**
 * AGB CHANTIER - Champ de Saisie Texte Professionnel
 */

import React from "react";

interface AppTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string | null;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

export const AppTextField: React.FC<AppTextFieldProps> = ({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  required,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || (label ? `field_${label.toLowerCase().replace(/[^a-z0-9]/g, "_")}` : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          className={`w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
            leftIcon ? "pl-10" : ""
          } ${rightIcon ? "pr-10" : ""} ${
            error
              ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
              : "border-slate-300 dark:border-slate-700 focus:ring-orange-500/20 focus:border-orange-500"
          } ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 text-slate-400 flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">{error}</p>
      ) : (
        helperText && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
};
