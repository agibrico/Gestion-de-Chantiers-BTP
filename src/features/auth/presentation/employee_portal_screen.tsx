/**
 * AGB CHANTIER - Espace Personnel de l'Employé (Ouvrier, Compagnon, Chef d'Équipe)
 */

import React, { useState } from "react";
import { useAuth } from "./auth_context";
import {
  HardHat,
  ShieldCheck,
  FileCheck2,
  Clock,
  CheckCircle2,
  Phone,
  QrCode,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { AppCard } from "../../../core/widgets/cards/app_card";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { useToast } from "../../../core/widgets/feedback/app_toast";

interface EmployeePortalScreenProps {
  onNavigate: (route: string) => void;
}

export const EmployeePortalScreen: React.FC<EmployeePortalScreenProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const handlePointage = () => {
    if (!isCheckedIn) {
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setIsCheckedIn(true);
      setCheckInTime(time);
      toast.success("Pointage validé", `Pointage d'arrivée enregistré à ${time} sur le chantier !`);
    } else {
      setIsCheckedIn(false);
      setCheckInTime(null);
      toast.info("Pointage de départ", "Pointage de départ enregistré. Bonne fin de journée !");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Employé */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/15 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded border border-sky-500/20">
                Espace Intervenant Terrain
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {currentUser?.name || "Employé BTP"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentUser?.speciality || "Compagnon / Ouvrier Qualifié BTP"} • Matricule : {currentUser?.matricule || "AGB-EMP-001"}
            </p>
          </div>
        </div>

        {/* Action Pointage Rapide */}
        <AppButton
          variant={isCheckedIn ? "outline" : "primary"}
          size="md"
          onClick={handlePointage}
          leftIcon={<Clock className="w-4 h-4" />}
        >
          {isCheckedIn ? `Pointé à ${checkInTime} (Pointer Sortie)` : "Pointer mon Arrivée"}
        </AppButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARTE 1 : BADGE BTP DÉMATÉRIALISÉ */}
        <AppCard
          title="Badge Numérique Professionnel BTP"
          subtitle="Identifiant officiel pour le contrôle d'accès sur les chantiers AGB."
        >
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-orange-600 rounded flex items-center justify-center font-black text-xs">
                  AGB
                </div>
                <span className="font-bold text-xs uppercase tracking-wider">
                  AGB CHANTIER CARD
                </span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIF
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-700 flex items-center justify-center text-xl font-bold text-slate-300 border border-slate-600 shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "E"}
              </div>
              <div className="truncate">
                <p className="font-extrabold text-sm truncate text-white">{currentUser?.name}</p>
                <p className="text-xs text-orange-400 font-semibold">{currentUser?.role}</p>
                <p className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {currentUser?.phone}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>MATRICULE : {currentUser?.matricule || "AGB-EMP-999"}</span>
              <span className="flex items-center gap-1 text-sky-400">
                <QrCode className="w-3.5 h-3.5" /> QR Code Certifié
              </span>
            </div>
          </div>
        </AppCard>

        {/* CARTE 2 : PIÈCE D'IDENTITÉ VALIDÉE */}
        <AppCard
          title="Pièce d'Identité Enregistrée"
          subtitle="Document officiel certifié lors de votre première connexion."
        >
          {currentUser?.identityDocument ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Document Vérifié & Conforme
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded">
                    {currentUser.identityDocument.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      Numéro du document :
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {currentUser.identityDocument.documentNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      Enregistré le :
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {new Date(currentUser.identityDocument.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {currentUser.identityDocument.photoBase64 && (
                <div className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-950 flex items-center justify-center max-h-40 overflow-hidden">
                  <img
                    src={currentUser.identityDocument.photoBase64}
                    alt="Aperçu document d'identité"
                    className="max-h-36 object-contain rounded"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 rounded-xl text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
              <p className="text-xs font-bold text-amber-900 dark:text-amber-300">
                Pièce d'identité en attente de vérification
              </p>
            </div>
          )}
        </AppCard>
      </div>

      {/* Tâches & Affectation Chantier */}
      <AppCard
        title="Affectation Actuelle & Tâches BTP"
        subtitle="Chantiers et consignes transmises par votre chef d'équipe ou conducteur de travaux."
      >
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Chantier Principal : Résidence Les Palmiers (Abidjan - Cocody)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Lot Gros Œuvre • Poste : {currentUser?.speciality || "Maçonnerie / Coffrage"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-300 dark:border-emerald-800">
              Consignes HSE Validées
            </span>
          </div>
        </div>
      </AppCard>
    </div>
  );
};
