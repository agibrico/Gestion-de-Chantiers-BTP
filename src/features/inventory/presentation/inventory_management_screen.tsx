/**
 * AGB CHANTIER - Écran Principal Matériaux, Stocks & Inventaire - AXE 09
 */

import React, { useState } from "react";
import { InventoryProvider, useInventory } from "./inventory_context";
import {
  InventoryItemEntity,
  MaterialCategory,
  MovementType,
} from "../domain/entities/inventory_entity";
import { ItemFormModal } from "./item_form_modal";
import { StockMovementModal } from "./stock_movement_modal";
import { QrCodeDisplay } from "../../../core/widgets/display/qr_code_display";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppBadge, BadgeVariant } from "../../../core/widgets/badges/app_badge";
import { AppEmptyState } from "../../../core/widgets/display/app_empty_state";
import {
  Package,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Download,
  Edit2,
  Trash2,
  Search,
  DollarSign,
  TrendingDown,
  Layers,
  FileText,
  Boxes,
} from "lucide-react";

const CATEGORY_NAMES: Record<MaterialCategory, string> = {
  CIMENT_LIANTS: "🧱 Ciment & Liants",
  ARMATURES_ACIER: "⛓️ Aciers & Fers",
  GRANULATS_SABLE_GRAVIER: "🏜️ Granulats & Sable",
  AGGLOS_BRIQUES: "🧱 Agglos & Briques",
  BOIS_COFFRAGE: "🪵 Bois & Coffrage",
  PLOMBERIE_TUYAUTERIE: "🚰 Plomberie & PVC",
  ELECTRICITE_CABLES: "⚡ Électricité & Câbles",
  PEINTURE_CHIMIE: "🎨 Peinture & Chimie",
  QUINCAILLERIE_OUTILLAGE: "🛠️ Quincaillerie",
};

const MOVEMENT_LABELS: Record<MovementType, { label: string; variant: BadgeVariant; icon: string }> = {
  ENTREE_LIVRAISON: { label: "Entrée / Réception BL", variant: "success", icon: "📥" },
  SORTIE_CONSOMMATION_CHANTIER: { label: "Sortie Chantier", variant: "warning", icon: "📤" },
  TRANSFERT_INTER_CHANTIER: { label: "Transfert", variant: "info", icon: "🔄" },
  AJUSTEMENT_INVENTAIRE: { label: "Ajustement", variant: "neutral", icon: "⚖️" },
  PERTE_CASSE: { label: "Perte / Casse", variant: "danger", icon: "⚠️" },
};

