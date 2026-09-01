/**
 * AGB CHANTIER - Écran Principal Fournisseurs & Achats BTP - AXE 10
 */

import React, { useState } from "react";
import { SuppliersProvider, useSuppliers } from "./suppliers_context";
import {
  SupplierEntity,
  PurchaseOrderEntity,
  SupplierCategory,
  PurchaseOrderStatus,
  PaymentStatus,
} from "../domain/entities/supplier_entity";
import { SupplierFormModal } from "./supplier_form_modal";
import { PurchaseOrderModal } from "./purchase_order_modal";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppBadge, BadgeVariant } from "../../../core/widgets/badges/app_badge";
import { AppEmptyState } from "../../../core/widgets/display/app_empty_state";
import {
  Truck,
  Plus,
  Download,
  Edit2,
  Trash2,
  Search,
  DollarSign,
  ShoppingCart,
  CheckCircle2,
  Clock,
  Send,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

const SUPPLIER_CAT_LABELS: Record<SupplierCategory, string> = {
  CIMENTERIE_INDUSTRIELLE: "🏭 Cimenterie",
  ACIER_METALLURGIE: "⛓️ Aciéries & Métal",
  CARRIERE_GRANULATS: "🏜️ Carrière & Granulats",
  BETON_PRET_EMPLOI: "🚚 Centrale Béton (BPE)",
  QUINCAILLERIE_GROS: "🛠️ Quincaillerie",
  ELECTRICITE_DISTRIBUTION: "⚡ Électricité",
  PLOMBERIE_SANITAIRE: "🚰 Plomberie",
  LOCATION_ENGINS: "🚜 Location Engins",
  PEINTURE_CHIMIE: "🎨 Peinture & Chimie",
};

const ORDER_STATUS_CONFIG: Record<
  PurchaseOrderStatus,
  { label: string; variant: BadgeVariant; icon: string }
> = {
  BROUILLON: { label: "Brouillon", variant: "neutral", icon: "📝" },
  VALIDE_DIRECTION: { label: "Validé Direction", variant: "info", icon: "✅" },
  COMMANDE_ENVOYEE: { label: "Envoyé Fournisseur", variant: "warning", icon: "📨" },
  LIVRE_PARTIEL: { label: "Livraison Partielle", variant: "warning", icon: "⏳" },
  LIVRE_CONFORME: { label: "Livré Conforme (BL)", variant: "success", icon: "🚚" },
  ANNULE: { label: "Annulé", variant: "danger", icon: "❌" },
};

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; variant: BadgeVariant }> = {
  NON_PAYE: { label: "Non Réglé", variant: "danger" },
  ACOMPTE_VERSE: { label: "Acompte Versé", variant: "warning" },
  PAYE_INTEGRAL: { label: "Payé Intégral", variant: "success" },
};

