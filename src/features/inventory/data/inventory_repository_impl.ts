/**
 * AGB CHANTIER - Implémentation Repository Matériaux & Stocks - AXE 09
 */

import { IdbAdapter } from "../../../core/storage/idb_adapter";
import {
  InventoryItemEntity,
  StockMovementEntity,
  InventoryStats,
  MaterialCategory,
} from "../domain/entities/inventory_entity";
import { InventoryRepository } from "../domain/repositories/inventory_repository";

const INITIAL_ITEMS_MOCK: Array<Omit<InventoryItemEntity, "id" | "createdAt" | "updatedAt">> = [
  {
    code: "MAT-CIM-01",
    name: "Ciment CPJ 42.5 R (Sacs 50kg)",
    category: "CIMENT_LIANTS",
    unit: "SAC_50KG",
    currentStock: 850,
    minStockAlert: 200,
    optimalStock: 1200,
    unitPurchasePriceFCFA: 4800,
    totalStockValueFCFA: 4080000,
    primaryStorageLocation: "Hangar Central Chantier Horizon",
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    supplierName: "SCA - Ciments d'Afrique",
    lastRestockedDate: "2026-06-10",
    isBelowAlertThreshold: false,
  },
  {
    code: "MAT-ACI-02",
    name: "Fers à béton Haute Adhérence HA12 (FeE500)",
    category: "ARMATURES_ACIER",
    unit: "TONNE",
    currentStock: 18,
    minStockAlert: 5,
    optimalStock: 30,
    unitPurchasePriceFCFA: 650000,
    totalStockValueFCFA: 11700000,
    primaryStorageLocation: "Parc à Ferraille Chantier Horizon",
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    supplierName: "SIMAM Aciéries & Métallurgie",
    lastRestockedDate: "2026-06-05",
    isBelowAlertThreshold: false,
  },
  {
    code: "MAT-ACI-03",
    name: "Fers à béton Haute Adhérence HA16 (FeE500)",
    category: "ARMATURES_ACIER",
    unit: "TONNE",
    currentStock: 4,
    minStockAlert: 8,
    optimalStock: 25,
    unitPurchasePriceFCFA: 680000,
    totalStockValueFCFA: 2720000,
    primaryStorageLocation: "Parc à Ferraille Chantier Horizon",
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    supplierName: "SIMAM Aciéries & Métallurgie",
    lastRestockedDate: "2026-05-20",
    isBelowAlertThreshold: true,
  },
  {
    code: "MAT-GRA-04",
    name: "Gravier Concassé 15/25 pour Béton",
    category: "GRANULATS_SABLE_GRAVIER",
    unit: "M3",
    currentStock: 120,
    minStockAlert: 40,
    optimalStock: 200,
    unitPurchasePriceFCFA: 18500,
    totalStockValueFCFA: 2220000,
    primaryStorageLocation: "Aire de Stockage Granulats",
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    supplierName: "Carrières Réunies d'Akoupé",
    lastRestockedDate: "2026-06-08",
    isBelowAlertThreshold: false,
  },
  {
    code: "MAT-SAB-05",
    name: "Sable Fin de Lagune Lavé",
    category: "GRANULATS_SABLE_GRAVIER",
    unit: "M3",
    currentStock: 80,
    minStockAlert: 30,
    optimalStock: 150,
    unitPurchasePriceFCFA: 14000,
    totalStockValueFCFA: 1120000,
    primaryStorageLocation: "Aire de Stockage Granulats",
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    supplierName: "Dragage & Granulats CI",
    lastRestockedDate: "2026-06-08",
    isBelowAlertThreshold: false,
  },
  {
    code: "MAT-AGG-06",
    name: "Agglos Creux 15x20x40 Haute Résistance",
    category: "AGGLOS_BRIQUES",
    unit: "UNITE",
    currentStock: 3400,
    minStockAlert: 1000,
    optimalStock: 5000,
    unitPurchasePriceFCFA: 380,
    totalStockValueFCFA: 1292000,
    primaryStorageLocation: "Zone Stockage Riviera",
    projectId: "prj_002",
    projectName: "Résidence Haut Standing Les Jardins de la Riviera",
    supplierName: "Briqueterie Industrielle d'Abidjan",
    lastRestockedDate: "2026-06-02",
    isBelowAlertThreshold: false,
  },
  {
    code: "MAT-BOI-07",
    name: "Contreplaqué Filmé 18mm Coffrage (250x125)",
    category: "BOIS_COFFRAGE",
    unit: "UNITE",
    currentStock: 65,
    minStockAlert: 20,
    optimalStock: 100,
    unitPurchasePriceFCFA: 24500,
    totalStockValueFCFA: 1592500,
    primaryStorageLocation: "Atelier Menuiserie & Coffrage",
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    supplierName: "Batimat BTP Matériaux",
    lastRestockedDate: "2026-05-28",
    isBelowAlertThreshold: false,
  },
  {
    code: "MAT-PLB-08",
    name: "Tuyaux PVC Évacuation Ø110 (Longueur 4m)",
    category: "PLOMBERIE_TUYAUTERIE",
    unit: "BARRE_12M",
    currentStock: 12,
    minStockAlert: 25,
    optimalStock: 60,
    unitPurchasePriceFCFA: 9800,
    totalStockValueFCFA: 117600,
    primaryStorageLocation: "Magasin Second Œuvre",
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    supplierName: "Plastafric Tubulures",
    lastRestockedDate: "2026-05-15",
    isBelowAlertThreshold: true,
  },
];

