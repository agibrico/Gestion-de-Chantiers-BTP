/**
 * AGB CHANTIER - Modal de Création & Modification de Compagnon / Ouvrier BTP - AXE 05
 */

import React, { useState, useEffect } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import {
  WorkerEntity,
  WorkerTrade,
  WorkerContractType,
  WorkerStatus,
  WorkerCertification,
} from "../domain/entities/worker_entity";
import { TeamEntity } from "../domain/entities/team_entity";
import { ProjectEntity } from "../../projects/domain/entities/project_entity";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import {
  HardHat,
  ShieldCheck,
  Check,
  Phone,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";

interface WorkerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  workerToEdit?: WorkerEntity | null;
}

const TRADES: { value: WorkerTrade; label: string }[] = [
  { value: "CHEF_EQUIPE_TERRAIN", label: "🎖️ Chef d'Équipe de Terrain" },
  { value: "GRUTIER", label: "🏗️ Grutier / Conducteur d'Engin Lourd" },
  { value: "CONDUCTEUR_ENGIN", label: "🚜 Conducteur Pelle / Niveleuse / Tracto" },
  { value: "COFFREUR_BANCHEUR", label: "🧱 Coffreur-Bancheur BTP" },
  { value: "FERRAILLEUR", label: "⛓️ Ferrailleur / Façonnier Armatures" },
  { value: "MACON", label: "🔨 Maçon Finisseur / Gros Œuvre" },
  { value: "ELECTRICIEN", label: "⚡ Électricien Bâtiment & CFA/CFO" },
  { value: "PLOMBIER_CHAUFFAGISTE", label: "🚰 Plombier Sanitaire & Tuyauterie" },
  { value: "PEINTRE_APPLICATEUR", label: "🎨 Peintre Applicateur d'Enduits" },
  { value: "CARRELEUR", label: "✨ Poseur de Carrelage & Faïence" },
  { value: "ETANCHEUR", label: "🛡️ Étancheur Toitures & Terrasses" },
  { value: "MANOEUVRE_SPECIALISE", label: "👷 Manœuvre Spécialisé BTP" },
  { value: "AGENT_SECURITE_HSE", label: "🦺 Homme de Trafic / Gardien HSE" },
];

const CONTRACT_TYPES: { value: WorkerContractType; label: string }[] = [
  { value: "CDI", label: "Contrat à Durée Indéterminée (CDI)" },
  { value: "CDD", label: "Contrat à Durée Déterminée (CDD)" },
  { value: "JOURNALIER_TACHERON", label: "Journalier / Tâcheron Chantier" },
  { value: "INTERIMAIRE", label: "Intérimaire" },
  { value: "SOUS_TRAITANT", label: "Détaché Sous-Traitant" },
];

const STATUSES: { value: WorkerStatus; label: string }[] = [
  { value: "SUR_CHANTIER", label: "🟢 Sur Chantier (Actif Aujourd'hui)" },
  { value: "DISPONIBLE", label: "🔵 Disponible / En Réserve" },
  { value: "EN_CONGE", label: "🟡 En Congé Légal" },
  { value: "ARRET_MALADIE", label: "🔴 Arrêt Maladie / Inaptitude" },
];

