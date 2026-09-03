/**
 * AGB CHANTIER - Modal Matériau / Article de Stock - AXE 09
 */

import React, { useState, useEffect } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import {
  InventoryItemEntity,
  MaterialCategory,
  StockUnit,
} from "../domain/entities/inventory_entity";
import { ProjectEntity } from "../../projects/domain/entities/project_entity";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { Package, Check, DollarSign } from "lucide-react";

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  itemToEdit?: InventoryItemEntity | null;
}

const CATEGORIES: { value: MaterialCategory; label: string }[] = [
  { value: "CIMENT_LIANTS", label: "🧱 Ciment, Chaux & Liants" },
  { value: "ARMATURES_ACIER", label: "⛓️ Fers à Béton, Armatures & Treillis" },
  { value: "GRANULATS_SABLE_GRAVIER", label: "🏜️ Sable, Gravier & Tout-venant" },
  { value: "AGGLOS_BRIQUES", label: "🧱 Agglos, Hourdis & Briques" },
  { value: "BOIS_COFFRAGE", label: "🪵 Bois, Madriers & Contreplaqué" },
  { value: "PLOMBERIE_TUYAUTERIE", label: "🚰 Tuyaux PVC, Cuivre & Vannes" },
  { value: "ELECTRICITE_CABLES", label: "⚡ Câbles, Gaines & Tableaux" },
  { value: "PEINTURE_CHIMIE", label: "🎨 Peinture, Adjuvants & Étanchéité" },
  { value: "QUINCAILLERIE_OUTILLAGE", label: "🛠️ Quincaillerie, Pointes & Disques" },
];

const UNITS: { value: StockUnit; label: string }[] = [
  { value: "SAC_50KG", label: "Sac de 50 kg" },
  { value: "TONNE", label: "Tonne" },
  { value: "M3", label: "m³ (Mètre cube)" },
  { value: "UNITE", label: "Unité / Pièce" },
  { value: "BARRE_12M", label: "Barre (12m / 4m / 6m)" },
  { value: "ML", label: "Mètre Linéaire" },
  { value: "POT_20L", label: "Pot de 20L" },
  { value: "ROULEAU", label: "Rouleau" },
];

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  itemToEdit,
}) => {
  const [projectsList, setProjectsList] = useState<ProjectEntity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<MaterialCategory>("CIMENT_LIANTS");
  const [unit, setUnit] = useState<StockUnit>("SAC_50KG");
  const [currentStock, setCurrentStock] = useState<number | "">(100);
  const [minStockAlert, setMinStockAlert] = useState<number | "">(20);
  const [optimalStock, setOptimalStock] = useState<number | "">(200);
  const [unitPurchasePriceFCFA, setUnitPurchasePriceFCFA] = useState<number | "">(5000);
  const [primaryStorageLocation, setPrimaryStorageLocation] = useState("");
  const [projectId, setProjectId] = useState("");
  const [supplierName, setSupplierName] = useState("");

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
    if (itemToEdit) {
      setCode(itemToEdit.code);
      setName(itemToEdit.name);
      setCategory(itemToEdit.category);
      setUnit(itemToEdit.unit);
      setCurrentStock(itemToEdit.currentStock);
      setMinStockAlert(itemToEdit.minStockAlert);
      setOptimalStock(itemToEdit.optimalStock);
      setUnitPurchasePriceFCFA(itemToEdit.unitPurchasePriceFCFA);
      setPrimaryStorageLocation(itemToEdit.primaryStorageLocation);
      setProjectId(itemToEdit.projectId || "");
      setSupplierName(itemToEdit.supplierName || "");
    } else {
      setCode("");
      setName("");
      setCategory("CIMENT_LIANTS");
      setUnit("SAC_50KG");
      setCurrentStock(100);
      setMinStockAlert(20);
      setOptimalStock(200);
      setUnitPurchasePriceFCFA(4800);
      setPrimaryStorageLocation("Dépôt Central Vridi");
      setProjectId("");
      setSupplierName("");
    }
  }, [itemToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const selectedPrj = projectsList.find((p) => p.id === projectId);
      const payload = {
        ...(itemToEdit ? itemToEdit : {}),
        code: code.trim() || `MAT-${Math.floor(Math.random() * 900 + 100)}`,
        name: name.trim(),
        category,
        unit,
        currentStock: Number(currentStock) || 0,
        minStockAlert: Number(minStockAlert) || 0,
        optimalStock: Number(optimalStock) || 0,
        unitPurchasePriceFCFA: Number(unitPurchasePriceFCFA) || 0,
        primaryStorageLocation: primaryStorageLocation.trim() || "Stock Chantier Principal",
        projectId: projectId || undefined,
        projectName: selectedPrj?.name || undefined,
        supplierName: supplierName.trim() || undefined,
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
      title={itemToEdit ? `Modifier l'Article : ${itemToEdit.name}` : "Ajouter un Matériau au Stock BTP"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AppTextField
            label="Code Article"
            placeholder="Ex: MAT-CIM-01"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            helperText="Auto-généré si vide"
          />

          <div className="sm:col-span-2">
            <AppTextField
              label="Désignation du Matériau *"
              placeholder="Ex: Ciment CPJ 42.5 (Sacs 50kg)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AppSelect
            label="Catégorie *"
            value={category}
            onChange={(e) => setCategory(e.target.value as MaterialCategory)}
            options={CATEGORIES}
          />

          <AppSelect
            label="Unité de Conditionnement *"
            value={unit}
            onChange={(e) => setUnit(e.target.value as StockUnit)}
            options={UNITS}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AppTextField
            label="Stock Actuel *"
            type="number"
            value={currentStock}
            onChange={(e) => setCurrentStock(e.target.value === "" ? "" : Number(e.target.value))}
            required
          />

          <AppTextField
            label="Seuil d'Alerte Minimum *"
            type="number"
            value={minStockAlert}
            onChange={(e) => setMinStockAlert(e.target.value === "" ? "" : Number(e.target.value))}
            required
          />

          <AppTextField
            label="Prix Unitaire Achat (FCFA) *"
            type="number"
            value={unitPurchasePriceFCFA}
            onChange={(e) => setUnitPurchasePriceFCFA(e.target.value === "" ? "" : Number(e.target.value))}
            leftIcon={<DollarSign className="w-4 h-4 text-emerald-600" />}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AppTextField
            label="Emplacement de Stockage"
            placeholder="Ex: Hangar Central ou Chantier Horizon"
            value={primaryStorageLocation}
            onChange={(e) => setPrimaryStorageLocation(e.target.value)}
          />

          <AppSelect
            label="Affectation Chantier (Optionnel)"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            options={[
              { value: "", label: "-- Stock Central / Multi-Chantiers --" },
              ...projectsList.map((p) => ({ value: p.id, label: `${p.code} - ${p.name}` })),
            ]}
          />
        </div>

        <AppTextField
          label="Fournisseur Référencé"
          placeholder="Ex: SCA Ciments d'Afrique, SIMAM Ferraille, Batimat..."
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton type="submit" variant="primary" isLoading={isSubmitting} leftIcon={<Check className="w-4 h-4" />}>
            {itemToEdit ? "Enregistrer" : "Créer le Matériau"}
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
