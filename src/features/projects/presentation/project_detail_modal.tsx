/**
 * AGB CHANTIER - Modal de Détail Approfondi de Chantier BTP - AXE 04
 */

import React, { useState } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppBadge, BadgeVariant } from "../../../core/widgets/badges/app_badge";
import {
  ProjectEntity,
  ProjectPhase,
  ProjectMilestone,
} from "../domain/entities/project_entity";
import { useProjects } from "./projects_context";
import {
  HardHat,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  MapPin,
  Users,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Clock,
  Layers,
  Sparkles,
  Phone,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Sun,
  CloudRain,
  Cloud,
} from "lucide-react";

interface ProjectDetailModalProps {
  project: ProjectEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (project: ProjectEntity) => void;
}

const TYPE_CONFIGS: Record<string, { label: string; variant: BadgeVariant }> = {
  BATIMENT_RESIDENTIEL: { label: "🏢 Bâtiment Résidentiel", variant: "inProgress" },
  BATIMENT_TERTIAIRE: { label: "🏬 Bâtiment Tertiaire", variant: "inProgress" },
  TRAVAUX_PUBLICS_VRD: { label: "🛣️ Travaux Publics & VRD", variant: "warning" },
  GENIE_CIVIL_OUVRAGES: { label: "🌉 Génie Civil & Ouvrages", variant: "info" },
  INDUSTRIEL_ENTREPOT: { label: "🏭 Industriel & Entrepôts", variant: "neutral" },
  RENOVATION_REHABILITATION: { label: "🔨 Rénovation & Réhab", variant: "warning" },
  AMENAGEMENT_INTERIEUR: { label: "✨ Aménagement Intérieur", variant: "neutral" },
};

