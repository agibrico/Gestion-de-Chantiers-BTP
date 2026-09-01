/**
 * AGB CHANTIER - Espace de Pilotage du Gérant (Conducteur de Travaux & Chefs de Chantier)
 */

import React from "react";
import { useAuth } from "./auth_context";
import {
  Briefcase,
  HardHat,
  Calendar,
  Clock,
  Package,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle2,
  Building2,
  ArrowRight,
} from "lucide-react";
import { AppCard } from "../../../core/widgets/cards/app_card";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppPermission } from "../../../core/permissions/permissions";

interface GerantDashboardScreenProps {
  onNavigate: (route: string) => void;
}

export const GerantDashboardScreen: React.FC<GerantDashboardScreenProps> = ({ onNavigate }) => {
  const { currentUser, hasPermission, employees } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header Gérant */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/15 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">
                Espace Gérant de Travaux
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Bonjour, {currentUser?.name || "Gérant"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supervision des opérations de chantier, affectation des ouvriers et respect des plannings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AppButton
            variant="outline"
            size="sm"
            onClick={() => onNavigate("/attendance")}
            leftIcon={<Clock className="w-4 h-4" />}
          >
            Vérifier le Pointage
          </AppButton>
          <AppButton
            variant="primary"
            size="sm"
            onClick={() => onNavigate("/planning")}
            leftIcon={<Calendar className="w-4 h-4" />}
          >
            Planning Général
          </AppButton>
        </div>
      </div>

      {/* Raccourcis Opérationnels BTP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Main-d'Œuvre Assignée
            </span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {employees.length} Ouvriers & Chefs
          </div>
          <p className="text-[11px] text-slate-500">
            Effectif opérationnel enregistré et rattaché aux chantiers.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Chantiers Supervisés
            </span>
            <Building2 className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            3 Chantiers Actifs
          </div>
          <p className="text-[11px] text-slate-500">
            Résidence Les Palmiers, Tour Ivoire Plaza, Hangar Logistique.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Statut Sécurité HSE
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            100% Conforme
          </div>
          <p className="text-[11px] text-slate-500">
            Tous les intervenants ont validé leur pièce d'identité et consignes.
          </p>
        </div>
      </div>

      {/* Permissions Accordées par l'Administrateur */}
      <AppCard
        title="Permissions Métier Accordées par l'Administrateur"
        subtitle="Ces droits d'accès sont définis et révocables en direct par la Direction Générale."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {[
            { perm: AppPermission.PROJECT_VIEW, label: "Consultation des Chantiers" },
            { perm: AppPermission.PLANNING_MANAGE, label: "Gestion des Plannings & Gantt" },
            { perm: AppPermission.ATTENDANCE_VALIDATE, label: "Validation des Pointages Équipes" },
            { perm: AppPermission.STOCK_MANAGE, label: "Gestion des Stocks & Matériaux" },
            { perm: AppPermission.FINANCE_EXPENSE_ADD, label: "Saisie des Dépenses & Factures" },
            { perm: AppPermission.SITE_DIARY_WRITE, label: "Rédaction Journal de Chantier" },
            { perm: AppPermission.HSE_INCIDENT_REPORT, label: "Déclaration Incidents HSE" },
            { perm: AppPermission.DOCUMENT_UPLOAD, label: "Dépôt des Plans & Documents" },
            { perm: AppPermission.REPORT_GENERATE, label: "Génération Rapports BTP" },
          ].map(({ perm, label }) => {
            const has = hasPermission(perm);
            return (
              <div
                key={perm}
                className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                  has
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30 text-slate-800 dark:text-slate-200"
                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                }`}
              >
                <span className="font-semibold">{label}</span>
                {has ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <span className="text-[10px] text-slate-400 font-bold">NON ATTRIBUÉ</span>
                )}
              </div>
            );
          })}
        </div>
      </AppCard>
    </div>
  );
};
