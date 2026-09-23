/**
 * AGB CHANTIER - Écran Paramètres & Personnalisation de l'Application
 * Permet aux utilisateurs de gérer leurs modules, profils métiers et options.
 */

import React, { useState } from "react";
import { useFeatures } from "../../../core/features/feature_toggle_context";
import { CATEGORY_LABELS } from "../../../core/features/feature_registry";
import {
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Layers,
  Check,
  Search,
  Database,
  ShieldCheck,
  Smartphone,
  HardDrive,
  History,
  Save,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useOfflineDataCache } from "../../../core/pwa/use_offline_data_cache";
import { ActivityLogWidget } from "../../../core/activity/presentation/ActivityLogWidget";
import { formatRelativeTimeFr } from "../../../core/activity/activity_log_service";

export interface SettingsAndCustomizationScreenProps {
  onNavigate?: (route: string) => void;
}

export const SettingsAndCustomizationScreen: React.FC<SettingsAndCustomizationScreenProps> = ({ onNavigate }) => {
  const {
    allFeatures,
    allPresets,
    isFeatureEnabled,
    toggleFeature,
    applyPreset,
    enableAllFeatures,
    resetToDefaults,
    activePresetId,
    activePreset,
    enabledCount,
    totalCount,
    openCustomizer,
    lastSavedTimestamp,
    savePreferencesNow,
  } = useFeatures();

  const [activeScreenTab, setActiveScreenTab] = useState<"modules" | "history">("modules");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("ALL");
  const { cachedProjectsCount, isServiceWorkerActive } = useOfflineDataCache();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* En-tête de la page */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">
              Paramètres & Configuration
            </span>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
              Axe 27
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Personnalisation des Options & Modules
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choisissez les fonctions qui doivent composer votre application BTP et suivez l'historique des actions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveScreenTab("history")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
              activeScreenTab === "history"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-xs"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750"
            }`}
          >
            <History className="w-4 h-4 text-orange-500" />
            <span>Historique d'Activité</span>
          </button>

          <button
            onClick={() => openCustomizer("presets")}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Assistant Profils</span>
          </button>
        </div>
      </div>

      {/* Résumé de l'état actuel (4 Cartes d'indicateurs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carte 1 : Profil */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Profil Métier Actif
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <span className="text-base font-black text-slate-900 dark:text-white truncate">
              {activePreset?.name || "Personnalisé"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
            {activePreset?.subtitle || "Sélection sur-mesure"}
          </p>
        </div>

        {/* Carte 2 : Fonctions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Fonctions Activées
          </p>
          <div className="flex items-center gap-2 mt-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-base font-black text-slate-900 dark:text-white">
              {enabledCount} sur {totalCount}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {totalCount - enabledCount} options masquées
          </p>
        </div>

        {/* Carte 3 : Sauvegarde Automatique */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Sauvegarde Auto
            </p>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Save className="w-5 h-5 text-emerald-500" />
            <span className="text-base font-black text-slate-900 dark:text-white">
              Synchronisé
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate" title={lastSavedTimestamp}>
            Persistance active ({formatRelativeTimeFr(lastSavedTimestamp)})
          </p>
        </div>

        {/* Carte 4 : Cache Terrain */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Stockage & Cache Terrain
          </p>
          <div className="flex items-center gap-2 mt-2">
            <HardDrive className="w-5 h-5 text-blue-500" />
            <span className="text-base font-black text-slate-900 dark:text-white">
              {cachedProjectsCount} chantiers en cache
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Service Worker {isServiceWorkerActive ? "Actif" : "En attente"}
          </p>
        </div>
      </div>

      {/* Onglets Principaux de l'Écran */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 w-fit">
        <button
          onClick={() => setActiveScreenTab("modules")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeScreenTab === "modules"
              ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Gestion des Modules & Toggles</span>
        </button>

        <button
          onClick={() => setActiveScreenTab("history")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeScreenTab === "history"
              ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Historique d'Activité & Exports</span>
        </button>
      </div>

      {/* Contenu Tab : Historique d'Activité */}
      {activeScreenTab === "history" && (
        <ActivityLogWidget
          limit={50}
          compact={false}
          showAutoSaveNotice={true}
          onNavigateToSettings={() => setActiveScreenTab("modules")}
        />
      )}

      {/* Contenu Tab : Modules & Profils Métiers */}
      {activeScreenTab === "modules" && (
        <div className="space-y-6">
          {/* Profils Rapides */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>1. Choisir un Profil Métier Prédéfini</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Appliquez une sélection adaptée à votre corps de métier en un seul clic. Vos choix sont automatiquement sauvegardés.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {allPresets
                .filter((p) => p.id !== "preset_custom")
                .map((preset) => {
                  const isActive = activePresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isActive
                          ? "bg-orange-50/50 dark:bg-orange-950/20 border-orange-500 ring-1 ring-orange-500/20"
                          : "bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <h3 className="text-xs font-black text-slate-900 dark:text-white">
                            {preset.name}
                          </h3>
                          {isActive && (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              Actif
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 mb-3">
                          {preset.description}
                        </p>
                      </div>

                      <button
                        onClick={() => applyPreset(preset.id)}
                        disabled={isActive}
                        className={`w-full py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          isActive
                            ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                            : "bg-orange-600 hover:bg-orange-700 text-white"
                        }`}
                      >
                        {isActive ? "Profil actuel" : "Appliquer"}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Personnalisation Fine (Tableau de bord de gestion des modules) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                  <span>2. Ajuster vos Modules & Options Individuellement</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Activez ou retirez chaque fonction d'un simple clic. La sauvegarde est automatique et immédiate.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={enableAllFeatures}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  Tout Activer
                </button>
                <button
                  onClick={resetToDefaults}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rétablir</span>
                </button>
              </div>
            </div>

            {/* Grille exhaustive des fonctionnalités */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {allFeatures.map((feature) => {
                const isEnabled = isFeatureEnabled(feature.id);
                const isCore = feature.isCore;

                return (
                  <div
                    key={feature.id}
                    onClick={() => {
                      if (!isCore) toggleFeature(feature.id);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isEnabled
                        ? "bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-750 shadow-2xs hover:border-orange-400"
                        : "bg-slate-50 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-850 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold truncate ${
                            isEnabled
                              ? "text-slate-900 dark:text-white"
                              : "text-slate-500 line-through"
                          }`}
                        >
                          {feature.name}
                        </span>
                        {isCore && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            Requis
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug mt-1 line-clamp-2">
                        {feature.description}
                      </p>
                      <span className="inline-block text-[10px] font-medium text-orange-600 dark:text-orange-400 mt-1">
                        {feature.categoryLabel}
                      </span>
                    </div>

                    {/* Bascule Switch */}
                    <div className="shrink-0 pt-1">
                      <div
                        className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                          isCore
                            ? "bg-emerald-500 cursor-not-allowed opacity-90"
                            : isEnabled
                            ? "bg-orange-600"
                            : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                            isEnabled ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mini-section Historique Récent sous les modules */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Historique d'Activité & Traçabilité
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Consultez les dernières modifications de vos options et l'historique des exports de rapports.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveScreenTab("history")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>Accéder à l'Historique Complet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
