/**
 * AGB CHANTIER - Modal de Création & Modification d'Équipe de Chantier - AXE 05
 */

import React, { useState, useEffect } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { TeamEntity, TeamCategory } from "../domain/entities/team_entity";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { ProjectEntity } from "../../projects/domain/entities/project_entity";
import { Users, Check, Phone, Layers, Sparkles } from "lucide-react";

interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  teamToEdit?: TeamEntity | null;
}

const CATEGORIES: { value: TeamCategory; label: string }[] = [
  { value: "GROS_OEUVRE", label: "🏗️ Gros Œuvre & Béton Armé" },
  { value: "FERRAILLAGE", label: "⛓️ Ferraillage & Armatures" },
  { value: "MACONNERIE_FINITIONS", label: "🧱 Maçonnerie & Enduits" },
  { value: "ELECTRICITE_CFO_CFA", label: "⚡ Électricité & Courants Faibles" },
  { value: "PLOMBERIE_CVC", label: "🚰 Plomberie, Sanitaire & Clim" },
  { value: "VRD_TERRASSEMENT", label: "🛣️ VRD, Terrassement & Réseaux" },
  { value: "ETANCHEITE_ISOLATION", label: "🛡️ Étanchéité & Isolation" },
  { value: "SECOND_OEUVRE_POLYVALENT", label: "🎨 Second Œuvre & Peinture/Carrelage" },
];

export const TeamFormModal: React.FC<TeamFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teamToEdit,
}) => {
  const [projectsList, setProjectsList] = useState<ProjectEntity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<TeamCategory>("GROS_OEUVRE");
  const [leaderName, setLeaderName] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [assignedProjectId, setAssignedProjectId] = useState("");
  const [memberCount, setMemberCount] = useState<number | "">(8);
  const [productivityScore, setProductivityScore] = useState<number>(90);
  const [colorTag, setColorTag] = useState("#ea580c");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const prjs = await IdbAdapter.getAll<ProjectEntity>(IdbAdapter.STORES.PROJECTS);
        setProjectsList(prjs);
      } catch (e) {
        console.error("Erreur chargement projets", e);
      }
    };
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  useEffect(() => {
    if (teamToEdit) {
      setCode(teamToEdit.code);
      setName(teamToEdit.name);
      setCategory(teamToEdit.category);
      setLeaderName(teamToEdit.leaderName);
      setLeaderPhone(teamToEdit.leaderPhone);
      setAssignedProjectId(teamToEdit.assignedProjectId || "");
      setMemberCount(teamToEdit.memberCount || 0);
      setProductivityScore(teamToEdit.productivityScore || 90);
      setColorTag(teamToEdit.colorTag || "#ea580c");
      setNotes(teamToEdit.notes || "");
    } else {
      setCode("");
      setName("");
      setCategory("GROS_OEUVRE");
      setLeaderName("");
      setLeaderPhone("");
      setAssignedProjectId("");
      setMemberCount(10);
      setProductivityScore(95);
      setColorTag("#ea580c");
      setNotes("");
    }
  }, [teamToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !leaderName.trim()) return;

    setIsSubmitting(true);
    try {
      const selectedPrj = projectsList.find((p) => p.id === assignedProjectId);

      const payload = {
        ...(teamToEdit ? teamToEdit : {}),
        code: code.trim() || undefined,
        name: name.trim(),
        category,
        leaderName: leaderName.trim(),
        leaderPhone: leaderPhone.trim(),
        assignedProjectId: assignedProjectId || undefined,
        assignedProjectName: selectedPrj ? selectedPrj.name : undefined,
        memberCount: Number(memberCount) || 0,
        productivityScore: Number(productivityScore) || 90,
        colorTag,
        notes: notes.trim(),
        workerIds: teamToEdit?.workerIds || [],
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
      title={teamToEdit ? `Modifier l'Équipe : ${teamToEdit.name}` : "Constituer une Nouvelle Équipe de Chantier BTP"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <AppTextField
              label="Nom de l'Équipe *"
              placeholder="Ex: Équipe Gros Œuvre Alpha"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              leftIcon={<Users className="w-4 h-4 text-orange-600" />}
            />
          </div>

          <AppTextField
            label="Code Équipe"
            placeholder="Ex: EQP-GO-01"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            helperText="Auto-généré si vide"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AppSelect
            label="Corps d'État / Spécialité *"
            value={category}
            onChange={(e) => setCategory(e.target.value as TeamCategory)}
            options={CATEGORIES}
          />

          <AppSelect
            label="Chantier d'Affectation Actuel"
            value={assignedProjectId}
            onChange={(e) => setAssignedProjectId(e.target.value)}
            options={[
              { value: "", label: "-- Non affectée à un chantier précis --" },
              ...projectsList.map((p) => ({
                value: p.id,
                label: `${p.code} - ${p.name}`,
              })),
            ]}
          />
        </div>

        {/* Team Leader info */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-orange-600" />
            Chef d'Équipe Terrain Référent
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AppTextField
              label="Nom & Prénom du Chef d'Équipe *"
              placeholder="Ex: M. Traoré Souleymane"
              value={leaderName}
              onChange={(e) => setLeaderName(e.target.value)}
              required
            />

            <AppTextField
              label="Téléphone Professionnel"
              placeholder="+225 07 00 00 00 00"
              value={leaderPhone}
              onChange={(e) => setLeaderPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AppTextField
            label="Effectif Total Estimé (Compagnons)"
            type="number"
            value={memberCount}
            onChange={(e) => setMemberCount(e.target.value === "" ? "" : Number(e.target.value))}
          />

          <AppTextField
            label="Note de Productivité & Rythme (%)"
            type="number"
            value={productivityScore}
            onChange={(e) => setProductivityScore(Number(e.target.value))}
            helperText="Standard : 90-95%"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton type="submit" variant="primary" isLoading={isSubmitting} leftIcon={<Check className="w-4 h-4" />}>
            {teamToEdit ? "Enregistrer les Modifications" : "Créer l'Équipe"}
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
