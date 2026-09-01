/**
 * AGB CHANTIER - Modal de Rédaction d'un Rapport Journalier de Chantier - AXE 13
 */

import React, { useState } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { SiteDiaryEntryEntity, WeatherCondition } from "../domain/entities/site_diary_entity";
import { BookOpen, Sun, Users, Plus, Trash2 } from "lucide-react";

interface NewDiaryEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<SiteDiaryEntryEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">) => Promise<void>;
  defaultProjectId?: string;
  defaultProjectName?: string;
}

const WEATHER_OPTIONS = [
  { value: "ENSOLEILLE", label: "Ensoleillé / Beau temps" },
  { value: "NUAGEUX", label: "Nuageux / Temps couvert" },
  { value: "PLUIE_LEGERE", label: "Pluie légère / Averse" },
  { value: "ORAGE_INTEMPERIE", label: "Orage violent / Intempérie (Arrêt)" },
  { value: "CANICULE", label: "Forte chaleur / Canicule" },
];

export const NewDiaryEntryModal: React.FC<NewDiaryEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultProjectId = "proj-001",
  defaultProjectName = "Tour Résidentielle Ivoire - Cocody Riviera",
}) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [entryNumber, setEntryNumber] = useState<number>(86);
  const [weatherMorning, setWeatherMorning] = useState<WeatherCondition>("ENSOLEILLE");
  const [weatherAfternoon, setWeatherAfternoon] = useState<WeatherCondition>("NUAGEUX");
  const [temperatureCelsius, setTemperatureCelsius] = useState<number>(30);
  const [totalWorkersOnSite, setTotalWorkersOnSite] = useState<number>(28);
  const [hoursWorkedStandard, setHoursWorkedStandard] = useState<number>(8);
  const [hoursWorkedOvertime, setHoursWorkedOvertime] = useState<number>(0);
  const [lot1Name, setLot1Name] = useState("Gros Œuvre - Ferraillage");
  const [lot1Desc, setLot1Desc] = useState("Ferraillage voiles périphériques et poteaux d'angle R+2.");
  const [lot1Workers, setLot1Workers] = useState<number>(14);
  const [deliveries, setDeliveries] = useState("25t Ciment CPJ 42.5 + 10m3 Gravier 15/25");
  const [visitors, setVisitors] = useState("M. Sylvain Kouamé (SOCOTEC) - Contrôle armatures");
  const [incidents, setIncidents] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        projectId: defaultProjectId,
        projectName: defaultProjectName,
        date,
        entryNumber: Number(entryNumber),
        weatherMorning,
        weatherAfternoon,
        temperatureCelsius: Number(temperatureCelsius),
        totalWorkersOnSite: Number(totalWorkersOnSite),
        hoursWorkedStandard: Number(hoursWorkedStandard),
        hoursWorkedOvertime: Number(hoursWorkedOvertime),
        workReports: [
          {
            lotName: lot1Name,
            workDescription: lot1Desc,
            workersCount: Number(lot1Workers),
          },
        ],
        materialDeliveries: deliveries.split("\n").filter((d) => d.trim().length > 0),
        visitors: visitors.trim()
          ? [
              {
                visitorName: visitors,
                organization: "Visite Chantier",
                purpose: "Suivi & Contrôle",
                arrivalTime: "10:00",
              },
            ]
          : [],
        incidentsOrDelays: incidents.trim() || undefined,
        authorName: "Kouassi Jean-Marc",
        authorRole: "Directeur Travaux",
        isSigned: true,
        signedAt: new Date().toISOString(),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Rédiger le Journal Quotidien de Chantier"
      subtitle="Compte-rendu légal des activités, météo, effectifs, livraisons et visites"
      icon={<BookOpen className="w-5 h-5 text-orange-600" />}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AppTextField
            label="Date de la journée"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <AppTextField
            label="Numéro du journal"
            type="number"
            value={entryNumber.toString()}
            onChange={(e) => setEntryNumber(Number(e.target.value))}
            required
          />

          <AppTextField
            label="Température relevée (°C)"
            type="number"
            value={temperatureCelsius.toString()}
            onChange={(e) => setTemperatureCelsius(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppSelect
            label="Météo Matin"
            options={WEATHER_OPTIONS}
            value={weatherMorning}
            onChange={(e) => setWeatherMorning(e.target.value as WeatherCondition)}
            required
          />

          <AppSelect
            label="Météo Après-midi"
            options={WEATHER_OPTIONS}
            value={weatherAfternoon}
            onChange={(e) => setWeatherAfternoon(e.target.value as WeatherCondition)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AppTextField
            label="Effectif global présent"
            type="number"
            value={totalWorkersOnSite.toString()}
            onChange={(e) => setTotalWorkersOnSite(Number(e.target.value))}
            required
          />

          <AppTextField
            label="Heures normales"
            type="number"
            value={hoursWorkedStandard.toString()}
            onChange={(e) => setHoursWorkedStandard(Number(e.target.value))}
            required
          />

          <AppTextField
            label="Heures supplémentaires"
            type="number"
            value={hoursWorkedOvertime.toString()}
            onChange={(e) => setHoursWorkedOvertime(Number(e.target.value))}
          />
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Travaux Réalisés par Lot
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <AppTextField
              label="Nom du lot"
              value={lot1Name}
              onChange={(e) => setLot1Name(e.target.value)}
              required
            />
            <div className="md:col-span-2">
              <AppTextField
                label="Détail des ouvrages exécutés"
                value={lot1Desc}
                onChange={(e) => setLot1Desc(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <AppTextField
          label="Livraisons de matériaux du jour"
          placeholder="Ex: 20t Ciment CPJ 42.5, 3 camions de sable..."
          value={deliveries}
          onChange={(e) => setDeliveries(e.target.value)}
        />

        <AppTextField
          label="Visiteurs & Contrôles (SOCOTEC, Bureau Études, Architecte)"
          placeholder="Ex: Ing. Kouamé (SOCOTEC) - Contrôle ferraillage..."
          value={visitors}
          onChange={(e) => setVisitors(e.target.value)}
        />

        <AppTextField
          label="Incidents, Aléas ou Arrêts de chantier"
          placeholder="Coupure de courant, panne d'engin, intempérie..."
          value={incidents}
          onChange={(e) => setIncidents(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton variant="outline" onClick={onClose} type="button" disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<BookOpen className="w-4 h-4" />}
          >
            Enregistrer & Signer le Journal
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
