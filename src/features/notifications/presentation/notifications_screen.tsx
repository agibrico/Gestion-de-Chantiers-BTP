/**
 * AGB CHANTIER - Écran Dédié du Centre de Notifications & Alertes Visuelles Terrain - AXE 22
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
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Clock,
  Trash2,
  Search,
  Filter,
} from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import { StatCard } from "../../../core/widgets/cards/stat_card";

interface NotificationsScreenProps {
  onNavigate: (route: string) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onNavigate }) => {
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const filteredAlerts = alerts.filter((a) => {
    if (selectedSeverity !== "ALL" && a.severity !== selectedSeverity) return false;
    if (selectedCategory !== "ALL" && a.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.message.toLowerCase().includes(q) ||
        a.projectName.toLowerCase().includes(q) ||
        a.reportedBy.toLowerCase().includes(q) ||
        a.locationDetails.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCritical = alerts.filter((a) => a.severity === "CRITIQUE").length;
  const totalMajor = alerts.filter((a) => a.severity === "MAJEURE").length;
  const totalAcknowledged = alerts.filter((a) => a.isAcknowledged).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <AppBadge variant="success" dot={true}>
              AXE 22 OPÉRATIONNEL
            </AppBadge>
            <span className="text-xs text-orange-400 font-mono font-bold">
              Notifications Push & Alertes Terrain Responsables
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            Centre des Alertes & Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Surveillance continue des non-conformités majeures, accidents de chantier, arrêts de travaux et alertes de sécurité en temps réel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <AppButton
            variant="danger"
            size="sm"
            tooltip="Déclencher une alerte d'accident terrain avec signal sonore et bannière rouge clignotante"
            onClick={() => triggerSimulatedAlert("ACCIDENT_TERRAIN")}
            leftIcon={<Siren className="w-4 h-4" />}
          >
            Alerte Accident
          </AppButton>

          <AppButton
            variant="amber"
            size="sm"
            tooltip="Déclencher une alerte de non-conformité majeure du bureau de contrôle avec arrêt de coulage"
            onClick={() => triggerSimulatedAlert("NON_CONFORMITE_MAJEURE")}
            leftIcon={<AlertTriangle className="w-4 h-4" />}
          >
            Alerte Qualité
          </AppButton>

          <AppButton
            variant="secondary"
            size="sm"
            tooltip={soundEnabled ? "Couper le signal sonore des notifications" : "Activer le bip sonore des notifications"}
            onClick={() => setSoundEnabled(!soundEnabled)}
            leftIcon={soundEnabled ? <Volume2 className="w-4 h-4 text-orange-600" /> : <VolumeX className="w-4 h-4" />}
          >
            {soundEnabled ? "Son Actif" : "Son Coupé"}
          </AppButton>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Alertes Actives Non Lues"
          value={`${unreadCount} Alertes`}
          subValue={criticalUnreadCount > 0 ? `${criticalUnreadCount} urgentes nécessitent une action` : "Aucune urgence non lue"}
          icon={<Bell className="w-6 h-6" />}
          iconColor={criticalUnreadCount > 0 ? "text-red-600" : "text-orange-600"}
          badgeText="Temps Réel"
          badgeVariant={criticalUnreadCount > 0 ? "danger" : "info"}
        />

        <StatCard
          label="Accidents Signalés Terrain"
          value={`${totalCritical} Déclarations`}
          subValue="Protocoles SST & arrêt de travail"
          icon={<Siren className="w-6 h-6" />}
          iconColor="text-red-600"
          badgeText="Sécurité HSE"
          badgeVariant="danger"
        />

        <StatCard
          label="Non-Conformités Majeures"
          value={`${totalMajor} Blocages`}
          subValue="Contrôles BPE, ferraillages, bétons"
          icon={<AlertTriangle className="w-6 h-6" />}
          iconColor="text-amber-600"
          badgeText="Qualité"
          badgeVariant="warning"
        />

        <StatCard
          label="Alertes Traitées & Closes"
          value={`${totalAcknowledged} Acquittées`}
          subValue="Par la direction et les conducteurs"
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconColor="text-emerald-600"
          badgeText="Résolues"
          badgeVariant="success"
        />
      </div>

      {/* Search & Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full">
          <AppTextField
            placeholder="Rechercher par mot-clé, chantier, auteur, localisation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="w-full sm:w-44">
            <AppSelect
              options={[
                { value: "ALL", label: "Toutes Gravités" },
                { value: "CRITIQUE", label: "🚨 Critique (Accident)" },
                { value: "MAJEURE", label: "⚠️ Majeure (Arrêt)" },
                { value: "AVERTISSEMENT", label: "⚡ Avertissement" },
                { value: "INFO", label: "ℹ️ Information" },
              ]}
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-48">
            <AppSelect
              options={[
                { value: "ALL", label: "Toutes Catégories" },
                { value: "ACCIDENT_TERRAIN", label: "Accident Terrain" },
                { value: "NON_CONFORMITE_MAJEURE", label: "Non-Conformité" },
                { value: "RESERVE_BLOQUANTE", label: "Réserve Bloquante" },
                { value: "SECURITE_EPI", label: "Consignes Sécurité" },
              ]}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
          </div>

          <AppButton
            variant="outline"
            size="md"
            tooltip="Marquer toutes les alertes de la liste comme lues"
            onClick={markAllAsRead}
          >
            Tout marquer lu
          </AppButton>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Aucune alerte ne correspond à vos filtres
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Vous pouvez réinitialiser les filtres ou simuler une nouvelle alerte de terrain.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCrit = alert.severity === "CRITIQUE";
            const isMaj = alert.severity === "MAJEURE";

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-xl border transition-all ${
                  !alert.isRead
                    ? isCrit
                      ? "bg-red-50/70 dark:bg-red-950/25 border-red-300 dark:border-red-900/60 shadow-sm"
                      : isMaj
                      ? "bg-amber-50/70 dark:bg-amber-950/25 border-amber-300 dark:border-amber-900/60 shadow-sm"
                      : "bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                }`}
                onClick={() => markAsRead(alert.id)}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {isCrit ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-black bg-red-600 text-white uppercase tracking-wider">
                          <Siren className="w-3.5 h-3.5" />
                          URGENCE TERRAIN / ACCIDENT
                        </span>
                      ) : isMaj ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-black bg-amber-600 text-white uppercase tracking-wider">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          NON-CONFORMITÉ MAJEURE BLOQUANTE
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                          {alert.category}
                        </span>
                      )}

                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {alert.projectName}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        ({alert.locationDetails})
                      </span>

                      {!alert.isAcknowledged ? (
                        <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/15 px-2 py-0.5 rounded border border-orange-500/25">
                          En attente d'arbitrage
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Pris en charge par {alert.acknowledgedBy}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {alert.title}
                    </h3>

                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {alert.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono">
                      <span>Signalé par : <strong className="text-slate-700 dark:text-slate-300">{alert.reportedBy}</strong></span>
                      <span>Horodatage : {new Date(alert.reportedAt).toLocaleString("fr-FR")}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center md:flex-col md:items-end gap-2 shrink-0">
                    <AppButton
                      variant="primary"
                      size="sm"
                      tooltip="Ouvrir le module métier correspondant pour analyser et traiter la non-conformité ou l'accident"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(alert.id);
                        onNavigate(alert.targetRoute);
                      }}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      {alert.actionLabel || "Traiter l'incident"}
                    </AppButton>

                    {!alert.isAcknowledged && (
                      <AppButton
                        variant="outline"
                        size="sm"
                        tooltip="Signer électroniquement la prise en charge de cette alerte par la direction des travaux"
                        onClick={(e) => {
                          e.stopPropagation();
                          acknowledgeAlert(alert.id);
                        }}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      >
                        Acquitter
                      </AppButton>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAlert(alert.id);
                      }}
                      title="Archiver et supprimer cette notification"
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
