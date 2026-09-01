/**
 * AGB CHANTIER - Modal d'Enregistrement de Dépense / Décaissement - AXE 11
 */

import React, { useState } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { ExpenseEntity, ExpenseCategory, PaymentMethod } from "../domain/entities/finance_entity";
import { Coins, Receipt, CreditCard, Building } from "lucide-react";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<ExpenseEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">) => Promise<void>;
  defaultProjectId?: string;
  defaultProjectName?: string;
}

const CATEGORY_OPTIONS = [
  { value: "MATERIAUX", label: "Matériaux & Fournitures" },
  { value: "MAIN_DOEUVRE", label: "Main d'œuvre & Paie" },
  { value: "SOUS_TRAITANCE", label: "Sous-traitance spécialisée" },
  { value: "CARBURANT_ENGINS", label: "Carburant & Énergie engins" },
  { value: "LOCATION_MATERIEL", label: "Location matériel & levage" },
  { value: "TRANSPORT_LOGISTIQUE", label: "Transport & Logistique" },
  { value: "CAISSE_MENUE_DEPENSE", label: "Caisse menue dépense" },
  { value: "HONORAIRES_CONTROLE", label: "Honoraires & Contrôle technique" },
  { value: "SECURITE_HSE", label: "Sécurité & Équipements EPI" },
  { value: "AUTRES", label: "Autres charges" },
];

const PAYMENT_OPTIONS = [
  { value: "VIREMENT_BANCAIRE", label: "Virement bancaire" },
  { value: "CHEQUE", label: "Chèque d'entreprise" },
  { value: "ESPECES_CAISSE", label: "Espèces (Caisse Chantier)" },
  { value: "ORANGE_MONEY", label: "Orange Money" },
  { value: "WAVE", label: "Wave Mobile Money" },
  { value: "MTN_MOMO", label: "MTN MoMo" },
];

const PROJECT_OPTIONS = [
  { value: "proj-001", label: "Tour Résidentielle Ivoire - Cocody Riviera" },
  { value: "proj-002", label: "Complexe Commercial & Bureaux - Plateau" },
  { value: "proj-003", label: "Hangar Logistique & Stockage - San-Pédro" },
  { value: "proj-004", label: "Résidence Privée Les Manguiers - Assinie" },
];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultProjectId = "proj-001",
  defaultProjectName = "Tour Résidentielle Ivoire - Cocody Riviera",
}) => {
  const [projectId, setProjectId] = useState(defaultProjectId);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("MATERIAUX");
  const [amountFCFA, setAmountFCFA] = useState<number>(150000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ESPECES_CAISSE");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [beneficiary, setBeneficiary] = useState("");
  const [invoiceReference, setInvoiceReference] = useState("");
  const [lot, setLot] = useState("Gros Œuvre");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amountFCFA <= 0 || !beneficiary.trim()) return;

    setIsSubmitting(true);
    try {
      const selectedProject = PROJECT_OPTIONS.find((p) => p.value === projectId);
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      await onSave({
        projectId,
        projectName: selectedProject ? selectedProject.label : defaultProjectName,
        expenseNumber: `DEP-2026-${randomNum}`,
        title: title.trim(),
        category,
        amountFCFA: Number(amountFCFA),
        paymentMethod,
        status: "APPROUVE",
        expenseDate,
        beneficiary: beneficiary.trim(),
        invoiceReference: invoiceReference.trim() || undefined,
        lot: lot.trim() || undefined,
        comments: comments.trim() || undefined,
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
      title="Engager une Dépense / Décaissement"
      subtitle="Enregistrez une facture, un paiement de main-d'œuvre ou un achat pour le chantier"
      icon={<Coins className="w-5 h-5 text-orange-600" />}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppSelect
            label="Chantier de destination"
            options={PROJECT_OPTIONS}
            value={projectId}
            onChange={(val) => setProjectId(val)}
            fullWidth
            required
          />
          <AppSelect
            label="Catégorie budgétaire"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(val) => setCategory(val as ExpenseCategory)}
            fullWidth
            required
          />
        </div>

        <AppTextField
          label="Libellé / Objet de la dépense"
          placeholder="Ex: Achat sacs de ciment CPJ 42.5 ou Acompte ferraillage"
          value={title}
          onChange={(val) => setTitle(val)}
          fullWidth
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppTextField
            label="Montant (FCFA)"
            type="number"
            value={amountFCFA.toString()}
            onChange={(val) => setAmountFCFA(Number(val))}
            fullWidth
            required
            helperText="Montant net TTC décaissé en FCFA"
          />

          <AppSelect
            label="Mode de règlement"
            options={PAYMENT_OPTIONS}
            value={paymentMethod}
            onChange={(val) => setPaymentMethod(val as PaymentMethod)}
            fullWidth
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppTextField
            label="Bénéficiaire (Fournisseur, Équipe, Sous-traitant)"
            placeholder="Ex: CIMIVOIRE ou Équipe Coffrage Yéo"
            value={beneficiary}
            onChange={(val) => setBeneficiary(val)}
            fullWidth
            required
          />

          <AppTextField
            label="Réf. Facture / Reçu / Bon de caisse"
            placeholder="Ex: FAC-2026-992 ou BON-041"
            value={invoiceReference}
            onChange={(val) => setInvoiceReference(val)}
            fullWidth
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppTextField
            label="Date de la dépense"
            type="date"
            value={expenseDate}
            onChange={(val) => setExpenseDate(val)}
            fullWidth
            required
          />

          <AppTextField
            label="Lot ou Destination travaux"
            placeholder="Ex: Gros Œuvre, CFO/CFA, Second Œuvre"
            value={lot}
            onChange={(val) => setLot(val)}
            fullWidth
          />
        </div>

        <AppTextField
          label="Observations & Justificatifs"
          placeholder="Détails complémentaires, validation spéciale..."
          value={comments}
          onChange={(val) => setComments(val)}
          fullWidth
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton variant="outline" onClick={onClose} type="button" disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Receipt className="w-4 h-4" />}
          >
            Enregistrer & Décaisser
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
