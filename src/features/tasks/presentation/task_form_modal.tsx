/**
 * AGB CHANTIER - Modal de Création & Modification de Tâche de Chantier - AXE 07
 */

import React, { useState, useEffect } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import {
  TaskEntity,
  TaskTrade,
  TaskPriority,
  TaskStatus,
  MetricUnit,
} from "../domain/entities/task_entity";
import { ProjectEntity } from "../../projects/domain/entities/project_entity";
import { TeamEntity } from "../../teams/domain/entities/team_entity";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import {
  CheckSquare,
  Check,
  DollarSign,
  Layers,
  AlertTriangle,
  FileSpreadsheet,
} from "lucide-react";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  taskToEdit?: TaskEntity | null;
  defaultProjectId?: string;
}

const TRADES: { value: TaskTrade; label: string }[] = [
  { value: "GROS_OEUVRE", label: "🏗️ Gros Œuvre & Béton Armé" },
  { value: "FERRAILLAGE", label: "⛓️ Ferraillage & Armatures" },
  { value: "MACONNERIE", label: "🧱 Maçonnerie & Agglos" },
  { value: "ELECTRICITE", label: "⚡ Électricité CFO / CFA" },
  { value: "PLOMBERIE", label: "🚰 Plomberie, Sanitaire & Clim" },
  { value: "ETANCHEITE", label: "🛡️ Étanchéité & Isolation" },
  { value: "PEINTURE_FINITION", label: "🎨 Peinture & Finitions" },
  { value: "VRD_TERRASSEMENT", label: "🛣️ VRD & Terrassement" },
  { value: "MENUISERIE", label: "🚪 Menuiseries Bois / Métal / Alu" },
];

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: "URGENT", label: "🔴 URGENT (Bloquant chantier)" },
  { value: "HIGH", label: "🟠 Priorité Haute" },
  { value: "MEDIUM", label: "🟡 Priorité Moyenne" },
  { value: "LOW", label: "🟢 Priorité Basse" },
];

const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "A_FAIRE", label: "📋 À Faire" },
  { value: "EN_COURS", label: "⚡ En Cours" },
  { value: "EN_ATTENTE_VALIDATION", label: "🔍 En Attente Validation" },
  { value: "VALIDE_CONFORME", label: "✅ Validé Conforme" },
  { value: "BLOQUE", label: "🛑 Bloqué (Intempéries / Matériaux)" },
];

