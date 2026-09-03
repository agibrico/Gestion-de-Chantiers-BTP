/**
 * AGB CHANTIER - Modal de Création & Modification de Client / MOA - AXE 03
 */

import React, { useState } from "react";
import { AppDialog } from "../../../core/widgets/feedback/app_dialog";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { ClientEntity, ClientType, ClientStatus } from "../domain/entities/client_entity";
import { CreateClientDTO } from "../domain/repositories/client_repository";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  Star,
  UserCheck,
  Globe,
  Tag,
} from "lucide-react";

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateClientDTO | ClientEntity) => Promise<any>;
  initialClient?: ClientEntity | null;
}

const CLIENT_TYPE_OPTIONS: { value: ClientType; label: string }[] = [
  { value: "MOA_PUBLIC", label: "🏛️ Maître d'Ouvrage Public (État, Mairie, Ministère)" },
  { value: "PROMOTEUR_PRIVE", label: "🏢 Promoteur Immobilier Privé" },
  { value: "ENTREPRISE_PARTENAIRE", label: "🏗️ Entreprise Générale / Partenaire Co-traitant" },
  { value: "PARTICULIER", label: "🏡 Client Particulier / Propriétaire Privé" },
  { value: "BAILLEUR_SOCIAL", label: "🏘️ Bailleur Social / Agence Foncière" },
  { value: "INVESTISSEUR", label: "💼 Investisseur Institutionnel / Fonds BTP" },
];

