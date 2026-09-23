/**
 * AGB CHANTIER - Composant Barre de Recherche Rapide du Dashboard
 * Permet de filtrer instantanément les indicateurs clés (KPIs)
 * par nom ou par numéro (code) de chantier spécifique.
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  X,
  Building2,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { ProjectEntity } from "../features/projects/domain/entities/project_entity";

export interface DashboardQuickSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  projects: ProjectEntity[];
  matchedProjectsCount: number;
  totalProjectsCount: number;
  onSelectProject: (project: ProjectEntity) => void;
  onResetSearch: () => void;
  isCompact?: boolean;
}

export const DashboardQuickSearchBar: React.FC<DashboardQuickSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  projects,
  matchedProjectsCount,
  totalProjectsCount,
  onSelectProject,
  onResetSearch,
  isCompact = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fermer la liste de suggestions au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Détection si un chantier a du retard
  const isDelayed = (p: ProjectEntity): boolean => {
    if (p.milestones?.some((m) => m.status === "EN_RETARD")) return true;
    if (p.phases?.some((ph) => ph.status === "RETARDEE")) return true;
    if (p.status === "EN_COURS" && p.estimatedEndDate) {
      const today = new Date().toISOString().split("T")[0];
      if (p.estimatedEndDate < today && p.progressPercentage < 100) return true;
    }
    return false;
  };

  const isFiltered = searchQuery.trim().length > 0;

  // Trouver si le filtre correspond exactement à 1 chantier
  const singleMatch =
    isFiltered && matchedProjectsCount === 1
      ? projects.find((p) => {
          const q = searchQuery.toLowerCase().trim();
          return p.code.toLowerCase() === q || p.name.toLowerCase() === q || p.code.toLowerCase().includes(q);
        })
      : null;

  // Filtrer les suggestions pour l'autocomplétion
  const suggestions = searchQuery.trim()
    ? projects.filter((p) => {
        const q = searchQuery.toLowerCase().trim();
        return (
          p.code.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.location?.city.toLowerCase().includes(q) ||
          p.clientName?.toLowerCase().includes(q)
        );
      })
    : projects;

  return (
    <div
      ref={containerRef}
      id="dashboard-quick-search-section"
      className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all shadow-xs ${
        isFiltered
          ? "border-orange-300 dark:border-orange-700/80 ring-2 ring-orange-500/10"
          : "border-slate-200 dark:border-slate-800"
      } ${isCompact ? "p-3 sm:p-4" : "p-4 sm:p-5"}`}
    >
      {/* Ligne de Titre & Contexte */}
      {!isCompact && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Filtrage Rapide des Indicateurs
                {isFiltered && (
                  <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-500 text-white">
                    Filtre actif
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Filtrez les métriques (Projets Actifs, Retards, Budget) par numéro de chantier (ex: CH-2026-001) ou nom.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs">
            {isFiltered ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2.5 py-1 rounded-lg border border-orange-200 dark:border-orange-800/60">
                  {matchedProjectsCount} / {totalProjectsCount} chantier(s) ciblé(s)
                </span>
                <button
                  id="btn-reset-indicator-search"
                  onClick={onResetSearch}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  title="Réinitialiser le filtre"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Tout afficher</span>
                </button>
              </div>
            ) : (
              <span className="text-slate-400 text-xs">
                {totalProjectsCount} chantiers consolidés
              </span>
            )}
          </div>
        </div>
      )}

      {/* Champ de Saisie de Recherche Rapide */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-orange-600 dark:text-orange-400 absolute left-3.5 pointer-events-none" />
          <input
            id="dashboard-indicator-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Rechercher par numéro de chantier (ex: CH-2026-001, CH-2025-008) ou par nom (ex: Tour Horizon, Échangeur)..."
            className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all font-medium"
            autoComplete="off"
          />
          {searchQuery ? (
            <button
              id="btn-clear-indicator-search"
              onClick={onResetSearch}
              className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
              title="Effacer la recherche"
              aria-label="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="absolute right-3 text-[11px] font-mono font-semibold text-slate-400 hidden sm:block pointer-events-none">
              N° ou Nom
            </div>
          )}
        </div>

        {/* Menu déroulant de suggestions rapides au focus / saisie */}
        {isDropdownOpen && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl z-30 max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            <div className="p-2 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Sélectionner un chantier pour filtrer les indicateurs :</span>
              <span className="font-mono">{suggestions.length} résultat(s)</span>
            </div>
            {suggestions.map((project) => {
              const delayed = isDelayed(project);
              return (
                <button
                  key={project.id}
                  onClick={() => {
                    onSelectProject(project);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-orange-50/70 dark:hover:bg-orange-950/30 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 group-hover:border-orange-300 group-hover:text-orange-600 shrink-0">
                      {project.code}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {project.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {project.location.city} • Client : {project.clientName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {delayed ? (
                      <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-900/60 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Retard
                      </span>
                    ) : project.status === "EN_COURS" ? (
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200/60">
                        En cours
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {project.status === "ETUDE_PREPARATION" ? "Études" : "Réceptionné"}
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                      {project.progressPercentage}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Badges d'accès rapide par Numéro de Chantier (Pills interactifs) */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-orange-500" />
          Chantiers :
        </span>

        {/* Bouton "Tous" */}
        <button
          onClick={onResetSearch}
          className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
            !isFiltered
              ? "bg-orange-600 text-white shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          Tous ({totalProjectsCount})
        </button>

        {/* Pills par numéro de chantier */}
        {projects.map((p) => {
          const isSelected =
            searchQuery.trim().toLowerCase() === p.code.toLowerCase() ||
            searchQuery.trim().toLowerCase() === p.name.toLowerCase();
          const delayed = isDelayed(p);

          return (
            <button
              key={p.id}
              onClick={() => {
                if (isSelected) {
                  onResetSearch();
                } else {
                  onSelectProject(p);
                }
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer border ${
                isSelected
                  ? "bg-orange-600 border-orange-600 text-white shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400"
              }`}
              title={`${p.code} - ${p.name}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${delayed ? "bg-red-500" : "bg-emerald-500"}`}></span>
              <span className="font-mono font-black">{p.code}</span>
              <span className="hidden md:inline max-w-[120px] truncate opacity-90 font-normal">
                • {p.name.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bandeau d'information quand 1 chantier spécifique est ciblé */}
      {singleMatch && (
        <div className="mt-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-orange-600 text-white">
              {singleMatch.code}
            </span>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                Indicateurs personnalisés pour : {singleMatch.name}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Ville : {singleMatch.location.city} • Conducteur : {singleMatch.managementTeam.siteManagerName || "Non assigné"} • Avancement : {singleMatch.progressPercentage}%
              </p>
            </div>
          </div>

          <button
            onClick={onResetSearch}
            className="text-xs font-bold text-orange-700 dark:text-orange-400 hover:underline shrink-0 flex items-center gap-1 cursor-pointer self-start sm:self-center"
          >
            <RotateCcw className="w-3 h-3" />
            Réinitialiser pour tous les chantiers
          </button>
        </div>
      )}

      {/* Alerte si aucun chantier ne correspond à la recherche */}
      {isFiltered && matchedProjectsCount === 0 && (
        <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Aucun chantier ne correspond au numéro ou nom "<strong>{searchQuery}</strong>". Les indicateurs sont à zéro.
            </span>
          </div>
          <button
            onClick={onResetSearch}
            className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 cursor-pointer shrink-0"
          >
            Effacer
          </button>
        </div>
      )}
    </div>
  );
};