const INITIAL_MOVEMENTS_MOCK: Array<Omit<StockMovementEntity, "id" | "createdAt" | "updatedAt">> = [
  {
    itemId: "mat_001",
    itemName: "Ciment CPJ 42.5 R (Sacs 50kg)",
    itemCode: "MAT-CIM-01",
    movementType: "ENTREE_LIVRAISON",
    quantity: 400,
    unit: "SAC_50KG",
    unitPriceFCFA: 4800,
    totalPriceFCFA: 1920000,
    date: "2026-06-10",
    referenceDocumentNumber: "BL-SCA-8890",
    requestedBy: "M. Traoré Souleymane",
    notes: "Livraison camion semi-remorque 400 sacs",
  },
  {
    itemId: "mat_001",
    itemName: "Ciment CPJ 42.5 R (Sacs 50kg)",
    itemCode: "MAT-CIM-01",
    movementType: "SORTIE_CONSOMMATION_CHANTIER",
    quantity: 120,
    unit: "SAC_50KG",
    unitPriceFCFA: 4800,
    totalPriceFCFA: 576000,
    date: "2026-06-11",
    referenceDocumentNumber: "BS-014",
    recipientTeamName: "Équipe Gros Œuvre Alpha",
    requestedBy: "Bakayoko Amadou",
    notes: "Coulage radier zone B",
  },
  {
    itemId: "mat_002",
    itemName: "Fers à béton Haute Adhérence HA12 (FeE500)",
    itemCode: "MAT-ACI-02",
    movementType: "SORTIE_CONSOMMATION_CHANTIER",
    quantity: 6,
    unit: "TONNE",
    unitPriceFCFA: 650000,
    totalPriceFCFA: 3900000,
    date: "2026-06-12",
    referenceDocumentNumber: "BS-015",
    recipientTeamName: "Équipe Ferraillage & Armatures",
    requestedBy: "Kouakou Jean-Yves",
    notes: "Armatures poteaux SS-1",
  },
];

export class InventoryRepositoryImpl implements InventoryRepository {
  private static instance: InventoryRepositoryImpl | null = null;

  public static getInstance(): InventoryRepositoryImpl {
    if (!this.instance) {
      this.instance = new InventoryRepositoryImpl();
    }
    return this.instance;
  }

  public async seedInitialInventoryIfEmpty(): Promise<void> {
    try {
      const existing = await IdbAdapter.getAll<InventoryItemEntity>(IdbAdapter.STORES.INVENTORY_ITEMS);
      if (existing.length === 0) {
        const now = new Date().toISOString();
        for (const item of INITIAL_ITEMS_MOCK) {
          const entity: InventoryItemEntity = {
            ...item,
            id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          };
          await IdbAdapter.put<InventoryItemEntity>(IdbAdapter.STORES.INVENTORY_ITEMS, entity);
        }

        for (const mov of INITIAL_MOVEMENTS_MOCK) {
          const mEntity: StockMovementEntity = {
            ...mov,
            id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          };
          await IdbAdapter.put<StockMovementEntity>(IdbAdapter.STORES.STOCK_MOVEMENTS, mEntity);
        }
      }
    } catch (e) {
      console.warn("Seeding inventory warning", e);
    }
  }

  public async getAllItems(category?: MaterialCategory | "ALL", projectId?: string): Promise<InventoryItemEntity[]> {
    await this.seedInitialInventoryIfEmpty();
    let items = await IdbAdapter.getAll<InventoryItemEntity>(IdbAdapter.STORES.INVENTORY_ITEMS);

    if (category && category !== "ALL") {
      items = items.filter((i) => i.category === category);
    }
    if (projectId && projectId !== "ALL") {
      items = items.filter((i) => !i.projectId || i.projectId === projectId);
    }

    return items.sort((a, b) => a.code.localeCompare(b.code));
  }

