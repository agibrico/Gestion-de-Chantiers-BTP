/**
 * AGB CHANTIER - Modal d'Affichage du Bon de Livraison (BL) Signé Manuscritement - AXE 10
 */

import React from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { PurchaseOrderEntity } from "../domain/entities/supplier_entity";
import { FileCheck, Printer, Download, ShieldCheck, CheckCircle2, Truck } from "lucide-react";

interface ViewSignedBlModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PurchaseOrderEntity | null;
}

export const ViewSignedBlModal: React.FC<ViewSignedBlModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val) + " FCFA";
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Bon de Livraison Signé : ${order.deliveryNoteNumber || "BL-NON-DEFINI"}`}
      subtitle={`Attestation de réception conforme avec signature manuscrite certifiée`}
      icon={<FileCheck className="w-5 h-5 text-emerald-600" />}
      size="lg"
    >
      <div className="space-y-5">
        {/* Actions bar */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Réception conforme validée sur site</span>
          </div>
          <div className="flex items-center gap-2">
            <AppButton size="sm" variant="outline" leftIcon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
              Imprimer BL
            </AppButton>
          </div>
        </div>

        {/* Paper Sheet Preview */}
        <div className="bg-white text-slate-900 p-6 rounded-xl border border-slate-300 shadow-md space-y-5">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-orange-600 pb-3">
            <div>
              <div className="text-xl font-black text-slate-900">
                AGB <span className="text-orange-600">CHANTIER</span>
              </div>
              <div className="text-xs text-slate-500 font-medium">Bordereau de Livraison Chantier (BL)</div>
            </div>
            <div className="text-right text-xs">
              <div className="font-mono font-bold text-slate-800">{order.deliveryNoteNumber}</div>
              <div className="text-slate-500">Réf Commande : {order.orderNumber}</div>
              <div className="text-slate-400">Date réception : {order.actualDeliveryDate || order.orderDate}</div>
            </div>
          </div>

          {/* Parties involved */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg border">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Fournisseur Émetteur</span>
              <span className="font-bold text-slate-800 block text-sm">{order.supplierName}</span>
              <span className="text-slate-500">Chauffeur : {order.driverSignatoryName || "Non renseigné"}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Chantier Destinataire</span>
              <span className="font-bold text-slate-800 block text-sm">{order.projectName}</span>
              <span className="text-slate-500">{order.deliveryAddress}</span>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-bold border-b">
                  <th className="p-2">Désignation des Matériaux</th>
                  <th className="p-2 text-center">Unité</th>
                  <th className="p-2 text-right">Qté Commandée</th>
                  <th className="p-2 text-right">Qté Livrée</th>
                  <th className="p-2 text-right">Total TTC</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {order.items.map((it) => (
                  <tr key={it.id}>
                    <td className="p-2 font-medium">{it.description}</td>
                    <td className="p-2 text-center font-mono">{it.unit}</td>
                    <td className="p-2 text-right font-mono">{it.quantityOrdered}</td>
                    <td className="p-2 text-right font-mono font-bold text-emerald-600">
                      {it.quantityDelivered || it.quantityOrdered}
                    </td>
                    <td className="p-2 text-right font-mono">{formatFCFA(it.totalFCFA)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures Area */}
          <div className="pt-4 border-t grid grid-cols-2 gap-4 text-xs">
            {/* Chauffeur */}
            <div className="p-3 border rounded-lg bg-slate-50 text-center space-y-1">
              <span className="font-bold text-slate-700 block">Pour le Fournisseur (Livreur)</span>
              <span className="text-[11px] text-slate-500 block">
                {order.driverSignatoryName || order.supplierName}
              </span>
              <div className="h-20 flex items-center justify-center border-t border-dashed mt-2">
                <span className="text-[10px] text-slate-400 italic">Bon pour expédition conforme</span>
              </div>
            </div>

            {/* Réceptionnaire Chantier with Handwritten Signature */}
            <div className="p-3 border rounded-lg bg-emerald-50/40 text-center space-y-1">
              <span className="font-bold text-emerald-900 block">Réceptionnaire Chantier (AGB)</span>
              <span className="text-[11px] text-slate-600 block font-medium">
                {order.deliverySignatoryName || "Chef de Chantier AGB"} ({order.deliverySignatoryRole || "Magasinier"})
              </span>

              {order.deliverySignatureDataUrl ? (
                <div className="h-20 flex flex-col items-center justify-center border-t border-dashed mt-2">
                  <img
                    src={order.deliverySignatureDataUrl}
                    alt="Signature Manuscrite"
                    className="max-h-16 object-contain"
                  />
                  <span className="text-[9px] text-emerald-700 font-mono">
                    Signé le {order.deliverySignedAt || order.actualDeliveryDate}
                  </span>
                </div>
              ) : (
                <div className="h-20 flex items-center justify-center border-t border-dashed mt-2 text-slate-400 italic">
                  Émargement numérique validé
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <AppButton variant="outline" onClick={onClose}>
            Fermer
          </AppButton>
        </div>
      </div>
    </AppModal>
  );
};
