/**
 * AGB CHANTIER - Modal d'Exportation CSV Avancée pour le Reporting BTP
 * Permet aux directeurs de travaux et conducteurs de personnaliser le périmètre
 * et les sections du fichier CSV avant téléchargement.
 */

import React, { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  X,
  CheckCircle2,
  Calendar,
  Layers,
  Coins,
  AlertTriangle,
  Clock,
  HardHat,
  SlidersHorizontal,
} from "lucide-react";
import { ProjectEntity } from "../../projects/domain/entities/project_entity";
import { DashboardMilestoneAlertsSummary } from "../../planning/domain/milestone_alert_helper";
import { downloadBtpDashboardCsv } from "../domain/btp_dashboard_csv_service";
import { useToast } from "../../../core/widgets/feedback/app_toast";
import { logActivity } from "../../../core/activity/activity_log_service";

interface BtpCsvExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectEntity[];
  filteredProjects: ProjectEntity[];
  milestoneAlertsSummary?: DashboardMilestoneAlertsSummary;
  currentFilterName: string;
}

export const BtpCsvExportModal: React.FC<BtpCsvExportModalProps> = ({
  isOpen,
  onClose,
  projects,
  filteredProjects,
  milestoneAlertsSummary,
  currentFilterName,
}) => {
  const { showToast } = useToast();
  const [scope, setScope] = useState<"filtered" | "all" | "delayed">("filtered");
  const [includeKpiSummary, setIncludeKpiSummary] = useState(true);
  const [includeMilestonesDetail, setIncludeMilestonesDetail] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  // Calcul du sous-ensemble sélectionné
  const targetProjects =
    scope === "all"
      ? projects
      : scope === "delayed"
      ? projects.filter(
          (p) =>
            p.status === "EN_COURS" &&
            new Date(p.estimatedEndDate).getTime() < Date.now()
        )
      : filteredProjects;

  const totalBudget = targetProjects.reduce(
    (sum, p) => sum + (p.totalBudgetContracted || 0),
    0
  );
  const totalExpenses = targetProjects.reduce(
    (sum, p) => sum + (p.totalExpensesRealized || 0),
    0
  );

  const handleExport = () => {
    setIsExporting(true);
    try {
      const filterLabel =
        scope === "all"
          ? "Ensemble du portefeuille"
          : scope === "delayed"
          ? "Chantiers en retard uniquement"
          : `Filtre actif (${currentFilterName})`;

      const filename = downloadBtpDashboardCsv(targetProjects, milestoneAlertsSummary, {
        filterName: filterLabel,
        includeKpiSummary,
        includeMilestonesDetail,
      });

      showToast(
        "success",
        "Rapport BTP exporté avec succès",
        `${filename} (${targetProjects.length} chantiers)`
      );

      logActivity({
        category: "EXPORT",
        title: "Export CSV BTP personnalisé",
        description: `Téléchargement du rapport « ${filterLabel} » (${targetProjects.length} chantiers, budget total: ${totalBudget.toLocaleString("fr-FR")} FCFA).`,
        metadata: {
          filename,
          itemCount: targetProjects.length,
          scope,
          includeKpiSummary,
          includeMilestonesDetail,
          exportFormat: "CSV",
        },
      });

      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 400);
    } catch (e) {
      console.error("[BtpCsvExportModal] Error exporting CSV:", e);
      showToast("error", "Erreur lors de la génération du fichier CSV");
      setIsExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scaleUp flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Export Reporting BTP (Format CSV)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Génération de synthèse structurée compatible Microsoft Excel et logiciels d'analyse BTP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* 1. Sélection du Périmètre */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-orange-500" />
              <span>1. Périmètre des chantiers à exporter</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setScope("filtered")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  scope === "filtered"
                    ? "bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-900 dark:text-orange-200 shadow-2xs"
                    : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">Vue Filtrée</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-200 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300 font-extrabold">
                    {filteredProjects.length}
                  </span>
                </div>
                <p className="text-[11px] opacity-80 line-clamp-1">
                  Filtre actuel ({currentFilterName})
                </p>
              </button>

              <button
                type="button"
                onClick={() => setScope("all")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  scope === "all"
                    ? "bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-900 dark:text-orange-200 shadow-2xs"
                    : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">Tout le Portefeuille</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-300 font-extrabold">
                    {projects.length}
                  </span>
                </div>
                <p className="text-[11px] opacity-80 line-clamp-1">
                  Tous les chantiers enregistrés
                </p>
              </button>

              <button
                type="button"
                onClick={() => setScope("delayed")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  scope === "delayed"
                    ? "bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-200 shadow-2xs"
                    : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">Chantiers en Retard</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-200 dark:bg-red-900/60 text-red-800 dark:text-red-300 font-extrabold">
                    {
                      projects.filter(
                        (p) =>
                          p.status === "EN_COURS" &&
                          new Date(p.estimatedEndDate).getTime() < Date.now()
                      ).length
                    }
                  </span>
                </div>
                <p className="text-[11px] opacity-80 line-clamp-1">
                  Focus sur les anomalies planning
                </p>
              </button>
            </div>
          </div>

          {/* 2. Options de Sections à Inclure */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-orange-500" />
              <span>2. Sections incluses dans le fichier CSV</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/60 transition-colors">
                <input
                  type="checkbox"
                  checked={includeKpiSummary}
                  onChange={(e) => setIncludeKpiSummary(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Synthèse Exécutive des Indicateurs Clés (KPIs Globaux)
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Inclut les totaux de trésorerie, consommation budgétaire, taux d'avancement moyen et effectifs mobilisés.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/60 transition-colors">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="mt-0.5 w-4 h-4 text-orange-600 rounded border-slate-300 opacity-80"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Registre Détaillé des Chantiers (24 colonnes BTP)</span>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded font-mono text-slate-700 dark:text-slate-300">
                      Requis
                    </span>
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Codes, dates de livraison, avancement %, budgets, dépenses réelles, clients, conducteurs de travaux et ville.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/60 transition-colors">
                <input
                  type="checkbox"
                  checked={includeMilestonesDetail}
                  onChange={(e) => setIncludeMilestonesDetail(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Audit des Jalons Critiques & Dates Charnières en Retard
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Tableau spécifique identifiant les phases, intitulés de jalons, retards en jours et impact sur le chemin critique.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* 3. Aperçu synthétique des données sélectionnées */}
          <div className="p-3.5 bg-slate-100 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Aperçu du volume exporté :
              </span>
              <span className="font-mono font-bold text-orange-600 dark:text-orange-400">
                {targetProjects.length} chantiers sélectionnés
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
              <div>
                • Budget cumulé :{" "}
                <strong className="text-slate-900 dark:text-white">
                  {totalBudget.toLocaleString("fr-FR")} FCFA
                </strong>
              </div>
              <div>
                • Dépenses réalisées :{" "}
                <strong className="text-slate-900 dark:text-white">
                  {totalExpenses.toLocaleString("fr-FR")} FCFA
                </strong>
              </div>
              <div>
                • Format d'encodage :{" "}
                <strong className="text-slate-900 dark:text-white">
                  UTF-8 avec BOM (Excel)
                </strong>
              </div>
              <div>
                • Séparateur de colonnes :{" "}
                <strong className="text-slate-900 dark:text-white">Point-virgule (;)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting || targetProjects.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>
              {isExporting ? "Génération en cours..." : "Télécharger le Fichier CSV"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
