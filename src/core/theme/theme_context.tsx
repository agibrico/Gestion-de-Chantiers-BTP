/**
 * AGB CHANTIER - Contexte de Thème & Préférences Visuelles (Light / Dark / System)
 * Détecte automatiquement les préférences système du navigateur (prefers-color-scheme)
 * et bascule l'interface en conséquence en temps réel.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { LocalStorageService } from "../storage/local_storage";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  isSystemMode: boolean;
  systemPrefersDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  resetToSystem: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEME_STORAGE_KEY = "theme_mode";

/**
 * Détecte si le navigateur ou l'OS a activé le mode sombre
 */
export const getSystemThemePreference = (): boolean => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

/**
 * Met à jour le DOM (classes Tailwind, color-scheme CSS et meta theme-color)
 */
export const applyDomTheme = (dark: boolean): void => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (dark) {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }

  // Synchronisation dynamique de la couleur de la barre de statut navigateur / PWA
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", dark ? "#0F172A" : "#FFFFFF");
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Déterminer le mode initial : si aucun mode n'a été enregistré, "system" par défaut
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const stored = LocalStorageService.getItem<ThemeMode>(THEME_STORAGE_KEY, null);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
    return "system";
  });

  // Détecter la préférence système actuelle
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    return getSystemThemePreference();
  });

  // Calculer l'état isDark initial
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = LocalStorageService.getItem<ThemeMode>(THEME_STORAGE_KEY, null);
    const mode = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    const dark = mode === "dark" ? true : mode === "light" ? false : getSystemThemePreference();
    applyDomTheme(dark);
    return dark;
  });

  // Surveillance des changements de préférences système & du mode sélectionné
  useEffect(() => {
    const updateActiveTheme = (sysPrefers: boolean = getSystemThemePreference()) => {
      setSystemPrefersDark(sysPrefers);
      const activeIsDark =
        themeMode === "dark"
          ? true
          : themeMode === "light"
          ? false
          : sysPrefers;

      setIsDark(activeIsDark);
      applyDomTheme(activeIsDark);
    };

    updateActiveTheme();

    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const prefersDark = e.matches;
      setSystemPrefersDark(prefersDark);
      // Bascule automatique de l'interface si l'utilisateur est en mode "system"
      if (themeMode === "system") {
        setIsDark(prefersDark);
        applyDomTheme(prefersDark);
      }
    };

    try {
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleSystemChange);
      } else if ((mediaQuery as any).addListener) {
        (mediaQuery as any).addListener(handleSystemChange);
      }
    } catch (e) {
      console.warn("[ThemeProvider] Impossible d'écouter prefers-color-scheme:", e);
    }

    return () => {
      try {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener("change", handleSystemChange);
        } else if ((mediaQuery as any).removeListener) {
          (mediaQuery as any).removeListener(handleSystemChange);
        }
      } catch (e) {
        // Nettoyage
      }
    };
  }, [themeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    LocalStorageService.setItem(THEME_STORAGE_KEY, mode);
  };

  const resetToSystem = () => {
    setThemeMode("system");
  };

  const toggleTheme = () => {
    // Si l'utilisateur clique sur le bouton de bascule rapide, il alterne entre sombre et clair
    const nextDark = !isDark;
    setThemeMode(nextDark ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isDark,
        isSystemMode: themeMode === "system",
        systemPrefersDark,
        setThemeMode,
        toggleTheme,
        resetToSystem,
      }}
    >
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
