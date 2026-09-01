/**
 * AGB CHANTIER - Écran de Gestion des Réceptions Provisoires & Définitives - AXE 20
 */

import React, { useState, useEffect } from "react";
import {
  Award,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building,
  Calendar,
  Lock,
  FileCheck,
  BadgeDollarSign,
  Users,
} from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { HandoverPVEntity } from "../domain/entities/handover_entity";
import { HandoverRepositoryImpl } from "../data/handover_repository_impl";
import { CreateHandoverPvModal } from "./create_handover_pv_modal";

export const HandoverManagementScreen: React.FC = () => {
  const [handovers, setHandovers] = useState<HandoverPVEntity[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const all = await HandoverRepositoryImpl.getAllHandovers();
      setHandovers(all);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateHandover = async (
    data: Omit<HandoverPVEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ) => {
    await HandoverRepositoryImpl.createHandover(data);
    await loadData();
  };

  const filteredHandovers = handovers.filter((h) => {
    return (
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.pvNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              AXE 20
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Réception Provisoire, GPA & Réception Définitive
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Procès-verbaux de réception contradictoires, suivi de la Garantie de Parfait Achèvement (GPA) et mainlevées de retenues de garantie
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AppButton
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Établir un PV de Réception
          </AppButton>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Procès-Verbaux Établis"
          value={`${handovers.length} Actes`}
          subValue="Signés contradictoirement"
          icon={<Award className="w-6 h-6" />}
          iconColor="text-orange-600"
          badgeText="Légal"
          badgeVariant="default"
        />
        <StatCard
          label="Garantie GPA Active (1 An)"
          value="1 Ouvrage"
          subValue="Tour Résidentielle Ivoire"
          icon={<Clock className="w-6 h-6" />}
          iconColor="text-blue-600"
          badgeText="En cours"
          badgeVariant="default"
        />
        <StatCard
          label="Réceptions Définitives"
          value="1 Clôturé"
          subValue="Complexe Commercial Plateau"
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconColor="text-emerald-600"
          badgeText="Libéré"
          badgeVariant="success"
        />
        <StatCard
          label="Retenues de Garantie Libérées"
          value="65.0 M FCFA"
          subValue="Mainlevée bancaire accordée"
          icon={<BadgeDollarSign className="w-6 h-6" />}
          iconColor="text-purple-600"
          badgeText="Mainlevée"
          badgeVariant="default"
        />
      </div>

      {/* Grid of Handover Cards */}
      <div className="space-y-6">
        {filteredHandovers.map((pv) => (
          <div
            key={pv.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-orange-500/40 transition-all space-y-6"
          >
            {/* PV Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                    {pv.pvNumber}
                  </span>
                  <span className="text-xs text-slate-500">Chantier : <strong>{pv.projectName}</strong></span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{pv.title}</h3>
              </div>

              <div>
                {pv.verdict === "LEVEE_TOTALE_GPA_VALIDEE" ? (
                  <AppBadge variant="success">RÉCEPTION DÉFINITIVE VALIDÉE</AppBadge>
                ) : pv.verdict === "PRONONCEE_AVEC_RESERVES" ? (
                  <AppBadge variant="warning">PRONONCÉE AVEC RÉSERVES (GPA EN COURS)</AppBadge>
                ) : (
                  <AppBadge variant="default">RÉCEPTION PRONONCÉE SANS RÉSERVE</AppBadge>
                )}
              </div>
            </div>

            {/* PV Dates & Legal Milestones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 font-mono">Date de Visite</span>
                <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{pv.visitDate}</div>
              </div>
              <div>
                <span className="text-slate-400 font-mono">Prise d'Effet Juridique</span>
                <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{pv.effectiveDate}</div>
              </div>
              <div>
                <span className="text-slate-400 font-mono">Échéance Fin GPA (1 an)</span>
                <div className="font-bold text-orange-600 dark:text-orange-400 text-sm mt-0.5">{pv.warrantyEndDate}</div>
              </div>
              <div>
                <span className="text-slate-400 font-mono">Caution Retenue 5%</span>
                <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                  {(pv.retentionAmountFCFA / 1000000).toFixed(1)} M FCFA
                  {pv.isFinalReleaseGranted && <span className="text-emerald-600 ml-1 text-xs">(Libérée)</span>}
                </div>
              </div>
            </div>

            {/* Observations & Progress */}
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white">Observations du Maître d'Ouvrage (MOA) : </span>
                <span className="text-slate-600 dark:text-slate-300 italic">{pv.observationsMOA || "Aucune observation formulée."}</span>
              </div>
            </div>

            {/* Signatures Row */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Signataires de l'Acte :</span>
                {pv.signatories.map((sig, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span><strong>{sig.role.replace(/_/g, " ")}</strong> ({sig.name})</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <AppButton size="sm" variant="outline" leftIcon={<FileCheck className="w-3.5 h-3.5" />}>
                  Télécharger le PV Signé
                </AppButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <CreateHandoverPvModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateHandover}
      />
    </div>
  );
};
