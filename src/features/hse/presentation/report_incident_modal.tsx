/**
 * AGB CHANTIER - Modal de Déclaration d'Incident / Presqu'accident HSE - AXE 16
 */

import React, { useState } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { HseIncidentEntity, IncidentCategory, IncidentSeverity } from "../domain/entities/hse_entity";
import { AlertTriangle, ShieldCheck, HeartPulse } from "lucide-react";

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (incident: Omit<HseIncidentEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">) => Promise<void>;
  defaultProjectId?: string;
  defaultProjectName?: string;
}

const CATEGORY_OPTIONS = [
  { value: "COUPURE_OUTILLAGE", label: "Coupure / Perforation outillage" },
  { value: "CHUTE_DE_HAUTEUR", label: "Chute de hauteur / Échafaudage" },
  { value: "CHUTE_OBJET_MANUTENTION", label: "Chute d'objet / Manutention grue" },
  { value: "COLLISION_ENGIN", label: "Collision / Manœuvre engin" },
  { value: "ELECTRISATION", label: "Risque électrique / Câble dénudé" },
  { value: "BRULURE_CHIMIQUE_CIMENT", label: "Brûlure chimique ciment / adjuvants" },
  { value: "COUP_DE_CHALEUR", label: "Coup de chaleur / Déshydratation" },
];

const SEVERITY_OPTIONS = [
  { value: "BENIN_SOINS_SUR_PLACE", label: "Bénin (Premiers soins sur place à l'infirmerie)" },
  { value: "PRESQU_ACCIDENT_NEAR_MISS", label: "Presqu'accident (Near-Miss sans blessé)" },
  { value: "AVEC_ARRET_TRAVAIL", label: "Grave (Avec arrêt de travail / Évacuation)" },
  { value: "DOMMAGE_MATERIEL_PUR", label: "Dommage matériel sans dommage corporel" },
];

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultProjectId = "proj-001",
  defaultProjectName = "Tour Résidentielle Ivoire - Cocody Riviera",
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<IncidentCategory>("COUPURE_OUTILLAGE");
  const [severity, setSeverity] = useState<IncidentSeverity>("BENIN_SOINS_SUR_PLACE");
  const [exactLocation, setExactLocation] = useState("Zone Bâtiment R+2");
  const [victimName, setVictimName] = useState("");
  const [victimCompany, setVictimCompany] = useState("AGB BTP");
  const [daysOfSickLeave, setDaysOfSickLeave] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [rootCauseAnalysis, setRootCauseAnalysis] = useState("");
  const [correctiveActions, setCorrectiveActions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      await onSave({
        projectId: defaultProjectId,
        projectName: defaultProjectName,
        incidentNumber: `HSE-2026-${randomNum}`,
        title: title.trim(),
        category,
        severity,
        dateTime: new Date().toISOString(),
        exactLocation: exactLocation.trim(),
        victimName: victimName.trim() || undefined,
        victimCompany: victimCompany.trim() || undefined,
        daysOfSickLeave: Number(daysOfSickLeave),
        description: description.trim(),
        rootCauseAnalysis: rootCauseAnalysis.trim() || "Analyse en cours par l'animateur sécurité",
        correctiveActions: correctiveActions.trim() || "Sensibilisation immédiate des équipes",
        responsibleFollowUp: "Responsable HSE Chantier",
        isClosed: true,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Déclarer un Événement HSE / Incident"
      subtitle="Registre obligatoire des presqu'accidents, soins bénins et actions correctives de prévention"
      icon={<AlertTriangle className="w-5 h-5 text-orange-600" />}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AppTextField
          label="Titre de l'incident / Résumé court"
          placeholder="Ex: Coupure superficielle main ou Glissade sur dalle humide"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppSelect
            label="Typologie du risque"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(e) => setCategory(e.target.value as IncidentCategory)}
            required
          />

          <AppSelect
            label="Gravité de l'événement"
            options={SEVERITY_OPTIONS}
            value={severity}
            onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AppTextField
            label="Lieu précis sur le chantier"
            placeholder="Ex: Étage R+2 File C"
            value={exactLocation}
            onChange={(e) => setExactLocation(e.target.value)}
            required
          />

          <AppTextField
            label="Nom de la personne impliquée"
            placeholder="Ex: Bamba S. (ou laisser vide)"
            value={victimName}
            onChange={(e) => setVictimName(e.target.value)}
          />

          <AppTextField
            label="Jours d'arrêt prescrits"
            type="number"
            value={daysOfSickLeave.toString()}
            onChange={(e) => setDaysOfSickLeave(Number(e.target.value))}
          />
        </div>

        <AppTextField
          label="Circonstances détaillées de l'événement"
          placeholder="Que s'est-il passé précisément ? Quelles étaient les conditions ?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppTextField
            label="Cause racine identifiée"
            placeholder="Ex: Non-port des EPI, balisage manquant..."
            value={rootCauseAnalysis}
            onChange={(e) => setRootCauseAnalysis(e.target.value)}
          />

          <AppTextField
            label="Action corrective & préventive mise en place"
            placeholder="Ex: Remplacement matériel, causerie 1/4h..."
            value={correctiveActions}
            onChange={(e) => setCorrectiveActions(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton variant="outline" onClick={onClose} type="button" disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<HeartPulse className="w-4 h-4" />}
          >
            Enregistrer l'Événement HSE
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
