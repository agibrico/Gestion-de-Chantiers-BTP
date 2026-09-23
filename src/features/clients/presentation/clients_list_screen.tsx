/**
 * AGB CHANTIER - Écran Principal de Gestion des Clients & Maîtres d'Ouvrage (MOA) - AXE 03
 */

import React, { useState } from "react";
import { useClients } from "./clients_context";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppBadge, BadgeVariant } from "../../../core/widgets/badges/app_badge";
import { ClientEntity, ClientType, ClientStatus } from "../domain/entities/client_entity";
import { ClientDetailModal } from "./client_detail_modal";
import { ClientFormModal } from "./client_form_modal";
import { AgbCreatorSignature } from "../../../core/widgets/display/agb_creator_signature";
import {
  Users,
  Building2,
  Coins,
  CreditCard,
  HardHat,
  Search,
  Plus,
  Download,
  LayoutGrid,
  List,
  Phone,
  Mail,
  MapPin,
  Star,
  ExternalLink,
  ChevronRight,
  Filter,
  Layers,
} from "lucide-react";

const TYPE_CONFIGS: Record<string, { label: string; badge: BadgeVariant }> = {
  MOA_PUBLIC: { label: "🏛️ MOA Public", badge: "info" },
  PROMOTEUR_PRIVE: { label: "🏢 Promoteur Privé", badge: "inProgress" },
  ENTREPRISE_PARTENAIRE: { label: "🏗️ Entreprise Partenaire", badge: "warning" },
  PARTICULIER: { label: "🏡 Particulier", badge: "neutral" },
  BAILLEUR_SOCIAL: { label: "🏘️ Bailleur Social", badge: "info" },
  INVESTISSEUR: { label: "💼 Investisseur", badge: "success" },
};

const STATUS_CONFIGS: Record<string, { label: string; badge: BadgeVariant }> = {
  ACTIF: { label: "Actif", badge: "success" },
  PROSPECT: { label: "Prospect", badge: "warning" },
  EN_NEGOCIATION: { label: "En Négociation", badge: "info" },
  ARCHIVE: { label: "Archivé", badge: "neutral" },
  SUSPENDU: { label: "Suspendu", badge: "danger" },
};

