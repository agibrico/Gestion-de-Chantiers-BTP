/**
 * AGB CHANTIER - Composant Racine App
 * Intègre le Tableau de Bord des chantiers (Dashboard) avec indicateurs clés :
 * Projets Actifs, Retard, et Budget Total.
 */

import React, { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { App as EnterprisePortal } from "./app/app";
import { ThemeProvider, useTheme } from "./core/theme/theme_context";
import { ToastProvider } from "./core/widgets/feedback/app_toast";
import { ErrorBoundary } from "./core/widgets/feedback/error_boundary";
import {
  HardHat,
  LayoutDashboard,
  Layers,
  Sun,
  Moon,
  Building2,
  Calendar,
  Coins,
  ExternalLink,
} from "lucide-react";

const AppHeaderNav: React.FC<{
  activeView: "dashboard" | "portal";
  setActiveView: (view: "dashboard" | "portal") => void;
}> = ({ activeView, setActiveView }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Identité AGB CHANTIER */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-black shadow-sm">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
                AGB CHANTIER
              </span>
              <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/15 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">
                SaaS BTP
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden md:block">
              Supervision de Travaux, Délais & Pilotage Budgétaire
            </p>
          </div>
        </div>

        {/* Sélecteur de Vue : Dashboard Chantiers vs Portail Multi-Modules */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <button
            id="nav-tab-dashboard"
            onClick={() => setActiveView("dashboard")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === "dashboard"
                ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Tableau de Bord</span>
          </button>

          <button
            id="nav-tab-portal"
            onClick={() => setActiveView("portal")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === "portal"
                ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portail Entreprise</span>
            <span className="sm:hidden">Portail</span>
          </button>
        </div>

        {/* Actions Rapides : Thème & Indicateur */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/60 dark:border-slate-800 cursor-pointer"
            title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export function MainAppContent() {
  const [activeView, setActiveView] = useState<"dashboard" | "portal">("dashboard");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Barre de navigation supérieure */}
      <AppHeaderNav activeView={activeView} setActiveView={setActiveView} />

      {/* Contenu Actif */}
      <main className="flex-1 w-full">
        {activeView === "dashboard" ? (
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Dashboard
              onNavigateToProjects={() => {
                window.location.hash = "/projects";
                setActiveView("portal");
              }}
              onNavigateToPlanning={() => {
                window.location.hash = "/planning";
                setActiveView("portal");
              }}
              onNavigateToFinance={() => {
                window.location.hash = "/finance";
                setActiveView("portal");
              }}
            />
          </div>
        ) : (
          <EnterprisePortal />
        )}
      </main>
    </div>
  );
}

export default function RootApp() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <MainAppContent />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export { RootApp as App };

