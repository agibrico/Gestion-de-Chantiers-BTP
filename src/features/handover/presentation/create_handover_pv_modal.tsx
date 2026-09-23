/**
 * AGB CHANTIER - Modal de Création de PV de Réception Provisoire / Définitive - AXE 20
 */

import React, { useState } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { HandoverPVEntity, HandoverType, HandoverVerdict } from "../domain/entities/handover_entity";
import { Award, CheckCircle2, ShieldCheck } from "lucide-react";

interface CreateHandoverPvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pv: Omit<HandoverPVEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">) => Promise<void>;
  defaultProjectId?: string;
  defaultProjectName?: string;
}

const TYPE_OPTIONS = [
  { value: "RECEPTION_PROVISOIRE_AVEC_RESERVES", label: "Réception Provisoire avec Réserves (Départ GPA 1 an)" },
  { value: "RECEPTION_PROVISOIRE_SANS_RESERVE", label: "Réception Provisoire Sans Réserve" },
  { value: "RECEPTION_DEFINITIVE_FIN_GPA", label: "Réception Définitive (Clôture GPA & Mainlevée Caution)" },
  { value: "LIVRAISON_CLIENT_ACQUEREUR", label: "Livraison Client / Clés Acquéreur" },
];

const VERDICT_OPTIONS = [
  { value: "PRONONCEE_AVEC_RESERVES", label: "Prononcée avec réserves (Délai d'exécution fixé)" },
  { value: "PRONONCEE_SANS_RESERVE", label: "Prononcée sans réserve (Parfaite conformité)" },
  { value: "LEVEE_TOTALE_GPA_VALIDEE", label: "Levée totale GPA validée (Mainlevée de caution accordée)" },
  { value: "AJOURNEE_NON_CONFORME", label: "Ajournée (Travaux inachevés ou malfaçons substantielles)" },
];

export const CreateHandoverPvModal: React.FC<CreateHandoverPvModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultProjectId = "proj-001",
  defaultProjectName = "Tour Résidentielle Ivoire - Cocody Riviera",
}) => {
  const [title, setTitle] = useState("");
  const [handoverType, setHandoverType] = useState<HandoverType>("RECEPTION_PROVISOIRE_AVEC_RESERVES");
  const [verdict, setVerdict] = useState<HandoverVerdict>("PRONONCEE_AVEC_RESERVES");
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split("T")[0]);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split("T")[0]);
  const [warrantyEndDate, setWarrantyEndDate] = useState(
    new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split("T")[0]
  );
  const [retentionAmountFCFA, setRetentionAmountFCFA] = useState<number>(42500000);
  const [observationsMOA, setObservationsMOA] = useState("");
  const [observationsAGB, setObservationsAGB] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const randomNum = Math.floor(100 + Math.random() * 900);
      await onSave({
        projectId: defaultProjectId,
        projectName: defaultProjectName,
        pvNumber: `PV-REC-${randomNum}`,
        handoverType,
        title: title.trim(),
        visitDate,
        effectiveDate,
        warrantyEndDate,
        verdict,
        totalReservationsCount: 12,
        resolvedReservationsCount: verdict === "PRONONCEE_SANS_RESERVE" || verdict === "LEVEE_TOTALE_GPA_VALIDEE" ? 12 : 8,
        retentionGuaranteePercent: 5,
        retentionAmountFCFA: Number(retentionAmountFCFA),
        isFinalReleaseGranted: verdict === "LEVEE_TOTALE_GPA_VALIDEE",
        signatories: [
          { role: "MAITRE_OUVRAGE_MOA", name: "Représentant MOA", organization: "Maître d'Ouvrage", isSigned: true, signedDate: visitDate },
          { role: "MAITRE_OEUVRE_MOE", name: "Architecte Chef", organization: "Cabinet MOE", isSigned: true, signedDate: visitDate },
          { role: "ENTREPRISE_AGB", name: "Kouassi Jean-Marc", organization: "AGB BTP", isSigned: true, signedDate: visitDate },
        ],
        observationsMOA: observationsMOA.trim() || undefined,
        observationsAGB: observationsAGB.trim() || undefined,
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
      title="Établir un Procès-Verbal de Réception"
      subtitle="Réception provisoire, constat d'achèvement des travaux, garantie de parfait achèvement (GPA) et mainlevée"
      icon={<Award className="w-5 h-5 text-orange-600" />}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AppTextField
          label="Titre du Procès-Verbal"
          placeholder="Ex: Procès-Verbal de Réception Provisoire - Bâtiment Principal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppSelect
            label="Type de Réception"
            options={TYPE_OPTIONS}
            value={handoverType}
            onChange={(e) => setHandoverType(e.target.value as HandoverType)}
            required
          />

          <AppSelect
            label="Décision / Verdict contradictoire"
            options={VERDICT_OPTIONS}
            value={verdict}
            onChange={(e) => setVerdict(e.target.value as HandoverVerdict)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AppTextField
            label="Date de la visite"
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            required
          />

          <AppTextField
            label="Date d'effet juridique"
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            required
          />

          <AppTextField
            label="Échéance fin GPA (1 an)"
            type="date"
            value={warrantyEndDate}
            onChange={(e) => setWarrantyEndDate(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppTextField
            label="Montant retenue de garantie 5% (FCFA)"
            type="number"
            value={retentionAmountFCFA.toString()}
            onChange={(e) => setRetentionAmountFCFA(Number(e.target.value))}
            required
          />

          <div className="p-3 bg-orange-50/50 dark:bg-slate-800/50 rounded-xl border border-orange-200 dark:border-slate-800 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-orange-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 dark:text-white">Garantie Décennale & Biennale</span>
              <p className="text-slate-500 mt-0.5">La réception active le point de départ légal des garanties d'assurance constructeur.</p>
            </div>
          </div>
        </div>

        <AppTextField
          label="Observations du Maître d'Ouvrage (MOA)"
          placeholder="Conditions particulières de levée, accès aux locaux..."
          value={observationsMOA}
          onChange={(e) => setObservationsMOA(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton variant="outline" onClick={onClose} type="button" disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Award className="w-4 h-4" />}
          >
            Enregistrer le PV de Réception
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
