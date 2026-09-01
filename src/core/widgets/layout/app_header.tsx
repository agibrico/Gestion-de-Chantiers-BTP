/**
 * AGB CHANTIER - Barre Supérieure d'Application (Top Bar Contract)
 * Zone 1 : Brand title (single line)
 * Zone 2 : 4-6 nav links (single line)
 * Zone 3 : 1-2 primary actions (profil/déconnexion + thème)
 */

import React from "react";
import { Sun, Moon, Wifi, WifiOff, Menu, LogOut, UserCheck } from "lucide-react";
import { useTheme } from "../../theme/theme_context";
import { AppIconButton } from "../buttons/app_icon_button";
import { useAuth } from "../../../features/auth/presentation/auth_context";

interface AppHeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isOnline: boolean;
  onToggleMobileMenu?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentRoute,
  onNavigate,
  isOnline,
  onToggleMobileMenu,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { currentUser, logout, isAuthenticated } = useAuth();

  return (
    <header className="h-16 w-full border-b border-slate-800 bg-slate-900 text-white sticky top-0 z-40 transition-colors shrink-0 shadow-sm">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* ZONE 1 : Brand title, one line */}
        <div className="flex items-center gap-3 shrink-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 text-slate-300 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => onNavigate("/auth/login")}
            className="text-left cursor-pointer flex items-center gap-2.5 group select-none"
          >
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-black text-white text-sm shadow-xs tracking-tight">
              AGB
            </div>
            <span className="font-bold tracking-tight text-white uppercase text-base sm:text-lg group-hover:text-orange-400 transition-colors whitespace-nowrap">
              AGB CHANTIER
            </span>
          </button>
        </div>

        {/* ZONE 2 : 4–6 nav links, 1–2 word labels, single-line */}
        <nav className="hidden lg:flex items-center gap-1.5">
          <button
            onClick={() => onNavigate("/auth/login")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentRoute === "/auth/login" || currentRoute === "/"
                ? "bg-slate-800 text-orange-400 border border-slate-700 font-bold"
                : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
            }`}
          >
            Portail Accès
          </button>

          <button
            onClick={() => onNavigate("/admin/users")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentRoute === "/admin/users"
                ? "bg-slate-800 text-orange-400 border border-slate-700 font-bold"
                : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
            }`}
          >
            Employés & Rôles
          </button>

          <button
            onClick={() => onNavigate("/gerant/dashboard")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentRoute === "/gerant/dashboard"
                ? "bg-slate-800 text-orange-400 border border-slate-700 font-bold"
                : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
            }`}
          >
            Espace Gérant
          </button>

          <button
            onClick={() => onNavigate("/employee/portal")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentRoute === "/employee/portal"
                ? "bg-slate-800 text-orange-400 border border-slate-700 font-bold"
                : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
            }`}
          >
            Espace Employé
          </button>

          <button
            onClick={() => onNavigate("/overview")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentRoute === "/overview"
                ? "bg-slate-800 text-orange-400 border border-slate-700 font-bold"
                : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
            }`}
          >
            30 Axes
          </button>
        </nav>

        {/* ZONE 3 : 1–2 primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2">
              <div
                onClick={() => {
                  if (currentUser.profileCategory === "ADMINISTRATEUR") onNavigate("/admin/users");
                  else if (currentUser.profileCategory === "GERANT") onNavigate("/gerant/dashboard");
                  else onNavigate("/employee/portal");
                }}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-slate-800/90 border border-slate-700 rounded-lg cursor-pointer hover:border-slate-600 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-orange-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-white truncate max-w-[110px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[9px] text-slate-400 font-mono leading-none">
                    {currentUser.profileCategory}
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                title="Déconnexion"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="hidden sm:inline-flex items-center px-2 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded text-[10px] uppercase font-bold tracking-wider">
              Axe 02 Actif
            </span>
          )}

          <div
            title={isOnline ? "Mode Connecté" : "Mode Hors-ligne Actif"}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
              isOnline
                ? "bg-slate-800 text-slate-300 border-slate-700"
                : "bg-amber-950/60 text-amber-300 border-amber-800"
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden md:inline">{isOnline ? "En ligne" : "Hors ligne"}</span>
          </div>

          <AppIconButton
            icon={isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            onClick={toggleTheme}
            label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:bg-slate-800 hover:text-white"
          />
        </div>
      </div>
    </header>
  );
};