const SuppliersManagementContent: React.FC = () => {
  const {
    suppliers,
    orders,
    projects,
    selectedCategory,
    setSelectedCategory,
    selectedProjectId,
    setSelectedProjectId,
    selectedOrderStatus,
    setSelectedOrderStatus,
    searchQuery,
    setSearchQuery,
    stats,
    isLoading,
    activeTab,
    setActiveTab,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    approvePurchaseOrder,
    markAsDelivered,
    exportOrdersCsv,
  } = useSuppliers();

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<SupplierEntity | null>(null);
  const [orderToEdit, setOrderToEdit] = useState<PurchaseOrderEntity | null>(null);

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val) + " FCFA";
  };

  const handleDeleteSupplier = async (id: string, name: string) => {
    if (window.confirm(`Confirmez-vous la suppression du fournisseur "${name}" ?`)) {
      await deleteSupplier(id);
    }
  };

  const handleDeleteOrder = async (id: string, num: string) => {
    if (window.confirm(`Confirmez-vous l'annulation du bon de commande ${num} ?`)) {
      await deletePurchaseOrder(id);
    }
  };

  const handleApprove = async (id: string) => {
    await approvePurchaseOrder(id, "M. Kouamé Serge (Directeur de Travaux)");
  };

  const handleDeliver = async (id: string) => {
    const blNum = prompt("Entrez le N° de Bon de Livraison Fournisseur (BL) :", "BL-2026-");
    if (blNum) {
      const today = new Date().toISOString().split("T")[0];
      await markAsDelivered(id, blNum, today);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <AppBadge variant="success" dot={true}>
              AXE 10 OPÉRATIONNEL
            </AppBadge>
            <span className="text-xs text-orange-400 font-mono font-bold">Achats BTP, Fournisseurs & Bons de Commande</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            Fournisseurs & Commandes
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Répertoire des partenaires et cimenteries agréés, émission de bons de commande avec calcul automatique de la TVA (18%), suivi des approbations et rapprochement BL.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <AppButton
            variant="primary"
            onClick={() => {
              setOrderToEdit(null);
              setIsOrderModalOpen(true);
            }}
            leftIcon={<ShoppingCart className="w-4 h-4" />}
          >
            Émettre un Bon de Commande
          </AppButton>
          <AppButton
            variant="secondary"
            onClick={() => {
              setSupplierToEdit(null);
              setIsSupplierModalOpen(true);
            }}
            leftIcon={<Truck className="w-4 h-4 text-orange-600" />}
          >
            Nouveau Fournisseur
          </AppButton>
          <AppButton
            variant="outline"
            onClick={exportOrdersCsv}
            leftIcon={<Download className="w-4 h-4 text-emerald-600" />}
          >
            Export Commandes CSV
          </AppButton>
        </div>
      </div>

      {/* KPI Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Volume Engagé Commandes"
            value={formatFCFA(stats.totalOrdersVolumeFCFA)}
            subValue="Achats BTP cumulés chantiers"
            icon={<DollarSign className="w-6 h-6" />}
            iconColor="text-emerald-600"
            badgeText="Engagements TTC"
            badgeVariant="success"
          />

          <StatCard
            label="Commandes en Attente Visa"
            value={`${stats.pendingValidationOrdersCount} Bons`}
            subValue="Brouillons à approuver par la Direction"
            icon={<FileCheck className="w-6 h-6" />}
            iconColor="text-orange-500"
            badgeText="Circuit Validation"
            badgeVariant={stats.pendingValidationOrdersCount > 0 ? "warning" : "neutral"}
          />

          <StatCard
            label="Livraisons en Cours"
            value={`${stats.pendingDeliveriesCount} Commandes`}
            subValue="En attente de réception chantier"
            icon={<Truck className="w-6 h-6" />}
            iconColor="text-blue-600"
            badgeText="Flux Logistique"
            badgeVariant="info"
          />

          <StatCard
            label="Fournisseurs Référencés"
            value={`${stats.totalSuppliers} Partenaires`}
            subValue="Base industrielle et quincaillerie"
            icon={<Building2 className="w-6 h-6" />}
            iconColor="text-slate-700 dark:text-slate-300"
            badgeText="Panel Agréé"
            badgeVariant="neutral"
          />
        </div>
      )}

      {/* Tabs & Search Filter */}
      <div className="p-4 bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("ORDERS")}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === "ORDERS"
                  ? "bg-orange-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Bons de Commande ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab("SUPPLIERS")}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === "SUPPLIERS"
                  ? "bg-orange-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Truck className="w-4 h-4" />
              Annuaire Fournisseurs ({suppliers.length})
            </button>
          </div>

          <div className="w-full sm:w-72">
            <AppTextField
              placeholder="Rechercher commande, fournisseur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>
        </div>

        {/* Dropdowns */}
        {activeTab === "ORDERS" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <AppSelect
              label="Chantier de Destination"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              options={[
                { value: "ALL", label: "🏢 Tous les chantiers" },
                ...projects.map((p) => ({ value: p.id, label: `${p.code} - ${p.name}` })),
              ]}
            />

            <AppSelect
              label="Statut du Bon de Commande"
              value={selectedOrderStatus}
              onChange={(e) => setSelectedOrderStatus(e.target.value as any)}
              options={[
                { value: "ALL", label: "📋 Tous les statuts" },
                { value: "BROUILLON", label: "📝 Brouillons" },
                { value: "VALIDE_DIRECTION", label: "✅ Validés Direction" },
                { value: "COMMANDE_ENVOYEE", label: "📨 Envoyés Fournisseur" },
                { value: "LIVRE_CONFORME", label: "🚚 Livrés Conformes (BL)" },
              ]}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <AppSelect
              label="Catégorie Fournisseur"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              options={[
                { value: "ALL", label: "🏭 Toutes les catégories" },
                ...Object.entries(SUPPLIER_CAT_LABELS).map(([k, v]) => ({ value: k, label: v })),
              ]}
            />
          </div>
        )}
      </div>

      {/* Main View Table */}
      {activeTab === "ORDERS" ? (
        orders.length === 0 ? (
          <AppEmptyState
            icon={<ShoppingCart className="w-8 h-8 text-orange-500" />}
            title="Aucun bon de commande trouvé"
            description="Émettez vos bons d'achat pour approvisionner vos chantiers."
            actionLabel="Émettre un Bon de Commande"
            onAction={() => {
              setOrderToEdit(null);
              setIsOrderModalOpen(true);
            }}
          />
        ) : (
          <div className="bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-3.5">N° Bon & Date</th>
                    <th className="p-3.5">Fournisseur</th>
                    <th className="p-3.5">Chantier Destination</th>
                    <th className="p-3.5 text-center">Statut Commande</th>
                    <th className="p-3.5 text-center">Paiement</th>
                    <th className="p-3.5 text-right">Montant HT</th>
                    <th className="p-3.5 text-right">Total TTC</th>
                    <th className="p-3.5">Rapprochement BL</th>
                    <th className="p-3.5 text-right">Actions & Visas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {orders.map((ord) => {
                    const statusInfo = ORDER_STATUS_CONFIG[ord.status] || {
                      label: ord.status,
                      variant: "neutral" as const,
                      icon: "📄",
                    };
                    const payInfo = PAYMENT_STATUS_CONFIG[ord.paymentStatus] || {
                      label: ord.paymentStatus,
                      variant: "neutral" as const,
                    };

                    return (
                      <tr key={ord.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <span className="font-mono font-black text-slate-900 dark:text-white block text-sm">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Émis le {ord.orderDate}</span>
                        </td>

                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">{ord.supplierName}</td>

                        <td className="p-3.5 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {ord.projectName}
                        </td>

                        <td className="p-3.5 text-center">
                          <AppBadge variant={statusInfo.variant} size="sm">
                            {statusInfo.icon} {statusInfo.label}
                          </AppBadge>
                        </td>

                        <td className="p-3.5 text-center">
                          <AppBadge variant={payInfo.variant} size="sm">
                            {payInfo.label}
                          </AppBadge>
                        </td>

                        <td className="p-3.5 text-right font-mono text-slate-500">
                          {formatFCFA(ord.subtotalFCFA)}
                        </td>

                        <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                          {formatFCFA(ord.totalWithTaxFCFA)}
                        </td>

                        <td className="p-3.5">
                          {ord.deliveryNoteNumber ? (
                            <span className="font-mono text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                              {ord.deliveryNoteNumber}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Non réceptionné</span>
                          )}
                        </td>

                        <td className="p-3.5 text-right space-x-1">
                          {ord.status === "BROUILLON" && (
                            <button
                              onClick={() => handleApprove(ord.id)}
                              className="px-2 py-1 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
                              title="Valider / Apposer le visa"
                            >
                              Viser
                            </button>
                          )}
                          {ord.status === "VALIDE_DIRECTION" && (
                            <button
                              onClick={() => handleDeliver(ord.id)}
                              className="px-2 py-1 text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
                              title="Réceptionner livraison BL"
                            >
                              BL Reçu
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setOrderToEdit(ord);
                              setIsOrderModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-orange-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(ord.id, ord.orderNumber)}
                            className="p-1.5 text-slate-500 hover:text-red-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* SUPPLIERS DIRECTORY GRID */
        suppliers.length === 0 ? (
          <AppEmptyState
            icon={<Truck className="w-8 h-8 text-orange-500" />}
            title="Aucun fournisseur trouvé"
            description="Référencez les cimenteries, aciéries et distributeurs agréés."
            actionLabel="Nouveau Fournisseur"
            onAction={() => {
              setSupplierToEdit(null);
              setIsSupplierModalOpen(true);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((supp) => (
              <div
                key={supp.id}
                className="bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded">
                      {supp.code}
                    </span>
                    <AppBadge variant="info" size="sm">
                      {SUPPLIER_CAT_LABELS[supp.category] || supp.category}
                    </AppBadge>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {supp.name}
                  </h3>

                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{supp.phone}</span>
                    </div>
                    {supp.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{supp.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{supp.address}, {supp.city}</span>
                    </div>
                  </div>

                  {supp.contactPerson && (
                    <div className="text-[11px] p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-500">
                      Contact : <span className="font-bold text-slate-800 dark:text-slate-200">{supp.contactPerson}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Dépenses Cumulées :</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {formatFCFA(supp.totalSpentFCFA || 0)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-emerald-600 font-bold">
                    {supp.paymentTerms.replace(/_/g, " ")}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSupplierToEdit(supp);
                        setIsSupplierModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-orange-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSupplier(supp.id, supp.name)}
                      className="p-1.5 text-slate-500 hover:text-red-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Supplier Modal */}
      <SupplierFormModal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        onSubmit={async (data) => {
          if (supplierToEdit) {
            await updateSupplier(data);
          } else {
            await createSupplier(data);
          }
        }}
        supplierToEdit={supplierToEdit}
      />

      {/* Purchase Order Modal */}
      <PurchaseOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSubmit={async (data) => {
          if (orderToEdit) {
            await updatePurchaseOrder(data);
          } else {
            await createPurchaseOrder(data);
          }
        }}
        orderToEdit={orderToEdit}
        suppliers={suppliers}
      />
    </div>
  );
};

export const SuppliersManagementScreen: React.FC = () => {
  return (
    <SuppliersProvider>
      <SuppliersManagementContent />
    </SuppliersProvider>
  );
};