const CLIENT_STATUS_OPTIONS: { value: ClientStatus; label: string }[] = [
  { value: "ACTIF", label: "🟢 Actif (Chantiers ou contrats en cours)" },
  { value: "PROSPECT", label: "🟡 Prospect (En phase de chiffrage / Appel d'Offres)" },
  { value: "EN_NEGOCIATION", label: "🟠 En Négociation (Projet de contrat)" },
  { value: "ARCHIVE", label: "⚪ Archivé (Opérations clôturées)" },
  { value: "SUSPENDU", label: "🔴 Suspendu (Compte bloqué ou litige)" },
];

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialClient,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "administrative" | "contact">("general");

  // General fields
  const [name, setName] = useState(initialClient?.name || "");
  const [commercialName, setCommercialName] = useState(initialClient?.commercialName || "");
  const [code, setCode] = useState(initialClient?.code || "");
  const [type, setType] = useState<ClientType>(initialClient?.type || "PROMOTEUR_PRIVE");
  const [status, setStatus] = useState<ClientStatus>(initialClient?.status || "ACTIF");
  const [rating, setRating] = useState<number>(initialClient?.rating || 5);

  // Administrative & Financial
  const [rccm, setRccm] = useState(initialClient?.rccm || "");
  const [ifuTaxNumber, setIfuTaxNumber] = useState(initialClient?.ifuTaxNumber || "");
  const [paymentTerms, setPaymentTerms] = useState(
    initialClient?.paymentTerms || "Situation mensuelle à 30 jours fin de mois"
  );
  const [totalContractValue, setTotalContractValue] = useState<string>(
    initialClient ? String(initialClient.totalContractValue || 0) : "0"
  );
  const [totalPaidValue, setTotalPaidValue] = useState<string>(
    initialClient ? String(initialClient.totalPaidValue || 0) : "0"
  );

  // Address & Contacts
  const [email, setEmail] = useState(initialClient?.email || "");
  const [phone, setPhone] = useState(initialClient?.phone || "");
  const [altPhone, setAltPhone] = useState(initialClient?.altPhone || "");
  const [address, setAddress] = useState(initialClient?.address || "");
  const [city, setCity] = useState(initialClient?.city || "Abidjan");
  const [country, setCountry] = useState(initialClient?.country || "Côte d'Ivoire");
  const [website, setWebsite] = useState(initialClient?.website || "");

  // Initial primary contact (for creation only)
  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("Directeur Technique MOA");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  // Notes & Tags
  const [notes, setNotes] = useState(initialClient?.notes || "");
  const [tagsInput, setTagsInput] = useState(initialClient?.tags?.join(", ") || "Client Clé");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !city.trim()) {
      setActiveTab("general");
      return;
    }

    try {
      setIsSubmitting(true);
      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const contractVal = Number(totalContractValue.replace(/\s/g, "")) || 0;
      const paidVal = Number(totalPaidValue.replace(/\s/g, "")) || 0;

      if (initialClient) {
        const updated: ClientEntity = {
          ...initialClient,
          name: name.trim(),
          commercialName: commercialName.trim() || undefined,
          code: code.trim() || initialClient.code,
          type,
          status,
          rating,
          rccm: rccm.trim() || undefined,
          ifuTaxNumber: ifuTaxNumber.trim() || undefined,
          paymentTerms: paymentTerms.trim(),
          totalContractValue: contractVal,
          totalPaidValue: paidVal,
          email: email.trim(),
          phone: phone.trim(),
          altPhone: altPhone.trim() || undefined,
          address: address.trim(),
          city: city.trim(),
          country: country.trim(),
          website: website.trim() || undefined,
          notes: notes.trim() || undefined,
          tags: parsedTags.length > 0 ? parsedTags : initialClient.tags,
        };
        await onSave(updated);
      } else {
        const dto: CreateClientDTO = {
          name: name.trim(),
          commercialName: commercialName.trim() || undefined,
          code: code.trim() || undefined,
          type,
          status,
          rating,
          rccm: rccm.trim() || undefined,
          ifuTaxNumber: ifuTaxNumber.trim() || undefined,
          paymentTerms: paymentTerms.trim(),
          totalContractValue: contractVal,
          totalPaidValue: paidVal,
          email: email.trim(),
          phone: phone.trim(),
          altPhone: altPhone.trim() || undefined,
          address: address.trim(),
          city: city.trim(),
          country: country.trim(),
          website: website.trim() || undefined,
          notes: notes.trim() || undefined,
          tags: parsedTags,
          initialContact: contactName.trim()
            ? {
                name: contactName.trim(),
                role: contactRole.trim(),
                phone: contactPhone.trim() || phone.trim(),
                email: contactEmail.trim() || email.trim(),
              }
            : undefined,
        };
        await onSave(dto);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      title={initialClient ? `Modifier : ${initialClient.name}` : "Nouveau Client / Maître d'Ouvrage"}
      subtitle="Enregistrement d'un donneur d'ordre, promoteur ou partenaire BTP"
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Note de solvabilité :</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="cursor-pointer focus:outline-hidden"
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AppButton variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </AppButton>
            <AppButton
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!name.trim() || !phone.trim()}
            >
              {initialClient ? "Enregistrer les modifications" : "Créer la fiche MOA"}
            </AppButton>
          </div>
        </div>
      }
    >
      <div className="space-y-4 py-1">
        {/* Sub-Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "general"
                ? "border-orange-500 text-orange-600 dark:text-orange-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            1. Identité & Type MOA
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("administrative")}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "administrative"
                ? "border-orange-500 text-orange-600 dark:text-orange-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            2. Données Fiscales & Finances
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("contact")}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "contact"
                ? "border-orange-500 text-orange-600 dark:text-orange-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            3. Siège & Interlocuteur Clé
          </button>
        </div>

        {/* Tab 1: Identité */}
        {activeTab === "general" && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <AppTextField
                  label="Raison Sociale / Nom Officiel"
                  placeholder="Ex: Société Ivoirienne de Promotion Immobilière"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  leftIcon={<Building2 className="w-4 h-4" />}
                />
              </div>
              <AppTextField
                label="Code MOA / Réf interne"
                placeholder="Ex: MOA-2026-007 (Auto si vide)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AppTextField
                label="Sigle / Nom Commercial / Abréviation"
                placeholder="Ex: SIPI Immobilier"
                value={commercialName}
                onChange={(e) => setCommercialName(e.target.value)}
              />
              <AppSelect
                label="Statut du compte"
                value={status}
                onChange={(e) => setStatus(e.target.value as ClientStatus)}
                options={CLIENT_STATUS_OPTIONS}
              />
            </div>

            <AppSelect
              label="Catégorie & Statut Juridique MOA"
              value={type}
              onChange={(e) => setType(e.target.value as ClientType)}
              options={CLIENT_TYPE_OPTIONS}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AppTextField
                label="Téléphone Standard / Fixe"
                placeholder="+225 27 20 00 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                leftIcon={<Phone className="w-4 h-4" />}
              />
              <AppTextField
                label="Email Officiel de Contact"
                placeholder="direction@entreprise.ci"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
              />
            </div>

            <AppTextField
              label="Étiquettes & Mots-clés (séparés par virgules)"
              placeholder="Ex: Marché Public, BNETD, Gros Œuvre, Grand Compte"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              leftIcon={<Tag className="w-4 h-4" />}
            />
          </div>
        )}

        {/* Tab 2: Données Fiscales & Finances */}
        {activeTab === "administrative" && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AppTextField
                label="N° RCCM (Registre du Commerce)"
                placeholder="Ex: CI-ABJ-2022-B-19401"
                value={rccm}
                onChange={(e) => setRccm(e.target.value)}
                leftIcon={<FileText className="w-4 h-4" />}
              />
              <AppTextField
                label="N° Compte Contribuable / IFU"
                placeholder="Ex: 2209184T"
                value={ifuTaxNumber}
                onChange={(e) => setIfuTaxNumber(e.target.value)}
                leftIcon={<FileText className="w-4 h-4" />}
              />
            </div>

            <AppTextField
              label="Conditions & Modalités de Règlement BTP"
              placeholder="Ex: Situation mensuelle à 30 jours fin de mois, retenue de garantie 5%"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              leftIcon={<CreditCard className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AppTextField
                label="Valeur Cumulée des Marchés (FCFA)"
                placeholder="Ex: 500000000"
                value={totalContractValue}
                onChange={(e) => setTotalContractValue(e.target.value)}
              />
              <AppTextField
                label="Total Décomptes Encaissés (FCFA)"
                placeholder="Ex: 350000000"
                value={totalPaidValue}
                onChange={(e) => setTotalPaidValue(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Remarques Spécifiques & Protocoles BTP
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Précisions sur les exigences techniques, les clauses de pénalités de retard, les cautions bancaires..."
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-orange-500"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Siège & Interlocuteur */}
        {activeTab === "contact" && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <AppTextField
              label="Adresse Physique du Siège"
              placeholder="Ex: Boulevard Latrille, Immeuble Horizon, 2ème étage"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              leftIcon={<MapPin className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AppTextField
                label="Ville / Commune"
                placeholder="Ex: Abidjan (Cocody)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <AppTextField
                label="Pays"
                placeholder="Ex: Côte d'Ivoire"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AppTextField
                label="Téléphone Secondaire / Mobile Direct"
                placeholder="+225 07 00 00 00 00"
                value={altPhone}
                onChange={(e) => setAltPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
              />
              <AppTextField
                label="Site Web Officiel"
                placeholder="https://organisation.ci"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                leftIcon={<Globe className="w-4 h-4" />}
              />
            </div>

            {!initialClient && (
              <div className="p-3.5 bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-900/50 rounded-xl space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900 dark:text-orange-300">
                  <UserCheck className="w-4 h-4 text-orange-600" />
                  Interlocuteur Principal (Contact Initial)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <AppTextField
                    label="Nom & Prénoms"
                    placeholder="Ex: Ing. Koffi Marc"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                  <AppTextField
                    label="Fonction / Titre"
                    placeholder="Ex: Directeur Technique MOA"
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <AppTextField
                    label="Téléphone direct"
                    placeholder="+225 07 00 00 00 00"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                  <AppTextField
                    label="Email professionnel"
                    placeholder="contact@organisation.ci"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppDialog>
  );
};
