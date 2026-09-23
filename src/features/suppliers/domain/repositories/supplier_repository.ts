/**
 * AGB CHANTIER - Interface du Repository Fournisseurs & Commandes - AXE 10
 */

import {
  SupplierEntity,
  PurchaseOrderEntity,
  SuppliersStats,
  SupplierCategory,
  PurchaseOrderStatus,
} from "../entities/supplier_entity";

export interface SupplierRepository {
  // Fournisseurs
  getAllSuppliers(category?: SupplierCategory | "ALL"): Promise<SupplierEntity[]>;
  getSupplierById(id: string): Promise<SupplierEntity | null>;
  createSupplier(data: Omit<SupplierEntity, "id" | "createdAt" | "updatedAt">): Promise<SupplierEntity>;
  updateSupplier(supplier: SupplierEntity): Promise<SupplierEntity>;
  deleteSupplier(id: string): Promise<void>;
  
  // Bons de Commande (Achats)
  getAllPurchaseOrders(projectId?: string, status?: PurchaseOrderStatus | "ALL"): Promise<PurchaseOrderEntity[]>;
  getPurchaseOrderById(id: string): Promise<PurchaseOrderEntity | null>;
  createPurchaseOrder(data: Omit<PurchaseOrderEntity, "id" | "createdAt" | "updatedAt">): Promise<PurchaseOrderEntity>;
  updatePurchaseOrder(order: PurchaseOrderEntity): Promise<PurchaseOrderEntity>;
  deletePurchaseOrder(id: string): Promise<void>;
  approvePurchaseOrder(id: string, approverName: string): Promise<PurchaseOrderEntity>;
  markAsDelivered(id: string, deliveryNoteNumber: string, actualDeliveryDate: string): Promise<PurchaseOrderEntity>;
  
  calculateStats(projectId?: string): Promise<SuppliersStats>;
  seedInitialSuppliersIfEmpty(): Promise<void>;
}
