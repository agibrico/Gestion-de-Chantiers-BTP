/**
 * AGB CHANTIER - Contexte des Alertes & Notifications Push Terrain - AXE 22
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { AlertNotificationEntity, AlertSeverity, AlertCategory } from "../domain/notification_entity";

const STORAGE_KEY = "agb_chantier_notifications_v1";

const INITIAL_ALERTS: AlertNotificationEntity[] = [
  {
    id: "notif-001",
    title: "🚨 ACCIDENT SIGNALÉ SUR LE TERRAIN",
    message: "Chute d'un compagnon depuis une plate-forme d'échafaudage au niveau R+2. Premiers secours prodigués, arrêt de travail immédiat requis et transfert clinique en cours.",
    severity: "CRITIQUE",
    category: "ACCIDENT_TERRAIN",
    projectId: "proj-001",
    projectName: "Résidence Les Perles d'Abidjan",
    locationDetails: "Bâtiment B - Échafaudage Façade Nord File 4",
    reportedBy: "Kouamé N'Guessan (Superviseur HSE)",
    reportedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 min ago
    isRead: false,
    isAcknowledged: false,
    targetRoute: "/hse",
    actionLabel: "Ouvrir Registre HSE & Déclaration",
  },
  {
    id: "notif-002",
    title: "⚠️ NON-CONFORMITÉ MAJEURE QUALITÉ : COULAGE BLOQUÉ",
    message: "Le Bureau de Contrôle SOCOTEC a refusé le bon à couler sur le plancher haut R+2. Enrobage d'armatures inférieur à 2.5cm et cales manquantes sur les voiles porteurs.",
    severity: "MAJEURE",
    category: "NON_CONFORMITE_MAJEURE",
    projectId: "proj-002",
    projectName: "Tour Postel 2001 (Rénovation)",
    locationDetails: "Plancher Haut R+2 - Zone Est Voile V12",
    reportedBy: "Ing. Jean-Luc Koffi (Bureau Veritas / Contrôle)",
    reportedAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(), // 1h35 ago
    isRead: false,
    isAcknowledged: false,
    targetRoute: "/quality",
    actionLabel: "Voir Fiche Non-Conformité",
  },
  {
    id: "notif-003",
    title: "🔒 RÉSERVE BLOQUANTE OPR",
    message: "Épreuve de mise sous pression du réseau de protection incendie RIA négative. Fuite constatée en sous-sol avant réception provisoire.",
    severity: "MAJEURE",
    category: "RESERVE_BLOQUANTE",
    projectId: "proj-003",
    projectName: "Hangar Logistique San-Pédro",
    locationDetails: "Local RIA & Colonnes S/Sol",
    reportedBy: "Laurent Bamba (Conducteur Principal)",
    reportedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4h ago
    isRead: true,
    isAcknowledged: true,
    acknowledgedBy: "Laurent Bamba",
    acknowledgedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    targetRoute: "/reservations",
    actionLabel: "Consulter Réserves OPR",
  },
  {
    id: "notif-004",
    title: "🦺 CONTRÔLE SÉCURITÉ : DÉFAUT PORT DES EPI",
    message: "Intervention sous-traitant plomberie sans casque ni chaussures de sécurité signalée en zone d'élingage grue. Rappel à l'ordre immédiat.",
    severity: "AVERTISSEMENT",
    category: "SECURITE_EPI",
    projectId: "proj-001",
    projectName: "Résidence Les Perles d'Abidjan",
    locationDetails: "Zone Déchargement Camions Toupie",
    reportedBy: "Sékou Traoré (Chef de Chantier)",
    reportedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    isRead: true,
    isAcknowledged: true,
    acknowledgedBy: "Kouamé N'Guessan",
    acknowledgedAt: new Date(Date.now() - 11 * 3600 * 1000).toISOString(),
    targetRoute: "/hse",
    actionLabel: "Consulter HSE",
  },
  {
    id: "notif-005",
    title: "📋 NOUVEAU PLAN BPE VALIDÉ PAR LE BET",
    message: "Le plan de structure EXE-BA-05 Indice C (Armatures dallage) a reçu le visa 'Bon Pour Exécution' sans réserve.",
    severity: "INFO",
    category: "DOCUMENT_URGENT",
    projectId: "proj-002",
    projectName: "Tour Postel 2001 (Rénovation)",
    locationDetails: "Dossier Technique GED - Axe 18",
    reportedBy: "Bureau d'Études BâtiTech",
    reportedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    isRead: true,
    isAcknowledged: true,
    targetRoute: "/documents",
    actionLabel: "Télécharger Plan BPE",
  },
];

interface NotificationsContextType {
  alerts: AlertNotificationEntity[];
  unreadCount: number;
  criticalUnreadCount: number;
  activeBannerAlert: AlertNotificationEntity | null;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  acknowledgeAlert: (id: string, userName?: string) => void;
  dismissBannerAlert: () => void;
  triggerSimulatedAlert: (category: "ACCIDENT_TERRAIN" | "NON_CONFORMITE_MAJEURE") => void;
  deleteAlert: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertNotificationEntity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_ALERTS;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("agb_notif_sound") !== "false";
    } catch {
      return true;
    }
  });

  // Most urgent unacknowledged critical alert to display on the screen
  const [activeBannerAlert, setActiveBannerAlert] = useState<AlertNotificationEntity | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    } catch {
      // ignore
    }
  }, [alerts]);

  // Determine active banner alert on load or updates
  useEffect(() => {
    const unackCritical = alerts.find(
      (a) => !a.isAcknowledged && (a.severity === "CRITIQUE" || a.severity === "MAJEURE")
    );
    setActiveBannerAlert(unackCritical || null);
  }, [alerts]);

  const playBeep = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  const markAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );
  };

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  const acknowledgeAlert = (id: string, userName = "Responsable Travaux") => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              isRead: true,
              isAcknowledged: true,
              acknowledgedBy: userName,
              acknowledgedAt: new Date().toISOString(),
            }
          : a
      )
    );
    if (activeBannerAlert?.id === id) {
      setActiveBannerAlert(null);
    }
  };

  const dismissBannerAlert = () => {
    setActiveBannerAlert(null);
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    if (activeBannerAlert?.id === id) {
      setActiveBannerAlert(null);
    }
  };

  const triggerSimulatedAlert = (category: "ACCIDENT_TERRAIN" | "NON_CONFORMITE_MAJEURE") => {
    playBeep();
    const isAccident = category === "ACCIDENT_TERRAIN";
    const newAlert: AlertNotificationEntity = {
      id: `notif-${Date.now()}`,
      title: isAccident
        ? "🚨 ALERTE TERRAIN : ACCIDENT DE TRAVAIL SIGNALÉ"
        : "⚠️ ALERTE QUALITÉ : NON-CONFORMITÉ MAJEURE IMMÉDIATE",
      message: isAccident
        ? "Signalement urgent : Blessure avec coupure profonde sur ferrailleur lors du ligaturage. Intervention SST terrain en cours, avis médical requis."
        : "Signalement urgent : Éprouvettes béton 7 jours écrasées à 14 MPa (requis 25 MPa). Suspension immédiate des travaux sur le voile V3.",
      severity: isAccident ? "CRITIQUE" : "MAJEURE",
      category,
      projectId: isAccident ? "proj-001" : "proj-002",
      projectName: isAccident ? "Résidence Les Perles d'Abidjan" : "Tour Postel 2001 (Rénovation)",
      locationDetails: isAccident ? "Zone Est Dalle R+3 File 8" : "Semelle isolée S-14 Bâtiment A",
      reportedBy: isAccident ? "Amadou Koné (Chef de Chantier)" : "Ing. Kassi (Contrôleur Technique)",
      reportedAt: new Date().toISOString(),
      isRead: false,
      isAcknowledged: false,
      targetRoute: isAccident ? "/hse" : "/quality",
      actionLabel: isAccident ? "Ouvrir Déclaration HSE" : "Consulter Fiche Qualité",
    };

    setAlerts((prev) => [newAlert, ...prev]);
    setActiveBannerAlert(newAlert);
  };

  const unreadCount = alerts.filter((a) => !a.isRead).length;
  const criticalUnreadCount = alerts.filter(
    (a) => !a.isRead && (a.severity === "CRITIQUE" || a.severity === "MAJEURE")
  ).length;

  return (
    <NotificationsContext.Provider
      value={{
        alerts,
        unreadCount,
        criticalUnreadCount,
        activeBannerAlert,
        soundEnabled,
        setSoundEnabled: (val) => {
          setSoundEnabled(val);
          try {
            localStorage.setItem("agb_notif_sound", val ? "true" : "false");
          } catch {}
        },
        markAsRead,
        markAllAsRead,
        acknowledgeAlert,
        dismissBannerAlert,
        triggerSimulatedAlert,
        deleteAlert,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
};
