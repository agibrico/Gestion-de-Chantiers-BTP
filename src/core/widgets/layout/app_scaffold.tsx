/**
 * AGB CHANTIER - Scaffold Principal de l'Application
 */

import React, { useState, useEffect } from "react";
import { AppHeader } from "./app_header";
import { AppSidebar } from "./app_sidebar";
import { AppBottomBar } from "./app_bottom_bar";
import { AppFooter } from "./app_footer";
import { NetworkInfo } from "../../network/network_info";
import { WifiOff } from "lucide-react";
import { CriticalAlertBanner } from "../../../features/notifications/presentation/critical_alert_banner";

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
        <div className="bg-amber-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 sticky top-0 z-50">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Mode Hors-Ligne actif — Vos saisies et pointages sont sauvegardés localement.</span>
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
    </div>
  );
};
