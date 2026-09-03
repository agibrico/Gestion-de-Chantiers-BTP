/**
 * AGB CHANTIER - Écran de Gestion des Engins & Matériels - AXE 12
 */

import React, { useState, useEffect } from "react";
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Truck,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Fuel,
  Gauge,
  Calendar,
  Building,
  UserCheck,
} from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { EquipmentEntity, EquipmentCategory, EquipmentStatus } from "../domain/entities/equipment_entity";
import { EquipmentRepositoryImpl } from "../data/equipment_repository_impl";
import { AddEquipmentModal } from "./add_equipment_modal";

export const EquipmentManagementScreen: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<EquipmentEntity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const all = await EquipmentRepositoryImpl.getAllEquipment();
      setEquipmentList(all);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEquipment = async (
    data: Omit<EquipmentEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ) => {
    await EquipmentRepositoryImpl.createEquipment(data);
    await loadData();
  };

  const handleUpdateStatus = async (id: string, status: EquipmentStatus) => {
    await EquipmentRepositoryImpl.updateEquipmentStatus(id, status);
    await loadData();
  };

  const filteredItems = equipmentList.filter((item) => {
    const matchCat = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchStat = selectedStatus === "ALL" || item.status === selectedStatus;
    const matchQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.currentProjectName && item.currentProjectName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchStat && matchQuery;
  });

  const totalEngins = equipmentList.length;
  const inServiceEngins = equipmentList.filter((e) => e.status === "EN_SERVICE_CHANTIER").length;
  const inBreakdownEngins = equipmentList.filter((e) => e.status === "EN_PANNE").length;
  const availableEngins = equipmentList.filter((e) => e.status === "DISPONIBLE_PARC").length;

  const formatFCFA = (val: number) => new Intl.NumberFormat("fr-FR").format(val) + " FCFA";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              AXE 12
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Engins, Matériels & Équipements
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestion du parc matériel, compteurs horaires, assignation chantier et maintenance préventive
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AppButton
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Ajouter un Engin
          </AppButton>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Parc Matériel"
          value={`${totalEngins} Unités`}
          subValue="Engins lourds & équipements"
          icon={<Truck className="w-6 h-6" />}
          iconColor="text-orange-600"
          badgeText="Flotte AGB"
          badgeVariant="neutral"
        />
        <StatCard
          label="En Activité sur Chantier"
          value={`${inServiceEngins} Actifs`}
          subValue="Affectés aux projets"
          icon={<Activity className="w-6 h-6" />}
          iconColor="text-emerald-600"
          badgeText="Opérationnel"
          badgeVariant="success"
        />
        <StatCard
          label="Disponibles au Parc"
          value={`${availableEngins} Prêts`}
          subValue="Dépôt Central Vridi"
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconColor="text-blue-600"
          badgeText="Réserve"
          badgeVariant="info"
        />
        <StatCard
          label="Engins en Panne / Arrêt"
          value={`${inBreakdownEngins} Alerte`}
          subValue="Intervention requise"
          icon={<AlertTriangle className="w-6 h-6" />}
          iconColor="text-red-600"
          badgeText="Maintenance"
          badgeVariant="danger"
        />
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <AppTextField
            placeholder="Rechercher par nom, code, marque, chantier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
        <div className="w-full md:w-56">
          <AppSelect
            options={[
              { value: "ALL", label: "Toutes catégories" },
              { value: "TERRASSEMENT", label: "Terrassement" },
              { value: "LEVAGE_MANUTENTION", label: "Levage & Grue" },
              { value: "BETON_MALAXAGE", label: "Béton & Malaxage" },
              { value: "ENERGIE_COMPRESSEUR", label: "Énergie & Groupes" },
              { value: "COMPACTAGE_ROUTIER", label: "Compactage" },
            ]}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />
        </div>
        <div className="w-full md:w-56">
          <AppSelect
            options={[
              { value: "ALL", label: "Tous statuts" },
              { value: "EN_SERVICE_CHANTIER", label: "En service" },
              { value: "DISPONIBLE_PARC", label: "Disponible parc" },
              { value: "EN_PANNE", label: "En panne" },
              { value: "EN_MAINTENANCE", label: "En révision" },
            ]}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Equipment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 hover:border-orange-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                    {item.code}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white mt-1.5 text-base">{item.name}</h3>
                  <p className="text-xs text-slate-500">
                    {item.brand} • Modèle {item.model}
                  </p>
                </div>
                <div>
                  {item.status === "EN_SERVICE_CHANTIER" ? (
                    <AppBadge variant="success">EN SERVICE</AppBadge>
                  ) : item.status === "DISPONIBLE_PARC" ? (
                    <AppBadge variant="info">DISPONIBLE</AppBadge>
                  ) : item.status === "EN_PANNE" ? (
                    <AppBadge variant="danger">EN PANNE</AppBadge>
                  ) : (
                    <AppBadge variant="warning">{item.status}</AppBadge>
                  )}
                </div>
              </div>

              {/* Assignment & Operator */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Building className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="truncate">
                    Chantier : <strong className="text-slate-900 dark:text-white">{item.currentProjectName || "Dépôt Central Vridi"}</strong>
                  </span>
                </div>
                {item.assignedOperator && (
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Opérateur : {item.assignedOperator}</span>
                  </div>
                )}
              </div>

              {/* Stats / Counters */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-center">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 font-mono">HORAMÈTRE</div>
                  <div className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                    {item.hourMeterCurrent} h
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 font-mono">CONSO</div>
                  <div className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                    {item.fuelConsumptionAvgLitrePerHour} L/h
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 font-mono">TARIF / J</div>
                  <div className="font-mono font-bold text-[11px] text-slate-900 dark:text-white truncate">
                    {formatFCFA(item.dailyCostRateFCFA)}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="text-[11px] text-slate-400">
                {item.maintenanceHistory.length > 0 ? (
                  <span>Dernière révision : {item.lastMaintenanceDate}</span>
                ) : (
                  <span>Aucun incident</span>
                )}
              </div>

              <div className="flex gap-1.5">
                {item.status === "EN_PANNE" ? (
                  <AppButton
                    size="sm"
                    variant="primary"
                    onClick={() => handleUpdateStatus(item.id, "EN_SERVICE_CHANTIER")}
                  >
                    Réparé & Actif
                  </AppButton>
                ) : (
                  <AppButton
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(item.id, item.status === "EN_SERVICE_CHANTIER" ? "DISPONIBLE_PARC" : "EN_SERVICE_CHANTIER")}
                  >
                    {item.status === "EN_SERVICE_CHANTIER" ? "Rapatrier Dépôt" : "Affecter Chantier"}
                  </AppButton>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AddEquipmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateEquipment}
      />
    </div>
  );
};
