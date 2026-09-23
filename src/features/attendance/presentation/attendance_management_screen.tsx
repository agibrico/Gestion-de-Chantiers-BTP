/**
 * AGB CHANTIER - Écran Principal Pointage & Présences BTP - AXE 08
 */

import React, { useState } from "react";
import { AttendanceProvider, useAttendance } from "./attendance_context";
import {
  AttendanceRecordEntity,
  AttendanceStatus,
  WeatherCondition,
} from "../domain/entities/attendance_entity";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppBadge, BadgeVariant } from "../../../core/widgets/badges/app_badge";
import { AppEmptyState } from "../../../core/widgets/display/app_empty_state";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserX,
  CloudRain,
  Sun,
  ShieldCheck,
  DollarSign,
  Download,
  Search,
  Calendar,
  Check,
  Zap,
} from "lucide-react";

const STATUS_BADGES: Record<AttendanceStatus, { label: string; variant: BadgeVariant }> = {
  PRESENT: { label: "Présent", variant: "success" },
  RETARD: { label: "Retard", variant: "warning" },
  ABSENT_JUSTIFIE: { label: "Absent Justifié", variant: "info" },
  ABSENT_INJUSTIFIE: { label: "Absent Injustifié", variant: "danger" },
  CONGE: { label: "Congé", variant: "neutral" },
  INTEMPERIES: { label: "Arrêt Intempéries", variant: "neutral" },
};

const WEATHER_OPTIONS: { value: WeatherCondition; label: string; icon: string }[] = [
  { value: "BEAU_TEMPS", label: "☀️ Ensoleillé / Normal", icon: "☀️" },
  { value: "PLUIE_FORTE", label: "🌧️ Pluie Forte (Arrêt chantier)", icon: "🌧️" },
  { value: "CANICULE", label: "🌡️ Forte Chaleur / Canicule", icon: "🌡️" },
  { value: "VENT_VIOLENT", label: "💨 Vent Violent (Arrêt Grue)", icon: "💨" },
  { value: "ORAGE", label: "⚡ Orage / Foudre", icon: "⚡" },
];

