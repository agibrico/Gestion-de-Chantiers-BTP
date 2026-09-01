/**
 * AGB CHANTIER - Entités du Domaine Fournisseurs & Commandes - AXE 10
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type SupplierCategory =
  | "CIMENTERIE_INDUSTRIELLE"
  | "ACIER_METALLURGIE"
  | "CARRIERE_GRANULATS"
  | "QUINCAILLERIE_GROS"
  | "ELECTRICITE_DISTRIBUTION"
  | "PLOMBERIE_SANITAIRE"
  | "LOCATION_ENGINS"
  | "BETON_PRET_EMPLOI"
  | "PEINTURE_CHIMIE";

export type PaymentTerms =
  | "COMPTANT_LIVRAISON"
  | "30_JOURS_FIN_MOIS"
  | "45_JOURS"
  | "60_JOURS"
  | "ACOMPTE_50_SOLDE";

export type PurchaseOrderStatus =
  | "BROUILLON"
  | "VALIDE_DIRECTION"
  | "COMMANDE_ENVOYEE"
  | "LIVRE_PARTIEL"
  | "LIVRE_CONFORME"
  | "ANNULE";

export type PaymentStatus = "NON_PAYE" | "ACOMPTE_VERSE" | "PAYE_INTEGRAL";

export interface SupplierEntity extends BaseEntity {
  code: string; // Ex: FRS-001
  name: string; // Ex: "SCA - Société des Ciments d'Afrique"
  category: SupplierCategory;
  phone: string;
  email: string;
  address: string;
  city: string;
  taxNumber?: string; // N° CC / IFU
  paymentTerms: PaymentTerms;
  rating: number; // 1 to 5 stars
  activeOrdersCount: number;
  totalSpentFCFA: number;
  bankAccountDetails?: string; // IBAN / RIB
  contactPerson?: string;
  notes?: string;
}

export interface PurchaseOrderItem {
  id: string;
  description: string;
  unit: string;
  quantityOrdered: number;
  quantityDelivered: number;
  unitPriceFCFA: number;
  totalFCFA: number;
}

export interface PurchaseOrderEntity extends BaseEntity {
  orderNumber: string; // Ex: "BC-2026-089"
  supplierId: string;
  supplierName: string;
  projectId: string;
  projectName: string;
  orderDate: string; // YYYY-MM-DD
  expectedDeliveryDate: string; // YYYY-MM-DD
  actualDeliveryDate?: string;
  
  status: PurchaseOrderStatus;
  paymentStatus: PaymentStatus;
  
  items: PurchaseOrderItem[];
  subtotalFCFA: number;
  vatRatePercent: number; // Ex: 18% (TVA standard UEMOA / Côte d'Ivoire)
  vatAmountFCFA: number;
  totalWithTaxFCFA: number;
  
  deliveryAddress: string;
  deliveryNoteNumber?: string; // N° Bon de livraison rattaché
  approvedBy?: string;
  notes?: string;
}

export interface SuppliersStats {
  totalSuppliers: number;
  totalActiveOrders: number;
  totalOrdersVolumeFCFA: number;
  pendingDeliveriesCount: number;
  pendingValidationOrdersCount: number;
}
