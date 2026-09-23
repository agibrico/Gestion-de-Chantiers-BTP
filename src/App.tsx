import { ChantierWorkspace } from "./features/workspace/chantier_workspace";
/**
 * AGB CHANTIER - Composant Racine App
 * Intègre le Tableau de Bord des chantiers (Dashboard) avec indicateurs clés :
 * Projets Actifs, Retard, et Budget Total.
 */

import { AuthProvider, useAuth } from "./features/auth/presentation/auth_context";
import { FirstLoginModal } from "./features/auth/presentation/first_login_modal";
import { AuthPortalScreen } from "./features/auth/presentation/auth_portal_screen";
import { AppPermission } from "./core/permissions/permissions";
import React, { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { App as EnterprisePortal } from "./app/app";
import { ThemeProvider, useTheme } from "./core/theme/theme_context";
import { ToastProvider } from "./core/widgets/feedback/app_toast";
import { ErrorBoundary } from "./core/widgets/feedback/error_boundary";
import { LoadingProvider, useLoading } from "./core/widgets/feedback/loading_indicator";
import {
  KeyboardShortcutsProvider,
  useKeyboardShortcuts,
} from "./core/shortcuts/keyboard_shortcuts";
import {
  FeatureToggleProvider,
  useFeatures,
} from "./core/features/feature_toggle_context";
import { FeatureCustomizerModal } from "./core/features/presentation/FeatureCustomizerModal";
import {
  HardHat,
  LayoutDashboard,
  Layers,
  Sun,
  Moon,
  Laptop,
  Building2,
  Calendar,
  Coins,
  ExternalLink,
  Keyboard,
  SlidersHorizontal,
} from "lucide-react";

const AppHeaderNav: React.FC<{
  activeView: "dashboard" | "portal";
  onSelectView: (view: "dashboard" | "portal") => void;
}> = ({ activeView, onSelectView }) => {
  const { themeMode, isDark, setThemeMode } = useTheme();
  const { openShortcutsModal } = useKeyboardShortcuts();
  const { openCustomizer, enabledCount, totalCount, activePreset } = useFeatures();

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

        {/* Sélecteur de Vue : Dashboard Chantiers vs Portail Multi-Modules (avec indicateurs de raccourcis clavier) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <button
            id="nav-tab-dashboard"
            onClick={() => onSelectView("dashboard")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === "dashboard"
                ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Afficher le Tableau de Bord (Raccourci : Ctrl+D)"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Tableau de Bord</span>
            <kbd className="hidden lg:inline-flex items-center text-[9px] font-mono px-1 py-0.2 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300/60 dark:border-slate-700 font-bold ml-0.5">
              Ctrl+D
            </kbd>
          </button>

          <button
            id="nav-tab-portal"
            onClick={() => onSelectView("portal")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === "portal"
                ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Accéder au Portail Entreprise (Raccourci : Ctrl+P)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portail Entreprise</span>
            <span className="sm:hidden">Portail</span>
            <kbd className="hidden lg:inline-flex items-center text-[9px] font-mono px-1 py-0.2 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300/60 dark:border-slate-700 font-bold ml-0.5">
              Ctrl+P
            </kbd>
          </button>
        </div>

        {/* Actions Rapides : Personnaliser Options, Raccourcis Clavier & Sélecteur de Thème */}
        <div className="flex items-center gap-2">
          {/* Bouton Personnaliser mes Options / Modules */}
          <button
            id="btn-customize-workspace"
            onClick={() => openCustomizer("categories")}
            className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-xl text-slate-700 dark:text-slate-200 bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-colors border border-orange-200 dark:border-orange-800/80 cursor-pointer text-xs font-bold shadow-2xs"
            title={`Personnaliser les options et modules de l'application (${enabledCount}/${totalCount} actifs, Profil : ${activePreset?.name || "Sur-Mesure"})`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
            <span className="hidden md:inline">Mes Options</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-orange-200/80 dark:bg-orange-900 text-orange-800 dark:text-orange-300 font-extrabold">
              {enabledCount}/{totalCount}
            </span>
          </button>

          {/* Bouton Guide Raccourcis Clavier */}
          <button
            onClick={openShortcutsModal}
            className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-700/60 cursor-pointer text-xs font-medium"
            title="Guide des Raccourcis Clavier (Ctrl+D, Ctrl+P, Ctrl+E, ?)"
          >
            <Keyboard className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
            <span className="hidden xl:inline text-[11px] font-bold">Raccourcis</span>
            <kbd className="hidden sm:inline-block text-[9px] font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded text-slate-500">
              ?
            </kbd>
          </button>

          {/* Sélecteur de Thème (Système Auto / Clair / Sombre) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-xs">
            <button
              onClick={() => setThemeMode("system")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                themeMode === "system"
                  ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
              title={`Mode Système Automatique (${isDark ? "Sombre détecté" : "Clair détecté"}) — Bascule selon l'OS`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Système</span>
            </button>

            <button
              onClick={() => setThemeMode("light")}
              className={`p-1 px-2 rounded-lg transition-all cursor-pointer ${
                themeMode === "light"
                  ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
              title="Forcer le Mode Clair"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setThemeMode("dark")}
              className={`p-1 px-2 rounded-lg transition-all cursor-pointer ${
                themeMode === "dark"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
              title="Forcer le Mode Sombre"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export function MainAppContent() {
  const [activeView, setActiveView] = useState<"dashboard" | "portal">("dashboard");
  const { triggerViewChangeLoading } = useLoading();
  const { isAuthenticated, isLoading: authLoading, isFirstLoginModalRequired, hasPermission } = useAuth();

  const handleSelectView = (view: "dashboard" | "portal") => {
    if (view === activeView) return;
    triggerViewChangeLoading(300);
    setActiveView(view);
  };

  const handleQuickExportCsvFromShortcut = () => {
    // Si sur le Dashboard, cliquer sur le bouton d'export CSV pour ouvrir la modale
    const exportBtn = document.getElementById("btn-export-csv-btp");
    if (exportBtn) {
      exportBtn.click();
    } else {
      // Si sur le portail, basculer vers le Dashboard et déclencher
      triggerViewChangeLoading(250);
      setActiveView("dashboard");
      setTimeout(() => {
        const btn = document.getElementById("btn-export-csv-btp");
        if (btn) btn.click();
      }, 300);
    }
  };

  if (authLoading) return <p className="p-8">Chargement de la session…</p>;
  if (!isAuthenticated) return <div className="p-6"><DemoNotice /><AuthPortalScreen onLoginSuccess={() => setActiveView("portal")} /></div>;
  if (isFirstLoginModalRequired) return <FirstLoginModal />;

  return (
    <KeyboardShortcutsProvider
      activeView={activeView}
      setActiveView={handleSelectView}
      onExportCsv={handleQuickExportCsvFromShortcut}
    >
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-orange-500 selection:text-white">
        <DemoNotice />
        {/* Barre de navigation supérieure */}
        <AppHeaderNav activeView={activeView} onSelectView={handleSelectView} />

        {/* Contenu Actif */}
        <main className="flex-1 w-full">
          {activeView === "dashboard" && hasPermission(AppPermission.FINANCE_VIEW) && hasPermission(AppPermission.PROJECT_VIEW) ? (
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              <Dashboard
                onNavigateToProjects={() => {
                  window.location.hash = "/projects";
                  handleSelectView("portal");
                }}
                onNavigateToPlanning={() => {
                  window.location.hash = "/planning";
                  handleSelectView("portal");
                }}
                onNavigateToFinance={() => {
                  window.location.hash = "/finance";
                  handleSelectView("portal");
                }}
              />
            </div>
          ) : (
            <EnterprisePortal />
          )}
        </main>
      </div>
    </KeyboardShortcutsProvider>
  );
}

function DemoNotice() {
  return <div role="note" className="bg-amber-100 text-amber-950 px-4 py-2 text-sm text-center">
    Version locale de test · Aucune sauvegarde serveur.
  </div>;
}

export default function RootApp() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LoadingProvider>
          <ToastProvider>
            <AuthProvider>
            <FeatureToggleProvider>
              <ChantierWorkspace><MainAppContent /></ChantierWorkspace>
              <FeatureCustomizerModal />
            </FeatureToggleProvider>
            </AuthProvider>
          </ToastProvider>
        </LoadingProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export { RootApp as App };

