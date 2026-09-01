/**
 * AGB CHANTIER - Modal de Signalement d'une Réserve OPR - AXE 17
 */

import React, { useState } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { ReservationEntity, ReservationSeverity } from "../domain/entities/reservation_entity";
import { FileCheck, AlertCircle } from "lucide-react";

interface AddReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (res: Omit<ReservationEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">) => Promise<void>;
  defaultProjectId?: string;
  defaultProjectName?: string;
}

const SEVERITY_OPTIONS = [
  { value: "MINEURE", label: "Mineure / Retouche légère" },
  { value: "MAJEURE", label: "Majeure / Non-conformité fonctionnelle" },
  { value: "BLOQUANTE_CRITIQUE", label: "Bloquante / Refus de réception" },
  { value: "FINITIONS_ESTHETIQUE", label: "Esthétique / Finition peinture" },
];

const LOT_OPTIONS地下 = [
  { value: "Gros Œuvre & Maçonnerie", label: "Gros Œuvre & Maçonnerie" },
  { value: "Étanchéité & Toiture", label: "Étanchéité & Toiture" },
  { value: "Menuiserie Aluminium & Vitrerie", label: "Menuiserie Aluminium & Vitrerie" },
  { value: "Électricité & Courants Forts", label: "Électricité & Courants Forts" },
  { value: "Plomberie & Sanitaire", label: "Plomberie & Sanitaire" },
  { value: "Peinture & Revêtements", label: "Peinture & Revêtements" },
  { value: "Carrelage & Faux-plafond", label: "Carrelage & Faux-plafond" },
];

export const AddReservationModal: React.FC<AddReservationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultProjectId = "proj-001",
  defaultProjectName = "Tour Résidentielle Ivoire - Cocody Riviera",
}) => {
  const [title, setTitle] = useState("");
  const [lotName, setLotName] = useState("Peinture & Revêtements");
  const [location, setLocation] = useState("Bâtiment A - Appartement 204");
  const [severity, setSeverity] = useState<ReservationSeverity>("MINEURE");
  const [companyResponsible, setCompanyResponsible] = useState("Ivoire Peinture SAS");
  const [description, setDescription] = useState("");
  const [deadlineDate, setDeadlineDate] = useState(
    new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split("T")[0]
  );
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
        reservationNumber: `RES-2026-${randomNum}`,
        title: title.trim(),
        lotName,
        location: location.trim(),
        severity,
        status: "OUVERTE",
        companyResponsible: companyResponsible.trim(),
        description: description.trim(),
        reportedDate: new Date().toISOString().split("T")[0],
        deadlineDate,
        authorName: "Kouassi Jean-Marc (DT)",
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
      title="Notifier une Réserve / Non-Conformité (OPR)"
      subtitle="Opérations Préalables à la Réception, constat de malfaçon et délai d'exécution imposé"
      icon={<FileCheck className="w-5 h-5 text-orange-600" />}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AppTextField
          label="Intitulé de la réserve"
          placeholder="Ex: Éclat de peinture sous plinthe ou Raccordement siphon fuyard"
          value={title}
          onChange={(val) => setTitle(val)}
          fullWidth
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppSelect
            label="Corps d'état / Lot concerné"
            options={LOT_OPTIONS地下}
            value={lotName}
            onChange={(val) => setLotName(val)}
            fullWidth
            required
          />

          <AppSelect
            label="Degré de sévérité"
            options={SEVERITY_OPTIONS}
            value={severity}
            onChange={(val) => setSeverity(val as ReservationSeverity)}
            fullWidth
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppTextField
            label="Localisation précise"
            placeholder="Ex: Bâtiment A - Étage 3 - Logement 302"
            value={location}
            onChange={(val) => setLocation(val)}
            fullWidth
            required
          />

          <AppTextField
            label="Entreprise / Sous-traitant responsable"
            placeholder="Ex: Ivoire Plomberie Pro SAS"
            value={companyResponsible}
            onChange={(val) => setCompanyResponsible(val)}
            fullWidth
            required
          />
        </div>

        <AppTextField
          label="Description précise de l'anomalie constatée"
          placeholder="Détaillez la non-conformité constatée lors de la visite OPR..."
          value={description}
          onChange={(val) => setDescription(val)}
          fullWidth
          required
        />

        <AppTextField
          label="Date limite contractuelle de levée"
          type="date"
          value={deadlineDate}
          onChange={(val) => setDeadlineDate(val)}
          fullWidth
          required
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton variant="outline" onClick={onClose} type="button" disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<AlertCircle className="w-4 h-4" />}
          >
            Enregistrer la Réserve
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