  public async getItemById(id: string): Promise<InventoryItemEntity | null> {
    return IdbAdapter.getById<InventoryItemEntity>(IdbAdapter.STORES.INVENTORY_ITEMS, id);
  }

  public async createItem(
    data: Omit<InventoryItemEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<InventoryItemEntity> {
    const now = new Date().toISOString();
    const stockVal = data.currentStock * data.unitPurchasePriceFCFA;
    const isAlert = data.currentStock <= data.minStockAlert;

    const newEntity: InventoryItemEntity = {
      ...data,
      totalStockValueFCFA: stockVal,
      isBelowAlertThreshold: isAlert,
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };
    await IdbAdapter.put<InventoryItemEntity>(IdbAdapter.STORES.INVENTORY_ITEMS, newEntity);
    return newEntity;
  }

  public async updateItem(item: InventoryItemEntity): Promise<InventoryItemEntity> {
    const stockVal = item.currentStock * item.unitPurchasePriceFCFA;
    const isAlert = item.currentStock <= item.minStockAlert;

    const updated: InventoryItemEntity = {
      ...item,
      totalStockValueFCFA: stockVal,
      isBelowAlertThreshold: isAlert,
      updatedAt: new Date().toISOString(),
      syncStatus: "local",
    };
    await IdbAdapter.put<InventoryItemEntity>(IdbAdapter.STORES.INVENTORY_ITEMS, updated);
    return updated;
  }

  public async deleteItem(id: string): Promise<void> {
    await IdbAdapter.delete(IdbAdapter.STORES.INVENTORY_ITEMS, id);
  }

  public async getAllMovements(itemId?: string): Promise<StockMovementEntity[]> {
    await this.seedInitialInventoryIfEmpty();
    let movements = await IdbAdapter.getAll<StockMovementEntity>(IdbAdapter.STORES.STOCK_MOVEMENTS);
    if (itemId) {
      movements = movements.filter((m) => m.itemId === itemId);
    }
    return movements.sort((a, b) => b.date.localeCompare(a.date));
  }

  public async recordMovement(
    movementData: Omit<StockMovementEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<StockMovementEntity> {
    const now = new Date().toISOString();
    const mEntity: StockMovementEntity = {
      ...movementData,
      id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };
    await IdbAdapter.put<StockMovementEntity>(IdbAdapter.STORES.STOCK_MOVEMENTS, mEntity);

    // Update item stock quantity
    const item = await this.getItemById(movementData.itemId);
    if (item) {
      let newStock = item.currentStock;
      if (movementData.movementType === "ENTREE_LIVRAISON") {
        newStock += movementData.quantity;
        item.lastRestockedDate = movementData.date;
      } else if (
        movementData.movementType === "SORTIE_CONSOMMATION_CHANTIER" ||
        movementData.movementType === "PERTE_CASSE"
      ) {
        newStock = Math.max(0, newStock - movementData.quantity);
      } else if (movementData.movementType === "AJUSTEMENT_INVENTAIRE") {
        newStock = movementData.quantity;
      }

      await this.updateItem({
        ...item,
        currentStock: newStock,
      });
    }

    return mEntity;
  }

  public async calculateStats(projectId?: string): Promise<InventoryStats> {
    const items = await this.getAllItems("ALL", projectId);
    const movements = await this.getAllMovements();

    let totalValuationFCFA = 0;
    let alertThresholdItemsCount = 0;

    for (const i of items) {
      totalValuationFCFA += i.totalStockValueFCFA || 0;
      if (i.isBelowAlertThreshold) alertThresholdItemsCount++;
    }

    let totalEntriesValueFCFA = 0;
    let totalExitsValueFCFA = 0;

    for (const m of movements) {
      if (m.movementType === "ENTREE_LIVRAISON") {
        totalEntriesValueFCFA += m.totalPriceFCFA || 0;
      } else if (m.movementType === "SORTIE_CONSOMMATION_CHANTIER") {
        totalExitsValueFCFA += m.totalPriceFCFA || 0;
      }
    }

    return {
      totalItemsCount: items.length,
      totalValuationFCFA,
      alertThresholdItemsCount,
      totalMovementsThisMonth: movements.length,
      totalEntriesValueFCFA,
      totalExitsValueFCFA,
    };
  }
}
