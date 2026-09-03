/**
 * AGB CHANTIER - Tiroir & Panneau des Alertes Visuelles Terrain
 */

import React, { useState } from "react";
import { useNotifications } from "./notifications_context";
import {
  Bell,
  AlertTriangle,
  Siren,
  CheckCircle2,
  Volume2,
  VolumeX,
  X,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Flame,
  Clock,
  Trash2,
} from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppBadge } from "../../../core/widgets/badges/app_badge";

interface NotificationsDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const NotificationsDrawerModal: React.FC<NotificationsDrawerModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const {
    alerts,
    unreadCount,
    criticalUnreadCount,
    soundEnabled,
    setSoundEnabled,
    markAsRead,
    markAllAsRead,
    acknowledgeAlert,
    triggerSimulatedAlert,
    deleteAlert,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<"ALL" | "CRITICAL" | "QUALITY" | "UNREAD">("ALL");

  if (!isOpen) return null;

  const filteredAlerts = alerts.filter((a) => {
    if (activeFilter === "CRITICAL") return a.category === "ACCIDENT_TERRAIN" || a.severity === "CRITIQUE";
    if (activeFilter === "QUALITY") return a.category === "NON_CONFORMITE_MAJEURE" || a.category === "RESERVE_BLOQUANTE";
    if (activeFilter === "UNREAD") return !a.isRead;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg h-full bg-white dark:bg-[#0F172A] shadow-2xl z-10 flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Centre d'Alertes Terrain
                </h3>
                {criticalUnreadCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white animate-pulse">
                    {criticalUnreadCount} URGENT{criticalUnreadCount > 1 ? "S" : ""}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Accidents chantiers & non-conformités majeures
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Désactiver les alertes sonores" : "Activer les alertes sonores"}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                soundEnabled
                  ? "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30"
                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Simulation Testing Toolbar for Managers */}
        <div className="p-3 bg-amber-500/10 dark:bg-amber-500/5 border-b border-amber-500/20 px-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Test du Système d'Alerte Responsables
            </span>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">
              Simulation temps réel
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AppButton
              variant="danger"
              size="sm"
              tooltip="Simule un accident de travail signalé sur le terrain avec notification visuelle et alerte sonore"
              className="text-xs flex-1 py-1"
              onClick={() => triggerSimulatedAlert("ACCIDENT_TERRAIN")}
              leftIcon={<Siren className="w-3.5 h-3.5" />}
            >
              Simuler Accident
            </AppButton>
            <AppButton
              variant="amber"
              size="sm"
              tooltip="Simule une non-conformité majeure du bureau de contrôle bloquant les coulages"
              className="text-xs flex-1 py-1"
              onClick={() => triggerSimulatedAlert("NON_CONFORMITE_MAJEURE")}
              leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}
            >
              Simuler Non-Conformité
            </AppButton>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === "ALL"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Toutes ({alerts.length})
          </button>
          <button
            onClick={() => setActiveFilter("CRITICAL")}
            className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeFilter === "CRITICAL"
                ? "bg-red-600 text-white"
                : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            }`}
          >
            🚨 Accidents & HSE
          </button>
          <button
            onClick={() => setActiveFilter("QUALITY")}
            className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeFilter === "QUALITY"
                ? "bg-amber-600 text-white"
                : "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
            }`}
          >
            ⚠️ Non-Conformités
          </button>
          <button
            onClick={() => setActiveFilter("UNREAD")}
            className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === "UNREAD"
                ? "bg-orange-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Non Lues ({unreadCount})
          </button>
        </div>

        {/* List of Alerts */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2 opacity-80" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Aucune alerte active dans cette catégorie
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Tous les chantiers et rapports de sécurité sont sous contrôle.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isCrit = alert.severity === "CRITIQUE";
              const isMaj = alert.severity === "MAJEURE";

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-all ${
                    !alert.isRead
                      ? isCrit
                        ? "bg-red-50/80 dark:bg-red-950/30 border-red-300 dark:border-red-900/60 shadow-xs"
                        : isMaj
                        ? "bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900/60 shadow-xs"
                        : "bg-blue-50/80 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50"
                      : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 opacity-90"
                  }`}
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isCrit ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-600 text-white uppercase tracking-wider">
                          <Siren className="w-3 h-3" />
                          URGENCE TERRAIN
                        </span>
                      ) : isMaj ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-600 text-white uppercase tracking-wider">
                          <AlertTriangle className="w-3 h-3" />
                          NON-CONFORMITÉ MAJEURE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                          {alert.category}
                        </span>
                      )}

                      {!alert.isAcknowledged && (
                        <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-500/15 px-1.5 py-0.5 rounded border border-orange-500/20">
                          Non Acquittée
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAlert(alert.id);
                      }}
                      title="Supprimer la notification"
                      className="p-1 text-slate-400 hover:text-red-500 rounded cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                    {alert.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {alert.projectName}
                      </span>{" "}
                      • {alert.locationDetails}
                    </div>
                  </div>

                  {alert.isAcknowledged ? (
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Acquittée par {alert.acknowledgedBy}
                    </div>
                  ) : null}

                  {/* Actions inside card */}
                  <div className="mt-3 flex items-center gap-2">
                    <AppButton
                      variant="primary"
                      size="sm"
                      tooltip="Ouvrir immédiatement la vue concernée (HSE, Qualité ou Réserves)"
                      className="text-xs py-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(alert.id);
                        onClose();
                        onNavigate(alert.targetRoute);
                      }}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      {alert.actionLabel || "Voir le module"}
                    </AppButton>

                    {!alert.isAcknowledged && (
                      <AppButton
                        variant="outline"
                        size="sm"
                        tooltip="Confirmer la prise en charge de cet incident par le responsable"
                        className="text-xs py-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          acknowledgeAlert(alert.id);
                        }}
                      >
                        Acquitter
                      </AppButton>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <AppButton
            variant="ghost"
            size="sm"
            tooltip="Marquer toutes les notifications et alertes comme lues"
            className="text-xs text-slate-600 dark:text-slate-400"
            onClick={markAllAsRead}
          >
            Tout marquer comme lu
          </AppButton>

          <AppButton
            variant="outline"
            size="sm"
            tooltip="Accéder à la page complète du centre de notifications et historique d'audit"
            className="text-xs"
            onClick={() => {
              onClose();
              onNavigate("/notifications");
            }}
          >
            Centre Complet
          </AppButton>
        </div>
      </div>
    </div>
  );
};
