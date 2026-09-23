/**
 * AGB CHANTIER - Entités du Domaine Matériaux, Stocks & Inventaire - AXE 09
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type MaterialCategory =
  | "CIMENT_LIANTS"
  | "ARMATURES_ACIER"
  | "GRANULATS_SABLE_GRAVIER"
  | "AGGLOS_BRIQUES"
  | "BOIS_COFFRAGE"
  | "PLOMBERIE_TUYAUTERIE"
  | "ELECTRICITE_CABLES"
  | "PEINTURE_CHIMIE"
  | "QUINCAILLERIE_OUTILLAGE";

export type StockUnit = "SAC_50KG" | "TONNE" | "M3" | "UNITE" | "ML" | "POT_20L" | "ROULEAU" | "BARRE_12M";

export type MovementType =
  | "ENTREE_LIVRAISON"
  | "SORTIE_CONSOMMATION_CHANTIER"
  | "TRANSFERT_INTER_CHANTIER"
  | "AJUSTEMENT_INVENTAIRE"
  | "PERTE_CASSE";

export interface InventoryItemEntity extends BaseEntity {
  code: string; // Ex: MAT-CIM-01
  name: string; // Ex: "Ciment CPJ 42.5 (Sacs 50kg)"
  category: MaterialCategory;
  unit: StockUnit;
  currentStock: number;
  minStockAlert: number;
  optimalStock: number;
  unitPurchasePriceFCFA: number;
  totalStockValueFCFA: number; // currentStock * unitPurchasePriceFCFA
  
  primaryStorageLocation: string; // Ex: "Dépôt Central Vridi" ou "Zone Stockage Chantier Horizon"
  projectId?: string; // Si stock dédié à un chantier précis
  projectName?: string;
  supplierName?: string;
  
  lastRestockedDate?: string;
  isBelowAlertThreshold: boolean;
  notes?: string;
}

export interface StockMovementEntity extends BaseEntity {
  itemId: string;
  itemName: string;
  itemCode: string;
  movementType: MovementType;
  quantity: number;
  unit: StockUnit;
  unitPriceFCFA: number;
  totalPriceFCFA: number;
  date: string;
  
  sourceLocation?: string;
  targetProjectId?: string;
  targetProjectName?: string;
  recipientTeamName?: string;
  requestedBy?: string;
  referenceDocumentNumber?: string; // Ex: "BL-2026-045" ou "BS-019"
  notes?: string;
}

export interface InventoryStats {
  totalItemsCount: number;
  totalValuationFCFA: number;
  alertThresholdItemsCount: number;
  totalMovementsThisMonth: number;
  totalEntriesValueFCFA: number;
  totalExitsValueFCFA: number;
}
