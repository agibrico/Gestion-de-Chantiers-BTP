/**
 * AGB CHANTIER - Écran Principal Intervenants, Équipes & Compagnons BTP - AXE 05
 */

import React, { useState } from "react";
import { TeamsProvider, useTeams } from "./teams_context";
import { StakeholderEntity, StakeholderCategory } from "../domain/entities/stakeholder_entity";
import { TeamEntity } from "../domain/entities/team_entity";
import { WorkerEntity, WorkerTrade, WorkerStatus } from "../domain/entities/worker_entity";
import { StakeholderFormModal } from "./stakeholder_form_modal";
import { TeamFormModal } from "./team_form_modal";
import { WorkerFormModal } from "./worker_form_modal";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppBadge, BadgeVariant } from "../../../core/widgets/badges/app_badge";
import { AppEmptyState } from "../../../core/widgets/display/app_empty_state";
import {
  Users,
  HardHat,
  Building,
  ShieldCheck,
  Search,
  Plus,
  Download,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  Award,
  Layers,
  Sparkles,
} from "lucide-react";

const STAKEHOLDER_CATEGORIES_CONFIG: Record<string, { label: string; variant: BadgeVariant }> = {
  BUREAU_CONTROLE: { label: "🔍 Bureau de Contrôle", variant: "info" },
  BUREAU_ETUDES_TECHNIQUES: { label: "📐 BET Structure/Fluides", variant: "info" },
  SOUS_TRAITANT_SPECIALISE: { label: "⚡ Sous-Traitant", variant: "warning" },
  LABORATOIRE_SOLS_BETON: { label: "🧪 Laboratoire Béton/Sol", variant: "neutral" },
  COORDONNATEUR_SPS: { label: "🦺 Coordonnateur SPS", variant: "success" },
  MAITRISE_OEUVRE_ARCHI: { label: "🏛️ Architecte / MOE", variant: "inProgress" },
  GEOMETRE_EXPERT: { label: "📍 Géomètre", variant: "neutral" },
};

const WORKER_STATUS_CONFIG: Record<string, { label: string; variant: BadgeVariant }> = {
  SUR_CHANTIER: { label: "🟢 Sur Chantier", variant: "success" },
  DISPONIBLE: { label: "🔵 Disponible", variant: "inProgress" },
  EN_CONGE: { label: "🟡 En Congé", variant: "warning" },
  ARRET_MALADIE: { label: "🔴 Arrêt Maladie", variant: "neutral" },
};

