/**
 * AGB CHANTIER SaaS - Modal de Gestion & Consultation du Cache Hors-Ligne
 * Conçu spécifiquement pour les Chefs de Chantier et Conducteurs de Travaux
 */

import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  HardDrive,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Users,
  ShieldCheck,
  Smartphone,
  X,
  Clock,
  ExternalLink,
  ChevronRight,
  SunMedium,
  Check,
} from "lucide-react";
import { useOfflineDataCache } from "./use_offline_data_cache";
import { NetworkInfo } from "../network/network_info";
import { ProjectEntity } from "../../features/projects/domain/entities/project_entity";

interface OfflineDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects?: ProjectEntity[];
  onSelectProject?: (projectCode: string) => void;
}

export const OfflineDataModal: React.FC<OfflineDataModalProps> = ({
  isOpen,
  onClose,
  projects = [],
  onSelectProject,
}) => {
  const {
    isServiceWorkerActive,
    cacheVersion,
    cachedProjectsCount,
    lastSavedAt,
    staticAssetsCount,
    dataAssetsCount,
    isSyncing,
    syncNow,
    loadSnapshot,
    cachedSnapshot,
    isLoadingSnapshot,
  } = useOfflineDataCache();

  const [isOnline, setIsOnline] = useState(NetworkInfo.isOnline);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = NetworkInfo.addListener((online) => setIsOnline(online));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadSnapshot();
    }
  }, [isOpen, loadSnapshot]);

  if (!isOpen) return null;

  const handleSync = async () => {
    try {
      const res = await syncNow(projects.length > 0 ? projects : undefined);
      await loadSnapshot();
      setSyncSuccessMsg(
        `Cache Service Worker actualisé avec succès (${res.projectsCount} chantiers embarqués pour consultation hors-ligne).`
      );
      setTimeout(() => setSyncSuccessMsg(null), 4000);
    } catch (e) {
      console.error("Erreur synchro cache:", e);
    }
  };

  const displayedProjects =
    cachedSnapshot?.projects && cachedSnapshot.projects.length > 0
      ? cachedSnapshot.projects
      : projects;

  const formattedDate = lastSavedAt
    ? new Date(lastSavedAt).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Non synchronisé";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* En-tête Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
                isOnline ? "bg-emerald-600" : "bg-amber-600"
              }`}
            >
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Cache Hors-Ligne & Données Chantier
                </h3>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isOnline
                      ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                      : "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                  }`}
                >
                  {isOnline ? "En Ligne (Réseau actif)" : "Mode Hors-Ligne Déconnecté"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Service Worker AGB — Consultation intégrale des chantiers sans réseau
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message de succès */}
        {syncSuccessMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800/80 px-4 py-2.5 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncSuccessMsg}</span>
          </div>
        )}

        {/* Contenu Déroulant */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* 1. Carte Synthèse État du Cache */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                Service Worker
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {isServiceWorkerActive ? "Actif & Prêt" : "Initialisation"}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1">
                Version : {cacheVersion}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-orange-500" />
                Chantiers en Cache
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-orange-600 dark:text-orange-400 tabular-nums">
                  {displayedProjects.length}
                </span>
                <span className="text-xs text-slate-500 font-medium">projets complets</span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" />
                Consultables sans réseau
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                Dernière Synchronisation
              </span>
              <div className="mt-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                  {formattedDate}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">
                Snapshot mémoire terrain
              </span>
            </div>
          </div>

          {/* 2. Bouton d'Action Préparation Départ Chantier */}
          <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-orange-900 dark:text-orange-200 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                Préparation Départ sur le Terrain
              </h4>
              <p className="text-xs text-orange-800/80 dark:text-orange-300/80 mt-0.5">
                Mettez à jour le snapshot local du Service Worker avant de vous rendre sur un chantier sans couverture réseau.
              </p>
            </div>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Mise en cache..." : "Actualiser le cache terrain"}</span>
            </button>
          </div>

          {/* 3. Données Principales Garanties Hors-Ligne */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Contenu Garanti Disponible Hors Connexion
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <Building2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    Fiches Complètes des Chantiers
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Codes, localisations, budgets contractés, conducteurs et coordonnées clients.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <Calendar className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    Jalons Critiques & Plannings
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Phases Gros Œuvre / CES, retards détectés et échéances de réception (OPR).
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <Users className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    Effectifs & Journal de Chantier
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Pointages journaliers, ouvriers mobilisés et conditions météo constatées.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    Alertes Sécurité & Non-Conformités
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Incidents HSE, réserves ouvertes et niveaux de risque prioritaires.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Liste des Chantiers Embarqués en Cache */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Liste des Chantiers en Cache ({displayedProjects.length})
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">
                Prêts pour inspection terrain
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {displayedProjects.map((p) => {
                const isDelayed =
                  p.milestones?.some((m) => m.status === "EN_RETARD") ||
                  p.phases?.some((ph) => ph.status === "RETARDEE");

                return (
                  <div
                    key={p.id || p.code}
                    onClick={() => {
                      if (onSelectProject) {
                        onSelectProject(p.code);
                        onClose();
                      }
                    }}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-orange-600 dark:text-orange-400">
                          {p.code}
                        </span>
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Offline OK
                        </span>
                        {isDelayed && (
                          <span className="text-[10px] bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Retard
                          </span>
                        )}
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-1">
                        {p.name}
                      </h5>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        <span>{p.location?.city || "Non spécifié"}</span>
                        <span>•</span>
                        <span>{p.managementTeam?.siteManagerName || "Chef de chantier"}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {p.progressPercentage}% réalisé
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pied du Modal */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Conformité PWA & Service Worker W3C
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
