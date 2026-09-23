/**
 * AGB CHANTIER - Modal d'Enregistrement de Contrôle Qualité - AXE 15
 */

import React, { useState } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { QualityInspectionEntity, InspectionType, QualityStatus } from "../domain/entities/quality_entity";
import { FileCheck, CheckCircle2, ShieldAlert } from "lucide-react";

interface NewQualityInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (inspection: Omit<QualityInspectionEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">) => Promise<void>;
  defaultProjectId?: string;
  defaultProjectName?: string;
}

const TYPE_OPTIONS = [
  { value: "ARMATURES_FERRAILLAGE", label: "Ferraillage & Armatures Béton Armé" },
  { value: "COULAGE_BETON_EPROUVETTES", label: "Essais Béton (Éprouvettes 7j / 28j)" },
  { value: "ETANCHEITE_TERRASSE", label: "Étanchéité toiture & Mise en eau" },
  { value: "NIVELLEMENT_ALTIMETRIE", label: "Implantation & Altimétrie Géomètre" },
  { value: "RESEAUX_EP_EU_EV", label: "Canalisations & Évacuations" },
  { value: "PLOMBERIE_PRESSION", label: "Épreuves de pression Plomberie" },
  { value: "ELECTRICITE_ISOLEMENT", label: "Essais d'isolement & Mesure terre" },
  { value: "RECEPTION_LOT_FINITIONS", label: "Contrôle Finitions & Menuiserie" },
];

const STATUS_OPTIONS = [
  { value: "CONFORME", label: "Conforme (Bon pour suite des travaux)" },
  { value: "AVEC_RESERVES", label: "Conforme avec réserves mineures" },
  { value: "NON_CONFORME", label: "Non conforme (Refus de coulage / Travaux à reprendre)" },
  { value: "EN_ATTENTE_RESULTATS", label: "En attente résultats laboratoire (7j/28j)" },
];

export const NewQualityInspectionModal: React.FC<NewQualityInspectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultProjectId = "proj-001",
  defaultProjectName = "Tour Résidentielle Ivoire - Cocody Riviera",
}) => {
  const [title, setTitle] = useState("");
  const [inspectionType, setInspectionType] = useState<InspectionType>("ARMATURES_FERRAILLAGE");
  const [locationDetails, setLocationDetails] = useState("Bâtiment A - Niveau R+2");
  const [inspectorName, setInspectorName] = useState("M. Sylvain Kouamé");
  const [inspectorOrg, setInspectorOrg] = useState("SOCOTEC Côte d'Ivoire");
  const [status, setStatus] = useState<QualityStatus>("CONFORME");
  const [observations, setObservations] = useState("");
  const [actionRequired, setActionRequired] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      await onSave({
        projectId: defaultProjectId,
        projectName: defaultProjectName,
        inspectionNumber: `CQ-2026-${randomNum}`,
        inspectionType,
        title: title.trim(),
        locationDetails: locationDetails.trim(),
        inspectorName: inspectorName.trim(),
        inspectorOrganization: inspectorOrg.trim(),
        inspectionDate: new Date().toISOString().split("T")[0],
        status,
        criteriaChecked: [
          { criterionName: "Conformité géométrique & dimensions", isOk: true },
          { criterionName: "Respect des spécifications techniques du CCTP", isOk: status !== "NON_CONFORME" },
        ],
        observations: observations.trim() || undefined,
        actionRequiredIfNonCompliant: actionRequired.trim() || undefined,
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
      title="Créer une Fiche de Contrôle Qualité"
      subtitle="Procès-verbal de réception de support, ferraillage, étanchéité ou essai d'écrasement"
      icon={<FileCheck className="w-5 h-5 text-orange-600" />}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AppTextField
          label="Titre du contrôle / Ouvrage inspecté"
          placeholder="Ex: Réception armatures poteaux P1 à P8 ou Éprouvettes béton R+1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppSelect
            label="Type de contrôle"
            options={TYPE_OPTIONS}
            value={inspectionType}
            onChange={(e) => setInspectionType(e.target.value as InspectionType)}
            required
          />

          <AppTextField
            label="Localisation précise / Repérage plan"
            placeholder="Ex: Poteaux P1-P4 Bâtiment A R+2"
            value={locationDetails}
            onChange={(e) => setLocationDetails(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppTextField
            label="Nom de l'inspecteur / Contrôleur"
            value={inspectorName}
            onChange={(e) => setInspectorName(e.target.value)}
            required
          />

          <AppTextField
            label="Organisme de contrôle"
            placeholder="Ex: SOCOTEC, LBTP, Bureau d'Études"
            value={inspectorOrg}
            onChange={(e) => setInspectorOrg(e.target.value)}
            required
          />
        </div>

        <AppSelect
          label="Verdict / Statut de conformité"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => setStatus(e.target.value as QualityStatus)}
          required
        />

        <AppTextField
          label="Observations & Détails techniques relevés"
          placeholder="Enrobage mesuré, tolérance altimétrique..."
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
        />

        {status === "NON_CONFORME" && (
          <AppTextField
            label="Action corrective obligatoire avant autorisation"
            placeholder="Détail des reprises exigées..."
            value={actionRequired}
            onChange={(e) => setActionRequired(e.target.value)}
            required
          />
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton variant="outline" onClick={onClose} type="button" disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<FileCheck className="w-4 h-4" />}
          >
            Enregistrer le PV de Contrôle
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
