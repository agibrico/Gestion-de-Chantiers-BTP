/**
 * AGB CHANTIER - Menu Déroulant / Sélecteur Standard
 */

import React from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface AppSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string | null;
  required?: boolean;
}

export const AppSelect: React.FC<AppSelectProps> = ({
  label,
  options,
  helperText,
  error,
  required,
  className = "",
  id,
  ...props
}) => {
  const selectId = id || (label ? `select_${label.toLowerCase().replace(/[^a-z0-9]/g, "_")}` : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <select
        id={selectId}
        className={`w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all cursor-pointer ${
          error
            ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
            : "border-slate-300 dark:border-slate-700 focus:ring-orange-500/20 focus:border-orange-500"
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
      ) : (
        helperText && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
};
