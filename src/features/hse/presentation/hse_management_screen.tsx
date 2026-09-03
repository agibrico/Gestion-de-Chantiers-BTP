/**
 * AGB CHANTIER - Écran de Gestion HSE, Sécurité & Incidents - AXE 16
 */

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  HeartPulse,
  HardHat,
  CheckCircle2,
  Clock,
  Activity,
  Flame,
  Award,
  Users,
} from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { HseIncidentEntity } from "../domain/entities/hse_entity";
import { HseRepositoryImpl } from "../data/hse_repository_impl";
import { ReportIncidentModal } from "./report_incident_modal";

export const HseManagementScreen: React.FC = () => {
  const [incidents, setIncidents] = useState<HseIncidentEntity[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const all = await HseRepositoryImpl.getAllIncidents();
      setIncidents(all);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateIncident = async (
    data: Omit<HseIncidentEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ) => {
    await HseRepositoryImpl.createIncident(data);
    await loadData();
  };

  const filteredIncidents = incidents.filter((inc) => {
    const matchQuery =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.incidentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.exactLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              AXE 16
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Hygiène, Sécurité & Environnement (HSE)
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Culture zéro accident, registre des presqu'accidents, conformité du port des EPI et causeries 1/4h
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AppButton
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
            tooltip="Déclarer une intervention HSE : accident de travail, presqu'accident, arrêt de zone ou manquement EPI"
            tooltipPosition="bottom"
          >
            Déclarer un Incident HSE
          </AppButton>
        </div>
      </div>

      {/* Safety Scoreboard */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
              Indicateur Majeur de Sécurité AGB
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono mt-1 text-white flex items-baseline gap-2">
              <span>184 Jours</span>
              <span className="text-sm font-normal text-emerald-300">Sans Accident avec Arrêt (TF = 0)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-[10px] uppercase font-mono text-slate-400">Taux de Fréquence</div>
            <div className="text-lg font-bold font-mono text-emerald-400">0.00</div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-[10px] uppercase font-mono text-slate-400">Causeries Réalisées</div>
            <div className="text-lg font-bold font-mono text-white">24 Sessions</div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Incidents Déclarés (Mois)"
          value={`${incidents.length} Événements`}
          subValue="Tous traités et clôturés"
          icon={<AlertTriangle className="w-6 h-6" />}
          iconColor="text-orange-600"
          badgeText="Suivi"
          badgeVariant="neutral"
        />
        <StatCard
          label="Presqu'accidents Détectés"
          value="4 Near-Miss"
          subValue="Actions préventives appliquées"
          icon={<HeartPulse className="w-6 h-6" />}
          iconColor="text-blue-600"
          badgeText="Prévention"
          badgeVariant="info"
        />
        <StatCard
          label="Taux de Port des EPI"
          value="98.5 %"
          subValue="Audits inopinés journaliers"
          icon={<HardHat className="w-6 h-6" />}
          iconColor="text-emerald-600"
          badgeText="Conforme"
          badgeVariant="success"
        />
        <StatCard
          label="Ouvriers Sensibilisés"
          value="142 Personnes"
          subValue="Personnel AGB & Sous-traitants"
          icon={<Users className="w-6 h-6" />}
          iconColor="text-purple-600"
          badgeText="Formés"
          badgeVariant="neutral"
        />
      </div>

      {/* Register List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            Registre Légal des Événements & Incidents HSE
          </h3>
          <div className="w-64">
            <AppTextField
              placeholder="Filtrer le registre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
            />
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {filteredIncidents.map((inc) => (
            <div key={inc.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                      {inc.incidentNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{new Date(inc.dateTime).toLocaleString("fr-FR")}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mt-1 text-base">{inc.title}</h4>
                </div>
                <div>
                  {inc.severity === "BENIN_SOINS_SUR_PLACE" ? (
                    <AppBadge variant="warning">SOINS BÉNINS (0j)</AppBadge>
                  ) : inc.severity === "PRESQU_ACCIDENT_NEAR_MISS" ? (
                    <AppBadge variant="info">PRESQU'ACCIDENT</AppBadge>
                  ) : (
                    <AppBadge variant="danger">ARRÊT DE TRAVAIL</AppBadge>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">{inc.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Cause racine : </span>
                  <span className="text-slate-700 dark:text-slate-300">{inc.rootCauseAnalysis}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Action corrective : </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{inc.correctiveActions}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Lieu : {inc.exactLocation}</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Dossier Clôturé & Validé
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <ReportIncidentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateIncident}
      />
    </div>
  );
};
