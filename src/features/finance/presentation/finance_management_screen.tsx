/**
 * AGB CHANTIER - Écran de Gestion Budgétaire, Dépenses & Caisse - AXE 11
 */

import React, { useState, useEffect } from "react";
import {
  Coins,
  Plus,
  Search,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
  Wallet,
  TrendingDown,
  Building,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
} from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { AppEmptyState } from "../../../core/widgets/display/app_empty_state";
import { ExpenseEntity, CashTransactionEntity, ExpenseCategory } from "../domain/entities/finance_entity";
import { FinanceRepositoryImpl } from "../data/finance_repository_impl";
import { AddExpenseModal } from "./add_expense_modal";

export const FinanceManagementScreen: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseEntity[]>([]);
  const [cashTransactions, setCashTransactions] = useState<CashTransactionEntity[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"EXPENSES" | "CASH_REGISTER" | "BUDGET_OVERVIEW">("EXPENSES");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const exp = await FinanceRepositoryImpl.getAllExpenses();
      const cash = await FinanceRepositoryImpl.getAllCashTransactions();
      setExpenses(exp);
      setCashTransactions(cash);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateExpense = async (
    data: Omit<ExpenseEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ) => {
    await FinanceRepositoryImpl.createExpense(data);
    await loadData();
  };

  const handleApproveExpense = async (id: string) => {
    await FinanceRepositoryImpl.updateExpenseStatus(id, "APPROUVE", "Kouassi Jean-Marc (DT)");
    await loadData();
  };

  const filteredExpenses = expenses.filter((e) => {
    const matchProj = selectedProjectId === "ALL" || e.projectId === selectedProjectId;
    const matchCat = selectedCategory === "ALL" || e.category === selectedCategory;
    const matchQuery =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.beneficiary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.expenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchProj && matchCat && matchQuery;
  });

  const totalSpentFCFA = expenses.reduce((acc, curr) => acc + (curr.status !== "REJETE" ? curr.amountFCFA : 0), 0);
  const currentCashBalanceFCFA = 2305000;
  const totalApprovedFCFA = expenses
    .filter((e) => e.status === "APPROUVE" || e.status === "PAYE")
    .reduce((acc, curr) => acc + curr.amountFCFA, 0);

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-FR").format(val) + " FCFA";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              AXE 11
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Budget, Dépenses & Caisse Chantier
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Contrôle financier, décaissements, caisse menues dépenses et suivi analytique par lot
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AppButton
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Nouvelle Dépense
          </AppButton>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Dépenses Engagées"
          value={formatFCFA(totalSpentFCFA)}
          subValue="Tous chantiers confondus"
          icon={<Coins className="w-6 h-6" />}
          iconColor="text-orange-600"
          badgeText="Engagé"
          badgeVariant="warning"
        />
        <StatCard
          label="Solde Caisse Chantier"
          value={formatFCFA(currentCashBalanceFCFA)}
          subValue="Disponible en espèces immédiat"
          icon={<Wallet className="w-6 h-6" />}
          iconColor="text-emerald-600"
          badgeText="Disponible"
          badgeVariant="success"
        />
        <StatCard
          label="Dépenses Validées / Payées"
          value={formatFCFA(totalApprovedFCFA)}
          subValue={`${expenses.filter((e) => e.status === "PAYE").length} pièces payées`}
          icon={<Receipt className="w-6 h-6" />}
          iconColor="text-blue-600"
          badgeText="Conforme"
          badgeVariant="default"
        />
        <StatCard
          label="En Attente de Validation"
          value={formatFCFA(
            expenses.filter((e) => e.status === "EN_ATTENTE_VALIDATION").reduce((a, b) => a + b.amountFCFA, 0)
          )}
          subValue="À approuver par Direction Travaux"
          icon={<Clock className="w-6 h-6" />}
          iconColor="text-purple-600"
          badgeText="À valider"
          badgeVariant="warning"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("EXPENSES")}
          className={`pb-3 relative flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === "EXPENSES"
              ? "text-orange-600 dark:text-orange-400 border-b-2 border-orange-600"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Receipt className="w-4 h-4" />
          Grand Livre des Dépenses ({expenses.length})
        </button>
        <button
          onClick={() => setActiveTab("CASH_REGISTER")}
          className={`pb-3 relative flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === "CASH_REGISTER"
              ? "text-orange-600 dark:text-orange-400 border-b-2 border-orange-600"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Wallet className="w-4 h-4" />
          Livre de Caisse Menues Dépenses
        </button>
        <button
          onClick={() => setActiveTab("BUDGET_OVERVIEW")}
          className={`pb-3 relative flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === "BUDGET_OVERVIEW"
              ? "text-orange-600 dark:text-orange-400 border-b-2 border-orange-600"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          Ventilation Budgétaire par Lot
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <AppTextField
            placeholder="Rechercher par libellé, fournisseur, N° pièce..."
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            fullWidth
          />
        </div>
        <div className="w-full md:w-64">
          <AppSelect
            options={[
              { value: "ALL", label: "Tous les chantiers" },
              { value: "proj-001", label: "Tour Résidentielle Ivoire" },
              { value: "proj-002", label: "Complexe Commercial Plateau" },
              { value: "proj-003", label: "Hangar Logistique San-Pédro" },
            ]}
            value={selectedProjectId}
            onChange={(val) => setSelectedProjectId(val)}
            fullWidth
          />
        </div>
        <div className="w-full md:w-56">
          <AppSelect
            options={[
              { value: "ALL", label: "Toutes catégories" },
              { value: "MATERIAUX", label: "Matériaux" },
              { value: "MAIN_DOEUVRE", label: "Main d'œuvre" },
              { value: "SOUS_TRAITANCE", label: "Sous-traitance" },
              { value: "CARBURANT_ENGINS", label: "Carburant & Énergie" },
              { value: "LOCATION_MATERIEL", label: "Location matériel" },
            ]}
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
            fullWidth
          />
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === "EXPENSES" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Réf / Date</th>
                  <th className="p-3.5">Libellé & Lot</th>
                  <th className="p-3.5">Bénéficiaire / Fournisseur</th>
                  <th className="p-3.5">Catégorie</th>
                  <th className="p-3.5">Mode</th>
                  <th className="p-3.5 text-right">Montant (FCFA)</th>
                  <th className="p-3.5 text-center">Statut</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                        {exp.expenseNumber}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{exp.expenseDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white">{exp.title}</div>
                      <div className="text-xs text-orange-600 dark:text-orange-400">{exp.lot || exp.projectName}</div>
                    </td>
                    <td className="p-3.5 font-medium">{exp.beneficiary}</td>
                    <td className="p-3.5">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-xs text-slate-500 font-mono">{exp.paymentMethod}</td>
                    <td className="p-3.5 text-right font-mono font-black text-slate-900 dark:text-white">
                      {formatFCFA(exp.amountFCFA)}
                    </td>
                    <td className="p-3.5 text-center">
                      {exp.status === "PAYE" ? (
                        <AppBadge variant="success">PAYÉ</AppBadge>
                      ) : exp.status === "APPROUVE" ? (
                        <AppBadge variant="default">APPROUVÉ</AppBadge>
                      ) : exp.status === "EN_ATTENTE_VALIDATION" ? (
                        <AppBadge variant="warning">À VALIDER</AppBadge>
                      ) : (
                        <AppBadge variant="danger">{exp.status}</AppBadge>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {exp.status === "EN_ATTENTE_VALIDATION" && (
                        <AppButton
                          size="sm"
                          variant="secondary"
                          onClick={() => handleApproveExpense(exp.id)}
                          leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                        >
                          Valider
                        </AppButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "CASH_REGISTER" && (
        <div className="space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 text-emerald-600 rounded-lg">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-950 dark:text-emerald-300">Solde Actuel Caisse Chantier</h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-400">
                  Coffre de chantier principal • Gestionnaire : Yao N'goran
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">
                {formatFCFA(currentCashBalanceFCFA)}
              </div>
              <span className="text-xs text-slate-500">Dernier pointage : Aujourd'hui</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold">
              Journal des Opérations de Caisse
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {cashTransactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        tx.type === "APPROVISIONNEMENT"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-red-500/15 text-red-600"
                      }`}
                    >
                      {tx.type === "APPROVISIONNEMENT" ? (
                        <ArrowDownRight className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        {tx.reason}
                        <span className="text-xs font-mono text-slate-400 font-normal">({tx.transactionNumber})</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Bénéficiaire : <span className="font-medium text-slate-700 dark:text-slate-300">{tx.beneficiary}</span> • Enregistré par {tx.recordedBy} le {tx.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-mono font-black text-sm ${
                        tx.type === "APPROVISIONNEMENT" ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "APPROVISIONNEMENT" ? "+" : "-"} {formatFCFA(tx.amountFCFA)}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      Solde : {formatFCFA(tx.balanceAfterFCFA)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "BUDGET_OVERVIEW" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 text-orange-600" />
              Répartition par Poste de Coût
            </h4>
            <div className="space-y-4">
              {[
                { name: "Matériaux & Fournitures", spent: 48500000, budget: 65000000, pct: 74, color: "bg-orange-500" },
                { name: "Main d'œuvre & Équipes", spent: 32000000, budget: 45000000, pct: 71, color: "bg-blue-500" },
                { name: "Sous-traitance spécialisée", spent: 22000000, budget: 35000000, pct: 62, color: "bg-purple-500" },
                { name: "Engins, Carburant & Énergie", spent: 9800000, budget: 14000000, pct: 70, color: "bg-amber-500" },
                { name: "Sécurité & Installations de chantier", spent: 3500000, budget: 6000000, pct: 58, color: "bg-emerald-500" },
              ].map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                    <span className="font-mono text-slate-900 dark:text-white">
                      {formatFCFA(item.spent)} / {formatFCFA(item.budget)} ({item.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Contrôle de Gestion & Rentabilité</h4>
              <p className="text-xs text-slate-500 mb-6">
                Ratio dépenses réalisées versus avancement physique du chantier Tour Résidentielle Ivoire.
              </p>
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-4">
                <div className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
                  Avancement Physique vs Financier
                </div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  Physique : 42% | Consommé : 44.8%
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Légère avance sur l'approvisionnement en acier HA qui sera résorbée lors du coulage R+3.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <AppButton variant="outline" size="sm" leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
                Exporter Bilan Financier Excel
              </AppButton>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateExpense}
      />
    </div>
  );
};