const STATUS_CONFIGS: Record<string, { label: string; variant: BadgeVariant }> = {
  ETUDE_PREPARATION: { label: "Études & Préparation", variant: "warning" },
  EN_COURS: { label: "Travaux En Cours", variant: "success" },
  EN_PAUSE: { label: "Travaux Suspendus", variant: "neutral" },
  RECEPTIONNE: { label: "Réceptionné (OPR)", variant: "success" },
  CLOTURE: { label: "Clôturé (DGD)", variant: "neutral" },
};

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onEdit,
}) => {
  const { updateProgress, addPhase, deletePhase, addMilestone, deleteMilestone } = useProjects();
  const [activeTab, setActiveTab] = useState<"overview" | "phases" | "financials" | "team" | "technical">("overview");

  // New Phase State
  const [showAddPhase, setShowAddPhase] = useState(false);
  const [phaseName, setPhaseName] = useState("");
  const [phaseBudget, setPhaseBudget] = useState<number | "">("");

  // New Milestone State
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDate, setMilestoneDate] = useState("");

  if (!project) return null;

  const typeConfig = TYPE_CONFIGS[project.type] || { label: project.type, variant: "neutral" as const };
  const statusConfig = STATUS_CONFIGS[project.status] || { label: project.status, variant: "neutral" as const };

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val) + " FCFA";
  };

  const marginEstimated = Math.max(0, (project.totalBudgetContracted || 0) - (project.totalExpensesRealized || 0));
  const marginPercent =
    project.totalBudgetContracted > 0
      ? Math.round((marginEstimated / project.totalBudgetContracted) * 100)
      : 0;

  const handleQuickProgressUpdate = (newVal: number) => {
    updateProgress(project.id, newVal);
  };

  const handleCreatePhase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phaseName.trim()) return;
    await addPhase(project.id, {
      name: phaseName.trim(),
      order: (project.phases?.length || 0) + 1,
      startDate: project.startDate,
      endDate: project.estimatedEndDate,
      progressPercentage: 0,
      status: "NON_DEBUTEE",
      budgetAllocated: Number(phaseBudget) || 0,
      budgetSpent: 0,
    });
    setPhaseName("");
    setPhaseBudget("");
    setShowAddPhase(false);
  };

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle.trim() || !milestoneDate) return;
    await addMilestone(project.id, {
      title: milestoneTitle.trim(),
      targetDate: milestoneDate,
      status: "EN_ATTENTE",
      isCritical: true,
    });
    setMilestoneTitle("");
    setMilestoneDate("");
    setShowAddMilestone(false);
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Fiche Chantier : ${project.code} — ${project.name}`}
      size="2xl"
    >
      <div className="space-y-6">
        {/* Header Summary Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-500/30">
                  {project.code}
                </span>
                <AppBadge variant={typeConfig.variant} size="sm">
                  {typeConfig.label}
                </AppBadge>
                <AppBadge variant={statusConfig.variant} size="sm">
                  {statusConfig.label}
                </AppBadge>
              </div>
              <h2 className="text-xl font-black tracking-tight uppercase mt-1 text-white">
                {project.name}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <span>🏛️ {project.clientName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  {project.location.city} {project.location.district ? `(${project.location.district})` : ""}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <AppButton
                variant="secondary"
                size="sm"
                leftIcon={<Edit2 className="w-4 h-4 text-orange-600" />}
                onClick={() => {
                  onEdit(project);
                }}
              >
                Modifier le Chantier
              </AppButton>
            </div>
          </div>

          {/* Quick Stats Bar in Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Avancement Physique</span>
              <span className="text-lg font-black font-mono text-emerald-400">{project.progressPercentage}%</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Marché Contracté</span>
              <span className="text-sm font-bold font-mono text-white">{formatFCFA(project.totalBudgetContracted)}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Effectif Aujourd'hui</span>
              <span className="text-sm font-bold font-mono text-orange-300">
                👷 {project.metrics?.workersOnSiteToday || 0} compagnons
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Météo Chantier</span>
              <span className="text-sm font-bold text-slate-200 flex items-center gap-1">
                {project.weatherCondition === "ENSOLEILLE" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Cloud className="w-4 h-4 text-slate-300" />
                )}
                {project.temperatureCelsius || 31}°C • {project.weatherCondition || "Ensoleillé"}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 pb-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "overview"
                ? "bg-orange-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            1. Avancement & Métriques
          </button>

          <button
            onClick={() => setActiveTab("phases")}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "phases"
                ? "bg-orange-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            2. Phases & Jalons ({project.phases?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("financials")}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "financials"
                ? "bg-orange-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            3. Finances & Marge
          </button>

          <button
            onClick={() => setActiveTab("team")}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "team"
                ? "bg-orange-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            4. Encadrement & Équipe
          </button>

          <button
            onClick={() => setActiveTab("technical")}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "technical"
                ? "bg-orange-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            5. Données Techniques & MOA
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Interactive Progress Slider */}
            <div className="p-4 bg-white dark:bg-[#131D31] rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Ajustement de l'Avancement Physique Global
                  </h4>
                  <p className="text-[11px] text-slate-500">Mise à jour rapide basée sur les constats de chantier</p>
                </div>
                <span className="text-2xl font-black font-mono text-orange-600 dark:text-orange-400">
                  {project.progressPercentage}%
                </span>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={project.progressPercentage}
                  onChange={(e) => handleQuickProgressUpdate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>0% (Ordre de Service)</span>
                  <span>25% (Fondations)</span>
                  <span>50% (Gros Œuvre)</span>
                  <span>75% (Second Œuvre)</span>
                  <span>100% (Réception OPR)</span>
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Heures Travaillées</span>
                <span className="text-base font-black font-mono text-slate-900 dark:text-white mt-1 block">
                  {project.metrics?.totalHoursWorked || 0} h
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Journal de Chantier</span>
                <span className="text-base font-black font-mono text-slate-900 dark:text-white mt-1 block">
                  📖 {project.metrics?.siteDiaryEntriesCount || 0} entrées
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Photos & Suivi</span>
                <span className="text-base font-black font-mono text-slate-900 dark:text-white mt-1 block">
                  📸 {project.metrics?.photosCount || 0} photos
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Sécurité & HSE</span>
                <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
                  🛡️ 0 Accident (100% Sûr)
                </span>
              </div>
            </div>

            {/* Dates & Timeline */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                Calendrier d'Exécution BTP
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Démarrage Travaux :</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{project.startDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Date Fin Contractuelle :</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{project.estimatedEndDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Délai Restant Estimé :</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400 font-mono">En cours selon planning</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Phases & Milestones */}
        {activeTab === "phases" && (
          <div className="space-y-6">
            {/* Phases List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-600" />
                  Découpage en Phases d'Exécution
                </h4>
                <AppButton
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setShowAddPhase(!showAddPhase)}
                >
                  Ajouter une Phase
                </AppButton>
              </div>

              {showAddPhase && (
                <form onSubmit={handleCreatePhase} className="p-3 bg-orange-50/50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-900/40 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nom de la Phase (Ex: Lots Techniques)"
                      value={phaseName}
                      onChange={(e) => setPhaseName(e.target.value)}
                      required
                      className="text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder="Budget Alloué en FCFA"
                      value={phaseBudget}
                      onChange={(e) => setPhaseBudget(e.target.value === "" ? "" : Number(e.target.value))}
                      className="text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <AppButton type="button" variant="ghost" size="sm" onClick={() => setShowAddPhase(false)}>
                      Annuler
                    </AppButton>
                    <AppButton type="submit" variant="primary" size="sm">
                      Enregistrer la Phase
                    </AppButton>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {project.phases?.map((phase, idx) => (
                  <div
                    key={phase.id}
                    className="p-3.5 bg-white dark:bg-[#131D31] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {phase.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {phase.progressPercentage}%
                        </span>
                        <button
                          onClick={() => deletePhase(project.id, phase.id)}
                          className="text-slate-400 hover:text-red-500 p-1"
                          title="Supprimer la phase"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Phase Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${phase.progressPercentage}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Budget : {formatFCFA(phase.budgetAllocated)}</span>
                      <span>Dépensé : {formatFCFA(phase.budgetSpent)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones List */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                  Jalons Clés & Points d'Arrêt BTP
                </h4>
                <AppButton
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setShowAddMilestone(!showAddMilestone)}
                >
                  Ajouter un Jalon
                </AppButton>
              </div>

              {showAddMilestone && (
                <form onSubmit={handleCreateMilestone} className="p-3 bg-orange-50/50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-900/40 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Intitulé du Jalon (Ex: Hors d'Eau / Hors d'Air)"
                      value={milestoneTitle}
                      onChange={(e) => setMilestoneTitle(e.target.value)}
                      required
                      className="text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                    <input
                      type="date"
                      value={milestoneDate}
                      onChange={(e) => setMilestoneDate(e.target.value)}
                      required
                      className="text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <AppButton type="button" variant="ghost" size="sm" onClick={() => setShowAddMilestone(false)}>
                      Annuler
                    </AppButton>
                    <AppButton type="submit" variant="primary" size="sm">
                      Enregistrer le Jalon
                    </AppButton>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.milestones?.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {m.status === "VALIDE" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-orange-500" />
                        )}
                        {m.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Date cible : {m.targetDate} {m.completedDate ? `(Validé le ${m.completedDate})` : ""}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteMilestone(project.id, m.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Financials */}
        {activeTab === "financials" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-[#131D31] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Marché Initial TTC</span>
                <span className="text-lg font-black font-mono text-slate-900 dark:text-white mt-1 block">
                  {formatFCFA(project.totalBudgetContracted)}
                </span>
                <span className="text-[10px] text-slate-500">Retenue de garantie : {project.retentionGuaranteeRate}%</span>
              </div>

              <div className="p-4 bg-white dark:bg-[#131D31] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Dépenses Réelles Engagées</span>
                <span className="text-lg font-black font-mono text-orange-600 dark:text-orange-400 mt-1 block">
                  {formatFCFA(project.totalExpensesRealized)}
                </span>
                <span className="text-[10px] text-slate-500">Matériaux, MO & Sous-traitance</span>
              </div>

              <div className="p-4 bg-white dark:bg-[#131D31] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Marge Prévisionnelle</span>
                <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {formatFCFA(marginEstimated)} ({marginPercent}%)
                </span>
                <span className="text-[10px] text-emerald-600">Rentabilité BTP saine</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-orange-600" />
                Suivi de la Facturation & Encaissements Clients
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Facturé à Date (Situations Mensuelles)</span>
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                    {formatFCFA(project.totalBilledAmount)}
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Encaissé sur Compte Société</span>
                  <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {formatFCFA(project.totalPaidAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Team */}
        {activeTab === "team" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-[#131D31] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Directeur de Travaux</span>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                  {project.managementTeam.projectManagerName || "Non assigné"}
                </h5>
                <span className="text-[11px] text-slate-500">Supervision stratégique & validation décomptes</span>
              </div>

              <div className="p-4 bg-white dark:bg-[#131D31] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Conducteur de Travaux Principal</span>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                  {project.managementTeam.siteManagerName}
                </h5>
                <span className="text-[11px] text-slate-500">Pilotage quotidien, commandes & réunions MOA</span>
              </div>

              <div className="p-4 bg-white dark:bg-[#131D31] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Chef de Chantier Principal</span>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                  {project.managementTeam.foremanName}
                </h5>
                <span className="text-[11px] text-slate-500">Organisation sur le terrain & affectation des équipes</span>
              </div>

              <div className="p-4 bg-white dark:bg-[#131D31] rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Responsable Hygiène & Sécurité (HSE)</span>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                  {project.managementTeam.safetyOfficerName || "Mme Yao Affoué Sylvie"}
                </h5>
                <span className="text-[11px] text-slate-500">Contrôle EPI, causeries 1/4h sécurité & conformité</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Technical */}
        {activeTab === "technical" && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Caractéristiques de l'Ouvrage
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">Surface Plancher (Shon) :</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{project.surfaceAreaM2 || 0} m²</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Niveaux / Hauteur :</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{project.numberOfFloors || "RDC"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Permis de Construire :</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{project.buildingPermitNumber || "PC Enregistré"}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Localisation & Voie d'Accès
              </h4>
              <p className="text-slate-700 dark:text-slate-300">
                <strong>Adresse :</strong> {project.location.address}, {project.location.district ? `${project.location.district}, ` : ""}{project.location.city} ({project.location.country})
              </p>
              {project.location.accessNotes && (
                <p className="text-slate-500 dark:text-slate-400">
                  <strong>Consignes d'accès :</strong> {project.location.accessNotes}
                </p>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Maîtrise d'Ouvrage (Client)
              </h4>
              <p className="text-slate-700 dark:text-slate-300 font-bold">{project.clientName}</p>
              {project.clientContactPerson && (
                <p className="text-slate-500">Contact : {project.clientContactPerson} ({project.clientPhone})</p>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton variant="secondary" onClick={onClose}>
            Fermer la Fiche Chantier
          </AppButton>
        </div>
      </div>
    </AppModal>
  );
};
