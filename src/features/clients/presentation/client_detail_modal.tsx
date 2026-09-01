/**
 * AGB CHANTIER - Fiche Détaillée & Gestionnaire Complet Client / MOA - AXE 03
 */

import React, { useState } from "react";
import { AppDialog } from "../../../core/widgets/feedback/app_dialog";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import {
  ClientEntity,
  ClientContact,
  ClientInteraction,
} from "../domain/entities/client_entity";
import { BadgeVariant } from "../../../core/widgets/badges/app_badge";
import { useClients } from "./clients_context";
import { ClientContactModal } from "./client_contact_modal";
import { ClientInteractionModal } from "./client_interaction_modal";
import { ClientFormModal } from "./client_form_modal";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  FileText,
  Star,
  Users,
  HardHat,
  History,
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MessageSquare,
  Sparkles,
  Printer,
  ChevronRight,
} from "lucide-react";

interface ClientDetailModalProps {
  client: ClientEntity | null;
  isOpen: boolean;
  onClose: () => void;
}

const TYPE_LABELS: Record<string, { label: string; variant: BadgeVariant }> = {
  MOA_PUBLIC: { label: "🏛️ MOA Public (État / Collectivité)", variant: "info" },
  PROMOTEUR_PRIVE: { label: "🏢 Promoteur Privé", variant: "inProgress" },
  ENTREPRISE_PARTENAIRE: { label: "🏗️ Entreprise Générale", variant: "warning" },
  PARTICULIER: { label: "🏡 Particulier", variant: "neutral" },
  BAILLEUR_SOCIAL: { label: "🏘️ Bailleur Social", variant: "info" },
  INVESTISSEUR: { label: "💼 Investisseur", variant: "success" },
};

