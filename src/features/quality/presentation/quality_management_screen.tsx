/**
 * AGB CHANTIER - Écran de Contrôle Qualité & Essais Béton - AXE 15
 */

import React, { useState, useEffect } from "react";
import {
  FileCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building,
  Activity,
  Layers,
  FileSpreadsheet,
} from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { QualityInspectionEntity, QualityStatus } from "../domain/entities/quality_entity";
import { QualityRepositoryImpl } from "../data/quality_repository_impl";
import { NewQualityInspectionModal } from "./new_quality_inspection_modal";

export const QualityManagementScreen: React.FC = () => {
  const [inspections, setInspections] = useState<QualityInspectionEntity[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const all = await QualityRepositoryImpl.getAllInspections();
      setInspections(all);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateInspection = async (
    data: Omit<QualityInspectionEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ) => {
    await QualityRepositoryImpl.createInspection(data);
    await loadData();
  };

  const filteredInspections = inspections.filter((item) => {
    const matchStatus = selectedStatus === "ALL" || item.status === selectedStatus;
    const matchQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.inspectionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.inspectorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locationDetails.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  const total = inspections.length;
  const conformCount = inspections.filter((i) => i.status === "CONFORME").length;
  const withReservesCount = inspections.filter((i) => i.status === "AVEC_RESERVES").length;
  const nonConformCount = inspections.filter((i) => i.status === "NON_CONFORME").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              AXE 15
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Contrôle Qualité & Essais Matériaux
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fiches de réception de support, conformité des ferraillages, essais d'écrasement béton et tolérances DTU
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AppButton
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
            tooltip="Ouvrir la saisie d'un contrôle qualité : fiche d'inspection, bon à couler ou essai d'écrasement béton"
            tooltipPosition="bottom"
          >
            Nouveau Contrôle Qualité
          </AppButton>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Contrôles Réalisés"
          value={`${total} Fiches`}
          subValue="Inspections & PV validés"
          icon={<FileCheck className="w-6 h-6" />}
          iconColor="text-orange-600"
          badgeText="Total"
          badgeVariant="neutral"
        />
        <StatCard
          label="Conformes (B.A.T.)"
          value={`${conformCount} / ${total}`}
          subValue="Autorisations de coulage"
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconColor="text-emerald-600"
          badgeText="Conforme"
          badgeVariant="success"
        />
        <StatCard
          label="Avec Réserves Mineures"
          value={`${withReservesCount} Dossiers`}
          subValue="Reprises sous 48h"
          icon={<Clock className="w-6 h-6" />}
          iconColor="text-amber-600"
          badgeText="À corriger"
          badgeVariant="warning"
        />
        <StatCard
          label="Non-Conformités Bloquantes"
          value={`${nonConformCount} Alerte`}
          subValue="Arrêt d'ouvrage"
          icon={<AlertTriangle className="w-6 h-6" />}
          iconColor="text-red-600"
          badgeText="Refus"
          badgeVariant="danger"
        />
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <AppTextField
            placeholder="Rechercher par titre, N° de contrôle, inspecteur, zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
        <div className="w-full md:w-64">
          <AppSelect
            options={[
              { value: "ALL", label: "Tous les statuts de conformité" },
              { value: "CONFORME", label: "Conforme" },
              { value: "AVEC_RESERVES", label: "Avec réserves" },
              { value: "NON_CONFORME", label: "Non conforme" },
              { value: "EN_ATTENTE_RESULTATS", label: "En attente labo" },
            ]}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInspections.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-orange-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                    {item.inspectionNumber}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white mt-1 text-base">{item.title}</h3>
                </div>
                <div>
                  {item.status === "CONFORME" ? (
                    <AppBadge variant="success">CONFORME</AppBadge>
                  ) : item.status === "AVEC_RESERVES" ? (
                    <AppBadge variant="warning">AVEC RÉSERVES</AppBadge>
                  ) : (
                    <AppBadge variant="danger">NON CONFORME</AppBadge>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <div>📍 Localisation : <strong className="text-slate-700 dark:text-slate-300">{item.locationDetails}</strong></div>
                <div>🏢 Inspecteur : <span className="font-medium text-slate-800 dark:text-slate-200">{item.inspectorName}</span> ({item.inspectorOrganization})</div>
                <div>📅 Date contrôle : {item.inspectionDate}</div>
              </div>

              {/* Concrete crush test results if present */}
              {item.concreteTests && item.concreteTests.length > 0 && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Résultats Écrasement LBTP</span>
                    <span className="text-emerald-600 font-mono">fc28 ≥ 25 MPa</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                    {item.concreteTests.map((t, idx) => (
                      <div key={idx} className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                        <span className="text-slate-500">{t.sampleNumber} ({t.crushAgeDays}j)</span>
                        <strong className="text-emerald-600">{t.measuredStrengthMPa} MPa</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {item.observations && (
                <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  « {item.observations} »
                </p>
              )}
            </div>

            <div className="pt-3 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">{item.inspectionType}</span>
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                PV Validé
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <NewQualityInspectionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateInspection}
      />
    </div>
  );
};
