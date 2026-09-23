/**
 * AGB CHANTIER - Modal de Personnalisation de l'Application & Gestion des Options
 * Permet aux clients utilisateurs d'activer ou retirer les fonctionnalités et widgets
 * selon leur profil de travail et leurs préférences.
 */

import React, { useState, useMemo } from "react";
import { useFeatures } from "../feature_toggle_context";
import { CATEGORY_LABELS } from "../feature_registry";
import { FeatureDefinition, FeaturePreset } from "../feature_toggle_types";
import { ActivityLogWidget } from "../../activity/presentation/ActivityLogWidget";
import {
  X,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Layers,
  HardHat,
  Users,
  Package,
  Coins,
  ShieldCheck,
  Wrench,
  LayoutDashboard,
  Check,
  Calendar,
  CheckSquare,
  Clock,
  UserCheck,
  Truck,
  QrCode,
  Briefcase,
  BarChart3,
  Printer,
  FileCheck,
  AlertTriangle,
  Award,
  FileText,
  Bell,
  History,
  HardDrive,
  FileSpreadsheet,
  Camera,
  BookOpen,
} from "lucide-react";

// Mappage des icônes dynamiques
const ICON_MAP: Record<string, React.ReactNode> = {
  HardHat: <HardHat className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
  CheckSquare: <CheckSquare className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Camera: <Camera className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  UserCheck: <UserCheck className="w-4 h-4" />,
  Package: <Package className="w-4 h-4" />,
  Truck: <Truck className="w-4 h-4" />,
  Wrench: <Wrench className="w-4 h-4" />,
  QrCode: <QrCode className="w-4 h-4" />,
  Coins: <Coins className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
  Printer: <Printer className="w-4 h-4" />,
  FileCheck: <FileCheck className="w-4 h-4" />,
  AlertTriangle: <AlertTriangle className="w-4 h-4" />,
  Award: <Award className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  Bell: <Bell className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  History: <History className="w-4 h-4" />,
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  HardDrive: <HardDrive className="w-4 h-4" />,
  FileSpreadsheet: <FileSpreadsheet className="w-4 h-4" />,
  SlidersHorizontal: <SlidersHorizontal className="w-4 h-4" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4" />,
};

const renderIcon = (name: string) => {
  return ICON_MAP[name] || <Layers className="w-4 h-4" />;
};