const AttendanceManagementContent: React.FC = () => {
  const {
    records,
    projects,
    selectedDate,
    setSelectedDate,
    selectedProjectId,
    setSelectedProjectId,
    summary,
    isLoading,
    searchQuery,
    setSearchQuery,
    updateRecordStatus,
    updateRecordHours,
    markAllPresent,
    markAllLeft,
    validateShift,
    changeWeather,
    exportAttendanceCsv,
  } = useAttendance();

  const [editingHoursId, setEditingHoursId] = useState<string | null>(null);
  const [tempRegHours, setTempRegHours] = useState<number>(8);
  const [tempOtHours, setTempOtHours] = useState<number>(0);

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val) + " FCFA";
  };

  const handleSaveHours = async (recordId: string) => {
    await updateRecordHours(recordId, tempRegHours, tempOtHours);
    setEditingHoursId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <AppBadge variant="success" dot={true}>
              AXE 08 OPÉRATIONNEL
            </AppBadge>
            <span className="text-xs text-orange-400 font-mono font-bold">Émargement Digital & Pointage Main-d'Œuvre</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            Pointage & Présences BTP
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Feuille d'appel journalière, contrôle des arrivées/départs des compagnons, calcul automatique des heures supplémentaires et valorisation de la paie chantier.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <AppButton
            variant="primary"
            onClick={markAllPresent}
            leftIcon={<Zap className="w-4 h-4" />}
          >
            Pointer Tout Présent (07:30)
          </AppButton>
          <AppButton
            variant="secondary"
            onClick={exportAttendanceCsv}
            leftIcon={<Download className="w-4 h-4 text-emerald-600" />}
          >
            Export Émargement CSV
          </AppButton>
        </div>
      </div>

      {/* KPI Stats */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Taux de Présence du Jour"
            value={`${summary.totalWorkersExpected > 0 ? Math.round(((summary.totalPresent + summary.totalLate) / summary.totalWorkersExpected) * 100) : 0}%`}
            subValue={`${summary.totalPresent + summary.totalLate} présents sur ${summary.totalWorkersExpected} ouvriers`}
            icon={<UserCheck className="w-6 h-6" />}
            iconColor="text-emerald-600"
            badgeText="Effectif Mobilisé"
            badgeVariant="success"
          />

          <StatCard
            label="Absences & Retards"
            value={`${summary.totalAbsent} Absents`}
            subValue={`${summary.totalLate} retards signalés`}
            icon={<UserX className="w-6 h-6" />}
            iconColor="text-red-600"
            badgeText="Impact Cadence"
            badgeVariant={summary.totalAbsent > 0 ? "warning" : "neutral"}
          />

          <StatCard
            label="Volume d'Heures Travaillées"
            value={`${summary.totalRegularHours + summary.totalOvertimeHours} Heures`}
            subValue={`Dont ${summary.totalOvertimeHours}h supplémentaires`}
            icon={<Clock className="w-6 h-6" />}
            iconColor="text-blue-600"
            badgeText="Heures Productives"
            badgeVariant="info"
          />

          <StatCard
            label="Masse Salariale Journalière"
            value={formatFCFA(summary.totalLaborCostFCFA)}
            subValue="Coût main-d'œuvre du jour"
            icon={<DollarSign className="w-6 h-6" />}
            iconColor="text-emerald-600"
            badgeText="Déboursé Sec MO"
            badgeVariant="success"
          />
        </div>
      )}

      {/* Controls & Weather Bar */}
      <div className="p-4 bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <AppTextField
            label="Date de Pointage"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <AppSelect
            label="Chantier BTP"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            options={projects.map((p) => ({ value: p.id, label: `${p.code} - ${p.name}` }))}
          />

          <AppSelect
            label="Condition Météorologique (Intempéries)"
            value={summary?.weatherCondition || "BEAU_TEMPS"}
            onChange={(e) => changeWeather(e.target.value as WeatherCondition)}
            options={WEATHER_OPTIONS}
          />

          <div className="w-full">
            <AppTextField
              placeholder="Rechercher ouvrier, matricule..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>
        </div>

        {/* Action Fast Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={markAllLeft}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-lg cursor-pointer text-slate-700 dark:text-slate-300"
            >
              Pointer Sortie Collective (17:00)
            </button>
          </div>

          <div className="flex items-center gap-3">
            {summary?.isShiftClosed ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-4 h-4" /> Journée Clôturée & Validée par le Conducteur de Travaux
              </span>
            ) : (
              <AppButton
                size="sm"
                variant="outline"
                leftIcon={<ShieldCheck className="w-4 h-4 text-orange-600" />}
                onClick={() => validateShift("M. Diallo Ousmane (Conducteur de Travaux)")}
              >
                Clôturer & Valider la Feuille du Jour
              </AppButton>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      {records.length === 0 ? (
        <AppEmptyState
          icon={<UserCheck className="w-8 h-8 text-orange-500" />}
          title="Aucun ouvrier enregistré pour ce chantier"
          description="Les fiches de présence sont générées automatiquement à partir de la liste des équipes."
        />
      ) : (
        <div className="bg-white dark:bg-[#131D31] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-3.5">Ouvrier & Matricule</th>
                  <th className="p-3.5">Corps d'État / Métier</th>
                  <th className="p-3.5">Équipe</th>
                  <th className="p-3.5 text-center">Statut du Jour</th>
                  <th className="p-3.5 text-center">Horaires (Arrivée / Départ)</th>
                  <th className="p-3.5 text-center">Heures (Norm / Sup)</th>
                  <th className="p-3.5 text-right">Taux Jour (FCFA)</th>
                  <th className="p-3.5 text-right">Coût Journée</th>
                  <th className="p-3.5 text-center">Pointage Rapide</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {records.map((rec) => {
                  const statusInfo = STATUS_BADGES[rec.status] || {
                    label: rec.status,
                    variant: "neutral" as const,
                  };
                  const isEditingHours = editingHoursId === rec.id;

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 dark:text-white block">{rec.workerName}</span>
                        <span className="font-mono text-[10px] text-slate-400">{rec.registrationNumber || "N/A"}</span>
                      </td>

                      <td className="p-3.5 font-medium">{rec.workerTrade}</td>
                      <td className="p-3.5 text-slate-500">{rec.teamName || "Générale"}</td>

                      <td className="p-3.5 text-center">
                        <AppBadge variant={statusInfo.variant} size="sm">
                          {statusInfo.label}
                        </AppBadge>
                      </td>

                      <td className="p-3.5 text-center font-mono text-[11px]">
                        {rec.checkInTime || "--:--"} &rarr; {rec.checkOutTime || "--:--"}
                      </td>

                      <td className="p-3.5 text-center">
                        {isEditingHours ? (
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              value={tempRegHours}
                              onChange={(e) => setTempRegHours(Number(e.target.value))}
                              className="w-12 p-1 text-center font-mono rounded border border-orange-500 bg-white dark:bg-slate-900"
                              title="Heures normales"
                            />
                            <span className="text-slate-400">+</span>
                            <input
                              type="number"
                              value={tempOtHours}
                              onChange={(e) => setTempOtHours(Number(e.target.value))}
                              className="w-12 p-1 text-center font-mono rounded border border-orange-500 bg-white dark:bg-slate-900"
                              title="Heures sup"
                            />
                            <button
                              onClick={() => handleSaveHours(rec.id)}
                              className="p-1 bg-emerald-600 text-white rounded font-bold"
                            >
                              ✓
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingHoursId(rec.id);
                              setTempRegHours(rec.regularHours);
                              setTempOtHours(rec.overtimeHours);
                            }}
                            className="font-mono hover:text-orange-600 font-bold cursor-pointer"
                            title="Cliquer pour modifier les heures"
                          >
                            {rec.regularHours}h {rec.overtimeHours > 0 && `(+${rec.overtimeHours}h sup)`}
                          </button>
                        )}
                      </td>

                      <td className="p-3.5 text-right font-mono text-slate-500">
                        {formatFCFA(rec.dailyRateFCFA)}
                      </td>

                      <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatFCFA(rec.totalDayLaborCostFCFA)}
                      </td>

                      {/* Fast Action Buttons */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => updateRecordStatus(rec.id, "PRESENT")}
                            className={`p-1.5 rounded cursor-pointer transition-colors ${
                              rec.status === "PRESENT"
                                ? "bg-emerald-600 text-white font-bold"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-100"
                            }`}
                            title="Présent"
                          >
                            P
                          </button>
                          <button
                            onClick={() => updateRecordStatus(rec.id, "RETARD")}
                            className={`p-1.5 rounded cursor-pointer transition-colors ${
                              rec.status === "RETARD"
                                ? "bg-amber-500 text-white font-bold"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-amber-100"
                            }`}
                            title="Retard"
                          >
                            R
                          </button>
                          <button
                            onClick={() => updateRecordStatus(rec.id, "ABSENT_JUSTIFIE")}
                            className={`p-1.5 rounded cursor-pointer transition-colors ${
                              rec.status === "ABSENT_JUSTIFIE" || rec.status === "ABSENT_INJUSTIFIE"
                                ? "bg-red-600 text-white font-bold"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-100"
                            }`}
                            title="Absent"
                          >
                            A
                          </button>
                          <button
                            onClick={() => updateRecordStatus(rec.id, "INTEMPERIES")}
                            className={`p-1.5 rounded cursor-pointer transition-colors ${
                              rec.status === "INTEMPERIES"
                                ? "bg-blue-600 text-white font-bold"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-blue-100"
                            }`}
                            title="Intempéries"
                          >
                            🌧️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export const AttendanceManagementScreen: React.FC = () => {
  return (
    <AttendanceProvider>
      <AttendanceManagementContent />
    </AttendanceProvider>
  );
};
