/**
 * AGB CHANTIER - Écran du Journal Quotidien de Chantier - AXE 13
 */

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Calendar,
  Sun,
  CloudRain,
  Users,
  Clock,
  Truck,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { SiteDiaryEntryEntity, WeatherCondition } from "../domain/entities/site_diary_entity";
import { SiteDiaryRepositoryImpl } from "../data/site_diary_repository_impl";
import { NewDiaryEntryModal } from "./new_diary_entry_modal";

export const SiteDiaryScreen: React.FC = () => {
  const [entries, setEntries] = useState<SiteDiaryEntryEntity[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<SiteDiaryEntryEntity | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const all = await SiteDiaryRepositoryImpl.getAllEntries();
      setEntries(all);
      if (all.length > 0 && !selectedEntry) {
        setSelectedEntry(all[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEntry = async (
    data: Omit<SiteDiaryEntryEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ) => {
    const created = await SiteDiaryRepositoryImpl.createEntry(data);
    await loadData();
    setSelectedEntry(created);
  };

  const filteredEntries = entries.filter((e) => {
    const matchQuery =
      e.date.includes(searchQuery) ||
      e.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.workReports.some((r) => r.workDescription.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchQuery;
  });

  const getWeatherIcon = (condition: WeatherCondition) => {
    switch (condition) {
      case "ENSOLEILLE":
        return <Sun className="w-4 h-4 text-amber-500" />;
      case "PLUIE_LEGERE":
      case "ORAGE_INTEMPERIE":
        return <CloudRain className="w-4 h-4 text-blue-500" />;
      default:
        return <Sun className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              AXE 13
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Journal Quotidien de Chantier
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Registre légal et contradictoire des événements, météo, effectifs, approvisionnements et visites
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AppButton
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Rédiger Journal du Jour
          </AppButton>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Journaux Clôturés & Signés"
          value={`${entries.filter((e) => e.isSigned).length} / ${entries.length}`}
          subValue="Conformes et horodatés"
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconColor="text-emerald-600"
          badgeText="Signé"
          badgeVariant="success"
        />
        <StatCard
          label="Moyenne Effectif / Jour"
          value="27 Ouvriers"
          subValue="Équipes AGB + Sous-traitants"
          icon={<Users className="w-6 h-6" />}
          iconColor="text-orange-600"
          badgeText="Mobilisé"
          badgeVariant="info"
        />
        <StatCard
          label="Heures Travaillées Cumul"
          value="1 380 Heures"
          subValue="Mois en cours"
          icon={<Clock className="w-6 h-6" />}
          iconColor="text-blue-600"
          badgeText="Productivité"
          badgeVariant="neutral"
        />
        <StatCard
          label="Visites Organismes Extérieurs"
          value="8 Visites"
          subValue="SOCOTEC, LBTP, Architecte"
          icon={<ShieldCheck className="w-6 h-6" />}
          iconColor="text-purple-600"
          badgeText="Contrôles"
          badgeVariant="warning"
        />
      </div>

      {/* Main Split View: Left List of Days, Right Selected Entry Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List: 4 cols */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <AppTextField
              placeholder="Rechercher par date, travaux..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <div className="space-y-3">
            {filteredEntries.map((entry) => {
              const isSelected = selectedEntry?.id === entry.id;
              return (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-orange-50/50 dark:bg-orange-950/20 border-orange-500 shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        N° {entry.entryNumber}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{entry.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      {getWeatherIcon(entry.weatherMorning)}
                      <span>{entry.temperatureCelsius}°C</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                    {entry.workReports.map((r) => r.lotName).join(" • ")}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/60 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-orange-600" />
                      {entry.totalWorkersOnSite} ouvriers
                    </span>
                    {entry.isSigned ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Signé
                      </span>
                    ) : (
                      <span className="text-amber-600 font-medium">Brouillon</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Details Panel: 7 cols */}
        <div className="lg:col-span-7">
          {selectedEntry ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                      JOURNAL N° {selectedEntry.entryNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Date : {selectedEntry.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {selectedEntry.projectName}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <AppButton size="sm" variant="outline" leftIcon={<Printer className="w-4 h-4" />}>
                    Imprimer PV
                  </AppButton>
                </div>
              </div>

              {/* Weather & Workforce banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-center">
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">Météo Matin</div>
                  <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center justify-center gap-1 mt-0.5">
                    {getWeatherIcon(selectedEntry.weatherMorning)}
                    {selectedEntry.weatherMorning}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">Météo A.M.</div>
                  <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center justify-center gap-1 mt-0.5">
                    {getWeatherIcon(selectedEntry.weatherAfternoon)}
                    {selectedEntry.weatherAfternoon}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">Effectifs</div>
                  <div className="font-mono font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                    {selectedEntry.totalWorkersOnSite} Présents
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">Heures Totales</div>
                  <div className="font-mono font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                    {selectedEntry.hoursWorkedStandard + selectedEntry.hoursWorkedOvertime} h
                  </div>
                </div>
              </div>

              {/* Works Reports */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  Travaux Exécutés dans la Journée
                </h4>
                <div className="space-y-2.5">
                  {selectedEntry.workReports.map((report, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-orange-600 dark:text-orange-400">{report.lotName}</span>
                        <span className="text-slate-500 font-mono">{report.workersCount} ouvriers affectés</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{report.workDescription}</p>
                      {report.progressNotes && (
                        <div className="text-xs text-slate-500 italic mt-1">{report.progressNotes}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliveries & Visitors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-600" />
                    Livraisons Reçues
                  </h5>
                  {selectedEntry.materialDeliveries.length > 0 ? (
                    <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                      {selectedEntry.materialDeliveries.map((mat, i) => (
                        <li key={i}>{mat}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400">Aucune livraison enregistrée</p>
                  )}
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-purple-600" />
                    Visites & Contrôles
                  </h5>
                  {selectedEntry.visitors.length > 0 ? (
                    <div className="space-y-2">
                      {selectedEntry.visitors.map((v, i) => (
                        <div key={i} className="text-xs text-slate-600 dark:text-slate-400 border-l-2 border-purple-500 pl-2">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {v.visitorName} ({v.organization})
                          </div>
                          <div>{v.purpose}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Aucun visiteur externe</p>
                  )}
                </div>
              </div>

              {/* Signature block */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Rédigé par :</span>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {selectedEntry.authorName} ({selectedEntry.authorRole})
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-600 font-bold flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-4 h-4" />
                    Signé Électroniquement
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{selectedEntry.signedAt}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              Sélectionnez une journée dans la liste pour voir le détail.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <NewDiaryEntryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateEntry}
      />
    </div>
  );
};
