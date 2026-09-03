/**
 * AGB CHANTIER - Bannière d'Alerte Visuelle d'Urgence Terrain
 * Notifie instantanément les responsables en cas d'accident ou de non-conformité majeure
 */

import React from "react";
import { useNotifications } from "./notifications_context";
import { AlertTriangle, ShieldAlert, ArrowRight, CheckCircle, X, Siren } from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppBadge } from "../../../core/widgets/badges/app_badge";

interface CriticalAlertBannerProps {
  onNavigate: (route: string) => void;
}

export const CriticalAlertBanner: React.FC<CriticalAlertBannerProps> = ({ onNavigate }) => {
  const { activeBannerAlert, acknowledgeAlert, dismissBannerAlert } = useNotifications();

  if (!activeBannerAlert) return null;

  const isCritical = activeBannerAlert.severity === "CRITIQUE";

  return (
    <div
      role="alert"
      className={`w-full border-b transition-all duration-300 ease-in-out shadow-lg ${
        isCritical
          ? "bg-red-700 text-white border-red-800"
          : "bg-amber-700 text-white border-amber-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={`p-2 rounded-lg shrink-0 ${
              isCritical
                ? "bg-red-800 text-white animate-pulse"
                : "bg-amber-800 text-white"
            }`}
          >
            {isCritical ? (
              <Siren className="w-5 h-5 text-red-200" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-200" />
            )}
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold uppercase text-xs tracking-wider bg-white/20 px-2 py-0.5 rounded text-white inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                {activeBannerAlert.title}
              </span>
              <span className="text-xs font-semibold opacity-90 truncate">
                • {activeBannerAlert.projectName} ({activeBannerAlert.locationDetails})
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/95 line-clamp-2 leading-snug">
              {activeBannerAlert.message}
            </p>
            <p className="text-[11px] text-white/75 font-mono">
              Signalé par {activeBannerAlert.reportedBy} • Il y a quelques instants
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <AppButton
            variant="secondary"
            size="sm"
            tooltip="Ouvrir immédiatement la fiche d'intervention sur le chantier concerné"
            className="bg-white text-slate-900 hover:bg-slate-100 font-bold border-none"
            onClick={() => {
              onNavigate(activeBannerAlert.targetRoute);
            }}
            rightIcon={<ArrowRight className="w-3.5 h-3.5 text-orange-600" />}
          >
            {activeBannerAlert.actionLabel || "Intervenir"}
          </AppButton>

          <AppButton
            variant="outline"
            size="sm"
            tooltip="Valider la prise en compte de l'incident par la direction des travaux"
            className="border-white/40 text-white hover:bg-white/10"
            onClick={() => acknowledgeAlert(activeBannerAlert.id)}
            leftIcon={<CheckCircle className="w-3.5 h-3.5 text-emerald-300" />}
          >
            Acquitter
          </AppButton>

          <button
            onClick={dismissBannerAlert}
            title="Masquer la bannière"
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-md cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