const TeamsManagementContent: React.FC = () => {
  const {
    stakeholders,
    teams,
    workers,
    stats,
    isLoading,
    activeTab,
    setActiveTab,
    stakeholderQuery,
    setStakeholderQuery,
    workerQuery,
    setWorkerQuery,
    createStakeholder,
    updateStakeholder,
    deleteStakeholder,
    createTeam,
    updateTeam,
    deleteTeam,
    createWorker,
    updateWorker,
    deleteWorker,
    updateWorkerStatus,
    exportWorkersCsv,
    exportStakeholdersCsv,
  } = useTeams();

  // Modals
  const [isStkModalOpen, setIsStkModalOpen] = useState(false);
  const [stkToEdit, setStkToEdit] = useState<StakeholderEntity | null>(null);

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState<TeamEntity | null>(null);

  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [workerToEdit, setWorkerToEdit] = useState<WorkerEntity | null>(null);

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val) + " FCFA";
  };

  const handleDeleteStk = async (id: string, name: string) => {
    if (window.confirm(`Confirmez-vous la suppression de l'intervenant "${name}" ?`)) {
      await deleteStakeholder(id);
    }
  };

  const handleDeleteTeam = async (id: string, name: string) => {
    if (window.confirm(`Confirmez-vous la suppression de l'équipe "${name}" ?`)) {
      await deleteTeam(id);
    }
  };

  const handleDeleteWorker = async (id: string, name: string) => {
    if (window.confirm(`Confirmez-vous le retrait du compagnon "${name}" ?`)) {
      await deleteWorker(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <AppBadge variant="success" dot={true}>
              AXE 05 OPÉRATIONNEL
            </AppBadge>
            <span className="text-xs text-orange-400 font-mono font-bold">Ressources Humaines & Partenaires BTP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            Intervenants, Équipes & Compagnons
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Gestion intégrée des bureaux d'études, organismes de contrôle, sous-traitants, équipes de chantier et suivi des habilitations des ouvriers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {activeTab === "stakeholders" && (
            <>
              <AppButton
                variant="primary"
                onClick={() => {
                  setStkToEdit(null);
                  setIsStkModalOpen(true);
                }}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Nouvel Intervenant
              </AppButton>
              <AppButton
                variant="secondary"
                onClick={exportStakeholdersCsv}
                leftIcon={<Download className="w-4 h-4 text-emerald-600" />}
              >
                Export CSV
              </AppButton>
            </>
          )}

          {activeTab === "teams" && (
            <AppButton
              variant="primary"
              onClick={() => {
                setTeamToEdit(null);
                setIsTeamModalOpen(true);
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Créer une Équipe
            </AppButton>
          )}

          {activeTab === "workers" && (
            <>
              <AppButton
                variant="primary"
                onClick={() => {
                  setWorkerToEdit(null);
                  setIsWorkerModalOpen(true);
                }}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Nouveau Compagnon
              </AppButton>
              <AppButton
                variant="secondary"
                onClick={exportWorkersCsv}
                leftIcon={<Download className="w-4 h-4 text-emerald-600" />}
              >
                Export Ouvriers
              </AppButton>
            </>
          )}
        </div>
      </div>

      {/* KPI Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Effectif Ouvrier Total"
            value={`${stats.totalWorkers} Compagnons`}
            subValue={`${stats.workersOnSiteToday} présents sur chantiers`}
            icon={<HardHat className="w-6 h-6" />}
            iconColor="text-orange-600"
            badgeText="Forces BTP"
            badgeVariant="success"
          />

          <StatCard
            label="Équipes Structurées"
            value={`${stats.totalTeams} Équipes`}
            subValue="Gros œuvre, Ferraillage, Élec, Finitions"
            icon={<Users className="w-6 h-6" />}
            iconColor="text-blue-600"
            badgeText="Opérationnelles"
            badgeVariant="info"
          />

          <StatCard
            label="Partenaires & Sous-Traitants"
            value={`${stats.totalStakeholders} Organismes`}
            subValue={`${stats.totalControlOffices} Bureaux Contrôle/BET • ${stats.totalSubcontractors} Sous-traitants`}
            icon={<Building className="w-6 h-6" />}
            iconColor="text-purple-600"
            badgeText="Agréés"
            badgeVariant="neutral"
          />

          <StatCard
            label="Conformité & Habilitations"
            value={`${stats.expiringCertificationsCount} Alertes`}
            subValue="CACES / Habilitations à renouveler sous 60j"
            icon={<ShieldCheck className="w-6 h-6" />}
            iconColor="text-emerald-600"
            badgeText={stats.expiringCertificationsCount > 0 ? "Vigilance HSE" : "Conforme"}
            badgeVariant={stats.expiringCertificationsCount > 0 ? "warning" : "success"}
          />
        </div>
      )}

      {/* Master Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 pb-2 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("stakeholders")}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "stakeholders"
              ? "bg-orange-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Building className="w-4 h-4" />
          1. Intervenants & Sous-Traitants ({stakeholders.length})
        </button>

        <button
          onClick={() => setActiveTab("teams")}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "teams"
              ? "bg-orange-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          2. Équipes de Chantier ({teams.length})
        </button>

        <button
          onClick={() => setActiveTab("workers")}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "workers"
              ? "bg-orange-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <HardHat className="w-4 h-4" />
          3. Compagnons & Habilitations BTP ({workers.length})
        </button>
      </div>

      {/* TAB 1: STAKEHOLDERS */}
      {activeTab === "stakeholders" && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <AppTextField
                  placeholder="Rechercher par raison sociale, code, spécialité ou ville..."
                  value={stakeholderQuery.search || ""}
                  onChange={(e) => setStakeholderQuery((prev) => ({ ...prev, search: e.target.value }))}
                  leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <AppSelect
                value={stakeholderQuery.category || "ALL"}
                onChange={(e) => setStakeholderQuery((prev) => ({ ...prev, category: e.target.value as any }))}
                options={[
                  { value: "ALL", label: "Toutes les Catégories" },
                  { value: "BUREAU_CONTROLE", label: "🔍 Bureaux de Contrôle" },
                  { value: "BUREAU_ETUDES_TECHNIQUES", label: "📐 BET Structure / Fluides" },
                  { value: "SOUS_TRAITANT_SPECIALISE", label: "⚡ Sous-Traitants" },
                  { value: "LABORATOIRE_SOLS_BETON", label: "🧪 Laboratoires Béton/Sol" },
                  { value: "COORDONNATEUR_SPS", label: "🦺 Coordonnateurs SPS" },
                ]}
              />
            </div>
          </div>

          {stakeholders.length === 0 ? (
            <AppEmptyState
              icon={<Building className="w-8 h-8 text-orange-500" />}
              title="Aucun intervenant trouvé"
              description="Aucun partenaire ou sous-traitant ne correspond à vos filtres."
              actionLabel="Ajouter un Intervenant"
              onAction={() => {
                setStkToEdit(null);
                setIsStkModalOpen(true);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stakeholders.map((stk) => {
                const catConfig = STAKEHOLDER_CATEGORIES_CONFIG[stk.category] || {
                  label: stk.category,
                  variant: "neutral" as const,
                };
                const primaryContact = stk.contacts?.[0];

                return (
                  <div
                    key={stk.id}
                    className="bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold font-mono text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded border border-orange-200 dark:border-orange-900/40">
                              {stk.code}
                            </span>
                            <AppBadge variant={catConfig.variant} size="sm">
                              {catConfig.label}
                            </AppBadge>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {stk.name}
                          </h3>
                        </div>

                        <div className="flex items-center text-amber-500 font-bold text-xs">
                          {"★".repeat(stk.rating || 5)}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {stk.specialty}
                      </p>

                      <div className="space-y-1 text-xs text-slate-500">
                        {primaryContact && (
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{primaryContact.name} ({primaryContact.role})</span>
                          </div>
                        )}
                        {stk.phone && (
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{stk.phone}</span>
                          </div>
                        )}
                        {stk.assignedProjectNames && stk.assignedProjectNames.length > 0 && (
                          <div className="p-2 bg-slate-50 dark:bg-slate-900/60 rounded-lg text-[11px] text-slate-700 dark:text-slate-300">
                            <strong>Chantiers :</strong> {stk.assignedProjectNames.join(", ")}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {stk.insuranceCompany ? `Assuré ${stk.insuranceCompany}` : "Conforme"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setStkToEdit(stk);
                            setIsStkModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-orange-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStk(stk.id, stk.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TEAMS */}
      {activeTab === "teams" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: team.colorTag || "#ea580c" }}
                        ></span>
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          {team.code}
                        </span>
                        <AppBadge variant="neutral" size="sm">
                          {team.category}
                        </AppBadge>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {team.name}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black font-mono text-orange-600 dark:text-orange-400">
                        {team.memberCount} compagnons
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl space-y-1 text-xs">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      Chef d'équipe : {team.leaderName}
                    </div>
                    <div className="text-slate-500 font-mono text-[11px]">{team.leaderPhone}</div>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Chantier actif :</strong> {team.assignedProjectName || "Réserve entreprise"}
                  </div>

                  {/* Productivity Gauge */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Productivité & Rythme</span>
                      <span className="font-bold font-mono text-emerald-600">{team.productivityScore}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${team.productivityScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-1">
                  <button
                    onClick={() => {
                      setTeamToEdit(team);
                      setIsTeamModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-orange-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id, team.name)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WORKERS & CERTIFICATIONS */}
      {activeTab === "workers" && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <AppTextField
                placeholder="Rechercher par nom, matricule, chantier..."
                value={workerQuery.search || ""}
                onChange={(e) => setWorkerQuery((prev) => ({ ...prev, search: e.target.value }))}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              />

              <AppSelect
                value={workerQuery.trade || "ALL"}
                onChange={(e) => setWorkerQuery((prev) => ({ ...prev, trade: e.target.value as any }))}
                options={[
                  { value: "ALL", label: "Tous les Métiers BTP" },
                  { value: "CHEF_EQUIPE_TERRAIN", label: "🎖️ Chef d'Équipe" },
                  { value: "GRUTIER", label: "🏗️ Grutier" },
                  { value: "COFFREUR_BANCHEUR", label: "🧱 Coffreur-Bancheur" },
                  { value: "FERRAILLEUR", label: "⛓️ Ferrailleur" },
                  { value: "MACON", label: "🔨 Maçon" },
                  { value: "ELECTRICIEN", label: "⚡ Électricien" },
                  { value: "CONDUCTEUR_ENGIN", label: "🚜 Conducteur d'Engin" },
                ]}
              />

              <AppSelect
                value={workerQuery.status || "ALL"}
                onChange={(e) => setWorkerQuery((prev) => ({ ...prev, status: e.target.value as any }))}
                options={[
                  { value: "ALL", label: "Tous les Statuts" },
                  { value: "SUR_CHANTIER", label: "🟢 Sur Chantier" },
                  { value: "DISPONIBLE", label: "🔵 Disponible" },
                  { value: "EN_CONGE", label: "🟡 En Congé" },
                ]}
              />
            </div>
          </div>

          {/* Workers Table */}
          <div className="bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-3.5">Matricule & Compagnon</th>
                    <th className="p-3.5">Métier & Niveau</th>
                    <th className="p-3.5">Statut Actuel</th>
                    <th className="p-3.5">Chantier & Équipe</th>
                    <th className="p-3.5">Habilitations & CACES</th>
                    <th className="p-3.5">Taux Jour (FCFA)</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {workers.map((worker) => {
                    const statusInfo = WORKER_STATUS_CONFIG[worker.status] || {
                      label: worker.status,
                      variant: "neutral" as const,
                    };

                    return (
                      <tr key={worker.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {worker.lastName} {worker.firstName}
                          </div>
                          <span className="font-mono text-[10px] text-orange-600 dark:text-orange-400">
                            {worker.registrationNumber}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <div className="font-medium text-slate-800 dark:text-slate-200">{worker.trade}</div>
                          <span className="text-[10px] text-slate-400">{worker.tradeLevel} • {worker.contractType}</span>
                        </td>

                        <td className="p-3.5">
                          <AppBadge variant={statusInfo.variant} size="sm">
                            {statusInfo.label}
                          </AppBadge>
                        </td>

                        <td className="p-3.5">
                          <div className="font-medium">{worker.currentProjectName || "Non affecté"}</div>
                          <span className="text-[10px] text-slate-400">{worker.currentTeamName || "Sans équipe"}</span>
                        </td>

                        <td className="p-3.5">
                          {worker.certifications && worker.certifications.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {worker.certifications.map((c) => (
                                <span
                                  key={c.id}
                                  className="text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/40"
                                >
                                  🛡️ {c.name.split("-")[0]}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">Aucune enregistrée</span>
                          )}
                        </td>

                        <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                          {formatFCFA(worker.dailyRateFCFA)}
                        </td>

                        <td className="p-3.5 text-right space-x-1">
                          <button
                            onClick={() => {
                              setWorkerToEdit(worker);
                              setIsWorkerModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-orange-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteWorker(worker.id, `${worker.firstName} ${worker.lastName}`)}
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
        </div>
      )}

      {/* Modals */}
      <StakeholderFormModal
        isOpen={isStkModalOpen}
        onClose={() => setIsStkModalOpen(false)}
        onSubmit={async (data) => {
          if (stkToEdit) {
            await updateStakeholder(data);
          } else {
            await createStakeholder(data);
          }
        }}
        stakeholderToEdit={stkToEdit}
      />

      <TeamFormModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        onSubmit={async (data) => {
          if (teamToEdit) {
            await updateTeam(data);
          } else {
            await createTeam(data);
          }
        }}
        teamToEdit={teamToEdit}
      />

      <WorkerFormModal
        isOpen={isWorkerModalOpen}
        onClose={() => setIsWorkerModalOpen(false)}
        onSubmit={async (data) => {
          if (workerToEdit) {
            await updateWorker(data);
          } else {
            await createWorker(data);
          }
        }}
        workerToEdit={workerToEdit}
      />
    </div>
  );
};

export const TeamsManagementScreen: React.FC = () => {
  return (
    <TeamsProvider>
      <TeamsManagementContent />
    </TeamsProvider>
  );
};
