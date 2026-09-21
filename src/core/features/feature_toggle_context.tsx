/**
 * AGB CHANTIER - Contexte Global de Gestion des Fonctionnalités & Options Utilisateur
 * Gère l'activation, la désactivation et la persistance locale des modules et widgets choisis par le client.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { ALL_FEATURES, FEATURE_PRESETS } from "./feature_registry";
import { FeatureDefinition, FeaturePreset, UserFeaturePreferences } from "./feature_toggle_types";
import { useToast } from "../widgets/feedback/app_toast";
import { logActivity } from "../activity/activity_log_service";

const STORAGE_KEY = "agb_user_feature_preferences_v1";

interface FeatureToggleContextType {
  enabledFeatures: Record<string, boolean>;
  isFeatureEnabled: (featureId: string) => boolean;
  toggleFeature: (featureId: string) => void;
  enableFeature: (featureId: string) => void;
  disableFeature: (featureId: string) => void;
  enableAllFeatures: () => void;
  disableAllNonCoreFeatures: () => void;
  applyPreset: (presetId: string) => void;
  resetToDefaults: () => void;
  activePresetId: string;
  activePreset: FeaturePreset | undefined;
  enabledCount: number;
  totalCount: number;
  isCustomizerOpen: boolean;
  customizerInitialTab: "categories" | "presets" | "widgets" | "history";
  openCustomizer: (initialTab?: "categories" | "presets" | "widgets" | "history") => void;
  closeCustomizer: () => void;
  allFeatures: FeatureDefinition[];
  allPresets: FeaturePreset[];
  lastSavedTimestamp: string;
  isAutoSaved: boolean;
  savePreferencesNow: () => void;
}

const FeatureToggleContext = createContext<FeatureToggleContextType | undefined>(undefined);

const getDefaultPreferences = (): UserFeaturePreferences => {
  const defaults: Record<string, boolean> = {};
  ALL_FEATURES.forEach((f) => {
    defaults[f.id] = f.defaultEnabled;
  });

  return {
    activePresetId: "preset_all",
    enabledFeatures: defaults,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Persistance synchrone et sécurisée dans le localStorage
 */
const persistToLocalStorage = (prefs: UserFeaturePreferences): boolean => {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    return true;
  } catch (e) {
    console.warn("[FeatureToggleProvider] Failed to persist preferences to localStorage:", e);
    return false;
  }
};