const InventoryManagementContent: React.FC = () => {
  const {
    items,
    movements,
    projects,
    selectedCategory,
    setSelectedCategory,
    selectedProjectId,
    setSelectedProjectId,
    searchQuery,
    setSearchQuery,
    stats,
    isLoading,
    activeTab,
    setActiveTab,
    createItem,
    updateItem,
    deleteItem,
    recordMovement,
    exportInventoryCsv,
  } = useInventory();

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItemEntity | null>(null);
  const [selectedItemForMovement, setSelectedItemForMovement] = useState<InventoryItemEntity | null>(null);
  const [selectedItemForQr, setSelectedItemForQr] = useState<InventoryItemEntity | null>(null);

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val) + " FCFA";
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Confirmez-vous la suppression du matériau "${name}" du stock ?`)) {
      await deleteItem(id);
    }
  };

  const alertItems = items.filter((i) => i.isBelowAlertThreshold);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <AppBadge variant="success" dot={true}>
              AXE 09 OPÉRATIONNEL
            </AppBadge>
            <span className="text-xs text-orange-400 font-mono font-bold">Gestion des Stocks, Matériaux & Approvisionnements</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            Matériaux, Stocks & Inventaire
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Inventaire en temps réel du ciment, ferraille, granulats et composants techniques. Alertes seuil minimum et traçabilité des bons d'entrée et de sortie chantier.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <AppButton
            variant="primary"
            onClick={() => {
              setItemToEdit(null);
              setIsItemModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nouveau Matériau
          </AppButton>
          <AppButton
            variant="secondary"
            onClick={() => {
              setSelectedItemForMovement(null);
              setIsMovementModalOpen(true);
            }}
            leftIcon={<ArrowDownLeft className="w-4 h-4 text-orange-600" />}
          >
            Mouvement de Stock (BL/BS)
          </AppButton>
          <AppButton
            variant="outline"
            onClick={exportInventoryCsv}
            leftIcon={<Download className="w-4 h-4 text-emerald-600" />}
          >
            Export Inventaire
          </AppButton>
        </div>
      </div>

      {/* KPI Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Valeur Globale du Stock"
            value={formatFCFA(stats.totalValuationFCFA)}
            subValue={`${stats.totalItemsCount} références cataloguées`}
            icon={<DollarSign className="w-6 h-6" />}
            iconColor="text-emerald-600"
            badgeText="Actif Immobilisé"
            badgeVariant="success"
          />

          <StatCard
            label="Alertes Seuil Minimum"
            value={`${stats.alertThresholdItemsCount} Articles`}
            subValue="Risque imminent de rupture chantier"
            icon={<AlertTriangle className="w-6 h-6" />}
            iconColor="text-red-600"
            badgeText="Réappro Urgent"
            badgeVariant={stats.alertThresholdItemsCount > 0 ? "danger" : "neutral"}
          />

          <StatCard
            label="Entrées Marchandises (BL)"
            value={formatFCFA(stats.totalEntriesValueFCFA)}
            subValue="Réceptions cumulées fournisseurs"
            icon={<ArrowDownLeft className="w-6 h-6" />}
            iconColor="text-blue-600"
            badgeText="Approvisionnements"
            badgeVariant="info"
          />

          <StatCard
            label="Sorties Chantier (BS)"
            value={formatFCFA(stats.totalExitsValueFCFA)}
            subValue="Matériaux incorporés aux ouvrages"
            icon={<ArrowUpRight className="w-6 h-6" />}
            iconColor="text-orange-500"
            badgeText="Consommation"
            badgeVariant="warning"
          />
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="p-4 bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("ITEMS")}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === "ITEMS"
                  ? "bg-orange-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Boxes className="w-4 h-4" />
              Catalogue & Stocks Actuels
            </button>

            <button
              onClick={() => setActiveTab("MOVEMENTS")}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === "MOVEMENTS"
                  ? "bg-orange-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              Journal des Mouvements (BL/BS)
            </button>

            <button
              onClick={() => setActiveTab("ALERTS")}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === "ALERTS"
                  ? "bg-orange-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Alertes de Rupture ({stats?.alertThresholdItemsCount || 0})
            </button>
          </div>

          <div className="w-full sm:w-72">
            <AppTextField
              placeholder="Rechercher matériau, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <AppSelect
            label="Catégorie de Matériau"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            options={[
              { value: "ALL", label: "📦 Toutes les catégories" },
              ...Object.entries(CATEGORY_NAMES).map(([k, v]) => ({ value: k, label: v })),
            ]}
          />

          <AppSelect
            label="Chantier de Stockage"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            options={[
              { value: "ALL", label: "🏢 Tous les chantiers / Dépôt central" },
              ...projects.map((p) => ({ value: p.id, label: `${p.code} - ${p.name}` })),
            ]}
          />
        </div>
      </div>

      {/* Main View Table */}
      {activeTab === "ITEMS" ? (
        items.length === 0 ? (
          <AppEmptyState
            icon={<Package className="w-8 h-8 text-orange-500" />}
            title="Aucun article de stock trouvé"
            description="Enregistrez vos matériaux ou modifiez vos filtres."
            actionLabel="Créer un Matériau"
            onAction={() => {
              setItemToEdit(null);
              setIsItemModalOpen(true);
            }}
          />
        ) : (
          <div className="bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-3.5">Code & Désignation</th>
                    <th className="p-3.5">Catégorie</th>
                    <th className="p-3.5 text-right">Stock Actuel</th>
                    <th className="p-3.5 text-right">Seuil Alerte</th>
                    <th className="p-3.5 text-right">P.U Achat</th>
                    <th className="p-3.5 text-right">Valeur Stock</th>
                    <th className="p-3.5">Emplacement</th>
                    <th className="p-3.5">Statut</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <span className="font-mono text-[10px] text-orange-600 font-bold block">{item.code}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
                      </td>

                      <td className="p-3.5">{CATEGORY_NAMES[item.category] || item.category}</td>

                      <td className="p-3.5 text-right font-mono font-black text-sm text-slate-900 dark:text-white">
                        {item.currentStock} <span className="text-[10px] font-normal text-slate-500">{item.unit}</span>
                      </td>

                      <td className="p-3.5 text-right font-mono text-slate-500">
                        {item.minStockAlert}
                      </td>

                      <td className="p-3.5 text-right font-mono">{formatFCFA(item.unitPurchasePriceFCFA)}</td>

                      <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatFCFA(item.totalStockValueFCFA)}
                      </td>

                      <td className="p-3.5 text-slate-500">{item.primaryStorageLocation}</td>

                      <td className="p-3.5">
                        {item.isBelowAlertThreshold ? (
                          <AppBadge variant="danger" size="sm">
                            ⚠️ SEUIL CRITIQUE
                          </AppBadge>
                        ) : (
                          <AppBadge variant="success" size="sm">
                            ✅ CONFORME
                          </AppBadge>
                        )}
                      </td>

                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => {
                            setSelectedItemForMovement(item);
                            setIsMovementModalOpen(true);
                          }}
                          className="px-2 py-1 text-[11px] font-bold bg-orange-50 dark:bg-orange-950/60 text-orange-600 rounded hover:bg-orange-100 cursor-pointer"
                          title="Mouvementer ce stock"
                        >
                          BL/BS
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItemForQr(item);
                            setIsQrModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Générer QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToEdit(item);
                            setIsItemModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-orange-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 text-slate-500 hover:text-red-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : activeTab === "MOVEMENTS" ? (
        /* MOVEMENTS LOG TABLE */
        <div className="bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Type de Mouvement</th>
                  <th className="p-3.5">Matériau & Code</th>
                  <th className="p-3.5 text-right">Quantité</th>
                  <th className="p-3.5 text-right">Montant (FCFA)</th>
                  <th className="p-3.5">N° Pièce / BL / BS</th>
                  <th className="p-3.5">Chantier / Destinataire</th>
                  <th className="p-3.5">Demandeur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {movements.map((mov) => {
                  const mInfo = MOVEMENT_LABELS[mov.movementType] || {
                    label: mov.movementType,
                    variant: "neutral" as const,
                    icon: "📄",
                  };

                  return (
                    <tr key={mov.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-mono font-medium">{mov.date}</td>

                      <td className="p-3.5">
                        <AppBadge variant={mInfo.variant} size="sm">
                          {mInfo.icon} {mInfo.label}
                        </AppBadge>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 dark:text-white block">{mov.itemName}</span>
                        <span className="font-mono text-[10px] text-slate-400">{mov.itemCode}</span>
                      </td>

                      <td className="p-3.5 text-right font-mono font-bold text-sm">
                        {mov.movementType === "ENTREE_LIVRAISON" ? "+" : "-"}
                        {mov.quantity} <span className="text-[10px] font-normal text-slate-500">{mov.unit}</span>
                      </td>

                      <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatFCFA(mov.totalPriceFCFA)}
                      </td>

                      <td className="p-3.5 font-mono font-bold text-orange-600">{mov.referenceDocumentNumber || "N/A"}</td>

                      <td className="p-3.5 max-w-xs truncate text-slate-600 dark:text-slate-400">
                        {mov.targetProjectName || mov.recipientTeamName || "Stock Principal"}
                      </td>

                      <td className="p-3.5 text-slate-500">{mov.requestedBy || "Direction"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ALERTS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alertItems.map((item) => (
            <div
              key={item.id}
              className="bg-red-50/40 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/50 p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-red-600 bg-red-100 dark:bg-red-900/50 px-2 py-0.5 rounded">
                    {item.code}
                  </span>
                  <AppBadge variant="danger" size="sm">
                    RUPTURE IMMINENTE
                  </AppBadge>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h3>

                <div className="grid grid-cols-2 gap-2 text-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-red-100 dark:border-red-900/30">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Stock Actuel</span>
                    <span className="font-black text-red-600 text-sm font-mono">
                      {item.currentStock} {item.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Seuil Minimal</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-sm font-mono">
                      {item.minStockAlert} {item.unit}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <div>Fournisseur : <span className="font-bold text-slate-800 dark:text-slate-200">{item.supplierName || "Non spécifié"}</span></div>
                  <div>Emplacement : {item.primaryStorageLocation}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-red-100 dark:border-red-900/40 flex justify-end">
                <AppButton
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setSelectedItemForMovement(item);
                    setIsMovementModalOpen(true);
                  }}
                  leftIcon={<ArrowDownLeft className="w-3.5 h-3.5" />}
                >
                  Enregistrer Entrée BL
                </AppButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Modal */}
      <ItemFormModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSubmit={async (data) => {
          if (itemToEdit) {
            await updateItem(data);
          } else {
            await createItem(data);
          }
        }}
        itemToEdit={itemToEdit}
      />

      {/* Movement Modal */}
      <StockMovementModal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        onSubmit={async (data) => {
          await recordMovement(data);
        }}
        items={items}
        selectedItem={selectedItemForMovement}
      />

      {/* QR Code Modal */}
      {isQrModalOpen && selectedItemForQr && (
        <QrCodeDisplay
          value={selectedItemForQr.code}
          title={selectedItemForQr.name}
          subtitle={`${CATEGORY_NAMES[selectedItemForQr.category]} • ${selectedItemForQr.primaryStorageLocation}`}
          onClose={() => setIsQrModalOpen(false)}
          type="MATERIAU"
        />
      )}
    </div>
  );
};

export const InventoryManagementScreen: React.FC = () => {
  return (
    <InventoryProvider>
      <InventoryManagementContent />
    </InventoryProvider>
  );
};
