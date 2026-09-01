/**
 * AGB CHANTIER - Modal de Création & Modification de Phase de Planning - AXE 06
 */

import React, { useState, useEffect } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { PhaseEntity, PhaseStatus, PhaseMilestone } from "../domain/entities/planning_entity";
import { ProjectEntity } from "../../projects/domain/entities/project_entity";
import { TeamEntity } from "../../teams/domain/entities/team_entity";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import {
  Calendar,
  Layers,
  Check,
  Plus,
  Trash2,
  AlertTriangle,
  Sparkles,
  Flag,
} from "lucide-react";

interface PhaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  phaseToEdit?: PhaseEntity | null;
  defaultProjectId?: string;
}

const STATUS_OPTIONS: { value: PhaseStatus; label: string }[] = [
  { value: "PLANNED", label: "🗓️ Planifié / À venir" },
  { value: "IN_PROGRESS", label: "⚡ En Cours d'Exécution" },
  { value: "COMPLETED", label: "✅ Achevé / Réceptionné" },
  { value: "DELAYED", label: "⚠️ En Retard sur planning" },
  { value: "BLOCKED", label: "🛑 Bloqué (Intempéries/Arrêt)" },
];

export const PhaseFormModal: React.FC<PhaseFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  phaseToEdit,
  defaultProjectId,
}) => {
  const [projectsList, setProjectsList] = useState<ProjectEntity[]>([]);
  const [teamsList, setTeamsList] = useState<TeamEntity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [projectId, setProjectId] = useState(defaultProjectId || "");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [status, setStatus] = useState<PhaseStatus>("PLANNED");
  const [colorTag, setColorTag] = useState("#ea580c");
  const [assignedTeamId, setAssignedTeamId] = useState("");
  const [budgetAllocatedFCFA, setBudgetAllocatedFCFA] = useState<number | "">(0);
  const [isCriticalPath, setIsCriticalPath] = useState(false);
  const [milestones, setMilestones] = useState<PhaseMilestone[]>([]);

  // Temp milestone
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [msName, setMsName] = useState("");
  const [msDate, setMsDate] = useState("");
  const [msImportance, setMsImportance] = useState<"CRITICAL" | "MAJOR" | "STANDARD">("CRITICAL");

  useEffect(() => {
    const loadPrjs = async () => {
      try {
        const [prjs, tms] = await Promise.all([
          IdbAdapter.getAll<ProjectEntity>(IdbAdapter.STORES.PROJECTS),
          IdbAdapter.getAll<TeamEntity>(IdbAdapter.STORES.TEAMS),
        ]);
        setProjectsList(prjs);
        setTeamsList(tms);
      } catch (e) {
        console.error("Erreur chargement données modal", e);
      }
    };
    if (isOpen) {
      loadPrjs();
    }
  }, [isOpen]);

  useEffect(() => {
    if (phaseToEdit) {
      setProjectId(phaseToEdit.projectId);
      setCode(phaseToEdit.code);
      setName(phaseToEdit.name);
      setDescription(phaseToEdit.description || "");
      setStartDate(phaseToEdit.startDate);
      setEndDate(phaseToEdit.endDate);
      setProgressPercentage(phaseToEdit.progressPercentage);
      setStatus(phaseToEdit.status);
      setColorTag(phaseToEdit.colorTag || "#ea580c");
      setAssignedTeamId(phaseToEdit.assignedTeamId || "");
      setBudgetAllocatedFCFA(phaseToEdit.budgetAllocatedFCFA || 0);
      setIsCriticalPath(phaseToEdit.isCriticalPath || false);
      setMilestones(phaseToEdit.milestones || []);
    } else {
      setProjectId(defaultProjectId || (projectsList[0]?.id ?? ""));
      setCode("");
      setName("");
      setDescription("");
      const today = new Date().toISOString().split("T")[0];
      setStartDate(today);
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 2);
      setEndDate(nextMonth.toISOString().split("T")[0]);
      setProgressPercentage(0);
      setStatus("PLANNED");
      setColorTag("#ea580c");
      setAssignedTeamId("");
      setBudgetAllocatedFCFA(150000000);
      setIsCriticalPath(false);
      setMilestones([]);
    }
  }, [phaseToEdit, isOpen, defaultProjectId, projectsList]);

  const handleAddMilestone = () => {
    if (!msName.trim() || !msDate) return;
    const newMs: PhaseMilestone = {
      id: `ms_${Date.now()}`,
      name: msName.trim(),
      targetDate: msDate,
      isReached: false,
      importance: msImportance,
    };
    setMilestones([...milestones, newMs]);
    setMsName("");
    setMsDate("");
    setShowAddMilestone(false);
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !startDate || !endDate) return;

    setIsSubmitting(true);
    try {
      const selectedPrj = projectsList.find((p) => p.id === projectId);
      const selectedTeam = teamsList.find((t) => t.id === assignedTeamId);

      const s = new Date(startDate);
      const end = new Date(endDate);
      const diff = Math.max(1, Math.ceil((end.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));

      const payload = {
        ...(phaseToEdit ? phaseToEdit : {}),
        projectId: projectId || projectsList[0]?.id || "prj_001",
        projectName: selectedPrj?.name || "Chantier Principal",
        code: code.trim() || `PH-${Math.floor(Math.random() * 90 + 10)}`,
        name: name.trim(),
        description: description.trim(),
        orderIndex: phaseToEdit?.orderIndex || 1,
        startDate,
        endDate,
        durationDays: diff,
        progressPercentage: Number(progressPercentage) || 0,
        status,
        colorTag,
        dependencies: phaseToEdit?.dependencies || [],
        assignedTeamId: assignedTeamId || undefined,
        assignedTeamName: selectedTeam?.name || undefined,
        budgetAllocatedFCFA: Number(budgetAllocatedFCFA) || 0,
        isCriticalPath,
        milestones,
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
      title={phaseToEdit ? `Modifier la Phase : ${phaseToEdit.name}` : "Planifier une Nouvelle Phase de Travaux BTP"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <AppSelect
              label="Chantier de Rattachement *"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              options={projectsList.map((p) => ({
                value: p.id,
                label: `${p.code} - ${p.name}`,
              }))}
            />
          </div>

          <AppTextField
            label="Code Phase"
            placeholder="Ex: PH-03"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            helperText="Auto-généré si vide"
          />
        </div>

        <AppTextField
          label="Intitulé de la Phase / Lot de Travaux *"
          placeholder="Ex: Superstructure Gros Œuvre RDC à R+4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AppTextField
            label="Date de Début *"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <AppTextField
            label="Date de Fin Prévisionnelle *"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />

          <AppSelect
            label="Statut du Planning"
            value={status}
            onChange={(e) => setStatus(e.target.value as PhaseStatus)}
            options={STATUS_OPTIONS}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AppTextField
            label="Avancement Physique (%)"
            type="number"
            value={progressPercentage}
            onChange={(e) => setProgressPercentage(Math.min(100, Math.max(0, Number(e.target.value))))}
          />

          <AppSelect
            label="Équipe BTP Assignée"
            value={assignedTeamId}
            onChange={(e) => setAssignedTeamId(e.target.value)}
            options={[
              { value: "", label: "-- Non assignée --" },
              ...teamsList.map((t) => ({ value: t.id, label: `${t.code} - ${t.name}` })),
            ]}
          />

          <AppTextField
            label="Budget Alloué (FCFA)"
            type="number"
            value={budgetAllocatedFCFA}
            onChange={(e) => setBudgetAllocatedFCFA(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>

        <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={isCriticalPath}
              onChange={(e) => setIsCriticalPath(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded"
            />
            <span className="text-red-600 dark:text-red-400">🚩 Inclure dans le Chemin Critique (Impacte date de livraison)</span>
          </label>
        </div>

        {/* Milestones Section */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-amber-500" />
              Jalons Clés & Points d'Arrêt ({milestones.length})
            </span>
            <AppButton
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-3 h-3" />}
              onClick={() => setShowAddMilestone(!showAddMilestone)}
            >
              Ajouter Jalon
            </AppButton>
          </div>

          {showAddMilestone && (
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Intitulé du Jalon (Ex: Coulage dalle haute R+4)"
                  value={msName}
                  onChange={(e) => setMsName(e.target.value)}
                  className="p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
                <input
                  type="date"
                  value={msDate}
                  onChange={(e) => setMsDate(e.target.value)}
                  className="p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
                <select
                  value={msImportance}
                  onChange={(e) => setMsImportance(e.target.value as any)}
                  className="p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                >
                  <option value="CRITICAL">🔴 Jalon Critique (Bloquant)</option>
                  <option value="MAJOR">🟡 Jalon Majeur</option>
                  <option value="STANDARD">🔵 Jalon Standard</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMilestone(false)}
                  className="px-2 py-1 text-slate-500 hover:text-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-3 py-1 bg-orange-600 text-white rounded font-bold hover:bg-orange-700"
                >
                  Enregistrer Jalon
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-2 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rotate-45 ${
                      m.isReached ? "bg-emerald-500" : m.importance === "CRITICAL" ? "bg-red-500" : "bg-amber-400"
                    }`}
                  ></span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{m.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Prévu le {m.targetDate}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMilestone(m.id)}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton type="submit" variant="primary" isLoading={isSubmitting} leftIcon={<Check className="w-4 h-4" />}>
            {phaseToEdit ? "Enregistrer les Modifications" : "Créer la Phase"}
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
