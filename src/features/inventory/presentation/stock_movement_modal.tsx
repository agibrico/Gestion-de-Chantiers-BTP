/**
 * AGB CHANTIER - Modal de Mouvement de Stock (Bon d'Entrée / Bon de Sortie) - AXE 09
 */

import React, { useState, useEffect } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import {
  InventoryItemEntity,
  MovementType,
} from "../domain/entities/inventory_entity";
import { ProjectEntity } from "../../projects/domain/entities/project_entity";
import { TeamEntity } from "../../teams/domain/entities/team_entity";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { ArrowDownLeft, ArrowUpRight, Check, FileText } from "lucide-react";

interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  items: InventoryItemEntity[];
  selectedItem?: InventoryItemEntity | null;
}

const MOVEMENT_TYPES: { value: MovementType; label: string }[] = [
  { value: "ENTREE_LIVRAISON", label: "📥 Entrée / Réception Bon de Livraison (BL)" },
  { value: "SORTIE_CONSOMMATION_CHANTIER", label: "📤 Sortie Chantier / Bon de Sortie (BS)" },
  { value: "TRANSFERT_INTER_CHANTIER", label: "🔄 Transfert Inter-Chantiers" },
  { value: "AJUSTEMENT_INVENTAIRE", label: "⚖️ Ajustement Inventaire Physique" },
  { value: "PERTE_CASSE", label: "⚠️ Déchet / Perte / Casse" },
];

export const StockMovementModal: React.FC<StockMovementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  items,
  selectedItem,
}) => {
  const [projectsList, setProjectsList] = useState<ProjectEntity[]>([]);
  const [teamsList, setTeamsList] = useState<TeamEntity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [itemId, setItemId] = useState("");
  const [movementType, setMovementType] = useState<MovementType>("SORTIE_CONSOMMATION_CHANTIER");
  const [quantity, setQuantity] = useState<number | "">(10);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [referenceDocumentNumber, setReferenceDocumentNumber] = useState("");
  const [targetProjectId, setTargetProjectId] = useState("");
  const [recipientTeamName, setRecipientTeamName] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [notes, setNotes] = useState("");

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
        console.error("Erreur chargement", e);
      }
    };
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedItem) {
      setItemId(selectedItem.id);
    } else if (items.length > 0) {
      setItemId(items[0].id);
    }
    setDate(new Date().toISOString().split("T")[0]);
    setQuantity(10);
    setReferenceDocumentNumber("");
    setNotes("");
  }, [selectedItem, items, isOpen]);

  const activeItem = items.find((i) => i.id === itemId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem || !quantity) return;

    setIsSubmitting(true);
    try {
      const selectedPrj = projectsList.find((p) => p.id === targetProjectId);
      const q = Number(quantity);
      const uPrice = activeItem.unitPurchasePriceFCFA;
      const total = q * uPrice;

      const payload = {
        itemId: activeItem.id,
        itemName: activeItem.name,
        itemCode: activeItem.code,
        movementType,
        quantity: q,
        unit: activeItem.unit,
        unitPriceFCFA: uPrice,
        totalPriceFCFA: total,
        date,
        targetProjectId: targetProjectId || undefined,
        targetProjectName: selectedPrj?.name || undefined,
        recipientTeamName: recipientTeamName || undefined,
        requestedBy: requestedBy.trim() || undefined,
        referenceDocumentNumber: referenceDocumentNumber.trim() || (movementType === "ENTREE_LIVRAISON" ? "BL-001" : "BS-001"),
        notes: notes.trim() || undefined,
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
      title="Enregistrer un Mouvement de Stock BTP"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AppSelect
          label="Type de Mouvement *"
          value={movementType}
          onChange={(e) => setMovementType(e.target.value as MovementType)}
          options={MOVEMENT_TYPES}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AppSelect
            label="Matériau Concerné *"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            options={items.map((i) => ({
              value: i.id,
              label: `${i.code} - ${i.name} (Stock: ${i.currentStock} ${i.unit})`,
            }))}
          />

          <AppTextField
            label="Date du Mouvement *"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AppTextField
            label={`Quantité à Mouvementer (${activeItem?.unit || "Unités"}) *`}
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
            required
            helperText={
              activeItem
                ? `Stock avant mouvement : ${activeItem.currentStock} ${activeItem.unit}`
                : undefined
            }
          />

          <AppTextField
            label="N° Pièce Justificative (BL / Bon de Sortie)"
            placeholder="Ex: BL-2026-089 ou BS-042"
            value={referenceDocumentNumber}
            onChange={(e) => setReferenceDocumentNumber(e.target.value)}
          />
        </div>

        {movementType === "SORTIE_CONSOMMATION_CHANTIER" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <AppSelect
              label="Chantier Destinataire *"
              value={targetProjectId}
              onChange={(e) => setTargetProjectId(e.target.value)}
              options={projectsList.map((p) => ({ value: p.id, label: `${p.code} - ${p.name}` }))}
            />

            <AppSelect
              label="Équipe BTP Réceptrice"
              value={recipientTeamName}
              onChange={(e) => setRecipientTeamName(e.target.value)}
              options={[
                { value: "", label: "-- Sélectionner l'équipe --" },
                ...teamsList.map((t) => ({ value: t.name, label: t.name })),
              ]}
            />
          </div>
        )}

        <AppTextField
          label="Demandeur / Réceptionnaire"
          placeholder="Ex: Chef d'équipe Traoré Souleymane"
          value={requestedBy}
          onChange={(e) => setRequestedBy(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton type="submit" variant="primary" isLoading={isSubmitting} leftIcon={<Check className="w-4 h-4" />}>
            Valider le Mouvement
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
