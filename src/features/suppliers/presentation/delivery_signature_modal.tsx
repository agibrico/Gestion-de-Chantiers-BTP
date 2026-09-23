/**
 * AGB CHANTIER - Modal de Réception et Signature Tactile de Bon de Livraison (BL) - AXE 10
 */

import React, { useState } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSignaturePad, SignatureData } from "../../../core/widgets/inputs/app_signature_pad";
import { PurchaseOrderEntity } from "../domain/entities/supplier_entity";
import { Truck, FileCheck, CheckCircle2, ShieldCheck, User } from "lucide-react";

interface DeliverySignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PurchaseOrderEntity | null;
  onConfirmDelivery: (
    orderId: string,
    blNumber: string,
    deliveryDate: string,
    signature: SignatureData,
    driverName?: string
  ) => Promise<void>;
}

export const DeliverySignatureModal: React.FC<DeliverySignatureModalProps> = ({
  isOpen,
  onClose,
  order,
  onConfirmDelivery,
}) => {
  const [blNumber, setBlNumber] = useState<string>(
    () => `BL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [deliveryDate, setDeliveryDate] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );
  const [driverName, setDriverName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!order) return null;

  const handleSaveSignature = async (sigData: SignatureData) => {
    if (!blNumber.trim()) {
      alert("Veuillez renseigner le numéro de Bon de Livraison.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirmDelivery(order.id, blNumber.trim(), deliveryDate, sigData, driverName.trim());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Réception & Émargement BL : ${order.orderNumber}`}
      subtitle={`Fournisseur : ${order.supplierName} • Chantier : ${order.projectName}`}
      icon={<Truck className="w-5 h-5 text-orange-600" />}
      size="lg"
    >
      <div className="space-y-5">
        {/* Delivery Details inputs */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AppTextField
            label="N° Bon de Livraison Fournisseur"
            value={blNumber}
            onChange={(e) => setBlNumber(e.target.value)}
            placeholder="Ex: BL-2026-4890"
            required
          />

          <AppTextField
            label="Date Réception Chantier"
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
          />

          <AppTextField
            label="Chauffeur / Livreur (Nom)"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            placeholder="Ex: Moussa Koné"
            leftIcon={<User className="w-4 h-4 text-slate-400" />}
          />
        </div>

        {/* Goods received summary */}
        <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Articles commandés : <b>{order.items.length} lignes</b> pour un montant de{" "}
              <b>{new Intl.NumberFormat("fr-FR").format(order.totalWithTaxFCFA)} FCFA TTC</b>.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-blue-200 text-blue-600">
            Contrôle quantitatif & qualitatif
          </span>
        </div>

        {/* Touchscreen Signature Pad */}
        <AppSignaturePad
          documentTitle={`Bon de Livraison ${blNumber}`}
          documentRef={order.orderNumber}
          defaultSignatoryName="Chef de Chantier AGB"
          defaultSignatoryRole="Réceptionnaire Chantier / Magasinier"
          defaultSignatoryCompany="AGB Construction & BTP"
          rolesOptions={[
            "Chef de Chantier",
            "Magasinier Chantier",
            "Conducteur de Travaux",
            "Chauffeur Livreur Fournisseur",
          ]}
          onSaveSignature={handleSaveSignature}
          onCancel={onClose}
        />
      </div>
    </AppModal>
  );
};
