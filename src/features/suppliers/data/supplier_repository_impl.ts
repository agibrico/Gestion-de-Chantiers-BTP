/**
 * AGB CHANTIER - Implémentation Repository Fournisseurs & Commandes - AXE 10
 */

import { IdbAdapter } from "../../../core/storage/idb_adapter";
import {
  SupplierEntity,
  PurchaseOrderEntity,
  SuppliersStats,
  SupplierCategory,
  PurchaseOrderStatus,
} from "../domain/entities/supplier_entity";
import { SupplierRepository } from "../domain/repositories/supplier_repository";

const INITIAL_SUPPLIERS_MOCK: Array<Omit<SupplierEntity, "id" | "createdAt" | "updatedAt">> = [
  {
    code: "FRS-001",
    name: "SCA - Société des Ciments d'Afrique",
    category: "CIMENTERIE_INDUSTRIELLE",
    phone: "+225 27 21 75 40 00",
    email: "commandes@cimentsafrique.ci",
    address: "Zone Industrielle de Vridi, Rue des Pétroliers",
    city: "Abidjan",
    taxNumber: "CI-ABJ-1998-B-04210",
    paymentTerms: "30_JOURS_FIN_MOIS",
    rating: 5,
    activeOrdersCount: 2,
    totalSpentFCFA: 68500000,
    contactPerson: "M. Bakayoko Idriss (Directeur Commercial)",
  },
  {
    code: "FRS-002",
    name: "SIMAM Aciéries & Métallurgie",
    category: "ACIER_METALLURGIE",
    phone: "+225 27 23 51 88 00",
    email: "commercial@simam-ci.com",
    address: "Zone Industrielle de Yopougon",
    city: "Abidjan",
    taxNumber: "CI-ABJ-2004-B-11890",
    paymentTerms: "ACOMPTE_50_SOLDE",
    rating: 4.8,
    activeOrdersCount: 1,
    totalSpentFCFA: 42000000,
    contactPerson: "Mme Touré Fatim",
  },
  {
    code: "FRS-003",
    name: "Carrières Réunies d'Akoupé & Granulats",
    category: "CARRIERE_GRANULATS",
    phone: "+225 07 08 45 12 30",
    email: "contact@carrieres-akoupe.ci",
    address: "Route Nationale d'Adzopé, PK 45",
    city: "Akoupé / Abidjan",
    taxNumber: "CI-AKP-2012-A-0091",
    paymentTerms: "COMPTANT_LIVRAISON",
    rating: 4.5,
    activeOrdersCount: 1,
    totalSpentFCFA: 18400000,
    contactPerson: "M. N'Goran Paul",
  },
  {
    code: "FRS-004",
    name: "Batimat BTP Matériaux & Quincaillerie",
    category: "QUINCAILLERIE_GROS",
    phone: "+225 27 21 24 10 10",
    email: "ventespro@batimat.ci",
    address: "Boulevard de Marseille, Zone 4C",
    city: "Abidjan",
    taxNumber: "CI-ABJ-1990-B-00450",
    paymentTerms: "30_JOURS_FIN_MOIS",
    rating: 4.7,
    activeOrdersCount: 1,
    totalSpentFCFA: 31200000,
    contactPerson: "M. Sanogo Lassina",
  },
  {
    code: "FRS-005",
    name: "Béton Prêt à l'Emploi CI (BPE Express)",
    category: "BETON_PRET_EMPLOI",
    phone: "+225 27 21 35 70 80",
    email: "centrale@bpe-express.ci",
    address: "Zone Portuaire, Boulevard du Havre",
    city: "Abidjan",
    taxNumber: "CI-ABJ-2015-B-18450",
    paymentTerms: "30_JOURS_FIN_MOIS",
    rating: 4.9,
    activeOrdersCount: 2,
    totalSpentFCFA: 124000000,
    contactPerson: "Ing. Koffi Marc",
  },
];

