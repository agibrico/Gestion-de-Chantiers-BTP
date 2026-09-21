/**
 * AGB CHANTIER - Composant LoadingIndicator & Contexte de Chargement Global
 * Affiche une barre de progression animée ultra-fluide au sommet de l'écran (style NProgress / YouTube)
 * lors des transitions de vues (Dashboard <-> Portail) et des chargements asynchrones de données BTP.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

interface LoadingContextType {
  isLoading: boolean;
  progress: number;
  startLoading: () => void;
  stopLoading: () => void;
  triggerViewChangeLoading: (durationMs?: number) => void;
  withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const completeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
  };

  const startLoading = useCallback(() => {
    clearTimers();
    setIsLoading(true);
    setIsVisible(true);
    setProgress(15);

    // Progression incrémentale naturelle et réaliste
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 50) return prev + Math.random() * 15;
        if (prev < 80) return prev + Math.random() * 8;
        if (prev < 92) return prev + Math.random() * 2;
        return prev;
      });
    }, 200);
  }, []);

  const stopLoading = useCallback(() => {
    clearTimers();
    setProgress(100);
    setIsLoading(false);

    // Laisser la barre atteindre 100% visuellement avant de disparaître en fondu
    completeTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setProgress(0);
    }, 350);
  }, []);

  // Déclencheur rapide optimisé pour les bascules de vue (ex: Dashboard <-> Portail)
  const triggerViewChangeLoading = useCallback((durationMs: number = 320) => {
    clearTimers();
    setIsLoading(true);
    setIsVisible(true);
    setProgress(20);

    // Étape 1 : accélération
    setTimeout(() => {
      setProgress(75);
    }, durationMs * 0.3);

    // Étape 2 : achèvement complet à 100%
    setTimeout(() => {
      setProgress(100);
      setIsLoading(false);
    }, durationMs * 0.7);

    // Étape 3 : disparition élégante
    completeTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setProgress(0);
    }, durationMs + 200);
  }, []);

  const withLoading = useCallback(
    async <T,>(asyncFn: () => Promise<T>): Promise<T> => {
      startLoading();
      try {
        const result = await asyncFn();
        return result;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  useEffect(() => {
    return () => clearTimers();
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        progress,
        startLoading,
        stopLoading,
        triggerViewChangeLoading,
        withLoading,
      }}
    >
      <LoadingIndicator isVisible={isVisible} progress={progress} />
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading doit être utilisé à l'intérieur d'un LoadingProvider");
  }
  return context;
};

/**
 * Barre de chargement BTP fixée au sommet absolu de l'écran
 */
export const LoadingIndicator: React.FC<{
  isVisible: boolean;
  progress: number;
}> = ({ isVisible, progress }) => {
  if (!isVisible && progress === 0) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] pointer-events-none transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      {/* Piste de fond translucide */}
      <div className="h-1 sm:h-1.5 w-full bg-slate-900/10 dark:bg-slate-100/10 backdrop-blur-xs">
        {/* Barre active avec dégradé BTP et transition fluide */}
        <div
          className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 transition-all ease-out duration-300 relative shadow-[0_0_12px_rgba(249,115,22,0.8)]"
          style={{ width: `${progress}%` }}
        >
          {/* Tête lumineuse pulsée au bout de la barre */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/70 animate-pulse" />
          <div className="absolute right-0 -top-1 w-3 h-3 bg-amber-400 rounded-full blur-xs opacity-90 -mr-1.5" />
        </div>
      </div>
    </div>
  );
};