const UNITS: { value: MetricUnit; label: string }[] = [
  { value: "m³", label: "m³ (Volume Béton / Terrassement)" },
  { value: "m²", label: "m² (Surface Coffrage / Peinture / Carrelage)" },
  { value: "ml", label: "ml (Mètre Linéaire Câbles / Tuyaux)" },
  { value: "tonne", label: "Tonne (Acier / Granulats)" },
  { value: "unité", label: "Unité (Équipement / Porte / Prise)" },
  { value: "kg", label: "kg" },
  { value: "forfait", label: "Forfait global" },
];

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  taskToEdit,
  defaultProjectId,
}) => {
  const [projectsList, setProjectsList] = useState<ProjectEntity[]>([]);
  const [teamsList, setTeamsList] = useState<TeamEntity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [projectId, setProjectId] = useState(defaultProjectId || "");
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [trade, setTrade] = useState<TaskTrade>("GROS_OEUVRE");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [status, setStatus] = useState<TaskStatus>("A_FAIRE");
  const [assignedTeamId, setAssignedTeamId] = useState("");
  const [assignedWorkerName, setAssignedWorkerName] = useState("");
  const [plannedStartDate, setPlannedStartDate] = useState("");
  const [plannedEndDate, setPlannedEndDate] = useState("");
  const [estimatedHours, setEstimatedHours] = useState<number | "">(40);

  // Quantitative tracking
  const [unit, setUnit] = useState<MetricUnit>("m³");
  const [quantityPlanned, setQuantityPlanned] = useState<number | "">(100);
  const [quantityExecuted, setQuantityExecuted] = useState<number | "">(0);
  const [unitPriceFCFA, setUnitPriceFCFA] = useState<number | "">(50000);
  const [blockingReason, setBlockingReason] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prjs, tms] = await Promise.all([
          IdbAdapter.getAll<ProjectEntity>(IdbAdapter.STORES.PROJECTS),
          IdbAdapter.getAll<TeamEntity>(IdbAdapter.STORES.TEAMS),
        ]);
        setProjectsList(prjs);
        setTeamsList(tms);
      } catch (e) {
        console.error("Erreur chargement données", e);
      }
    };
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (taskToEdit) {
      setProjectId(taskToEdit.projectId);
      setCode(taskToEdit.code);
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setTrade(taskToEdit.trade);
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setAssignedTeamId(taskToEdit.assignedTeamId || "");
      setAssignedWorkerName(taskToEdit.assignedWorkerName || "");
      setPlannedStartDate(taskToEdit.plannedStartDate);
      setPlannedEndDate(taskToEdit.plannedEndDate);
      setEstimatedHours(taskToEdit.estimatedHours);
      setUnit(taskToEdit.unit);
      setQuantityPlanned(taskToEdit.quantityPlanned);
      setQuantityExecuted(taskToEdit.quantityExecuted);
      setUnitPriceFCFA(taskToEdit.unitPriceFCFA || 0);
      setBlockingReason(taskToEdit.blockingReason || "");
    } else {
      setProjectId(defaultProjectId || (projectsList[0]?.id ?? ""));
      setCode("");
      setTitle("");
      setDescription("");
      setTrade("GROS_OEUVRE");
      setPriority("MEDIUM");
      setStatus("A_FAIRE");
      setAssignedTeamId("");
      setAssignedWorkerName("");
      const today = new Date().toISOString().split("T")[0];
      setPlannedStartDate(today);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 14);
      setPlannedEndDate(nextWeek.toISOString().split("T")[0]);
      setEstimatedHours(40);
      setUnit("m³");
      setQuantityPlanned(100);
      setQuantityExecuted(0);
      setUnitPriceFCFA(75000);
      setBlockingReason("");
    }
  }, [taskToEdit, isOpen, defaultProjectId, projectsList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !plannedStartDate || !plannedEndDate) return;

    setIsSubmitting(true);
    try {
      const selectedPrj = projectsList.find((p) => p.id === projectId);
      const selectedTeam = teamsList.find((t) => t.id === assignedTeamId);

      const qPlanned = Number(quantityPlanned) || 1;
      const qExec = Number(quantityExecuted) || 0;
      const progress = Math.min(100, Math.round((qExec / qPlanned) * 100));
      const uPrice = Number(unitPriceFCFA) || 0;
      const totalCost = qPlanned * uPrice;

      const payload = {
        ...(taskToEdit ? taskToEdit : {}),
        projectId: projectId || projectsList[0]?.id || "prj_001",
        projectName: selectedPrj?.name || "Chantier Principal",
        code: code.trim() || `TSK-${Math.floor(Math.random() * 900 + 100)}`,
        title: title.trim(),
        description: description.trim(),
        trade,
        priority,
        status,
        assignedTeamId: assignedTeamId || undefined,
        assignedTeamName: selectedTeam?.name || undefined,
        assignedWorkerName: assignedWorkerName.trim() || undefined,
        plannedStartDate,
        plannedEndDate,
        estimatedHours: Number(estimatedHours) || 40,
        unit,
        quantityPlanned: qPlanned,
        quantityExecuted: qExec,
        unitPriceFCFA: uPrice,
        totalBudgetFCFA: totalCost,
        progressPercentage: progress,
        blockingReason: status === "BLOQUE" ? blockingReason.trim() : undefined,
      };

      await onSubmit(payload);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? `Modifier la Tâche : ${taskToEdit.code}` : "Créer une Tâche & Décompte d'Ouvrage BTP"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <AppSelect
              label="Chantier d'Affectation *"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              options={projectsList.map((p) => ({
                value: p.id,
                label: `${p.code} - ${p.name}`,
              }))}
            />
          </div>

          <AppTextField
            label="Code Tâche"
            placeholder="Ex: TSK-GO-021"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            helperText="Auto-généré si vide"
          />
        </div>

        <AppTextField
          label="Intitulé de la Tâche / Ouvrage *"
          placeholder="Ex: Coulage poteaux BA axe 4 au niveau R+3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AppSelect
            label="Corps d'État / Métier *"
            value={trade}
            onChange={(e) => setTrade(e.target.value as TaskTrade)}
            options={TRADES}
          />

          <AppSelect
            label="Niveau de Priorité *"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            options={PRIORITIES}
          />

          <AppSelect
            label="Statut d'Avancement"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            options={STATUSES}
          />
        </div>

        {/* Assignments & Timing */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AppSelect
            label="Équipe Responsable"
            value={assignedTeamId}
            onChange={(e) => setAssignedTeamId(e.target.value)}
            options={[
              { value: "", label: "-- Non assignée --" },
              ...teamsList.map((t) => ({ value: t.id, label: `${t.code} - ${t.name}` })),
            ]}
          />

          <AppTextField
            label="Date Début Prévue *"
            type="date"
            value={plannedStartDate}
            onChange={(e) => setPlannedStartDate(e.target.value)}
            required
          />

          <AppTextField
            label="Date Fin Prévue *"
            type="date"
            value={plannedEndDate}
            onChange={(e) => setPlannedEndDate(e.target.value)}
            required
          />
        </div>

        {/* Quantitative Section */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-orange-600" />
            Métré & Décompte Quantitatif BTP
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <AppSelect
              label="Unité de Mesure *"
              value={unit}
              onChange={(e) => setUnit(e.target.value as MetricUnit)}
              options={UNITS}
            />

            <AppTextField
              label="Quantité Prévue (Marché) *"
              type="number"
              value={quantityPlanned}
              onChange={(e) => setQuantityPlanned(e.target.value === "" ? "" : Number(e.target.value))}
              required
            />

            <AppTextField
              label="Quantité Exécutée (Réalisée)"
              type="number"
              value={quantityExecuted}
              onChange={(e) => setQuantityExecuted(e.target.value === "" ? "" : Number(e.target.value))}
              helperText={`${
                quantityPlanned
                  ? Math.min(100, Math.round(((Number(quantityExecuted) || 0) / Number(quantityPlanned)) * 100))
                  : 0
              }% avancement`}
            />

            <AppTextField
              label="Prix Unitaire (FCFA)"
              type="number"
              value={unitPriceFCFA}
              onChange={(e) => setUnitPriceFCFA(e.target.value === "" ? "" : Number(e.target.value))}
              leftIcon={<DollarSign className="w-4 h-4 text-emerald-600" />}
            />
          </div>
        </div>

        {status === "BLOQUE" && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/60 space-y-1">
            <span className="text-xs font-bold text-red-700 dark:text-red-400 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> Motif du Blocage / Point d'Arrêt
            </span>
            <AppTextField
              placeholder="Ex: Pénurie ciment, intempéries fortes pluies, attente validation BET"
              value={blockingReason}
              onChange={(e) => setBlockingReason(e.target.value)}
              required
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton type="submit" variant="primary" isLoading={isSubmitting} leftIcon={<Check className="w-4 h-4" />}>
            {taskToEdit ? "Enregistrer les Modifications" : "Créer la Tâche"}
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