export const FeatureToggleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserFeaturePreferences>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as UserFeaturePreferences;
          // S'assurer que les nouvelles fonctionnalités ont une valeur par défaut
          ALL_FEATURES.forEach((f) => {
            if (parsed.enabledFeatures[f.id] === undefined) {
              parsed.enabledFeatures[f.id] = f.defaultEnabled;
            }
          });
          return parsed;
        }
      } catch (e) {
        console.warn("[FeatureToggleProvider] Failed to read stored preferences:", e);
      }
    }
    return getDefaultPreferences();
  });

  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string>(
    () => preferences.lastUpdated || new Date().toISOString()
  );
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizerInitialTab, setCustomizerInitialTab] = useState<"categories" | "presets" | "widgets" | "history">("categories");
  const { showToast } = useToast();

  // Sauvegarde automatique garantie dans localStorage lors de tout changement d'état
  useEffect(() => {
    persistToLocalStorage(preferences);
    setLastSavedTimestamp(preferences.lastUpdated || new Date().toISOString());
  }, [preferences]);

  // Synchronisation multi-onglets en temps réel via l'événement storage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const remotePrefs = JSON.parse(e.newValue) as UserFeaturePreferences;
          setPreferences(remotePrefs);
          setLastSavedTimestamp(remotePrefs.lastUpdated || new Date().toISOString());
        } catch {
          // Ignore parse errors from other windows
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const savePreferencesNow = useCallback(() => {
    const updated = {
      ...preferences,
      lastUpdated: new Date().toISOString(),
    };
    persistToLocalStorage(updated);
    setPreferences(updated);
    setLastSavedTimestamp(updated.lastUpdated);
    showToast("success", "Sauvegarde réussie", "Vos choix de personnalisation sont enregistrés dans votre navigateur.");
  }, [preferences, showToast]);

  const isFeatureEnabled = useCallback(
    (featureId: string): boolean => {
      // Les fonctionnalités indispensables (isCore) ne peuvent pas être désactivées
      const feature = ALL_FEATURES.find((f) => f.id === featureId);
      if (feature?.isCore) return true;
      return preferences.enabledFeatures[featureId] ?? true;
    },
    [preferences.enabledFeatures]
  );

  const toggleFeature = useCallback(
    (featureId: string) => {
      const feature = ALL_FEATURES.find((f) => f.id === featureId);
      if (feature?.isCore) {
        showToast("info", "Fonctionnalité indispensable", `${feature.name} est requise pour le fonctionnement de base.`);
        return;
      }

      setPreferences((prev) => {
        const currentVal = prev.enabledFeatures[featureId] ?? true;
        const newVal = !currentVal;
        const now = new Date().toISOString();
        const updated: UserFeaturePreferences = {
          ...prev,
          activePresetId: "preset_custom",
          enabledFeatures: {
            ...prev.enabledFeatures,
            [featureId]: newVal,
          },
          lastUpdated: now,
        };

        // Sauvegarde synchrone immédiate (protection contre rafraîchissement instantané F5)
        persistToLocalStorage(updated);

        if (feature) {
          if (newVal) {
            showToast("success", "Option ajoutée", `${feature.name} est maintenant visible dans votre application.`);
          } else {
            showToast("info", "Option retirée", `${feature.name} a été masqué de votre navigation.`);
          }

          // Enregistrement dans l'historique d'activité
          logActivity({
            category: "PARAMETRES",
            title: newVal ? `Module activé : ${feature.name}` : `Module masqué : ${feature.name}`,
            description: newVal
              ? `L'option « ${feature.name} » a été activée et ajoutée à vos raccourcis.`
              : `L'option « ${feature.name} » a été retirée de votre interface.`,
            metadata: {
              featureId,
              featureName: feature.name,
              category: feature.category,
              action: newVal ? "ENABLE" : "DISABLE",
            },
          });
        }

        return updated;
      });
    },
    [showToast]
  );

  const enableFeature = useCallback(
    (featureId: string) => {
      const feature = ALL_FEATURES.find((f) => f.id === featureId);
      const now = new Date().toISOString();
      setPreferences((prev) => {
        const updated: UserFeaturePreferences = {
          ...prev,
          activePresetId: "preset_custom",
          enabledFeatures: {
            ...prev.enabledFeatures,
            [featureId]: true,
          },
          lastUpdated: now,
        };
        persistToLocalStorage(updated);
        return updated;
      });

      if (feature) {
        showToast("success", "Module activé", `${feature.name} a été ajouté à votre espace de travail.`);
        logActivity({
          category: "PARAMETRES",
          title: `Module activé : ${feature.name}`,
          description: `Activation du module ${feature.name}.`,
          metadata: { featureId, featureName: feature.name, action: "ENABLE" },
        });
      }
    },
    [showToast]
  );

  const disableFeature = useCallback(
    (featureId: string) => {
      const feature = ALL_FEATURES.find((f) => f.id === featureId);
      if (feature?.isCore) {
        showToast("info", "Action impossible", `${feature.name} est une fonction indispensable.`);
        return;
      }
      const now = new Date().toISOString();
      setPreferences((prev) => {
        const updated: UserFeaturePreferences = {
          ...prev,
          activePresetId: "preset_custom",
          enabledFeatures: {
            ...prev.enabledFeatures,
            [featureId]: false,
          },
          lastUpdated: now,
        };
        persistToLocalStorage(updated);
        return updated;
      });

      if (feature) {
        showToast("info", "Module retiré", `${feature.name} a été retiré de votre espace de travail.`);
        logActivity({
          category: "PARAMETRES",
          title: `Module masqué : ${feature.name}`,
          description: `Désactivation de l'option ${feature.name}.`,
          metadata: { featureId, featureName: feature.name, action: "DISABLE" },
        });
      }
    },
    [showToast]
  );

  const applyPreset = useCallback(
    (presetId: string) => {
      const preset = FEATURE_PRESETS.find((p) => p.id === presetId);
      if (!preset) return;

      const newFeatures: Record<string, boolean> = {};
      ALL_FEATURES.forEach((f) => {
        if (f.isCore) {
          newFeatures[f.id] = true;
        } else if (presetId === "preset_all") {
          newFeatures[f.id] = true;
        } else {
          newFeatures[f.id] = preset.enabledFeatureIds.includes(f.id);
        }
      });

      const now = new Date().toISOString();
      const updated: UserFeaturePreferences = {
        activePresetId: presetId,
        enabledFeatures: newFeatures,
        lastUpdated: now,
      };

      persistToLocalStorage(updated);
      setPreferences(updated);

      showToast("success", "Profil métier appliqué", `Profil « ${preset.name} » activé avec succès.`);

      logActivity({
        category: "PARAMETRES",
        title: `Profil Métier appliqué : ${preset.name}`,
        description: `Bascule vers la présélection « ${preset.name} » (${preset.subtitle}).`,
        metadata: {
          presetId,
          presetName: preset.name,
          activeFeaturesCount: Object.values(newFeatures).filter(Boolean).length,
        },
      });
    },
    [showToast]
  );

  const enableAllFeatures = useCallback(() => {
    applyPreset("preset_all");
  }, [applyPreset]);

  const disableAllNonCoreFeatures = useCallback(() => {
    const newFeatures: Record<string, boolean> = {};
    ALL_FEATURES.forEach((f) => {
      newFeatures[f.id] = f.isCore ? true : false;
    });

    const now = new Date().toISOString();
    const updated: UserFeaturePreferences = {
      activePresetId: "preset_custom",
      enabledFeatures: newFeatures,
      lastUpdated: now,
    };

    persistToLocalStorage(updated);
    setPreferences(updated);

    showToast("info", "Options minimales", "Seules les fonctionnalités indispensables sont désormais actives.");

    logActivity({
      category: "PARAMETRES",
      title: "Configuration minimale appliquée",
      description: "Conservation exclusive des fonctionnalités centrales du système.",
    });
  }, [showToast]);

  const resetToDefaults = useCallback(() => {
    const defaults = getDefaultPreferences();
    persistToLocalStorage(defaults);
    setPreferences(defaults);
    showToast("info", "Réinitialisation", "Toutes les options ont été réinitialisées aux réglages standard.");

    logActivity({
      category: "PARAMETRES",
      title: "Réinitialisation aux réglages d'origine",
      description: "Restitution des valeurs initiales par défaut du système.",
    });
  }, [showToast]);

  const enabledCount = useMemo(() => {
    return ALL_FEATURES.filter((f) => f.isCore || preferences.enabledFeatures[f.id] !== false).length;
  }, [preferences.enabledFeatures]);

  const totalCount = ALL_FEATURES.length;

  const activePreset = useMemo(() => {
    return FEATURE_PRESETS.find((p) => p.id === preferences.activePresetId);
  }, [preferences.activePresetId]);

  const openCustomizer = useCallback((initialTab: "categories" | "presets" | "widgets" | "history" = "categories") => {
    setCustomizerInitialTab(initialTab);
    setIsCustomizerOpen(true);
  }, []);

  const closeCustomizer = useCallback(() => {
    setIsCustomizerOpen(false);
  }, []);

  return (
    <FeatureToggleContext.Provider
      value={{
        enabledFeatures: preferences.enabledFeatures,
        isFeatureEnabled,
        toggleFeature,
        enableFeature,
        disableFeature,
        enableAllFeatures,
        disableAllNonCoreFeatures,
        applyPreset,
        resetToDefaults,
        activePresetId: preferences.activePresetId,
        activePreset,
        enabledCount,
        totalCount,
        isCustomizerOpen,
        customizerInitialTab,
        openCustomizer,
        closeCustomizer,
        allFeatures: ALL_FEATURES,
        allPresets: FEATURE_PRESETS,
        lastSavedTimestamp,
        isAutoSaved: true,
        savePreferencesNow,
      }}
    >
      {children}
    </FeatureToggleContext.Provider>
  );
};

export const useFeatures = (): FeatureToggleContextType => {
  const context = useContext(FeatureToggleContext);
  if (!context) {
    throw new Error("useFeatures must be used within a FeatureToggleProvider");
  }
  return context;
};
