/**
 * AGB CHANTIER - Modal Création & Édition Intervenant / Partenaire / Sous-Traitant BTP - AXE 05
 */

import React, { useState, useEffect } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import {
  StakeholderEntity,
  StakeholderCategory,
  StakeholderStatus,
} from "../domain/entities/stakeholder_entity";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { ProjectEntity } from "../../projects/domain/entities/project_entity";
import {
  Building,
  ShieldCheck,
  Check,
  Phone,
  Mail,
  MapPin,
  FileText,
  Star,
  Users,
} from "lucide-react";

interface StakeholderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  stakeholderToEdit?: StakeholderEntity | null;
}

const CATEGORIES: { value: StakeholderCategory; label: string }[] = [
  { value: "BUREAU_CONTROLE", label: "🔍 Bureau de Contrôle Technique (Veritas, Socotec, etc.)" },
  { value: "BUREAU_ETUDES_TECHNIQUES", label: "📐 BET Structure & Fluides (BNETD, Ingénierie)" },
  { value: "SOUS_TRAITANT_SPECIALISE", label: "⚡ Sous-Traitant Spécialisé (Élec, Clim, VRD)" },
  { value: "LABORATOIRE_SOLS_BETON", label: "🧪 Laboratoire Essais Sols & Béton (LBTP)" },
  { value: "COORDONNATEUR_SPS", label: "🦺 Coordonnateur Sécurité SPS" },
  { value: "MAITRISE_OEUVRE_ARCHI", label: "🏛️ Cabinet d'Architecture / MOE" },
  { value: "GEOMETRE_EXPERT", label: "📍 Cabinet Géomètre-Topographe" },
];

const STATUSES: { value: StakeholderStatus; label: string }[] = [
  { value: "AGREE", label: "🟢 Agréé & Validé" },
  { value: "ACTIF", label: "🔵 Actif sur Chantier" },
  { value: "EN_ATTENTE_DOCUMENTS", label: "🟡 En Attente Attestations / Assurances" },
  { value: "SUSPENDU", label: "🔴 Suspendu" },
];

