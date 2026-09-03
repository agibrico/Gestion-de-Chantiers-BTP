/**
 * AGB CHANTIER - Implémentation du Repository Finances & Caisse - AXE 11
 */

import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { ExpenseEntity, BudgetLineEntity, CashTransactionEntity, ExpenseCategory, PaymentMethod } from "../domain/entities/finance_entity";

const INITIAL_EXPENSES_MOCK: Omit<ExpenseEntity, "id" | "createdAt" | "updatedAt">[] = [
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    expenseNumber: "DEP-2026-0089",
    title: "Achat Ciment CPJ 42.5 (20 Tonnes)",
    category: "MATERIAUX",
    amountFCFA: 1850000,
    paymentMethod: "VIREMENT_BANCAIRE",
    status: "PAYE",
    expenseDate: "2026-08-28",
    beneficiary: "Ciments de Côte d'Ivoire (CIMIVOIRE)",
    invoiceReference: "FAC-CIM-2026-4412",
    approvedBy: "Kouassi Jean-Marc (Directeur Travaux)",
    approvalDate: "2026-08-28T14:30:00Z",
    lot: "Gros Œuvre & Structure",
  },
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    expenseNumber: "DEP-2026-0090",
    title: "Paie Quinzaine Équipe Ferrailleurs",
    category: "MAIN_DOEUVRE",
    amountFCFA: 1450000,
    paymentMethod: "ESPECES_CAISSE",
    status: "PAYE",
    expenseDate: "2026-08-29",
    beneficiary: "Chef d'équipe Yéo Bakary (12 ouvriers)",
    invoiceReference: "BORD-MO-2026-17",
    approvedBy: "Kouassi Jean-Marc (Directeur Travaux)",
    approvalDate: "2026-08-29T10:00:00Z",
    lot: "Gros Œuvre & Structure",
  },
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    expenseNumber: "DEP-2026-0091",
    title: "Carburant Groupe Électrogène 100 kVA (500L Gasoil)",
    category: "CARBURANT_ENGINS",
    amountFCFA: 387500,
    paymentMethod: "ORANGE_MONEY",
    status: "PAYE",
    expenseDate: "2026-08-30",
    beneficiary: "Station TOTAL Riviera Palmeraie",
    invoiceReference: "TICK-TOT-98231",
    approvedBy: "Amadou Touré (Conducteur Principal)",
    lot: "Logistique & Énergie",
  },
  {
    projectId: "proj-002",
    projectName: "Complexe Commercial & Bureaux - Plateau",
    expenseNumber: "DEP-2026-0092",
    title: "Location Grue à Tour Potain (Mois d'Août)",
    category: "LOCATION_MATERIEL",
    amountFCFA: 4500000,
    paymentMethod: "VIREMENT_BANCAIRE",
    status: "APPROUVE",
    expenseDate: "2026-08-27",
    beneficiary: "BTP Equipement & Levage CI",
    invoiceReference: "FAC-LEV-8802",
    approvedBy: "Kouassi Jean-Marc",
    lot: "Gros Œuvre",
  },
  {
    projectId: "proj-003",
    projectName: "Hangar Logistique & Stockage - Zone Portuaire San-Pédro",
    expenseNumber: "DEP-2026-0093",
    title: "Fourniture profilés IPE 300 et boulonnerie HDG",
    category: "SOUS_TRAITANCE",
    amountFCFA: 6200000,
    paymentMethod: "CHEQUE",
    status: "EN_ATTENTE_VALIDATION",
    expenseDate: "2026-08-30",
    beneficiary: "Ivoire Charpente Métallique SAS",
    invoiceReference: "DEVIS-ICM-2026-08",
    lot: "Charpente Métallique",
  },
];

const INITIAL_CASH_MOCK: Omit<CashTransactionEntity, "id" | "createdAt" | "updatedAt">[] = [
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    transactionNumber: "CAISSE-2026-041",
    type: "APPROVISIONNEMENT",
    amountFCFA: 2000000,
    beneficiary: "Caisse Chantier Cocody",
    reason: "Alimentation caisse menues dépenses & urgences",
    recordedBy: "Yao N'goran (Comptable Chantier)",
    date: "2026-08-25",
    balanceAfterFCFA: 2350000,
    receiptNumber: "APPROV-08-25",
  },
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    transactionNumber: "CAISSE-2026-042",
    type: "DECAISSEMENT",
    amountFCFA: 45000,
    beneficiary: "Quincaillerie Moderne Riviera",
    reason: "Achat mèches SDS, disques à tronçonner et ruban de balisage",
    recordedBy: "Amadou Touré (Conducteur)",
    date: "2026-08-29",
    balanceAfterFCFA: 2305000,
    receiptNumber: "REC-QM-4410",
  },
];

export class FinanceRepositoryImpl {
  private static isInitialized = false;

  public static async init(): Promise<void> {
    if (this.isInitialized) return;
    try {
      const expenses = await IdbAdapter.getAll<ExpenseEntity>(IdbAdapter.STORES.EXPENSES);
      if (expenses.length === 0) {
        const now = new Date().toISOString();
        for (let i = 0; i < INITIAL_EXPENSES_MOCK.length; i++) {
          const item = INITIAL_EXPENSES_MOCK[i];
          const entity: ExpenseEntity = {
            ...item,
            id: `exp-${100 + i}`,
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          };
          await IdbAdapter.put<ExpenseEntity>(IdbAdapter.STORES.EXPENSES, entity);
        }
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn("Init Finance error:", e);
    }
  }

  public static async getAllExpenses(): Promise<ExpenseEntity[]> {
    await this.init();
    return IdbAdapter.getAll<ExpenseEntity>(IdbAdapter.STORES.EXPENSES);
  }

  public static async getExpensesByProject(projectId: string): Promise<ExpenseEntity[]> {
    await this.init();
    const all = await this.getAllExpenses();
    return all.filter((e) => e.projectId === projectId);
  }

  public static async createExpense(
    data: Omit<ExpenseEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ): Promise<ExpenseEntity> {
    await this.init();
    const now = new Date().toISOString();
    const newEntity: ExpenseEntity = {
      ...data,
      id: `exp-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };
    await IdbAdapter.put<ExpenseEntity>(IdbAdapter.STORES.EXPENSES, newEntity);
    return newEntity;
  }

  public static async updateExpenseStatus(id: string, status: ExpenseEntity["status"], approver?: string): Promise<ExpenseEntity> {
    await this.init();
    const all = await this.getAllExpenses();
    const item = all.find((x) => x.id === id);
    if (!item) throw new Error("Dépense non trouvée");
    const updated: ExpenseEntity = {
      ...item,
      status,
      approvedBy: approver || item.approvedBy,
      approvalDate: status === "APPROUVE" ? new Date().toISOString() : item.approvalDate,
      updatedAt: new Date().toISOString(),
    };
    await IdbAdapter.put<ExpenseEntity>(IdbAdapter.STORES.EXPENSES, updated);
    return updated;
  }

  public static async getAllCashTransactions(): Promise<CashTransactionEntity[]> {
    return INITIAL_CASH_MOCK.map((c, i) => ({
      ...c,
      id: `cash-${i + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: "synced",
    }));
  }
}
