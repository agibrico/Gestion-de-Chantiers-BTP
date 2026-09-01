/**
 * AGB CHANTIER - Interface du Repository Matériaux & Stocks - AXE 09
 */

import {
  InventoryItemEntity,
  StockMovementEntity,
  InventoryStats,
  MaterialCategory,
} from "../entities/inventory_entity";

export interface InventoryRepository {
  getAllItems(category?: MaterialCategory | "ALL", projectId?: string): Promise<InventoryItemEntity[]>;
  getItemById(id: string): Promise<InventoryItemEntity | null>;
  createItem(data: Omit<InventoryItemEntity, "id" | "createdAt" | "updatedAt">): Promise<InventoryItemEntity>;
  updateItem(item: InventoryItemEntity): Promise<InventoryItemEntity>;
  deleteItem(id: string): Promise<void>;
  
  // Movements
  getAllMovements(itemId?: string): Promise<StockMovementEntity[]>;
  recordMovement(movement: Omit<StockMovementEntity, "id" | "createdAt" | "updatedAt">): Promise<StockMovementEntity>;
  
  calculateStats(projectId?: string): Promise<InventoryStats>;
  seedInitialInventoryIfEmpty(): Promise<void>;
}