export const StakeholderFormModal: React.FC<StakeholderFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  stakeholderToEdit,
}) => {
  const [projectsList, setProjectsList] = useState<ProjectEntity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<StakeholderCategory>("BUREAU_CONTROLE");
  const [specialty, setSpecialty] = useState("");
  const [status, setStatus] = useState<StakeholderStatus>("AGREE");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Abidjan");
  const [country, setCountry] = useState("Côte d'Ivoire");
  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [insuranceCompany, setInsuranceCompany] = useState("");
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState("");
  const [assignedProjectId, setAssignedProjectId] = useState("");
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState("");

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
    if (stakeholderToEdit) {
      setCode(stakeholderToEdit.code);
      setName(stakeholderToEdit.name);
      setCategory(stakeholderToEdit.category);
      setSpecialty(stakeholderToEdit.specialty || "");
      setStatus(stakeholderToEdit.status);
      setPhone(stakeholderToEdit.phone || "");
      setEmail(stakeholderToEdit.email || "");
      setAddress(stakeholderToEdit.address || "");
      setCity(stakeholderToEdit.city || "Abidjan");
      setCountry(stakeholderToEdit.country || "Côte d'Ivoire");
      const primaryContact = stakeholderToEdit.contacts?.[0];
      setContactName(primaryContact?.name || "");
      setContactRole(primaryContact?.role || "");
      setContactPhone(primaryContact?.phone || "");
      setInsuranceCompany(stakeholderToEdit.insuranceCompany || "");
      setInsurancePolicyNumber(stakeholderToEdit.insurancePolicyNumber || "");
      setAssignedProjectId(stakeholderToEdit.assignedProjectIds?.[0] || "");
      setRating(stakeholderToEdit.rating || 5);
      setNotes(stakeholderToEdit.notes || "");
    } else {
      setCode("");
      setName("");
      setCategory("BUREAU_CONTROLE");
      setSpecialty("");
      setStatus("AGREE");
      setPhone("");
      setEmail("");
      setAddress("");
      setCity("Abidjan");
      setCountry("Côte d'Ivoire");
      setContactName("");
      setContactRole("");
      setContactPhone("");
      setInsuranceCompany("AXA Assurances");
      setInsurancePolicyNumber("");
      setAssignedProjectId("");
      setRating(5);
      setNotes("");
    }
  }, [stakeholderToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const selectedPrj = projectsList.find((p) => p.id === assignedProjectId);

      const payload = {
        ...(stakeholderToEdit ? stakeholderToEdit : {}),
        code: code.trim() || undefined,
        name: name.trim(),
        category,
        specialty: specialty.trim(),
        status,
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        country: country.trim(),
        insuranceCompany: insuranceCompany.trim(),
        insurancePolicyNumber: insurancePolicyNumber.trim(),
        rating,
        notes: notes.trim(),
        assignedProjectIds: assignedProjectId ? [assignedProjectId] : [],
        assignedProjectNames: selectedPrj ? [selectedPrj.name] : [],
        contacts: contactName.trim()
          ? [
              {
                id: `ctc_${Date.now()}`,
                name: contactName.trim(),
                role: contactRole.trim() || "Référent Technique",
                phone: contactPhone.trim() || phone.trim(),
                email: email.trim(),
                isPrimary: true,
              },
            ]
          : [],
        documents: stakeholderToEdit?.documents || [],
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
      title={stakeholderToEdit ? `Modifier Intervenant : ${stakeholderToEdit.name}` : "Enregistrer un Nouvel Intervenant / Sous-Traitant BTP"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <AppTextField
              label="Raison Sociale / Nom de l'Organisme *"
              placeholder="Ex: Bureau Veritas, BNETD, SOTRAP-CI"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              leftIcon={<Building className="w-4 h-4 text-orange-600" />}
            />
          </div>

          <AppTextField
            label="Code Intervenant"
            placeholder="Ex: STK-2026-01"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            helperText="Auto-généré si vide"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <AppSelect
            label="Catégorie d'Intervenant *"
            value={category}
            onChange={(e) => setCategory(e.target.value as StakeholderCategory)}
            options={CATEGORIES}
          />

          <AppTextField
            label="Spécialité & Compétence"
            placeholder="Ex: Contrôle Solidité L/S, CFO/CFA, VRD"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          />

          <AppSelect
            label="Statut d'Agrément"
            value={status}
            onChange={(e) => setStatus(e.target.value as StakeholderStatus)}
            options={STATUSES}
          />
        </div>

        {/* Contact info */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-orange-600" />
            Coordonnées & Référent Opérationnel
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <AppTextField
              label="Nom de l'Interlocuteur"
              placeholder="Ex: Ing. Koffi Alain"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />

            <AppTextField
              label="Fonction / Titre"
              placeholder="Ex: Ingénieur Contrôleur Principal"
              value={contactRole}
              onChange={(e) => setContactRole(e.target.value)}
            />

            <AppTextField
              label="Téléphone Direct"
              placeholder="+225 07 00 00 00 00"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AppTextField
              label="Email Professionnel"
              type="email"
              placeholder="contact@bureauveritas.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <AppTextField
              label="Ville / Commune"
              placeholder="Abidjan (Treichville)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        {/* Project assignment & Insurance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AppSelect
            label="Affecter au Chantier"
            value={assignedProjectId}
            onChange={(e) => setAssignedProjectId(e.target.value)}
            options={[
              { value: "", label: "-- Non affecté spécifiquement --" },
              ...projectsList.map((p) => ({
                value: p.id,
                label: `${p.code} - ${p.name}`,
              })),
            ]}
          />

          <AppTextField
            label="Compagnie d'Assurance (Décennale / RC)"
            placeholder="Ex: AXA Assurances CI, NSIA, Allianz"
            value={insuranceCompany}
            onChange={(e) => setInsuranceCompany(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton type="submit" variant="primary" isLoading={isSubmitting} leftIcon={<Check className="w-4 h-4" />}>
            {stakeholderToEdit ? "Enregistrer les Modifications" : "Créer l'Intervenant"}
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
