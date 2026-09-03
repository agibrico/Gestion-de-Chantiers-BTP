/**
 * AGB CHANTIER - Modal d'Ajout d'un Engin / Matériel - AXE 12
 */

import React, { useState } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { EquipmentEntity, EquipmentCategory, FuelType, EquipmentStatus } from "../domain/entities/equipment_entity";
import { Wrench, HardHat } from "lucide-react";

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: Omit<EquipmentEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">) => Promise<void>;
}

const CATEGORY_OPTIONS = [
  { value: "TERRASSEMENT", label: "Terrassement (Pelle, Bulldozer, Chargeuse)" },
  { value: "LEVAGE_MANUTENTION", label: "Levage & Manutention (Grue, Chariot, Treuil)" },
  { value: "BETON_MALAXAGE", label: "Béton & Malaxage (Bétonnière, Toupie, Pompe)" },
  { value: "ENERGIE_COMPRESSEUR", label: "Énergie & Compresseurs (Groupe électrogène)" },
  { value: "COMPACTAGE_ROUTIER", label: "Compactage & VRD (Rouleau, Plaque)" },
  { value: "VEHICULE_LIAISON", label: "Véhicule de liaison / Pick-up" },
  { value: "PETIT_MATERIEL_ELECTROPORTATIF", label: "Petit matériel électroportatif" },
];

const FUEL_OPTIONS = [
  { value: "DIESEL", label: "Diesel / Gazole" },
  { value: "ESSENCE", label: "Super / Essence" },
  { value: "ELECTRIQUE", label: "Électrique / Réseau" },
  { value: "HYBRIDE", label: "Hybride" },
  { value: "MANUEL", label: "Manuel / Non motorisé" },
];

const PROJECT_OPTIONS = [
  { value: "", label: "Aucun chantier (Parc Central Vridi)" },
  { value: "proj-001", label: "Tour Résidentielle Ivoire - Cocody Riviera" },
  { value: "proj-002", label: "Complexe Commercial & Bureaux - Plateau" },
  { value: "proj-003", label: "Hangar Logistique & Stockage - San-Pédro" },
];

export const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({ isOpen, onClose, onSave }) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<EquipmentCategory>("TERRASSEMENT");
  const [brand, setBrand] = useState("Caterpillar");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [fuelType, setFuelType] = useState<FuelType>("DIESEL");
  const [hourMeterCurrent, setHourMeterCurrent] = useState<number>(120);
  const [fuelConsumption, setFuelConsumption] = useState<number>(15);
  const [dailyCostRateFCFA, setDailyCostRateFCFA] = useState<number>(150000);
  const [projectId, setProjectId] = useState<string>("proj-001");
  const [assignedOperator, setAssignedOperator] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim()) return;

    setIsSubmitting(true);
    try {
      const selectedProj = PROJECT_OPTIONS.find((p) => p.value === projectId);
      const generatedCode = code.trim() || `ENG-${brand.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
      const status: EquipmentStatus = projectId ? "EN_SERVICE_CHANTIER" : "DISPONIBLE_PARC";

      await onSave({
        code: generatedCode,
        name: name.trim(),
        category,
        brand: brand.trim(),
        model: model.trim() || "Modèle Standard",
        serialNumber: serialNumber.trim() || undefined,
        status,
        currentProjectId: projectId || undefined,
        currentProjectName: selectedProj && projectId ? selectedProj.label : undefined,
        assignedOperator: assignedOperator.trim() || undefined,
        fuelType,
        hourMeterCurrent: Number(hourMeterCurrent),
        fuelConsumptionAvgLitrePerHour: Number(fuelConsumption),
        dailyCostRateFCFA: Number(dailyCostRateFCFA),
        maintenanceHistory: [],
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
      title="Ajouter un Engin / Équipement au Parc"
      subtitle="Fiche technique, immatriculation, compteur horaire et assignation chantier"
      icon={<Wrench className="w-5 h-5 text-orange-600" />}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppTextField
            label="Nom complet de l'engin"
            placeholder="Ex: Pelle Hydraulique CAT 320D"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <AppSelect
            label="Catégorie d'équipement"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(e) => setCategory(e.target.value as EquipmentCategory)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AppTextField
            label="Marque"
            placeholder="Ex: Caterpillar, Potain, Komatsu"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />

          <AppTextField
            label="Modèle"
            placeholder="Ex: 320D3, MDT 178, PC210"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />

          <AppTextField
            label="Code Parc / Immatriculation"
            placeholder="Ex: ENG-PELLE-02"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            helperText="Laisser vide pour auto-générer"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AppSelect
            label="Motorisation / Énergie"
            options={FUEL_OPTIONS}
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value as FuelType)}
            required
          />

          <AppTextField
            label="Compteur horaire actuel (h)"
            type="number"
            value={hourMeterCurrent.toString()}
            onChange={(e) => setHourMeterCurrent(Number(e.target.value))}
            required
          />

          <AppTextField
            label="Conso moyenne (L/h)"
            type="number"
            value={fuelConsumption.toString()}
            onChange={(e) => setFuelConsumption(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppSelect
            label="Affectation Chantier Initiale"
            options={PROJECT_OPTIONS}
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />

          <AppTextField
            label="Conducteur / Machiniste Attitré"
            placeholder="Ex: Koffi N'Guessan (Machiniste Agréé)"
            value={assignedOperator}
            onChange={(e) => setAssignedOperator(e.target.value)}
          />
        </div>

        <AppTextField
          label="Taux journalier d'imputation chantier (FCFA/jour)"
          type="number"
          value={dailyCostRateFCFA.toString()}
          onChange={(e) => setDailyCostRateFCFA(Number(e.target.value))}
          helperText="Coût interne de revient journalier pour la comptabilité analytique"
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton variant="outline" onClick={onClose} type="button" disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Wrench className="w-4 h-4" />}
          >
            Enregistrer l'Équipement
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