const INITIAL_ORDERS_MOCK: Array<Omit<PurchaseOrderEntity, "id" | "createdAt" | "updatedAt">> = [
  {
    orderNumber: "BC-2026-089",
    supplierId: "frs_001",
    supplierName: "SCA - Société des Ciments d'Afrique",
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    orderDate: "2026-06-08",
    expectedDeliveryDate: "2026-06-15",
    status: "VALIDE_DIRECTION",
    paymentStatus: "ACOMPTE_VERSE",
    deliveryAddress: "Chantier Tour Horizon, Avenue Chardy, Plateau Abidjan",
    approvedBy: "M. Kouamé Serge (Directeur de Travaux)",
    vatRatePercent: 18,
    subtotalFCFA: 9600000,
    vatAmountFCFA: 1728000,
    totalWithTaxFCFA: 11328000,
    items: [
      {
        id: "poi_01",
        description: "Ciment CPJ 42.5 R Sacs 50kg",
        unit: "Sac 50kg",
        quantityOrdered: 2000,
        quantityDelivered: 0,
        unitPriceFCFA: 4800,
        totalFCFA: 9600000,
      },
    ],
    notes: "Livraison par rotations de 4 camions de 500 sacs",
  },
  {
    orderNumber: "BC-2026-088",
    supplierId: "frs_002",
    supplierName: "SIMAM Aciéries & Métallurgie",
    projectId: "prj_001",
    projectName: "Tour Horizon d'Affaires R+14 (Plateau)",
    orderDate: "2026-06-02",
    expectedDeliveryDate: "2026-06-10",
    actualDeliveryDate: "2026-06-09",
    status: "LIVRE_CONFORME",
    paymentStatus: "PAYE_INTEGRAL",
    deliveryAddress: "Chantier Tour Horizon, Avenue Chardy, Plateau Abidjan",
    deliveryNoteNumber: "BL-SIMAM-2026-904",
    approvedBy: "M. Kouamé Serge (Directeur de Travaux)",
    vatRatePercent: 18,
    subtotalFCFA: 19800000,
    vatAmountFCFA: 3564000,
    totalWithTaxFCFA: 23364000,
    items: [
      {
        id: "poi_02",
        description: "Fers à béton HA12 FeE500 (Barres 12m)",
        unit: "Tonne",
        quantityOrdered: 18,
        quantityDelivered: 18,
        unitPriceFCFA: 650000,
        totalFCFA: 11700000,
      },
      {
        id: "poi_03",
        description: "Fers à béton HA16 FeE500 (Barres 12m)",
        unit: "Tonne",
        quantityOrdered: 12,
        quantityDelivered: 12,
        unitPriceFCFA: 675000,
        totalFCFA: 8100000,
      },
    ],
  },
];

export class SupplierRepositoryImpl implements SupplierRepository {
  private static instance: SupplierRepositoryImpl | null = null;

  public static getInstance(): SupplierRepositoryImpl {
    if (!this.instance) {
      this.instance = new SupplierRepositoryImpl();
    }
    return this.instance;
  }

  public async seedInitialSuppliersIfEmpty(): Promise<void> {
    try {
      const existingSuppliers = await IdbAdapter.getAll<SupplierEntity>(IdbAdapter.STORES.SUPPLIERS);
      if (existingSuppliers.length === 0) {
        const now = new Date().toISOString();
        for (const s of INITIAL_SUPPLIERS_MOCK) {
          const entity: SupplierEntity = {
            ...s,
            id: `supplier_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          };
          await IdbAdapter.put<SupplierEntity>(IdbAdapter.STORES.SUPPLIERS, entity);
        }

        for (const o of INITIAL_ORDERS_MOCK) {
          const oEntity: PurchaseOrderEntity = {
            ...o,
            id: `po_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          };
          await IdbAdapter.put<PurchaseOrderEntity>(IdbAdapter.STORES.PURCHASE_ORDERS, oEntity);
        }
      }
    } catch (e) {
      console.warn("Seeding suppliers warning", e);
    }
  }

  public async getAllSuppliers(category?: SupplierCategory | "ALL"): Promise<SupplierEntity[]> {
    await this.seedInitialSuppliersIfEmpty();
    let suppliers = await IdbAdapter.getAll<SupplierEntity>(IdbAdapter.STORES.SUPPLIERS);
    if (category && category !== "ALL") {
      suppliers = suppliers.filter((s) => s.category === category);
    }
    return suppliers.sort((a, b) => a.name.localeCompare(b.name));
  }

  public async getSupplierById(id: string): Promise<SupplierEntity | null> {
    return IdbAdapter.getById<SupplierEntity>(IdbAdapter.STORES.SUPPLIERS, id);
  }

