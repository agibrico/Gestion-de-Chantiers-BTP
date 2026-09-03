/**
 * AGB CHANTIER - Modal Fournisseur BTP - AXE 10
 */

import React, { useState, useEffect } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import {
  SupplierEntity,
  SupplierCategory,
  PaymentTerms,
} from "../domain/entities/supplier_entity";
import { Truck, Check, Star } from "lucide-react";

interface SupplierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  supplierToEdit?: SupplierEntity | null;
}

const CATEGORIES: { value: SupplierCategory; label: string }[] = [
  { value: "CIMENTERIE_INDUSTRIELLE", label: "🏭 Cimenterie Industrielle" },
  { value: "ACIER_METALLURGIE", label: "⛓️ Aciéries & Métallurgie" },
  { value: "CARRIERE_GRANULATS", label: "🏜️ Carrière Granulats & Sable" },
  { value: "BETON_PRET_EMPLOI", label: "🚚 Centrale à Béton (BPE)" },
  { value: "QUINCAILLERIE_GROS", label: "🛠️ Quincaillerie de Gros & Outillage" },
  { value: "ELECTRICITE_DISTRIBUTION", label: "⚡ Matériel Électrique & Câblage" },
  { value: "PLOMBERIE_SANITAIRE", label: "🚰 Plomberie, Sanitaire & CVC" },
  { value: "LOCATION_ENGINS", label: "🚜 Location d'Engins & Grues" },
  { value: "PEINTURE_CHIMIE", label: "🎨 Peintures & Produits Chimiques" },
];

const PAYMENT_TERMS: { value: PaymentTerms; label: string }[] = [
  { value: "COMPTANT_LIVRAISON", label: "💵 Paiement Comptant à la Livraison" },
  { value: "ACOMPTE_50_SOLDE", label: "💳 Acompte 50% à la commande, solde livraison" },
  { value: "30_JOURS_FIN_MOIS", label: "📅 Virement 30 Jours Fin de Mois" },
  { value: "45_JOURS", label: "📅 Virement 45 Jours" },
  { value: "60_JOURS", label: "📅 Traite 60 Jours" },
];

export const SupplierFormModal: React.FC<SupplierFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  supplierToEdit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SupplierCategory>("CIMENTERIE_INDUSTRIELLE");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Abidjan");
  const [taxNumber, setTaxNumber] = useState("");
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>("30_JOURS_FIN_MOIS");
  const [contactPerson, setContactPerson] = useState("");
  const [rating, setRating] = useState<number>(5);

  useEffect(() => {
    if (supplierToEdit) {
      setCode(supplierToEdit.code);
      setName(supplierToEdit.name);
      setCategory(supplierToEdit.category);
      setPhone(supplierToEdit.phone);
      setEmail(supplierToEdit.email);
      setAddress(supplierToEdit.address);
      setCity(supplierToEdit.city);
      setTaxNumber(supplierToEdit.taxNumber || "");
      setPaymentTerms(supplierToEdit.paymentTerms);
      setContactPerson(supplierToEdit.contactPerson || "");
      setRating(supplierToEdit.rating);
    } else {
      setCode("");
      setName("");
      setCategory("CIMENTERIE_INDUSTRIELLE");
      setPhone("+225 ");
      setEmail("");
      setAddress("Zone Industrielle");
      setCity("Abidjan");
      setTaxNumber("");
      setPaymentTerms("30_JOURS_FIN_MOIS");
      setContactPerson("");
      setRating(5);
    }
  }, [supplierToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...(supplierToEdit ? supplierToEdit : {}),
        code: code.trim() || `FRS-${Math.floor(Math.random() * 900 + 100)}`,
        name: name.trim(),
        category,
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        taxNumber: taxNumber.trim() || undefined,
        paymentTerms,
        contactPerson: contactPerson.trim() || undefined,
        rating: Number(rating) || 5,
        activeOrdersCount: supplierToEdit?.activeOrdersCount || 0,
        totalSpentFCFA: supplierToEdit?.totalSpentFCFA || 0,
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
      title={supplierToEdit ? `Modifier le Fournisseur : ${supplierToEdit.name}` : "Référencer un Nouveau Fournisseur BTP"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AppTextField
            label="Code Fournisseur"
            placeholder="Ex: FRS-014"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            helperText="Auto-généré si vide"
          />

          <div className="sm:col-span-2">
            <AppTextField
              label="Raison Sociale / Nom de l'Entreprise *"
              placeholder="Ex: Ciments d'Afrique (SCA)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AppSelect
            label="Secteur d'Activité / Catégorie *"
            value={category}
            onChange={(e) => setCategory(e.target.value as SupplierCategory)}
            options={CATEGORIES}
          />

          <AppSelect
            label="Conditions de Règlement *"
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value as PaymentTerms)}
            options={PAYMENT_TERMS}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AppTextField
            label="Téléphone Professionnel *"
            placeholder="+225 27 21 XX XX XX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <AppTextField
            label="Email Commercial"
            type="email"
            placeholder="contact@fournisseur.ci"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <AppTextField
              label="Adresse & Siège"
              placeholder="Ex: Zone Industrielle Vridi"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <AppTextField
            label="Ville"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AppTextField
            label="N° Compte Contribuable / IFU"
            placeholder="Ex: CI-ABJ-2020-B-12345"
            value={taxNumber}
            onChange={(e) => setTaxNumber(e.target.value)}
          />

          <AppTextField
            label="Interlocuteur / Contact Principal"
            placeholder="Ex: M. Kouamé (Responsable Grands Comptes)"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton type="submit" variant="primary" isLoading={isSubmitting} leftIcon={<Check className="w-4 h-4" />}>
            {supplierToEdit ? "Enregistrer" : "Référencer le Fournisseur"}
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