export const WorkerFormModal: React.FC<WorkerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  workerToEdit,
}) => {
  const [projectsList, setProjectsList] = useState<ProjectEntity[]>([]);
  const [teamsList, setTeamsList] = useState<TeamEntity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [trade, setTrade] = useState<WorkerTrade>("MACON");
  const [tradeLevel, setTradeLevel] = useState("N3P1 (Compagnon)");
  const [contractType, setContractType] = useState<WorkerContractType>("CDI");
  const [status, setStatus] = useState<WorkerStatus>("SUR_CHANTIER");
  const [phone, setPhone] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [dailyRateFCFA, setDailyRateFCFA] = useState<number | "">(15000);
  const [currentProjectId, setCurrentProjectId] = useState("");
  const [currentTeamId, setCurrentTeamId] = useState("");
  const [medicalCheckupExpiryDate, setMedicalCheckupExpiryDate] = useState("");
  const [ppeDelivered, setPpeDelivered] = useState(true);
  const [certifications, setCertifications] = useState<WorkerCertification[]>([]);

  // New certification temp
  const [showAddCert, setShowAddCert] = useState(false);
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("Bureau Veritas / APAVE");
  const [certExpiry, setCertExpiry] = useState("");

  useEffect(() => {
    const loadPrjsAndTeams = async () => {
      try {
        const [prjs, tms] = await Promise.all([
          IdbAdapter.getAll<ProjectEntity>(IdbAdapter.STORES.PROJECTS),
          IdbAdapter.getAll<TeamEntity>(IdbAdapter.STORES.TEAMS),
        ]);
        setProjectsList(prjs);
        setTeamsList(tms);
      } catch (e) {
        console.error("Erreur chargement projets/équipes", e);
      }
    };
    if (isOpen) {
      loadPrjsAndTeams();
    }
  }, [isOpen]);

  useEffect(() => {
    if (workerToEdit) {
      setRegistrationNumber(workerToEdit.registrationNumber);
      setFirstName(workerToEdit.firstName);
      setLastName(workerToEdit.lastName);
      setTrade(workerToEdit.trade);
      setTradeLevel(workerToEdit.tradeLevel || "N3P1");
      setContractType(workerToEdit.contractType);
      setStatus(workerToEdit.status);
      setPhone(workerToEdit.phone || "");
      setEmergencyContactName(workerToEdit.emergencyContactName || "");
      setEmergencyContactPhone(workerToEdit.emergencyContactPhone || "");
      setDailyRateFCFA(workerToEdit.dailyRateFCFA || 15000);
      setCurrentProjectId(workerToEdit.currentProjectId || "");
      setCurrentTeamId(workerToEdit.currentTeamId || "");
      setMedicalCheckupExpiryDate(workerToEdit.medicalCheckupExpiryDate || "");
      setPpeDelivered(workerToEdit.ppeDelivered ?? true);
      setCertifications(workerToEdit.certifications || []);
    } else {
      setRegistrationNumber("");
      setFirstName("");
      setLastName("");
      setTrade("MACON");
      setTradeLevel("N3P1 (Compagnon)");
      setContractType("CDI");
      setStatus("SUR_CHANTIER");
      setPhone("");
      setEmergencyContactName("");
      setEmergencyContactPhone("");
      setDailyRateFCFA(15000);
      setCurrentProjectId("");
      setCurrentTeamId("");
      setMedicalCheckupExpiryDate("2026-12-31");
      setPpeDelivered(true);
      setCertifications([]);
    }
  }, [workerToEdit, isOpen]);

  const handleAddCert = () => {
    if (!certName.trim() || !certExpiry) return;
    const newCert: WorkerCertification = {
      id: `cert_${Date.now()}`,
      name: certName.trim(),
      issuer: certIssuer.trim(),
      obtainedDate: new Date().toISOString().split("T")[0],
      expiryDate: certExpiry,
      isValid: true,
    };
    setCertifications([...certifications, newCert]);
    setCertName("");
    setCertExpiry("");
    setShowAddCert(false);
  };

  const handleRemoveCert = (id: string) => {
    setCertifications(certifications.filter((c) => c.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    setIsSubmitting(true);
    try {
      const selectedPrj = projectsList.find((p) => p.id === currentProjectId);
      const selectedTeam = teamsList.find((t) => t.id === currentTeamId);

      const payload = {
        ...(workerToEdit ? workerToEdit : {}),
        registrationNumber: registrationNumber.trim() || undefined,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        trade,
        tradeLevel: tradeLevel.trim(),
        contractType,
        status,
        phone: phone.trim(),
        emergencyContactName: emergencyContactName.trim(),
        emergencyContactPhone: emergencyContactPhone.trim(),
        dailyRateFCFA: Number(dailyRateFCFA) || 12000,
        currentProjectId: currentProjectId || undefined,
        currentProjectName: selectedPrj ? selectedPrj.name : undefined,
        currentTeamId: currentTeamId || undefined,
        currentTeamName: selectedTeam ? selectedTeam.name : undefined,
        medicalCheckupExpiryDate: medicalCheckupExpiryDate || undefined,
        ppeDelivered,
        certifications,
        nationality: workerToEdit?.nationality || "Ivoirienne",
      };

      await onSubmit(payload);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={workerToEdit ? `Fiche Compagnon : ${workerToEdit.firstName} ${workerToEdit.lastName}` : "Enregistrer un Compagnon / Ouvrier BTP"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AppTextField
            label="Nom de Famille *"
            placeholder="Ex: Kouamé, Traoré, Diallo"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <AppTextField
            label="Prénom(s) *"
            placeholder="Ex: Jean-Yves, Souleymane"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <AppTextField
            label="Matricule BTP"
            placeholder="Ex: OUV-2026-042"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            helperText="Auto-généré si vide"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AppSelect
            label="Corps d'État / Métier *"
            value={trade}
            onChange={(e) => setTrade(e.target.value as WorkerTrade)}
            options={TRADES}
          />

          <AppTextField
            label="Niveau de Qualification"
            placeholder="Ex: N3P2 (Compagnon Pro), N4P1"
            value={tradeLevel}
            onChange={(e) => setTradeLevel(e.target.value)}
          />

          <AppSelect
            label="Type de Contrat"
            value={contractType}
            onChange={(e) => setContractType(e.target.value as WorkerContractType)}
            options={CONTRACT_TYPES}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AppSelect
            label="Statut Aujourd'hui"
            value={status}
            onChange={(e) => setStatus(e.target.value as WorkerStatus)}
            options={STATUSES}
          />

          <AppSelect
            label="Affectation Chantier"
            value={currentProjectId}
            onChange={(e) => setCurrentProjectId(e.target.value)}
            options={[
              { value: "", label: "-- Non affecté --" },
              ...projectsList.map((p) => ({
                value: p.id,
                label: `${p.code} - ${p.name}`,
              })),
            ]}
          />

          <AppSelect
            label="Équipe de Chantier"
            value={currentTeamId}
            onChange={(e) => setCurrentTeamId(e.target.value)}
            options={[
              { value: "", label: "-- Sans équipe dédiée --" },
              ...teamsList.map((t) => ({
                value: t.id,
                label: `${t.code} - ${t.name}`,
              })),
            ]}
          />
        </div>

        {/* Remuneration & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AppTextField
            label="Taux Journalier (FCFA) *"
            type="number"
            value={dailyRateFCFA}
            onChange={(e) => setDailyRateFCFA(e.target.value === "" ? "" : Number(e.target.value))}
            required
            leftIcon={<DollarSign className="w-4 h-4 text-emerald-600" />}
          />

          <AppTextField
            label="Téléphone Portable"
            placeholder="+225 07 00 00 00 00"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <AppTextField
            label="Date Fin Validité Visite Médicale"
            type="date"
            value={medicalCheckupExpiryDate}
            onChange={(e) => setMedicalCheckupExpiryDate(e.target.value)}
          />
        </div>

        {/* Emergency contact */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
            Contact d'Urgence (Famille)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AppTextField
              label="Nom Contact d'Urgence"
              placeholder="Ex: Épouse / Frère"
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
            />
            <AppTextField
              label="Téléphone d'Urgence"
              placeholder="+225 07 00 00 00 00"
              value={emergencyContactPhone}
              onChange={(e) => setEmergencyContactPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Certifications & Habilitations */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Habilitations BTP & CACES ({certifications.length})
            </span>
            <AppButton
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-3 h-3" />}
              onClick={() => setShowAddCert(!showAddCert)}
            >
              Ajouter Habilitation
            </AppButton>
          </div>

          {showAddCert && (
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Intitulé (Ex: CACES R487, Habilitation B2V, SST)"
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  className="p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
                <input
                  type="text"
                  placeholder="Organisme émetteur"
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  className="p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
                <input
                  type="date"
                  value={certExpiry}
                  onChange={(e) => setCertExpiry(e.target.value)}
                  className="p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCert(false)}
                  className="px-2 py-1 text-slate-500 hover:text-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleAddCert}
                  className="px-3 py-1 bg-orange-600 text-white rounded font-bold hover:bg-orange-700"
                >
                  Valider Habilitation
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            {certifications.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                  <span className="text-[10px] text-slate-400 block">
                    Émis par {c.issuer} • Expire le {c.expiryDate}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCert(c.id)}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="ppe"
            checked={ppeDelivered}
            onChange={(e) => setPpeDelivered(e.target.checked)}
            className="w-4 h-4 text-orange-600 rounded"
          />
          <label htmlFor="ppe" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            EPI Réglementaires Fournis (Casque avec jugulaire, Chaussures S3, Gilet HV, Lunettes)
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </AppButton>
          <AppButton type="submit" variant="primary" isLoading={isSubmitting} leftIcon={<Check className="w-4 h-4" />}>
            {workerToEdit ? "Enregistrer les Modifications" : "Enregistrer le Compagnon"}
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
};
