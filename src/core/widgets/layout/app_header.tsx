/**
 * AGB CHANTIER - Barre Supérieure d'Application (Top Bar Contract)
 * Zone 1 : Brand title (single line)
 * Zone 2 : Recherche globale & Navigation rapide
 * Zone 3 : Alertes temps réel, profil/déconnexion & thème
 */

import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Menu,
  LogOut,
  UserCheck,
  Search,
  Bell,
  Siren,
  Command,
} from "lucide-react";
import { useTheme } from "../../theme/theme_context";
import { AppIconButton } from "../buttons/app_icon_button";
import { AppTooltip } from "../feedback/app_tooltip";
import { useAuth } from "../../../features/auth/presentation/auth_context";
import { useNotifications } from "../../../features/notifications/presentation/notifications_context";
import { GlobalSearchModal } from "../search/global_search_modal";
import { NotificationsDrawerModal } from "../../../features/notifications/presentation/notifications_drawer_modal";

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
  const { unreadCount, criticalUnreadCount } = useNotifications();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K to open global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 w-full border-b border-slate-800 bg-slate-900 text-white sticky top-0 z-40 transition-colors shrink-0 shadow-sm">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* ZONE 1 : Brand title */}
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

          {/* ZONE 2 : Global Search Bar */}
          <div className="flex-1 max-w-md hidden md:flex items-center justify-center">
            <AppTooltip content="Rechercher des documents, incidents HSE, tâches ou intervenants (Raccourci : Ctrl+K)">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between gap-2.5 px-3.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-600 transition-all text-xs font-medium cursor-pointer shadow-xs group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Search className="w-3.5 h-3.5 text-orange-400 group-hover:text-orange-300 transition-colors shrink-0" />
                  <span className="truncate text-slate-400 group-hover:text-slate-200">
                    Recherche globale (documents, incidents, tâches...)
                  </span>
                </div>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-700/80 text-slate-300 rounded border border-slate-600 shrink-0">
                  Ctrl K
                </kbd>
              </button>
            </AppTooltip>
          </div>

          {/* Mobile search trigger */}
          <div className="md:hidden flex items-center">
            <AppIconButton
              icon={<Search className="w-4 h-4 text-slate-300" />}
              label="Recherche globale"
              tooltip="Ouvrir la recherche rapide (documents, incidents, tâches)"
              onClick={() => setIsSearchOpen(true)}
              variant="ghost"
              size="sm"
            />
          </div>

          {/* ZONE 3 : Real-Time Notifications & Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Real-time Alerts Bell */}
            <AppTooltip content="Alertes directes : Non-conformités majeures et accidents signalés sur le terrain">
              <button
                onClick={() => setIsNotifDrawerOpen(true)}
                className={`relative p-2 rounded-lg cursor-pointer transition-colors ${
                  criticalUnreadCount > 0
                    ? "text-red-400 bg-red-950/40 hover:bg-red-900/60 border border-red-800"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
                aria-label="Centre d'alertes terrain"
              >
                {criticalUnreadCount > 0 ? (
                  <Siren className="w-4 h-4 animate-bounce text-red-400" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}

                {criticalUnreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                )}

                {unreadCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-extrabold rounded-full ${
                      criticalUnreadCount > 0
                        ? "bg-red-600 text-white"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            </AppTooltip>

            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-2">
                <AppTooltip content={`Session active : ${currentUser.name} (${currentUser.profileCategory})`}>
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
                </AppTooltip>

                <AppIconButton
                  icon={<LogOut className="w-4 h-4 text-slate-400 hover:text-red-400" />}
                  label="Déconnexion"
                  tooltip="Fermer la session et se déconnecter en toute sécurité"
                  onClick={logout}
                  variant="ghost"
                  size="sm"
                />
              </div>
            ) : null}

            {/* Offline Status Badge */}
            <AppTooltip content={isOnline ? "Système connecté en temps réel aux serveurs" : "Mode Hors-Ligne : Saisies enregistrées dans IndexedDB"}>
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                  isOnline
                    ? "bg-slate-800 text-slate-300 border-slate-700"
                    : "bg-amber-950/60 text-amber-300 border-amber-800"
                }`}
              >
                {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
                <span className="hidden lg:inline">{isOnline ? "En ligne" : "Hors ligne"}</span>
              </div>
            </AppTooltip>

            {/* Theme toggle */}
            <AppIconButton
              icon={isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
              onClick={toggleTheme}
              label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
              tooltip={isDark ? "Activer le mode d'affichage clair" : "Activer le mode d'affichage sombre"}
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:bg-slate-800 hover:text-white"
            />
          </div>
        </div>
      </header>

      {/* Global Search Dialog Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawerModal
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
};
