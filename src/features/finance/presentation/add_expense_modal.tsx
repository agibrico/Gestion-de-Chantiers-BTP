/**
 * AGB CHANTIER - Modal d'Enregistrement de Dépense / Décaissement - AXE 11
 */

import React, { useState, useEffect } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { ExpenseEntity, ExpenseCategory, PaymentMethod } from "../domain/entities/finance_entity";
import { ProjectEntity } from "../../projects/domain/entities/project_entity";
import { ProjectScope } from "../../workspace/project_scope";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { Coins, Receipt, AlertCircle } from "lucide-react";

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

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultProjectId = "proj-001",
  defaultProjectName = "Chantier Actif",
}) => {
  const activeScopeId = ProjectScope.id;
  const [projectsList, setProjectsList] = useState<ProjectEntity[]>([]);
  const [projectId, setProjectId] = useState<string>(activeScopeId || defaultProjectId);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("MATERIAUX");
  const [amountFCFA, setAmountFCFA] = useState<number | "">(150000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ESPECES_CAISSE");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [beneficiary, setBeneficiary] = useState("");
  const [invoiceReference, setInvoiceReference] = useState("");
  const [lot, setLot] = useState("Gros Œuvre");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const prjs = await IdbAdapter.getAll<ProjectEntity>(IdbAdapter.STORES.PROJECTS);
        setProjectsList(prjs);
        const currentActive = ProjectScope.id;
        if (currentActive) {
          setProjectId(currentActive);
        } else if (prjs.length > 0) {
          setProjectId(prjs[0].id);
        }
      } catch (e) {
        console.warn("Erreur chargement projets pour la dépense:", e);
      }
    };
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numericAmount = Number(amountFCFA) || 0;

    if (numericAmount <= 0) {
      setErrorMessage("Veuillez saisir un montant valide et positif en FCFA (ex: 150 000 FCFA).");
      return;
    }

    // Toujours s'assurer d'utiliser le chantier actif de ProjectScope si présent
    const targetProjId = ProjectScope.id || projectId || defaultProjectId;

    // Déduire le nom du projet sélectionné
    const selectedProject = projectsList.find((p) => p.id === targetProjId);
    const targetProjName = selectedProject?.name || defaultProjectName;

    // Si l'objet de la dépense est vide, déduire automatiquement un libellé
    const categoryLabel = CATEGORY_OPTIONS.find((c) => c.value === category)?.label || "Dépense";
    const finalTitle = title.trim() || `${categoryLabel}${beneficiary.trim() ? " - " + beneficiary.trim() : ""}`;
    const finalBeneficiary = beneficiary.trim() || "Fournisseur / Caisse Chantier";

    setIsSubmitting(true);
    try {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      await onSave({
        projectId: targetProjId,
        projectName: targetProjName,
        expenseNumber: `DEP-2026-${randomNum}`,
        title: finalTitle,
        category,
        amountFCFA: numericAmount,
        paymentMethod,
        status: "APPROUVE",
        expenseDate: expenseDate || new Date().toISOString().split("T")[0],
        beneficiary: finalBeneficiary,
        invoiceReference: invoiceReference.trim() || undefined,
        lot: lot.trim() || undefined,
        comments: comments.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur lors de l'enregistrement de la dépense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectOptions = projectsList.length > 0
    ? projectsList.map((p) => ({ value: p.id, label: `${p.code ? p.code + " - " : ""}${p.name}` }))
    : [{ value: ProjectScope.id || defaultProjectId, label: defaultProjectName }];

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
        {errorMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppSelect
            label="Chantier de destination"
            options={projectOptions}
            value={ProjectScope.id || projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            disabled={!!ProjectScope.id}
            helperText={ProjectScope.id ? "Chantier actif verrouillé" : undefined}
          />
          <AppSelect
            label="Catégorie budgétaire"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            required
          />
        </div>

        <AppTextField
          label="Libellé / Objet de la dépense"
          placeholder="Ex: Achat sacs de ciment CPJ 42.5 (laissé vide = généré automatiquement)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          helperText="Ex: Achat ciment, Acompte ferrailleur... (Optionnel)"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppTextField
            label="Montant (FCFA) *"
            type="number"
            value={amountFCFA === "" ? "" : amountFCFA.toString()}
            onChange={(e) => setAmountFCFA(e.target.value === "" ? "" : Number(e.target.value))}
            required
            helperText="Montant net TTC décaissé en FCFA"
          />

          <AppSelect
            label="Mode de règlement"
            options={PAYMENT_OPTIONS}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppTextField
            label="Bénéficiaire (Fournisseur, Équipe, Sous-traitant)"
            placeholder="Ex: CIMIVOIRE ou Équipe Coffrage Yéo"
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
          />

          <AppTextField
            label="Réf. Facture / Reçu / Bon de caisse"
            placeholder="Ex: FAC-2026-992 ou BON-041"
            value={invoiceReference}
            onChange={(e) => setInvoiceReference(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppTextField
            label="Date de la dépense"
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            required
          />

          <AppTextField
            label="Lot ou Destination travaux"
            placeholder="Ex: Gros Œuvre, CFO/CFA, Second Œuvre"
            value={lot}
            onChange={(e) => setLot(e.target.value)}
          />
        </div>

        <AppTextField
          label="Observations & Justificatifs"
          placeholder="Détails complémentaires, validation spéciale..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
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
