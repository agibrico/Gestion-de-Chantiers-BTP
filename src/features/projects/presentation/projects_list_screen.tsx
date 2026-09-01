/**
 * AGB CHANTIER - Écran Principal de Gestion des Chantiers & Projets BTP - AXE 04
 */

import React, { useState } from "react";
import { ProjectsProvider, useProjects } from "./projects_context";
import { ProjectEntity, ProjectType, ProjectStatus } from "../domain/entities/project_entity";
import { ProjectFormModal } from "./project_form_modal";
import { ProjectDetailModal } from "./project_detail_modal";
import { AppCard } from "../../../core/widgets/cards/app_card";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppBadge, BadgeVariant } from "../../../core/widgets/badges/app_badge";
import { AppEmptyState } from "../../../core/widgets/display/app_empty_state";
import {
  HardHat,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  MapPin,
  Users,
  Search,
  Plus,
  Download,
  Filter,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  Eye,
  Sun,
  Cloud,
  Layers,
  Sparkles,
} from "lucide-react";

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

const ProjectsListContent: React.FC = () => {
  const {
    projects,
    stats,
    isLoading,
    filterQuery,
    setFilterQuery,
    createProject,
    updateProject,
    deleteProject,
    exportToCsv,
  } = useProjects();

  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<ProjectEntity | null>(null);
  const [selectedDetailProject, setSelectedDetailProject] = useState<ProjectEntity | null>(null);

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val) + " FCFA";
  };

  const handleOpenCreate = () => {
    setProjectToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (project: ProjectEntity) => {
    setProjectToEdit(project);
    setIsFormModalOpen(true);
  };

  const handleOpenDetail = (project: ProjectEntity) => {
    setSelectedDetailProject(project);
  };

  const handleFormSubmit = async (data: any) => {
    if (projectToEdit) {
      await updateProject(data);
    } else {
      await createProject(data);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Confirmez-vous l'archivage du chantier "${name}" ?`)) {
      await deleteProject(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <AppBadge variant="success" dot={true}>
              AXE 04 VALIDÉ
            </AppBadge>
            <span className="text-xs text-orange-400 font-mono font-bold">Portefeuille Opérationnel BTP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            Gestion & Pilotage des Chantiers
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Suivi en temps réel des ouvrages, avancement physique vs financier, effectifs sur site, budgets engagés et encadrement terrain.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <AppButton
            variant="primary"
            onClick={handleOpenCreate}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nouveau Chantier BTP
          </AppButton>
          <AppButton
            variant="secondary"
            onClick={exportToCsv}
            leftIcon={<Download className="w-4 h-4 text-emerald-600" />}
          >
            Exporter CSV
          </AppButton>
        </div>
      </div>

      {/* KPI Stats Row */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Chantiers Actifs"
            value={`${stats.activeProjects} / ${stats.totalProjects}`}
            subValue={`${stats.planningProjects} en étude • ${stats.completedProjects} réceptionnés`}
            icon={<HardHat className="w-6 h-6" />}
            iconColor="text-orange-600"
            badgeText="En Exécution"
            badgeVariant="success"
          />

          <StatCard
            label="Volume Total Marchés"
            value={formatFCFA(stats.totalContractedValue)}
            subValue={`Dépenses réelles : ${formatFCFA(stats.totalExpensesRealized)}`}
            icon={<DollarSign className="w-6 h-6" />}
            iconColor="text-emerald-600"
            badgeText="Portefeuille TTC"
            badgeVariant="info"
          />

          <StatCard
            label="Avancement Global"
            value={`${stats.averageProgress}%`}
            subValue="Moyenne pondérée d'avancement physique"
            icon={<TrendingUp className="w-6 h-6" />}
            iconColor="text-blue-600"
            badgeText="Rythme Conforme"
            badgeVariant="success"
          />

          <StatCard
            label="Compagnons sur Sites"
            value={`${stats.totalWorkersOnSites} Ouvriers`}
            subValue="Effectif mobilisé aujourd'hui sur le terrain"
            icon={<Users className="w-6 h-6" />}
            iconColor="text-purple-600"
            badgeText="Forces Vives BTP"
            badgeVariant="neutral"
          />
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="p-4 bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-2">
            <AppTextField
              placeholder="Rechercher par code, nom, client MOA, ville ou conducteur..."
              value={filterQuery.search || ""}
              onChange={(e) => setFilterQuery((prev) => ({ ...prev, search: e.target.value }))}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <AppSelect
            value={filterQuery.type || "ALL"}
            onChange={(e) => setFilterQuery((prev) => ({ ...prev, type: e.target.value as any }))}
            options={[
              { value: "ALL", label: "Tous les Types d'Ouvrages" },
              { value: "BATIMENT_RESIDENTIEL", label: "🏢 Résidentiel" },
              { value: "BATIMENT_TERTIAIRE", label: "🏬 Tertiaire & Bureaux" },
              { value: "TRAVAUX_PUBLICS_VRD", label: "🛣️ Travaux Publics & VRD" },
              { value: "GENIE_CIVIL_OUVRAGES", label: "🌉 Génie Civil & Ponts" },
              { value: "INDUSTRIEL_ENTREPOT", label: "🏭 Industriel & Hangars" },
            ]}
          />

          <AppSelect
            value={filterQuery.status || "ALL"}
            onChange={(e) => setFilterQuery((prev) => ({ ...prev, status: e.target.value as any }))}
            options={[
              { value: "ALL", label: "Tous les Statuts" },
              { value: "ETUDE_PREPARATION", label: "📝 En Étude" },
              { value: "EN_COURS", label: "🟢 Travaux En Cours" },
              { value: "EN_PAUSE", label: "⏸️ En Pause" },
              { value: "RECEPTIONNE", label: "🏁 Réceptionnés" },
            ]}
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-500 font-mono">
            {projects.length} chantier{projects.length > 1 ? "s" : ""} trouvé{projects.length > 1 ? "s" : ""}
          </span>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded cursor-pointer ${
                  viewMode === "grid" ? "bg-white dark:bg-slate-700 text-orange-600 shadow-xs" : "text-slate-400"
                }`}
                title="Vue en Grille"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded cursor-pointer ${
                  viewMode === "table" ? "bg-white dark:bg-slate-700 text-orange-600 shadow-xs" : "text-slate-400"
                }`}
                title="Vue en Tableau"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Projects Display */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-500 font-mono">
          Chargement des chantiers depuis IndexedDB...
        </div>
      ) : projects.length === 0 ? (
        <AppEmptyState
          icon={<HardHat className="w-8 h-8 text-orange-500" />}
          title="Aucun chantier trouvé"
          description="Aucun chantier ne correspond à vos critères de recherche ou la base est vide."
          actionLabel="Créer un Chantier"
          onAction={handleOpenCreate}
        />
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => {
            const typeInfo = TYPE_CONFIGS[project.type] || { label: project.type, variant: "neutral" as const };
            const statusInfo = STATUS_CONFIGS[project.status] || { label: project.status, variant: "neutral" as const };

            return (
              <div
                key={project.id}
                className="bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold font-mono text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded border border-orange-200 dark:border-orange-900/40">
                          {project.code}
                        </span>
                        <AppBadge variant={statusInfo.variant} size="sm">
                          {statusInfo.label}
                        </AppBadge>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{project.clientName}</span>
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">Météo</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 justify-end">
                        {project.weatherCondition === "ENSOLEILLE" ? (
                          <Sun className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <Cloud className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        {project.temperatureCelsius || 31}°C
                      </span>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-1.5 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
                        Avancement Physique
                      </span>
                      <span className="font-black font-mono text-emerald-600 dark:text-emerald-400">
                        {project.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${project.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Location & Team Snapshot */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="truncate">{project.location.city} ({project.location.district || "Centre"})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">Conducteur : {project.managementTeam.siteManagerName}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{project.startDate} &rarr; {project.estimatedEndDate}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer with Budget and Actions */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Marché TTC</span>
                    <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
                      {formatFCFA(project.totalBudgetContracted)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <AppButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetail(project)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Détails
                    </AppButton>
                    <button
                      onClick={() => handleOpenEdit(project)}
                      className="p-1.5 text-slate-400 hover:text-orange-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id, project.name)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-3.5">Code & Chantier</th>
                  <th className="p-3.5">Maître d'Ouvrage</th>
                  <th className="p-3.5">Ville & Zone</th>
                  <th className="p-3.5">Statut</th>
                  <th className="p-3.5">Avancement</th>
                  <th className="p-3.5">Marché (FCFA)</th>
                  <th className="p-3.5">Conducteur</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {projects.map((project) => {
                  const statusInfo = STATUS_CONFIGS[project.status] || { label: project.status, variant: "neutral" as const };

                  return (
                    <tr key={project.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{project.name}</div>
                        <span className="font-mono text-[10px] text-orange-600 dark:text-orange-400">{project.code}</span>
                      </td>

                      <td className="p-3.5">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{project.clientName}</div>
                      </td>

                      <td className="p-3.5">
                        <div>{project.location.city}</div>
                        <span className="text-[10px] text-slate-400">{project.location.district || "Principal"}</span>
                      </td>

                      <td className="p-3.5">
                        <AppBadge variant={statusInfo.variant} size="sm">
                          {statusInfo.label}
                        </AppBadge>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {project.progressPercentage}%
                          </span>
                          <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${project.progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                        {formatFCFA(project.totalBudgetContracted)}
                      </td>

                      <td className="p-3.5">
                        <div>{project.managementTeam.siteManagerName}</div>
                        <span className="text-[10px] text-slate-400">{project.metrics.workersOnSiteToday} ouvriers</span>
                      </td>

                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => handleOpenDetail(project)}
                          className="p-1.5 text-slate-500 hover:text-orange-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-1.5 text-slate-500 hover:text-orange-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, project.name)}
                          className="p-1.5 text-slate-500 hover:text-red-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <ProjectFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        projectToEdit={projectToEdit}
      />

      {/* Detail Modal */}
      <ProjectDetailModal
        project={selectedDetailProject}
        isOpen={!!selectedDetailProject}
        onClose={() => setSelectedDetailProject(null)}
        onEdit={(p) => {
          setSelectedDetailProject(null);
          handleOpenEdit(p);
        }}
      />
    </div>
  );
};

export const ProjectsListScreen: React.FC = () => {
  return (
    <ProjectsProvider>
      <ProjectsListContent />
    </ProjectsProvider>
  );
};
