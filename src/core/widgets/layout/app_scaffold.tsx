/**
 * AGB CHANTIER - Scaffold Principal de l'Application
 */

import React, { useState, useEffect } from "react";
import { AppHeader } from "./app_header";
import { AppSidebar } from "./app_sidebar";
import { AppBottomBar } from "./app_bottom_bar";
import { AppFooter } from "./app_footer";
import { NetworkInfo } from "../../network/network_info";
import { WifiOff, Database } from "lucide-react";
import { CriticalAlertBanner } from "../../../features/notifications/presentation/critical_alert_banner";
import { OfflineDataModal } from "../../pwa/offline_data_modal";

interface AppScaffoldProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const AppScaffold: React.FC<AppScaffoldProps> = ({
  currentRoute,
  onNavigate,
  children,
  showSidebar = true,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(NetworkInfo.isOnline);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);

  useEffect(() => {
    NetworkInfo.initialize();
    const unsubscribe = NetworkInfo.addListener((online) => {
      setIsOnline(online);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-orange-500 selection:text-white pb-16 lg:pb-0">
      {/* Offline Status Warning Bar */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-3 sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5 shrink-0" />
            <span>Mode Hors-Ligne Chantier actif — Consultation fluide des chantiers garantie via le Service Worker.</span>
          </div>
          <button
            onClick={() => setIsOfflineModalOpen(true)}
            className="inline-flex items-center gap-1 underline text-[11px] font-bold text-amber-100 hover:text-white cursor-pointer bg-amber-700/60 hover:bg-amber-700 px-2 py-0.5 rounded transition-colors"
          >
            <Database className="w-3 h-3" />
            Consulter le cache chantier
          </button>
        </div>
      )}

      {/* Top Header with Global Search and Alerts Drawer */}
      <AppHeader
        currentRoute={currentRoute}
        onNavigate={onNavigate}
        isOnline={isOnline}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
      />

      {/* Visual Critical Alert Banner (Accidents & Major Non-Conformities) */}
      <CriticalAlertBanner onNavigate={onNavigate} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar */}
        {showSidebar && (
          <AppSidebar
            currentRoute={currentRoute}
            onNavigate={onNavigate}
            isOpenMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Persistent Footer with AGB Branding & SaaS Multiplatform Installation */}
      <AppFooter />

      {/* Mobile Bottom Navigation */}
      <AppBottomBar currentRoute={currentRoute} onNavigate={onNavigate} />

      {/* Offline Data Consultation Modal */}
      <OfflineDataModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        onSelectProject={() => onNavigate("/projects")}
      />
    </div>
  );
};
