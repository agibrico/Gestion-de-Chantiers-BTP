/**
 * AGB CHANTIER - Modal d'Ajout / Modification d'un Contact MOA - AXE 03
 */

import React, { useState } from "react";
import { AppDialog } from "../../../core/widgets/feedback/app_dialog";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { ClientContact } from "../domain/entities/client_entity";
import { UserCheck, Phone, Mail, Building, Briefcase } from "lucide-react";

interface ClientContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Omit<ClientContact, "id"> | ClientContact) => Promise<void>;
  initialContact?: ClientContact | null;
}

const COMMON_ROLES = [
  { value: "Directeur Général / Gérant", label: "Directeur Général / Gérant" },
  { value: "Directeur Technique MOA", label: "Directeur Technique MOA" },
  { value: "Conducteur d'Opérations", label: "Conducteur d'Opérations" },
  { value: "Chef de Projet BTP", label: "Chef de Projet BTP" },
  { value: "Architecte Mandataire / Délégué", label: "Architecte Mandataire / Délégué" },
  { value: "Responsable Marchés & Achats", label: "Responsable Marchés & Achats" },
  { value: "Directeur Administratif & Financier (DAF)", label: "Directeur Administratif & Financier (DAF)" },
  { value: "Responsable Suivi Financier & Facturation", label: "Responsable Suivi Financier & Facturation" },
  { value: "Ingénieur Bureau de Contrôle", label: "Ingénieur Bureau de Contrôle" },
  { value: "Responsable HSE Client", label: "Responsable HSE Client" },
  { value: "Autre interlocuteur", label: "Autre interlocuteur" },
];

export const ClientContactModal: React.FC<ClientContactModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialContact,
}) => {
  const [name, setName] = useState(initialContact?.name || "");
  const [role, setRole] = useState(initialContact?.role || "Conducteur d'Opérations");
  const [department, setDepartment] = useState(initialContact?.department || "");
  const [phone, setPhone] = useState(initialContact?.phone || "");
  const [email, setEmail] = useState(initialContact?.email || "");
  const [isPrimary, setIsPrimary] = useState(initialContact?.isPrimary ?? false);
  const [notes, setNotes] = useState(initialContact?.notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    try {
      setIsSubmitting(true);
      if (initialContact) {
        await onSave({
          ...initialContact,
          name: name.trim(),
          role: role.trim(),
          department: department.trim() || undefined,
          phone: phone.trim(),
          email: email.trim(),
          isPrimary,
          notes: notes.trim() || undefined,
        });
      } else {
        await onSave({
          name: name.trim(),
          role: role.trim(),
          department: department.trim() || undefined,
          phone: phone.trim(),
          email: email.trim(),
          isPrimary,
          notes: notes.trim() || undefined,
        });
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
      title={initialContact ? "Modifier l'Interlocuteur" : "Ajouter un Interlocuteur MOA"}
      subtitle="Coordonnées professionnelles et rôle au sein de l'organisation"
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
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
            {initialContact ? "Enregistrer les modifications" : "Ajouter le contact"}
          </AppButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <AppTextField
          label="Nom & Prénoms de l'interlocuteur"
          placeholder="Ex: Ing. Koffi Marc"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          leftIcon={<UserCheck className="w-4 h-4" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AppSelect
            label="Fonction / Rôle BTP"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={COMMON_ROLES}
          />

          <AppTextField
            label="Département / Direction"
            placeholder="Ex: Direction des Travaux"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            leftIcon={<Building className="w-4 h-4" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AppTextField
            label="Téléphone direct (Appel / WhatsApp)"
            placeholder="+225 07 00 00 00 00"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            leftIcon={<Phone className="w-4 h-4" />}
          />

          <AppTextField
            label="Adresse Email professionnelle"
            placeholder="contact@organisation.ci"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
          />
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Interlocuteur Principal (Point focal MOA)
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Ce contact sera affiché en priorité sur les fiches de chantier et convocations.
            </p>
          </div>
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
            className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Notes / Disponibilités
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes sur ses créneaux de réunion, responsabilités particulières..."
            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-orange-500"
          />
        </div>
      </form>
    </AppDialog>
  );
};