export const FeatureCustomizerModal: React.FC = () => {
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
    isCustomizerOpen,
    customizerInitialTab,
    closeCustomizer,
  } = useFeatures();

  const [activeTab, setActiveTab] = useState<"categories" | "presets" | "widgets" | "history">(customizerInitialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Synchronisation lors de l'ouverture
  React.useEffect(() => {
    if (isCustomizerOpen) {
      setActiveTab(customizerInitialTab);
    }
  }, [isCustomizerOpen, customizerInitialTab]);

  // Filtrage des fonctionnalités
  const filteredFeatures = useMemo(() => {
    return allFeatures.filter((f) => {
      // Si onglet widgets, ne garder que les widgets
      if (activeTab === "widgets" && f.category !== "dashboard_widgets") {
        return false;
      }
      // Si onglet catégories, ignorer les widgets dashboard si filtre actif
      if (activeTab === "categories" && f.category === "dashboard_widgets" && selectedCategory !== "dashboard_widgets" && selectedCategory !== "ALL") {
        return false;
      }

      // Filtre catégorie
      if (selectedCategory !== "ALL" && f.category !== selectedCategory) {
        return false;
      }

      // Recherche textuelle
      if (searchQuery.trim() === "") return true;
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [allFeatures, activeTab, selectedCategory, searchQuery]);

  // Regroupement par catégorie
  const groupedFeatures = useMemo(() => {
    const groups: Record<string, FeatureDefinition[]> = {};
    filteredFeatures.forEach((f) => {
      if (!groups[f.category]) {
        groups[f.category] = [];
      }
      groups[f.category].push(f);
    });
    return groups;
  }, [filteredFeatures]);

  if (!isCustomizerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeCustomizer}
    >
      <div
        className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ==========================================
            EN-TÊTE DU DIALOGUE
        ========================================== */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm shrink-0">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Personnaliser mon Application
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                  <CheckCircle2 className="w-3 h-3" />
                  {enabledCount} / {totalCount} actives
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Choisissez les modules et options que vous souhaitez voir apparaître dans votre espace BTP.
              </p>
            </div>
          </div>

          <button
            onClick={closeCustomizer}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fermer (Échap)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ==========================================
            BARRE D'ACTIONS, RECHERCHE & ONGLETS
        ========================================== */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Sélecteur d'onglets */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-xs">
              <button
                onClick={() => setActiveTab("categories")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === "categories"
                    ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Tous les Modules</span>
              </button>

              <button
                onClick={() => setActiveTab("presets")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === "presets"
                    ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Profils Métiers</span>
              </button>

              <button
                onClick={() => setActiveTab("widgets")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === "widgets"
                    ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Widgets Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab("history")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === "history"
                    ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Historique</span>
              </button>
            </div>

            {/* Actions globales */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={enableAllFeatures}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                title="Activer l'ensemble des modules"
              >
                Tout Activer
              </button>
              <button
                onClick={resetToDefaults}
                className="p-1.5 px-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1"
                title="Rétablir les réglages par défaut"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Rétablir</span>
              </button>
            </div>
          </div>

          {/* Barre de recherche (pour les onglets modules et widgets) */}
          {activeTab !== "presets" && (
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une fonction (ex: planning, devis, journal, photos, réserves, stocks)..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ==========================================
            CORPS DU MODAL (CONTENU PRINCIPAL)
        ========================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* ONGLET 1 & 3 : LISTE PAR CATÉGORIE / WIDGETS */}
          {activeTab !== "presets" && (
            <>
              {Object.keys(groupedFeatures).length === 0 ? (
                <div className="text-center py-12 px-4">
                  <SlidersHorizontal className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Aucune fonctionnalité trouvée
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Aucun module ne correspond à votre recherche « {searchQuery} ». Essayez d'autres mots-clés.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-3 px-3 py-1.5 text-xs font-bold text-orange-600 hover:underline cursor-pointer"
                  >
                    Effacer la recherche
                  </button>
                </div>
              ) : (
                Object.entries(groupedFeatures).map(([catKey, features]) => {
                  const catInfo = CATEGORY_LABELS[catKey] || {
                    label: catKey,
                    description: "",
                    icon: "Layers",
                  };
                  const activeInCat = features.filter((f) => isFeatureEnabled(f.id)).length;

                  return (
                    <div
                      key={catKey}
                      className="bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-3.5 sm:p-4 space-y-3"
                    >
                      {/* En-tête de catégorie */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                            {renderIcon(catInfo.icon)}
                          </div>
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                              {catInfo.label}
                            </h3>
                            {catInfo.description && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                                {catInfo.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {activeInCat} / {features.length}
                        </span>
                      </div>

                      {/* Grille des fonctionnalités */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                        {features.map((feature) => {
                          const isEnabled = isFeatureEnabled(feature.id);
                          const isCore = feature.isCore;

                          return (
                            <div
                              key={feature.id}
                              onClick={() => {
                                if (!isCore) toggleFeature(feature.id);
                              }}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 select-none ${
                                isEnabled
                                  ? "bg-white dark:bg-slate-900 border-slate-300/80 dark:border-slate-700 shadow-2xs hover:border-orange-400 dark:hover:border-orange-500"
                                  : "bg-slate-100/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-850 opacity-65 hover:opacity-100 hover:border-slate-300"
                              }`}
                            >
                              <div className="flex items-start gap-2.5 min-w-0">
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                    isEnabled
                                      ? "bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400"
                                      : "bg-slate-200/80 dark:bg-slate-800 text-slate-400"
                                  }`}
                                >
                                  {renderIcon(feature.iconName)}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span
                                      className={`text-xs font-bold tracking-tight truncate ${
                                        isEnabled
                                          ? "text-slate-900 dark:text-white"
                                          : "text-slate-600 dark:text-slate-400 line-through"
                                      }`}
                                    >
                                      {feature.name}
                                    </span>
                                    {feature.badge && (
                                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                                        {feature.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5 line-clamp-2">
                                    {feature.description}
                                  </p>
                                </div>
                              </div>

                              {/* Interrupteur Bascule (Switch Toggle) */}
                              <div className="shrink-0 pt-0.5">
                                <div
                                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                                    isCore
                                      ? "bg-emerald-500 cursor-not-allowed opacity-90"
                                      : isEnabled
                                      ? "bg-orange-600 dark:bg-orange-500"
                                      : "bg-slate-300 dark:bg-slate-700"
                                  }`}
                                  title={
                                    isCore
                                      ? "Module fondamental (non désactivable)"
                                      : isEnabled
                                      ? "Cliquer pour retirer ce module"
                                      : "Cliquer pour ajouter ce module"
                                  }
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
                  );
                })
              )}
            </>
          )}

          {/* ONGLET 2 : PROFILS MÉTIERS PRÉ-CONFIGURÉS (PRESETS) */}
          {activeTab === "presets" && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
                <p className="font-bold mb-0.5">💡 Configuration Rapide en 1 Clic :</p>
                <p className="opacity-90">
                  Sélectionnez un profil métier adapté à votre rôle pour configurer automatiquement votre application.
                  Vous pourrez toujours affiner ensuite chaque option individuellement.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {allPresets.map((preset) => {
                  const isActive = activePresetId === preset.id;
                  const countInPreset =
                    preset.id === "preset_all"
                      ? allFeatures.length
                      : preset.enabledFeatureIds.length;

                  return (
                    <div
                      key={preset.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isActive
                          ? "bg-orange-50/50 dark:bg-orange-950/20 border-orange-500 shadow-sm ring-1 ring-orange-500/20"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                              {renderIcon(preset.iconName)}
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                                {preset.name}
                              </h4>
                              <p className="text-[11px] font-bold text-orange-600 dark:text-orange-400">
                                {preset.subtitle}
                              </p>
                            </div>
                          </div>

                          {isActive && (
                            <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
                              <Check className="w-3 h-3" />
                              Actif
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                          {preset.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {countInPreset > 0 ? `${countInPreset} fonctionnalités incluses` : "Personnalisation libre"}
                        </span>

                        <button
                          onClick={() => applyPreset(preset.id)}
                          disabled={isActive}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            isActive
                              ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                              : "bg-orange-600 hover:bg-orange-700 text-white shadow-2xs"
                          }`}
                        >
                          {isActive ? "Profil en cours" : "Appliquer ce profil"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Onglet 4 : Historique d'Activité */}
          {activeTab === "history" && (
            <div className="p-4 sm:p-5">
              <ActivityLogWidget compact={false} showAutoSaveNotice={true} />
            </div>
          )}
        </div>

        {/* ==========================================
            PIED DE DIALOGUE (RÉCAPITULATIF & FERMETURE)
        ========================================== */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 dark:text-slate-400 text-center sm:text-left flex flex-wrap items-center gap-2">
            <span>Profil actif : </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {activePreset?.name || "Sur-Mesure"}
            </span>
            <span className="opacity-40">•</span>
            <span className="font-mono text-[11px]">
              {enabledCount} options actives sur {totalCount}
            </span>
            <span className="opacity-40">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sauvegardé auto (localStorage)</span>
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={closeCustomizer}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Valider & Enregistrer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
