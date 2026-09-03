/**
 * AGB CHANTIER - Entités du Domaine Budget, Dépenses & Caisse - AXE 11
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type ExpenseCategory =
  | "MATERIAUX"
  | "MAIN_DOEUVRE"
  | "SOUS_TRAITANCE"
  | "CARBURANT_ENGINS"
  | "LOCATION_MATERIEL"
  | "TRANSPORT_LOGISTIQUE"
  | "CAISSE_MENUE_DEPENSE"
  | "HONORAIRES_CONTROLE"
  | "SECURITE_HSE"
  | "AUTRES";

export type PaymentMethod =
  | "VIREMENT_BANCAIRE"
  | "CHEQUE"
  | "ESPECES_CAISSE"
  | "ORANGE_MONEY"
  | "WAVE"
  | "MTN_MOMO";

export type ExpenseStatus = "BROUILLON" | "EN_ATTENTE_VALIDATION" | "APPROUVE" | "PAYE" | "REJETE";

export interface ExpenseEntity extends BaseEntity {
  projectId: string;
  projectName: string;
  expenseNumber: string; // Ex: DEP-2026-0042
  title: string;
  category: ExpenseCategory;
  amountFCFA: number;
  paymentMethod: PaymentMethod;
  status: ExpenseStatus;
  expenseDate: string;
  beneficiary: string; // Entreprise, ouvrier ou fournisseur
  invoiceReference?: string;
  receiptPhotoUrl?: string;
  approvedBy?: string;
  approvalDate?: string;
  comments?: string;
  lot?: string; // Ex: Gros Œuvre, Plomberie
}

export interface BudgetLineEntity extends BaseEntity {
  projectId: string;
  projectName: string;
  category: ExpenseCategory;
  allocatedAmountFCFA: number;
  spentAmountFCFA: number;
  committedAmountFCFA: number; // Montant engagé (bons de commande émis)
}

export interface CashTransactionEntity extends BaseEntity {
  projectId: string;
  projectName: string;
  transactionNumber: string; // Ex: CAISSE-2026-018
  type: "APPROVISIONNEMENT" | "DECAISSEMENT";
  amountFCFA: number;
  beneficiary: string;
  reason: string;
  recordedBy: string;
  date: string;
  balanceAfterFCFA: number;
  receiptNumber?: string;
}