  public async createSupplier(
    data: Omit<SupplierEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<SupplierEntity> {
    const now = new Date().toISOString();
    const newEntity: SupplierEntity = {
      ...data,
      id: `supplier_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };
    await IdbAdapter.put<SupplierEntity>(IdbAdapter.STORES.SUPPLIERS, newEntity);
    return newEntity;
  }

  public async updateSupplier(supplier: SupplierEntity): Promise<SupplierEntity> {
    const updated: SupplierEntity = {
      ...supplier,
      updatedAt: new Date().toISOString(),
      syncStatus: "local",
    };
    await IdbAdapter.put<SupplierEntity>(IdbAdapter.STORES.SUPPLIERS, updated);
    return updated;
  }

  public async deleteSupplier(id: string): Promise<void> {
    await IdbAdapter.delete(IdbAdapter.STORES.SUPPLIERS, id);
  }

  public async getAllPurchaseOrders(
    projectId?: string,
    status?: PurchaseOrderStatus | "ALL"
  ): Promise<PurchaseOrderEntity[]> {
    await this.seedInitialSuppliersIfEmpty();
    let orders = await IdbAdapter.getAll<PurchaseOrderEntity>(IdbAdapter.STORES.PURCHASE_ORDERS);

    if (projectId && projectId !== "ALL") {
      orders = orders.filter((o) => o.projectId === projectId);
    }
    if (status && status !== "ALL") {
      orders = orders.filter((o) => o.status === status);
    }

    return orders.sort((a, b) => b.orderDate.localeCompare(a.orderDate));
  }

  public async getPurchaseOrderById(id: string): Promise<PurchaseOrderEntity | null> {
    return IdbAdapter.getById<PurchaseOrderEntity>(IdbAdapter.STORES.PURCHASE_ORDERS, id);
  }

  public async createPurchaseOrder(
    data: Omit<PurchaseOrderEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<PurchaseOrderEntity> {
    const now = new Date().toISOString();
    const subtotal = data.items.reduce((acc, it) => acc + (it.totalFCFA || 0), 0);
    const vatRate = data.vatRatePercent || 18;
    const vatAmount = Math.round(subtotal * (vatRate / 100));
    const total = subtotal + vatAmount;

    const newOrder: PurchaseOrderEntity = {
      ...data,
      subtotalFCFA: subtotal,
      vatAmountFCFA: vatAmount,
      totalWithTaxFCFA: total,
      id: `po_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };
    await IdbAdapter.put<PurchaseOrderEntity>(IdbAdapter.STORES.PURCHASE_ORDERS, newOrder);
    return newOrder;
  }

  public async updatePurchaseOrder(order: PurchaseOrderEntity): Promise<PurchaseOrderEntity> {
    const subtotal = order.items.reduce((acc, it) => acc + (it.totalFCFA || 0), 0);
    const vatRate = order.vatRatePercent || 18;
    const vatAmount = Math.round(subtotal * (vatRate / 100));
    const total = subtotal + vatAmount;

    const updated: PurchaseOrderEntity = {
      ...order,
      subtotalFCFA: subtotal,
      vatAmountFCFA: vatAmount,
      totalWithTaxFCFA: total,
      updatedAt: new Date().toISOString(),
      syncStatus: "local",
    };
    await IdbAdapter.put<PurchaseOrderEntity>(IdbAdapter.STORES.PURCHASE_ORDERS, updated);
    return updated;
  }

  public async deletePurchaseOrder(id: string): Promise<void> {
    await IdbAdapter.delete(IdbAdapter.STORES.PURCHASE_ORDERS, id);
  }

  public async approvePurchaseOrder(id: string, approverName: string): Promise<PurchaseOrderEntity> {
    const order = await this.getPurchaseOrderById(id);
    if (!order) throw new Error("Bon de commande introuvable");

    const updated: PurchaseOrderEntity = {
      ...order,
      status: "VALIDE_DIRECTION",
      approvedBy: approverName,
      updatedAt: new Date().toISOString(),
    };
    await IdbAdapter.put<PurchaseOrderEntity>(IdbAdapter.STORES.PURCHASE_ORDERS, updated);
    return updated;
  }

  public async markAsDelivered(
    id: string,
    deliveryNoteNumber: string,
    actualDeliveryDate: string
  ): Promise<PurchaseOrderEntity> {
    const order = await this.getPurchaseOrderById(id);
    if (!order) throw new Error("Bon de commande introuvable");

    const updatedItems = order.items.map((it) => ({
      ...it,
      quantityDelivered: it.quantityOrdered,
    }));

    const updated: PurchaseOrderEntity = {
      ...order,
      items: updatedItems,
      status: "LIVRE_CONFORME",
      deliveryNoteNumber,
      actualDeliveryDate,
      updatedAt: new Date().toISOString(),
    };
    await IdbAdapter.put<PurchaseOrderEntity>(IdbAdapter.STORES.PURCHASE_ORDERS, updated);
    return updated;
  }

  public async calculateStats(projectId?: string): Promise<SuppliersStats> {
    const [suppliers, orders] = await Promise.all([
      this.getAllSuppliers(),
      this.getAllPurchaseOrders(projectId),
    ]);

    let totalOrdersVolumeFCFA = 0;
    let pendingDeliveriesCount = 0;
    let pendingValidationOrdersCount = 0;
    let activeOrders = 0;

    for (const o of orders) {
      totalOrdersVolumeFCFA += o.totalWithTaxFCFA || 0;
      if (o.status === "VALIDE_DIRECTION" || o.status === "COMMANDE_ENVOYEE" || o.status === "LIVRE_PARTIEL") {
        pendingDeliveriesCount++;
        activeOrders++;
      }
      if (o.status === "BROUILLON") {
        pendingValidationOrdersCount++;
      }
    }

    return {
      totalSuppliers: suppliers.length,
      totalActiveOrders: activeOrders,
      totalOrdersVolumeFCFA,
      pendingDeliveriesCount,
      pendingValidationOrdersCount,
    };
  }
}
