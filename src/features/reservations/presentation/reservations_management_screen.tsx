/**
 * AGB CHANTIER - Écran de Gestion des Réserves & OPR - AXE 17
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
  Check,
  Building,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { ReservationEntity, ReservationStatus } from "../domain/entities/reservation_entity";
import { ReservationRepositoryImpl } from "../data/reservation_repository_impl";
import { AddReservationModal } from "./add_reservation_modal";

export const ReservationsManagementScreen: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationEntity[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const all = await ReservationRepositoryImpl.getAllReservations();
      setReservations(all);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateReservation = async (
    data: Omit<ReservationEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ) => {
    await ReservationRepositoryImpl.createReservation(data);
    await loadData();
  };

  const handleStatusChange = async (id: string, newStatus: ReservationStatus) => {
    await ReservationRepositoryImpl.updateStatus(id, newStatus, "Kouassi Jean-Marc (DT)");
    await loadData();
  };

  const filteredReservations = reservations.filter((r) => {
    const matchStatus = selectedStatus === "ALL" || r.status === selectedStatus;
    const matchQuery =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reservationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.lotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.companyResponsible.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  const total = reservations.length;
  const closedCount = reservations.filter((r) => r.status === "CLOTUREE_VALIDEE").length;
  const toVerifyCount = reservations.filter((r) => r.status === "LEVEE_A_VERIFIER").length;
  const inProgressCount = reservations.filter((r) => r.status === "EN_COURS_TRAITEMENT" || r.status === "OUVERTE").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              AXE 17
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Réserves, OPR & Non-Conformités
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Opérations préalables à la réception, constat de malfaçons, assignation aux sous-traitants et levée contradictoire
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AppButton
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Nouvelle Réserve OPR
          </AppButton>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Réserves Notifiées"
          value={`${total} Réserves`}
          subValue="Tous corps d'état"
          icon={<FileCheck className="w-6 h-6" />}
          iconColor="text-orange-600"
          badgeText="OPR"
          badgeVariant="default"
        />
        <StatCard
          label="Réserves Clôturées / Levées"
          value={`${closedCount} / ${total}`}
          subValue={`${total > 0 ? Math.round((closedCount / total) * 100) : 0}% de taux de levée`}
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconColor="text-emerald-600"
          badgeText="Validé"
          badgeVariant="success"
        />
        <StatCard
          label="À Vérifier sur Chantier"
          value={`${toVerifyCount} Prêtes`}
          subValue="Travaux terminés par artisan"
          icon={<Clock className="w-6 h-6" />}
          iconColor="text-blue-600"
          badgeText="Contrôle"
          badgeVariant="default"
        />
        <StatCard
          label="En Cours de Traitement"
          value={`${inProgressCount} Actives`}
          subValue="Sous délai contractuel"
          icon={<AlertTriangle className="w-6 h-6" />}
          iconColor="text-amber-600"
          badgeText="En cours"
          badgeVariant="warning"
        />
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <AppTextField
            placeholder="Rechercher par titre, N° réserve, corps d'état, entreprise..."
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            fullWidth
          />
        </div>
        <div className="w-full md:w-64">
          <AppSelect
            options={[
              { value: "ALL", label: "Tous les statuts de traitement" },
              { value: "OUVERTE", label: "Ouverte" },
              { value: "EN_COURS_TRAITEMENT", label: "En cours" },
              { value: "LEVEE_A_VERIFIER", label: "Levée à vérifier" },
              { value: "CLOTUREE_VALIDEE", label: "Clôturée & Validée" },
            ]}
            value={selectedStatus}
            onChange={(val) => setSelectedStatus(val)}
            fullWidth
          />
        </div>
      </div>

      {/* Grid of Reservation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReservations.map((res) => (
          <div
            key={res.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-orange-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                    {res.reservationNumber}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white mt-1 text-base">{res.title}</h3>
                </div>
                <div>
                  {res.status === "CLOTUREE_VALIDEE" ? (
                    <AppBadge variant="success">LEVÉE VALIDÉE</AppBadge>
                  ) : res.status === "LEVEE_A_VERIFIER" ? (
                    <AppBadge variant="default">À VÉRIFIER</AppBadge>
                  ) : (
                    <AppBadge variant="warning">EN COURS</AppBadge>
                  )}
                </div>
              </div>

              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                <div>Lot : <strong className="text-orange-600 dark:text-orange-400">{res.lotName}</strong></div>
                <div>Lieu : <strong className="text-slate-800 dark:text-slate-200">{res.location}</strong></div>
                <div>Entreprise : <span className="font-medium text-slate-900 dark:text-white">{res.companyResponsible}</span></div>
                <div className="text-red-600 dark:text-red-400 font-medium">Échéance limite : {res.deadlineDate}</div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                {res.description}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">Sévérité : {res.severity}</span>

              <div className="flex gap-1.5">
                {res.status !== "CLOTUREE_VALIDEE" && (
                  <AppButton
                    size="sm"
                    variant={res.status === "LEVEE_A_VERIFIER" ? "primary" : "secondary"}
                    onClick={() =>
                      handleStatusChange(
                        res.id,
                        res.status === "LEVEE_A_VERIFIER" ? "CLOTUREE_VALIDEE" : "LEVEE_A_VERIFIER"
                      )
                    }
                    leftIcon={<Check className="w-3.5 h-3.5" />}
                  >
                    {res.status === "LEVEE_A_VERIFIER" ? "Valider la Levée" : "Marquer Exécuté"}
                  </AppButton>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AddReservationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateReservation}
      />
    </div>
  );
};
