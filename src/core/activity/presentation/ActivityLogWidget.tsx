/**
 * AGB CHANTIER - Composant Historique d'Activité (Activity Log)
 * Affiche les dernières actions effectuées :
 * - Modifications de paramètres et personnalisations
 * - Exports de données (CSV BTP)
 * - Statut de la sauvegarde automatique dans le localStorage
 */

import React, { useState, useMemo } from "react";
import {
  History,
  Sliders,
  FileSpreadsheet,
  HardDrive,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowDownToLine,
  Sparkles,
} from "lucide-react";
import {
  useActivityLog,
  ActivityCategory,
  ActivityLogEntry,
  formatRelativeTimeFr,
} from "../activity_log_service";

interface ActivityLogWidgetProps {
  limit?: number;
  compact?: boolean;
  showAutoSaveNotice?: boolean;
  className?: string;
  onNavigateToSettings?: () => void;
}

export const ActivityLogWidget: React.FC<ActivityLogWidgetProps> = ({
  limit = 50,
  compact = false,
  showAutoSaveNotice = true,
  className = "",
  onNavigateToSettings,
}) => {
  const { activities, clearLog, refresh, totalCount } = useActivityLog(limit);
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | ActivityCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  // Filtrage par catégorie et recherche textuelle
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchCat = selectedCategory === "ALL" || act.category === selectedCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        act.title.toLowerCase().includes(q) ||
        act.description.toLowerCase().includes(q) ||
        (act.metadata?.filename && act.metadata.filename.toLowerCase().includes(q)) ||
        (act.metadata?.presetName && act.metadata.presetName.toLowerCase().includes(q)) ||
        (act.metadata?.featureName && act.metadata.featureName.toLowerCase().includes(q))
      );
    });
  }, [activities, selectedCategory, searchQuery]);

  const getCategoryConfig = (category: ActivityCategory) => {
    switch (category) {
      case "PARAMETRES":
        return {
          icon: Sliders,
          label: "Paramètres & Options",
          badgeBg: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
          iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        };
      case "EXPORT":
        return {
          icon: FileSpreadsheet,
          label: "Export de Données",
          badgeBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
          iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        };
      case "SYSTEME":
      default:
        return {
          icon: HardDrive,
          label: "Sauvegarde & Système",
          badgeBg: "bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
          iconBg: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
        };
    }
  };

  const handleClear = () => {
    clearLog();
    setIsConfirmingClear(false);
  };

  return (
    <div
      id="activity-log-widget-root"
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden ${className}`}
    >
      {/* En-tête du widget */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Historique d'Activité
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {totalCount} événement{totalCount > 1 ? "s" : ""}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Traçabilité des modifications de paramètres et des exports de données
            </p>
          </div>
        </div>

        {/* Actions d'en-tête */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={refresh}
            title="Rafraîchir l'historique"
            aria-label="Rafraîchir l'historique"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {!isConfirmingClear ? (
            <button
              onClick={() => setIsConfirmingClear(true)}
              disabled={totalCount === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Effacer</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 p-1 rounded-lg">
              <button
                onClick={handleClear}
                className="px-2 py-1 text-[11px] font-bold bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer"
              >
                Confirmer
              </button>
              <button
                onClick={() => setIsConfirmingClear(false)}
                className="px-2 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded cursor-pointer"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bannière de persistance localStorage */}
      {showAutoSaveNotice && (
        <div className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 px-5 py-2.5 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium">
              Sauvegarde automatique active :
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              Vos choix de modules et paramètres sont conservés en permanence dans votre navigateur (<code className="text-[11px] font-mono text-slate-700 dark:text-slate-300">localStorage</code>).
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Persistant au rafraîchissement</span>
          </div>
        </div>
      )}

      {/* Barre de filtres et recherche */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row gap-3">
        {/* Recherche */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrer l'historique (ex: Planning, CSV, Profil)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Filtres de catégorie */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === "ALL"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Tous ({activities.length})
          </button>
          <button
            onClick={() => setSelectedCategory("PARAMETRES")}
            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === "PARAMETRES"
                ? "bg-blue-600 text-white shadow-2xs"
                : "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Paramètres ({activities.filter((a) => a.category === "PARAMETRES").length})</span>
          </button>
          <button
            onClick={() => setSelectedCategory("EXPORT")}
            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === "EXPORT"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
            }`}
          >
            <FileSpreadsheet className="w-3 h-3" />
            <span>Exports ({activities.filter((a) => a.category === "EXPORT").length})</span>
          </button>
        </div>
      </div>

      {/* Liste des entrées d'activité */}
      <div className={`divide-y divide-slate-100 dark:divide-slate-800/80 overflow-y-auto ${compact ? "max-h-72" : "max-h-[500px]"}`}>
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <History className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Aucune activité trouvée
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? "Aucune action ne correspond à votre filtre. Essayez d'élargir votre recherche."
                : "Les prochaines modifications de vos options ou exports apparaîtront ici automatiquement."}
            </p>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const config = getCategoryConfig(activity.category);
            const Icon = config.icon;
            const formattedTime = formatRelativeTimeFr(activity.timestamp);
            const fullDate = new Date(activity.timestamp).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });

            return (
              <div
                key={activity.id}
                className="p-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex items-start gap-3.5 group"
              >
                {/* Icône de catégorie */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${config.iconBg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Contenu principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {activity.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${config.badgeBg}`}
                      >
                        {config.label}
                      </span>
                    </div>

                    {/* Date / Heure relative avec date complète au survol */}
                    <div
                      className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0"
                      title={fullDate}
                    >
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{formattedTime}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {activity.description}
                  </p>

                  {/* Badges de métadonnées spécifiques */}
                  {activity.metadata && (
                    <div className="flex flex-wrap items-center gap-2 mt-2 pt-1.5 border-t border-slate-100/60 dark:border-slate-800/50">
                      {activity.metadata.filename && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                          <ArrowDownToLine className="w-3 h-3 text-emerald-500" />
                          {activity.metadata.filename}
                        </span>
                      )}
                      {activity.metadata.itemCount !== undefined && (
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {activity.metadata.itemCount} élément{activity.metadata.itemCount > 1 ? "s" : ""}
                        </span>
                      )}
                      {activity.metadata.presetName && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded">
                          <Sparkles className="w-3 h-3 text-orange-500" />
                          Profil : {activity.metadata.presetName}
                        </span>
                      )}
                      {activity.metadata.featureName && (
                        <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                          Module : {activity.metadata.featureName}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
