/**
 * AGB CHANTIER - Service d'Historique d'Activité Utilisateur (Activity Log)
 * Enregistre et persiste dans le localStorage les actions clés :
 * - Modifications des paramètres et personnalisation des modules
 * - Exports de données (CSV BTP, rapports)
 * - Événements système et sauvegardes automatiques
 */

import { useState, useEffect } from "react";

export type ActivityCategory = "PARAMETRES" | "EXPORT" | "SYSTEME";

export interface ActivityLogEntry {
  id: string;
  timestamp: string; // ISO 8601
  category: ActivityCategory;
  title: string;
  description: string;
  metadata?: {
    featureId?: string;
    featureName?: string;
    presetId?: string;
    presetName?: string;
    exportFormat?: string;
    filename?: string;
    itemCount?: number;
    source?: string;
    [key: string]: any;
  };
}

const ACTIVITY_STORAGE_KEY = "agb_user_activity_log_v1";
const MAX_LOG_ENTRIES = 100;
const ACTIVITY_EVENT_NAME = "agb:activity_logged";

/**
 * Entrées d'activité initiales réalistes pour un démarrage propre et informatif
 */
const INITIAL_ACTIVITIES: ActivityLogEntry[] = [
  {
    id: "act_init_001",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
    category: "SYSTEME",
    title: "Sauvegarde automatique activée",
    description: "Initialisation du moteur de persistance locale dans le localStorage du navigateur.",
  },
  {
    id: "act_init_002",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 min ago
    category: "PARAMETRES",
    title: "Profil Métier BTP initialisé",
    description: "Configuration par défaut « Tout-en-un Complet » chargée avec succès.",
    metadata: {
      presetId: "preset_all",
      presetName: "Tout-en-un Complet",
    },
  },
  {
    id: "act_init_003",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
    category: "EXPORT",
    title: "Export initial de contrôle",
    description: "Génération de l'export de contrôle de données chantiers (format CSV BTP).",
    metadata: {
      exportFormat: "CSV",
      itemCount: 6,
      filename: "agb_btp_dashboard_controle.csv",
    },
  },
];

/**
 * Récupère l'ensemble des activités enregistrées dans le localStorage
 */
export const getStoredActivities = (): ActivityLogEntry[] => {
  if (typeof window === "undefined") return INITIAL_ACTIVITIES;

  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (!raw) {
      // Si aucune activité n'existe, initialiser avec les entrées de bienvenue
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(INITIAL_ACTIVITIES));
      return INITIAL_ACTIVITIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_ACTIVITIES;
  } catch (error) {
    console.warn("[ActivityLogService] Failed to read activity log from localStorage:", error);
    return INITIAL_ACTIVITIES;
  }
};

/**
 * Ajoute une nouvelle action dans l'historique d'activité et la persiste
 */
export const logActivity = (
  entry: Omit<ActivityLogEntry, "id" | "timestamp"> & { timestamp?: string }
): ActivityLogEntry => {
  const newEntry: ActivityLogEntry = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: entry.timestamp || new Date().toISOString(),
    category: entry.category,
    title: entry.title,
    description: entry.description,
    metadata: entry.metadata,
  };

  if (typeof window !== "undefined") {
    try {
      const current = getStoredActivities();
      // Insérer la nouvelle action en tête de liste et limiter la taille
      const updated = [newEntry, ...current].slice(0, MAX_LOG_ENTRIES);
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(updated));

      // Déclencher un événement personnalisé pour que tous les composants React se mettent à jour
      window.dispatchEvent(
        new CustomEvent(ACTIVITY_EVENT_NAME, {
          detail: newEntry,
        })
      );
    } catch (error) {
      console.warn("[ActivityLogService] Failed to write activity log to localStorage:", error);
    }
  }

  return newEntry;
};

/**
 * Efface l'historique d'activité du localStorage
 */
export const clearActivityLog = (): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify([]));
      window.dispatchEvent(new CustomEvent(ACTIVITY_EVENT_NAME, { detail: null }));
    } catch (error) {
      console.warn("[ActivityLogService] Failed to clear activity log:", error);
    }
  }
};

/**
 * Hook React pour s'abonner en temps réel aux événements de l'historique d'activité
 */
export const useActivityLog = (limit: number = 50) => {
  const [activities, setActivities] = useState<ActivityLogEntry[]>(() => {
    return getStoredActivities().slice(0, limit);
  });

  const refresh = () => {
    setActivities(getStoredActivities().slice(0, limit));
  };

  useEffect(() => {
    const handleActivityLogged = () => {
      refresh();
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === ACTIVITY_STORAGE_KEY) {
        refresh();
      }
    };

    window.addEventListener(ACTIVITY_EVENT_NAME, handleActivityLogged);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(ACTIVITY_EVENT_NAME, handleActivityLogged);
      window.removeEventListener("storage", handleStorage);
    };
  }, [limit]);

  return {
    activities,
    logAction: logActivity,
    clearLog: clearActivityLog,
    refresh,
    totalCount: activities.length,
  };
};

/**
 * Helper de formatage de temps relatif en français
 */
export const formatRelativeTimeFr = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "À l'instant";
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} min`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return `Hier à ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
    }
    if (diffInDays < 7) {
      return `Il y a ${diffInDays} jours`;
    }

    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
};
