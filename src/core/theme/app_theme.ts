/**
 * AGB CHANTIER - Définitions du Thème & Classes CSS Réutilisables
 */

export const AppTheme = {
  classes: {
    // Surfaces
    surface: "bg-white dark:bg-[#131D31] border border-slate-200 dark:border-slate-800 rounded-xl",
    surfaceSubtle: "bg-slate-50 dark:bg-[#1E293B] border border-slate-200/70 dark:border-slate-800/80 rounded-lg",
    surfaceHighlight: "bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 rounded-xl",
    
    // Typographie
    heading1: "text-2xl font-bold tracking-tight text-slate-900 dark:text-white",
    heading2: "text-xl font-bold text-slate-900 dark:text-white",
    heading3: "text-lg font-semibold text-slate-900 dark:text-white",
    body: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed",
    bodyMuted: "text-xs text-slate-500 dark:text-slate-400",
    label: "text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400",

    // Actions & Boutons
    buttonPrimary: "inline-flex items-center justify-center font-medium transition-colors bg-orange-600 hover:bg-orange-700 text-white rounded-lg px-4 py-2.5 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
    buttonSecondary: "inline-flex items-center justify-center font-medium transition-colors bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-4 py-2.5 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
    buttonOutline: "inline-flex items-center justify-center font-medium transition-colors border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg px-4 py-2.5 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
    buttonDanger: "inline-flex items-center justify-center font-medium transition-colors bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2.5 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",

    // Champs de formulaires
    input: "w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow",
    inputError: "w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 border border-red-500 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow",
  },
} as const;