export const ClientsListScreen: React.FC = () => {
  const {
    clients,
    selectedClient,
    setSelectedClient,
    stats,
    filterQuery,
    setFilterQuery,
    createClient,
    exportCsv,
  } = useClients();

  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
              AXE 03 • PRODUCTION
            </span>
            <span className="text-xs text-slate-400">Offline-First IndexedDB</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Clients, Maîtres d'Ouvrage (MOA) & Contacts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Répertoire centralisé des donneurs d'ordres BTP, suivi contractuel, interlocuteurs et journal d'échanges
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <AppButton
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={exportCsv}
          >
            Export CSV
          </AppButton>

          <AppButton
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsNewClientModalOpen(true)}
          >
            Nouveau Client / MOA
          </AppButton>
        </div>
      </div>

      {/* KPI Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <StatCard
            label="Total MOA"
            value={stats.totalClients}
            subValue={`${stats.activeClients} actifs`}
            icon={<Building2 className="w-5 h-5" />}
            iconBgColor="bg-blue-50 dark:bg-blue-950/40"
            iconColor="text-blue-600 dark:text-blue-400"
          />

          <StatCard
            label="Volume Marchés"
            value={`${(stats.totalContractValue / 1000000).toFixed(0)} M`}
            subValue="FCFA cumulés"
            icon={<Coins className="w-5 h-5" />}
            iconBgColor="bg-orange-50 dark:bg-orange-950/40"
            iconColor="text-orange-600 dark:text-orange-400"
          />

          <StatCard
            label="Encaissé"
            value={`${(stats.totalPaidValue / 1000000).toFixed(0)} M`}
            subValue={stats.totalContractValue > 0 ? `${Math.round((stats.totalPaidValue / stats.totalContractValue) * 100)}% encaissé` : "0%"}
            icon={<CreditCard className="w-5 h-5" />}
            iconBgColor="bg-emerald-50 dark:bg-emerald-950/40"
            iconColor="text-emerald-600 dark:text-emerald-400"
          />

          <StatCard
            label="Solde à Recouvrer"
            value={`${(stats.outstandingBalance / 1000000).toFixed(0)} M`}
            subValue="Situations en cours"
            icon={<CreditCard className="w-5 h-5" />}
            iconBgColor="bg-amber-50 dark:bg-amber-950/40"
            iconColor="text-amber-600 dark:text-amber-400"
          />

          <StatCard
            label="Chantiers Liés"
            value={stats.totalLinkedProjects}
            subValue="Opérations BTP"
            icon={<HardHat className="w-5 h-5" />}
            iconBgColor="bg-purple-50 dark:bg-purple-950/40"
            iconColor="text-purple-600 dark:text-purple-400"
          />

          <StatCard
            label="Note Moyenne"
            value={`${stats.averageRating} / 5`}
            subValue="Solvabilité & Partenariat"
            icon={<Star className="w-5 h-5 fill-amber-400 text-amber-400" />}
            iconBgColor="bg-amber-50 dark:bg-amber-950/40"
            iconColor="text-amber-500"
          />
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          {/* Search bar */}
          <div className="lg:col-span-2">
            <AppTextField
              placeholder="Rechercher par nom, code, ville, téléphone, contact..."
              value={filterQuery.search || ""}
              onChange={(e) => setFilterQuery((prev) => ({ ...prev, search: e.target.value }))}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          {/* Type Filter */}
          <AppSelect
            value={filterQuery.type || "ALL"}
            onChange={(e) => setFilterQuery((prev) => ({ ...prev, type: e.target.value as any }))}
            options={[
              { value: "ALL", label: "Tous les types de MOA" },
              { value: "MOA_PUBLIC", label: "🏛️ MOA Publics (État/Mairie)" },
              { value: "PROMOTEUR_PRIVE", label: "🏢 Promoteurs Privés" },
              { value: "ENTREPRISE_PARTENAIRE", label: "🏗️ Entreprises Partenaires" },
              { value: "PARTICULIER", label: "🏡 Particuliers" },
              { value: "BAILLEUR_SOCIAL", label: "🏘️ Bailleurs Sociaux" },
              { value: "INVESTISSEUR", label: "💼 Investisseurs" },
            ]}
          />

          {/* Status Filter */}
          <AppSelect
            value={filterQuery.status || "ALL"}
            onChange={(e) => setFilterQuery((prev) => ({ ...prev, status: e.target.value as any }))}
            options={[
              { value: "ALL", label: "Tous les statuts" },
              { value: "ACTIF", label: "🟢 Actifs" },
              { value: "PROSPECT", label: "🟡 Prospects" },
              { value: "EN_NEGOCIATION", label: "🟠 En Négociation" },
              { value: "ARCHIVE", label: "⚪ Archivés" },
              { value: "SUSPENDU", label: "🔴 Suspendus" },
            ]}
          />

          {/* View Mode & Sort */}
          <div className="flex items-center justify-end gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-xs"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
                title="Vue Grille"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-xs"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
                title="Vue Tabulaire"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <AppSelect
              value={filterQuery.sortBy || "createdAt"}
              onChange={(e) => setFilterQuery((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              options={[
                { value: "createdAt", label: "Date création" },
                { value: "name", label: "Nom alphabétique" },
                { value: "totalContractValue", label: "Valeur marchés" },
                { value: "rating", label: "Notation" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Main Content: Grid vs Table */}
      {clients.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Aucun client ou MOA ne correspond à vos critères
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Ajustez votre recherche ou réinitialisez les filtres pour afficher l'ensemble des donneurs d'ordres.
          </p>
          <AppButton
            variant="outline"
            size="sm"
            onClick={() => setFilterQuery({ search: "", type: "ALL", status: "ALL", sortBy: "createdAt", sortOrder: "desc" })}
          >
            Réinitialiser les filtres
          </AppButton>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => {
            const typeInfo = TYPE_CONFIGS[client.type] || { label: client.type, badge: "neutral" as const };
            const statusInfo = STATUS_CONFIGS[client.status] || { label: client.status, badge: "neutral" as const };
            const primaryContact = client.contacts.find((c) => c.isPrimary) || client.contacts[0];
            const paymentPercent =
              client.totalContractValue > 0
                ? Math.min(100, Math.round((client.totalPaidValue / client.totalContractValue) * 100))
                : 0;

            return (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="bg-white dark:bg-[#131D31] border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 dark:hover:border-orange-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-150 hover:shadow-md cursor-pointer group"
              >
                {/* Card Top */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                        {client.code}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors line-clamp-1">
                        {client.name}
                      </h3>
                      {client.commercialName && (
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 line-clamp-1">
                          {client.commercialName}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {client.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <AppBadge variant={typeInfo.badge} size="sm">
                      {typeInfo.label}
                    </AppBadge>
                    <AppBadge variant={statusInfo.badge} size="sm">
                      {statusInfo.label}
                    </AppBadge>
                  </div>

                  {/* Primary Contact Row */}
                  {primaryContact && (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between text-xs">
                      <div className="truncate">
                        <span className="text-slate-400 text-[10px] block uppercase font-semibold">
                          Contact Principal
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                          {primaryContact.name}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {primaryContact.role}
                        </span>
                      </div>
                      <a
                        href={`tel:${primaryContact.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors shrink-0 ml-2"
                        title="Appeler"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {/* Address */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{client.city} • {client.country}</span>
                  </div>
                </div>

                {/* Card Bottom / Financial Bar */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Marchés</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {client.totalContractValue.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-emerald-500 block">Encaissé ({paymentPercent}%)</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {client.totalPaidValue.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                  </div>

                  {/* Progress line */}
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${paymentPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>{(client.projects || []).length} chantier(s)</span>
                    <span className="text-orange-500 font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      Voir la fiche <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 border-b border-slate-200 dark:border-slate-800 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3.5">Code & Raison Sociale</th>
                  <th className="p-3.5">Type & Statut</th>
                  <th className="p-3.5">Ville</th>
                  <th className="p-3.5">Interlocuteur Principal</th>
                  <th className="p-3.5 text-right">Volume Marchés</th>
                  <th className="p-3.5 text-right">Encaissé</th>
                  <th className="p-3.5 text-center">Note</th>
                  <th className="p-3.5 text-center">Chantiers</th>
                  <th className="p-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {clients.map((client) => {
                  const typeInfo = TYPE_CONFIGS[client.type] || { label: client.type, badge: "neutral" as const };
                  const statusInfo = STATUS_CONFIGS[client.status] || { label: client.status, badge: "neutral" as const };
                  const primaryContact = client.contacts.find((c) => c.isPrimary) || client.contacts[0];

                  return (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {client.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {client.code} {client.commercialName ? `• ${client.commercialName}` : ""}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="flex flex-col gap-1">
                          <AppBadge variant={typeInfo.badge} size="sm">
                            {typeInfo.label}
                          </AppBadge>
                          <AppBadge variant={statusInfo.badge} size="sm">
                            {statusInfo.label}
                          </AppBadge>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span>{client.city}</span>
                      </td>

                      <td className="p-3.5">
                        {primaryContact ? (
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              {primaryContact.name}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {primaryContact.phone}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">-</span>
                        )}
                      </td>

                      <td className="p-3.5 text-right font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {client.totalContractValue.toLocaleString("fr-FR")} FCFA
                      </td>

                      <td className="p-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {client.totalPaidValue.toLocaleString("fr-FR")} FCFA
                      </td>

                      <td className="p-3.5 text-center">
                        <div className="inline-flex items-center gap-1 font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{client.rating}</span>
                        </div>
                      </td>

                      <td className="p-3.5 text-center font-semibold">
                        {(client.projects || []).length}
                      </td>

                      <td className="p-3.5 text-center">
                        <AppButton
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClient(client);
                          }}
                        >
                          Détails
                        </AppButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Creation Modal */}
      {isNewClientModalOpen && (
        <ClientFormModal
          isOpen={isNewClientModalOpen}
          onClose={() => setIsNewClientModalOpen(false)}
          onSave={createClient}
        />
      )}

      {/* Detail Modal */}
      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}

      {/* Creator Signature AGB */}
      <div className="pt-6">
        <AgbCreatorSignature />
      </div>
    </div>
  );
};