const STATUS_LABELS: Record<string, { label: string; variant: BadgeVariant }> = {
  ACTIF: { label: "Actif", variant: "success" },
  PROSPECT: { label: "Prospect", variant: "warning" },
  EN_NEGOCIATION: { label: "En Négociation", variant: "info" },
  ARCHIVE: { label: "Archivé", variant: "neutral" },
  SUSPENDU: { label: "Suspendu", variant: "danger" },
};

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  isOpen,
  onClose,
}) => {
  const {
    updateClient,
    deleteClient,
    addContact,
    updateContact,
    deleteContact,
    addInteraction,
    deleteInteraction,
  } = useClients();

  const [activeTab, setActiveTab] = useState<"overview" | "contacts" | "projects" | "interactions">("overview");

  // Sub-modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ClientContact | null>(null);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!client) return null;

  const typeConfig = TYPE_LABELS[client.type] || { label: client.type, variant: "neutral" as const };
  const statusConfig = STATUS_LABELS[client.status] || { label: client.status, variant: "neutral" as const };

  const outstanding = Math.max(0, (client.totalContractValue || 0) - (client.totalPaidValue || 0));
  const paymentRate =
    client.totalContractValue > 0
      ? Math.min(100, Math.round((client.totalPaidValue / client.totalContractValue) * 100))
      : 0;

  const primaryContact = client.contacts.find((c) => c.isPrimary) || client.contacts[0];

  const handlePrintSheet = () => {
    window.print();
  };

  const handleDeleteClient = async () => {
    await deleteClient(client.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      <AppDialog
        isOpen={isOpen}
        onClose={onClose}
        title={client.name}
        subtitle={`${client.code} • ${client.commercialName ? client.commercialName + " • " : ""}${client.city}`}
        maxWidth="full"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <AppButton
                variant="outline"
                size="sm"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={handlePrintSheet}
              >
                Imprimer la fiche
              </AppButton>
              <AppButton
                variant="outline"
                size="sm"
                leftIcon={<Trash2 className="w-4 h-4 text-red-500" />}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Supprimer
              </AppButton>
            </div>

            <div className="flex items-center gap-2">
              <AppButton
                variant="outline"
                size="sm"
                leftIcon={<Edit2 className="w-4 h-4" />}
                onClick={() => setIsEditOpen(true)}
              >
                Modifier la fiche
              </AppButton>
              <AppButton variant="primary" size="sm" onClick={onClose}>
                Fermer
              </AppButton>
            </div>
          </div>
        }
      >
        <div className="space-y-4 py-1">
          {/* Header Metric & Badges Bar */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <AppBadge variant={typeConfig.variant} size="sm">
                  {typeConfig.label}
                </AppBadge>
                <AppBadge variant={statusConfig.variant} size="sm">
                  {statusConfig.label}
                </AppBadge>
                <div className="flex items-center gap-0.5 px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{client.rating} / 5</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {client.address}, {client.city} • {client.country}
              </p>
            </div>

            {/* Financial Summary */}
            <div className="flex items-center gap-6 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Marchés</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {client.totalContractValue.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
              <div className="h-7 w-px bg-slate-200 dark:bg-slate-700" />
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-500 block">Encaissé ({paymentRate}%)</span>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {client.totalPaidValue.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
              <div className="h-7 w-px bg-slate-200 dark:bg-slate-700" />
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-500 block">Solde à percevoir</span>
                <span className="text-sm font-extrabold text-orange-600 dark:text-orange-400 tabular-nums">
                  {outstanding.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "overview"
                  ? "border-orange-500 text-orange-600 dark:text-orange-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Vue Générale & Coordonnées
            </button>

            <button
              onClick={() => setActiveTab("contacts")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "contacts"
                  ? "border-orange-500 text-orange-600 dark:text-orange-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Users className="w-4 h-4" />
              Interlocuteurs & Contacts MOA ({client.contacts.length})
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "projects"
                  ? "border-orange-500 text-orange-600 dark:text-orange-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <HardHat className="w-4 h-4" />
              Chantiers & Projets Liés ({(client.projects || []).length})
            </button>

            <button
              onClick={() => setActiveTab("interactions")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "interactions"
                  ? "border-orange-500 text-orange-600 dark:text-orange-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <History className="w-4 h-4" />
              Journal des Échanges & Réunions ({(client.interactions || []).length})
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-150">
              {/* Left Column: Identifiants & Légal */}
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-500" />
                    Identifiants Légaux & Modalités BTP
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                      <span className="text-slate-400 block text-[11px]">N° RCCM</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                        {client.rccm || "Non renseigné"}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                      <span className="text-slate-400 block text-[11px]">N° Compte Contribuable / IFU</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                        {client.ifuTaxNumber || "Non renseigné"}
                      </span>
                    </div>

                    <div className="sm:col-span-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                      <span className="text-slate-400 block text-[11px]">Modalités de Règlement & Conditions</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {client.paymentTerms}
                      </span>
                    </div>
                  </div>

                  {client.notes && (
                    <div className="p-3 bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/30 rounded-lg text-xs">
                      <span className="font-bold text-orange-900 dark:text-orange-300 block mb-1">
                        Remarques & Exigences Particulières :
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{client.notes}</p>
                    </div>
                  )}

                  {client.tags && client.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {client.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Progress bar of payments */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Taux de recouvrement des décomptes
                    </span>
                    <span className="font-extrabold text-orange-600 dark:text-orange-400">{paymentRate}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${paymentRate}%` }}
                    />
                    <div
                      className="bg-orange-400 h-full transition-all duration-500"
                      style={{ width: `${100 - paymentRate}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Encaissé : {client.totalPaidValue.toLocaleString("fr-FR")} FCFA</span>
                    <span>Restant : {outstanding.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Direct Contact & Location */}
              <div className="space-y-4">
                {/* Primary Contact Card */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    Interlocuteur Privilégié
                  </h4>

                  {primaryContact ? (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm shrink-0">
                          {primaryContact.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {primaryContact.name}
                          </p>
                          <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium truncate">
                            {primaryContact.role}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 text-xs">
                        <a
                          href={`tel:${primaryContact.phone}`}
                          className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-orange-500" />
                          <span className="font-semibold">{primaryContact.phone}</span>
                        </a>

                        <a
                          href={`mailto:${primaryContact.email}`}
                          className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors truncate"
                        >
                          <Mail className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span className="truncate">{primaryContact.email}</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Aucun contact enregistré</p>
                  )}
                </div>

                {/* Company Info */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    Siège & Coordonnées
                  </h4>

                  <div className="space-y-2 text-slate-700 dark:text-slate-300 pt-1">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{client.address}, {client.city}, {client.country}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{client.phone}</span>
                    </div>

                    {client.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a
                          href={client.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-orange-600 hover:underline truncate"
                        >
                          {client.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTACTS */}
          {activeTab === "contacts" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Répertoire des Représentants & Interlocuteurs MOA
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Directeurs techniques, conducteurs d'opérations, architectes et comptables
                  </p>
                </div>

                <AppButton
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => {
                    setEditingContact(null);
                    setIsContactModalOpen(true);
                  }}
                >
                  Ajouter un interlocuteur
                </AppButton>
              </div>

              {client.contacts.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Aucun interlocuteur enregistré pour ce client.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {client.contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 relative group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm shrink-0">
                            {contact.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {contact.name}
                              </span>
                              {contact.isPrimary && (
                                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                                  Point Focal
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium">
                              {contact.role} {contact.department ? `• ${contact.department}` : ""}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingContact(contact);
                              setIsContactModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Modifier"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteContact(client.id, contact.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Contact Channels */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-orange-600 transition-colors truncate"
                        >
                          <Phone className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span className="truncate">{contact.phone}</span>
                        </a>

                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-orange-600 transition-colors truncate"
                        >
                          <Mail className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span className="truncate">{contact.email}</span>
                        </a>
                      </div>

                      {contact.notes && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg italic">
                          {contact.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Chantiers & Marchés Associés
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Suivi d'avancement et états financiers des chantiers commandés
                  </p>
                </div>
              </div>

              {(!client.projects || client.projects.length === 0) ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <HardHat className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">
                    Aucun chantier rattaché pour le moment. Les projets créés dans l'Axe 04 s'afficheront ici.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {client.projects.map((prj) => (
                    <div
                      key={prj.id}
                      className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 font-bold">
                            {prj.code}
                          </span>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                            {prj.name}
                          </h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {prj.location}
                          </p>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {prj.status}
                        </span>
                      </div>

                      {/* Financial info */}
                      <div className="flex items-center justify-between text-xs py-1 border-t border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Budget Global</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {prj.budget.toLocaleString("fr-FR")} FCFA
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 text-[10px] block">Encaissé</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {prj.paidAmount.toLocaleString("fr-FR")} FCFA
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Avancement des travaux</span>
                          <span className="font-bold text-orange-600">{prj.progressPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="bg-orange-500 h-full rounded-full"
                            style={{ width: `${prj.progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span>Début : {prj.startDate}</span>
                        <span>Livraison : {prj.endDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INTERACTIONS */}
          {activeTab === "interactions" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Journal d'Échanges, Réunions & Décisions MOA
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Historique chronologique avec procès-verbaux et points de blocage
                  </p>
                </div>

                <AppButton
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setIsInteractionModalOpen(true)}
                >
                  Consigner un échange
                </AppButton>
              </div>

              {(!client.interactions || client.interactions.length === 0) ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <History className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Aucun échange consigné pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {client.interactions.map((interaction) => (
                    <div
                      key={interaction.id}
                      className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 relative"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {interaction.type.replace(/_/g, " ")}
                            </span>
                            {interaction.priority === "URGENTE" && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/10 text-red-600 border border-red-500/20">
                                URGENT
                              </span>
                            )}
                            {interaction.priority === "IMPORTANTE" && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                IMPORTANT
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400">
                              {new Date(interaction.date).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                            {interaction.title}
                          </h5>

                          {interaction.projectName && (
                            <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium">
                              Chantier concerné : {interaction.projectName}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => deleteInteraction(client.id, interaction.id)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded cursor-pointer"
                          title="Supprimer cette entrée"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg">
                        {interaction.summary}
                      </p>

                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span>Rapporteur : <strong className="text-slate-600 dark:text-slate-300">{interaction.authorName}</strong></span>
                        {interaction.followUpDate && (
                          <span className="text-orange-600 dark:text-orange-400 font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Relance prévue le : {interaction.followUpDate}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </AppDialog>

      {/* Sub-Modal Edit Client */}
      {isEditOpen && (
        <ClientFormModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={updateClient}
          initialClient={client}
        />
      )}

      {/* Sub-Modal Contact */}
      {isContactModalOpen && (
        <ClientContactModal
          isOpen={isContactModalOpen}
          onClose={() => {
            setIsContactModalOpen(false);
            setEditingContact(null);
          }}
          onSave={async (contactData) => {
            if ("id" in contactData) {
              await updateContact(client.id, contactData as ClientContact);
            } else {
              await addContact(client.id, contactData);
            }
          }}
          initialContact={editingContact}
        />
      )}

      {/* Sub-Modal Interaction */}
      {isInteractionModalOpen && (
        <ClientInteractionModal
          isOpen={isInteractionModalOpen}
          onClose={() => setIsInteractionModalOpen(false)}
          onSave={async (data) => {
            await addInteraction(client.id, data);
          }}
          clientId={client.id}
          clientProjects={client.projects}
        />
      )}

      {/* Confirm Delete Dialog */}
      {showDeleteConfirm && (
        <AppDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Confirmer la suppression"
          subtitle="Attention : Cette action retirera la fiche du client."
          maxWidth="sm"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <AppButton variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Annuler
              </AppButton>
              <AppButton variant="danger" size="sm" onClick={handleDeleteClient}>
                Supprimer définitivement
              </AppButton>
            </div>
          }
        >
          <div className="py-3 text-xs text-slate-600 dark:text-slate-300">
            Êtes-vous certain de vouloir supprimer le client <strong>"{client.name}"</strong> ?
          </div>
        </AppDialog>
      )}
    </>
  );
};
