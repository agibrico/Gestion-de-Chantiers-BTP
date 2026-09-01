/**
 * AGB CHANTIER - Contexte de Thème & Préférences Visuelles (Light / Dark / System)
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { LocalStorageService } from "../storage/local_storage";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "theme_mode";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    return LocalStorageService.getItem<ThemeMode>(THEME_STORAGE_KEY, "light") || "light";
  });

  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const updateTheme = () => {
      let activeIsDark = false;
      if (themeMode === "dark") {
        activeIsDark = true;
      } else if (themeMode === "light") {
        activeIsDark = false;
      } else {
        // System preference
        activeIsDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      }

      setIsDark(activeIsDark);
      if (activeIsDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    updateTheme();

    if (themeMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => updateTheme();
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [themeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    LocalStorageService.setItem(THEME_STORAGE_KEY, mode);
  };

  const toggleTheme = () => {
    setThemeMode(isDark ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ themeMode, isDark, setThemeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé à l'intérieur d'un ThemeProvider");
  }
  return context;
};
