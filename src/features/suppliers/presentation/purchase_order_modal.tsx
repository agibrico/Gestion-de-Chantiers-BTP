/**
 * AGB CHANTIER - Modal Bon de Commande Fournisseur BTP - AXE 10
 */

import React, { useState, useEffect } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import {
  PurchaseOrderEntity,
  PurchaseOrderItem,
  PurchaseOrderStatus,
  PaymentStatus,
  SupplierEntity,
} from "../domain/entities/supplier_entity";
import { ProjectEntity } from "../../projects/domain/entities/project_entity";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { Plus, Trash2, Check, DollarSign, ShoppingCart } from "lucide-react";

interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  orderToEdit?: PurchaseOrderEntity | null;
  suppliers: SupplierEntity[];
  defaultProjectId?: string;
}

export const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  orderToEdit,
  suppliers,
  defaultProjectId,
}) => {
  const [projectsList, setProjectsList] = useState<ProjectEntity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [orderNumber, setOrderNumber] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [projectId, setProjectId] = useState(defaultProjectId || "");
  const [orderDate, setOrderDate] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [vatRatePercent, setVatRatePercent] = useState<number>(18);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("NON_PAYE");
  const [status, setStatus] = useState<PurchaseOrderStatus>("BROUILLON");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<PurchaseOrderItem[]>([
    {
      id: "item_1",
      description: "Ciment CPJ 42.5 (Sacs 50kg)",
      unit: "Sac 50kg",
      quantityOrdered: 500,
      quantityDelivered: 0,
      unitPriceFCFA: 4800,
      totalFCFA: 2400000,
    },
  ]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const prjs = await IdbAdapter.getAll<ProjectEntity>(IdbAdapter.STORES.PROJECTS);
        setProjectsList(prjs);
      } catch (e) {
        console.error("Erreur chargement projets", e);
      }
    };
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  useEffect(() => {
    if (orderToEdit) {
      setOrderNumber(orderToEdit.orderNumber);
      setSupplierId(orderToEdit.supplierId);
      setProjectId(orderToEdit.projectId);
      setOrderDate(orderToEdit.orderDate);
      setExpectedDeliveryDate(orderToEdit.expectedDeliveryDate);
      setDeliveryAddress(orderToEdit.deliveryAddress);
      setVatRatePercent(orderToEdit.vatRatePercent);
      setPaymentStatus(orderToEdit.paymentStatus);
      setStatus(orderToEdit.status);
      setNotes(orderToEdit.notes || "");
      setItems(orderToEdit.items || []);
    } else {
      setOrderNumber(`BC-2026-${Math.floor(Math.random() * 900 + 100)}`);
      setSupplierId(suppliers[0]?.id || "");
      setProjectId(defaultProjectId || (projectsList[0]?.id ?? ""));
      const today = new Date().toISOString().split("T")[0];
      setOrderDate(today);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setExpectedDeliveryDate(nextWeek.toISOString().split("T")[0]);
      setDeliveryAddress("Sur Chantier Principal");
      setVatRatePercent(18);
      setPaymentStatus("NON_PAYE");
      setStatus("BROUILLON");
      setNotes("");
      setItems([
        {
          id: `item_${Date.now()}`,
          description: "Fourniture Ciment CPJ 42.5 R",
          unit: "Sac 50kg",
          quantityOrdered: 400,
          quantityDelivered: 0,
          unitPriceFCFA: 4800,
          totalFCFA: 1920000,
        },
      ]);
    }
  }, [orderToEdit, isOpen, defaultProjectId, suppliers, projectsList]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        description: "",
        unit: "Unité",
        quantityOrdered: 10,
        quantityDelivered: 0,
        unitPriceFCFA: 10000,
        totalFCFA: 100000,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((it) => it.id !== id));
  };

  const handleItemChange = (id: string, field: keyof PurchaseOrderItem, value: any) => {
    setItems(
      items.map((it) => {
        if (it.id === id) {
          const updated = { ...it, [field]: value };
          if (field === "quantityOrdered" || field === "unitPriceFCFA") {
            const q = field === "quantityOrdered" ? Number(value) : updated.quantityOrdered;
            const p = field === "unitPriceFCFA" ? Number(value) : updated.unitPriceFCFA;
            updated.totalFCFA = (q || 0) * (p || 0);
          }
          return updated;
        }
        return it;
      })
    );
  };

  const subtotal = items.reduce((acc, it) => acc + (it.totalFCFA || 0), 0);
  const vatAmount = Math.round(subtotal * (vatRatePercent / 100));
  const totalWithTax = subtotal + vatAmount;

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val) + " FCFA";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || !projectId || items.length === 0) return;

    setIsSubmitting(true);
    try {
      const selectedSupplier = suppliers.find((s) => s.id === supplierId);
      const selectedPrj = projectsList.find((p) => p.id === projectId);

      const payload = {
        ...(orderToEdit ? orderToEdit : {}),
        orderNumber,
        supplierId,
        supplierName: selectedSupplier?.name || "Fournisseur BTP",
        projectId,
        projectName: selectedPrj?.name || "Chantier Principal",
        orderDate,
        expectedDeliveryDate,
        status,
        paymentStatus,
        deliveryAddress: deliveryAddress.trim() || "Chantier",
        vatRatePercent: Number(vatRatePercent) || 18,
        items,
        notes: notes.trim() || undefined,
      };

      await onSubmit(payload);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={orderToEdit ? `Modifier le Bon de Commande ${orderToEdit.orderNumber}` : "Émettre un Bon de Commande Achat BTP"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AppTextField
            label="N° Bon de Commande *"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
          />

          <AppSelect
            label="Fournisseur Référencé *"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            options={suppliers.map((s) => ({ value: s.id, label: `${s.code} - ${s.name}` }))}
          />

          <AppSelect
            label="Chantier de Destination *"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            options={projectsList.map((p) => ({ value: p.id, label: `${p.code} - ${p.name}` }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AppTextField
            label="Date d'Émission *"
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            required
          />

          <AppTextField
            label="Date de Livraison Souhaitée *"
            type="date"
            value={expectedDeliveryDate}
            onChange={(e) => setExpectedDeliveryDate(e.target.value)}
            required
          />

          <AppSelect
            label="Statut du Bon"
            value={status}
            onChange={(e) => setStatus(e.target.value as PurchaseOrderStatus)}
            options={[
              { value: "BROUILLON", label: "📝 Brouillon (En attente visa)" },
              { value: "VALIDE_DIRECTION", label: "✅ Validé par la Direction" },
              { value: "COMMANDE_ENVOYEE", label: "📨 Envoyé au Fournisseur" },
              { value: "LIVRE_CONFORME", label: "🚚 Livré Conforme" },
            ]}
          />
        </div>

        <AppTextField
          label="Adresse de Livraison Précise sur Chantier"
          placeholder="Ex: Chantier Tour Horizon Plateau, Accès Ruelle Chardy"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
        />

        {/* Lignes d'articles */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingCart className="w-4 h-4 text-orange-600" />
              Lignes de Commande & Matériaux ({items.length})
            </span>
            <AppButton
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={handleAddItem}
            >
              Ajouter Ligne
            </AppButton>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {items.map((it, idx) => (
              <div
                key={it.id}
                className="grid grid-cols-12 gap-2 items-center bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
              >
                <div className="col-span-5">
                  <input
                    type="text"
                    placeholder="Désignation matériau (Ex: Ciment CPJ 42.5)"
                    value={it.description}
                    onChange={(e) => handleItemChange(it.id, "description", e.target.value)}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-medium"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Unité (m³, sac...)"
                    value={it.unit}
                    onChange={(e) => handleItemChange(it.id, "unit", e.target.value)}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  />
                </div>

                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Qté"
                    value={it.quantityOrdered}
                    onChange={(e) => handleItemChange(it.id, "quantityOrdered", Number(e.target.value))}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-right font-mono"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="P.U FCFA"
                    value={it.unitPriceFCFA}
                    onChange={(e) => handleItemChange(it.id, "unitPriceFCFA", Number(e.target.value))}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-right font-mono"
                    required
                  />
                </div>

                <div className="col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(it.id)}
                    className="p-1 text-slate-400 hover:text-red-600"
                    disabled={items.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Taux TVA :</span>
              <select
                value={vatRatePercent}
                onChange={(e) => setVatRatePercent(Number(e.target.value))}
                className="p-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold"
              >
                <option value={18}>18% (Standard UEMOA)</option>
                <option value={0}>0% (Exonération Chantier)</option>
              </select>
            </div>

            <div className="space-y-1 text-right font-mono">
              <div className="text-slate-500">Sous-total HT : <span className="font-bold text-slate-800 dark:text-slate-200">{formatFCFA(subtotal)}</span></div>
              <div className="text-slate-500">TVA ({vatRatePercent}%) : <span className="font-bold text-slate-800 dark:text-slate-200">{formatFCFA(vatAmount)}</span></div>
              <div className="text-sm font-black text-orange-600">Total TTC : {formatFCFA(totalWithTax)}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton type="submit" variant="primary" isLoading={isSubmitting} leftIcon={<Check className="w-4 h-4" />}>
            {orderToEdit ? "Enregistrer les Modifications" : "Créer le Bon de Commande"}
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
