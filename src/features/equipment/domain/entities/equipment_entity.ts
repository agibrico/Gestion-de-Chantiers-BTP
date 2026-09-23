/**
 * AGB CHANTIER - Entités du Domaine Engins, Matériels & Équipements - AXE 12
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type EquipmentCategory =
  | "TERRASSEMENT"
  | "LEVAGE_MANUTENTION"
  | "BETON_MALAXAGE"
  | "ENERGIE_COMPRESSEUR"
  | "COMPACTAGE_ROUTIER"
  | "VEHICULE_LIAISON"
  | "PETIT_MATERIEL_ELECTROPORTATIF";

export type EquipmentStatus =
  | "DISPONIBLE_PARC"
  | "EN_SERVICE_CHANTIER"
  | "EN_PANNE"
  | "EN_MAINTENANCE"
  | "REFORME";

export type FuelType = "DIESEL" | "ESSENCE" | "ELECTRIQUE" | "HYBRIDE" | "MANUEL";

export interface MaintenanceLog {
  id: string;
  date: string;
  type: "PREVENTIF" | "CURATIF" | "VIDANGE_FILTRES" | "VISITE_TECHNIQUE";
  description: string;
  costFCFA: number;
  mechanic: string;
  hourMeter: number;
}

export interface EquipmentEntity extends BaseEntity {
  code: string; // Ex: ENG-CAT-01, GRUE-POT-02
  name: string; // Ex: Pelle Hydraulique Caterpillar 320D
  category: EquipmentCategory;
  brand: string; // Caterpillar, Potain, Komatsu, SDMO...
  model: string;
  serialNumber?: string;
  registrationPlate?: string; // Immatriculation si véhicule
  status: EquipmentStatus;
  currentProjectId?: string;
  currentProjectName?: string;
  assignedOperator?: string; // Nom du machiniste / grutier
  fuelType: FuelType;
  hourMeterCurrent: number; // Compteur horaire (heures de fonctionnement)
  fuelConsumptionAvgLitrePerHour: number;
  lastMaintenanceDate?: string;
  nextMaintenanceHourMeter?: number;
  maintenanceHistory: MaintenanceLog[];
  dailyCostRateFCFA: number; // Coût journalier d'imputation chantier
}
