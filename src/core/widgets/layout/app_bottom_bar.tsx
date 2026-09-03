/**
 * AGB CHANTIER - Barre de Navigation Inférieure Mobile (Mobile Bottom Bar)
 */

import React from "react";
import { Layers, Palette, HardHat, Calendar, Coins } from "lucide-react";

interface AppBottomBarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const AppBottomBar: React.FC<AppBottomBarProps> = ({ currentRoute, onNavigate }) => {
  const tabs = [
    { label: "Archi", route: "/overview", icon: <Layers className="w-5 h-5" /> },
    { label: "Design", route: "/design-system", icon: <Palette className="w-5 h-5" /> },
    { label: "Chantiers", route: "/projects", icon: <HardHat className="w-5 h-5" /> },
    { label: "Planning", route: "/planning", icon: <Calendar className="w-5 h-5" /> },
    { label: "Finances", route: "/finance", icon: <Coins className="w-5 h-5" /> },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#0F172A]/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md z-40 px-2 flex items-center justify-around">
      {tabs.map((tab) => {
        const isActive = currentRoute === tab.route;
        return (
          <button
            key={tab.route}
            onClick={() => onNavigate(tab.route)}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors cursor-pointer select-none ${
              isActive
                ? "text-orange-600 dark:text-orange-500 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span className="shrink-0">{tab.icon}</span>
            <span className="text-[10px] truncate max-w-[60px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
