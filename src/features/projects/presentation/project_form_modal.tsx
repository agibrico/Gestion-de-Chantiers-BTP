/**
 * AGB CHANTIER - Modal de Création & Modification de Chantier BTP - AXE 04
 */

import React, { useState, useEffect } from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import {
  ProjectEntity,
  ProjectType,
  ProjectStatus,
  ProjectRiskLevel,
} from "../domain/entities/project_entity";
import { CreateProjectDTO } from "../domain/repositories/project_repository";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { ClientEntity } from "../../clients/domain/entities/client_entity";
import {
  HardHat,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  ShieldAlert,
  Users,
  Check,
  Sparkles,
} from "lucide-react";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateProjectDTO | ProjectEntity) => Promise<void>;
  projectToEdit?: ProjectEntity | null;
}

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: "BATIMENT_RESIDENTIEL", label: "🏢 Bâtiment Résidentiel (Immeubles / Villas)" },
  { value: "BATIMENT_TERTIAIRE", label: "🏬 Bâtiment Tertiaire (Bureaux / Sièges)" },
  { value: "TRAVAUX_PUBLICS_VRD", label: "🛣️ Travaux Publics & VRD (Routes / Voiries)" },
  { value: "GENIE_CIVIL_OUVRAGES", label: "🌉 Génie Civil & Ouvrages d'Art" },
  { value: "INDUSTRIEL_ENTREPOT", label: "🏭 Industriel & Entrepôts Métalliques" },
  { value: "RENOVATION_REHABILITATION", label: "🔨 Rénovation & Réhabilitation" },
  { value: "AMENAGEMENT_INTERIEUR", label: "✨ Aménagement Intérieur & Finitions" },
];

const PROJECT_STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: "ETUDE_PREPARATION", label: "📝 Études & Préparation" },
  { value: "EN_COURS", label: "🟢 Travaux En Cours" },
  { value: "EN_PAUSE", label: "⏸️ Travaux Suspendus" },
  { value: "RECEPTIONNE", label: "🏁 Réceptionné (OPR / Clés)" },
  { value: "CLOTURE", label: "🔒 Clôturé (DGD Validé)" },
];

const RISK_LEVELS: { value: ProjectRiskLevel; label: string }[] = [
  { value: "FAIBLE", label: "🟢 Risque Faible" },
  { value: "MOYEN", label: "🟡 Risque Modéré" },
  { value: "ELEVE", label: "🔴 Risque Élevé (Délais / Nappe / Météo)" },
];

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projectToEdit,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "financial" | "location" | "team">("general");
  const [clientsList, setClientsList] = useState<ClientEntity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ProjectType>("BATIMENT_RESIDENTIEL");
  const [status, setStatus] = useState<ProjectStatus>("EN_COURS");
  const [riskLevel, setRiskLevel] = useState<ProjectRiskLevel>("FAIBLE");

  // Client / MOA
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientContactPerson, setClientContactPerson] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  // Dates
  const [startDate, setStartDate] = useState("");
  const [estimatedEndDate, setEstimatedEndDate] = useState("");

  // Tech Specs
  const [surfaceAreaM2, setSurfaceAreaM2] = useState<number | "">("");
  const [numberOfFloors, setNumberOfFloors] = useState("");
  const [buildingPermitNumber, setBuildingPermitNumber] = useState("");

  // Finances
  const [totalBudgetContracted, setTotalBudgetContracted] = useState<number | "">("");
  const [totalBudgetEstimated, setTotalBudgetEstimated] = useState<number | "">("");
  const [retentionGuaranteeRate, setRetentionGuaranteeRate] = useState<number>(5);

  // Localisation
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Abidjan");
  const [district, setDistrict] = useState("");
  const [country, setCountry] = useState("Côte d'Ivoire");
  const [accessNotes, setAccessNotes] = useState("");

  // Team
  const [projectManagerName, setProjectManagerName] = useState("Ing. Koffi Kan Marc");
  const [siteManagerName, setSiteManagerName] = useState("M. Kouamé Jean-Yves");
  const [foremanName, setForemanName] = useState("M. Traoré Souleymane");
  const [safetyOfficerName, setSafetyOfficerName] = useState("Mme Yao Affoué Sylvie");

  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    const loadClients = async () => {
      try {
        const clients = await IdbAdapter.getAll<ClientEntity>(IdbAdapter.STORES.CLIENTS);
        setClientsList(clients);
      } catch (e) {
        console.error("Erreur chargement clients", e);
      }
    };
    if (isOpen) {
      loadClients();
    }
  }, [isOpen]);

  useEffect(() => {
    if (projectToEdit) {
      setCode(projectToEdit.code);
      setName(projectToEdit.name);
      setDescription(projectToEdit.description || "");
      setType(projectToEdit.type);
      setStatus(projectToEdit.status);
      setRiskLevel(projectToEdit.riskLevel);
      setClientId(projectToEdit.clientId || "");
      setClientName(projectToEdit.clientName || "");
      setClientContactPerson(projectToEdit.clientContactPerson || "");
      setClientPhone(projectToEdit.clientPhone || "");
      setStartDate(projectToEdit.startDate);
      setEstimatedEndDate(projectToEdit.estimatedEndDate);
      setSurfaceAreaM2(projectToEdit.surfaceAreaM2 || "");
      setNumberOfFloors(projectToEdit.numberOfFloors || "");
      setBuildingPermitNumber(projectToEdit.buildingPermitNumber || "");
      setTotalBudgetContracted(projectToEdit.totalBudgetContracted || "");
      setTotalBudgetEstimated(projectToEdit.totalBudgetEstimated || "");
      setRetentionGuaranteeRate(projectToEdit.retentionGuaranteeRate || 5);
      setAddress(projectToEdit.location?.address || "");
      setCity(projectToEdit.location?.city || "Abidjan");
      setDistrict(projectToEdit.location?.district || "");
      setCountry(projectToEdit.location?.country || "Côte d'Ivoire");
      setAccessNotes(projectToEdit.location?.accessNotes || "");
      setProjectManagerName(projectToEdit.managementTeam?.projectManagerName || "");
      setSiteManagerName(projectToEdit.managementTeam?.siteManagerName || "");
      setForemanName(projectToEdit.managementTeam?.foremanName || "");
      setSafetyOfficerName(projectToEdit.managementTeam?.safetyOfficerName || "");
      setTagsInput(projectToEdit.tags?.join(", ") || "");
    } else {
      // Defaults for new project
      const today = new Date().toISOString().split("T")[0];
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const nextYearStr = nextYear.toISOString().split("T")[0];

      setCode("");
      setName("");
      setDescription("");
      setType("BATIMENT_RESIDENTIEL");
      setStatus("EN_COURS");
      setRiskLevel("FAIBLE");
      setClientId("");
      setClientName("");
      setClientContactPerson("");
      setClientPhone("");
      setStartDate(today);
      setEstimatedEndDate(nextYearStr);
      setSurfaceAreaM2("");
      setNumberOfFloors("R+4");
      setBuildingPermitNumber("");
      setTotalBudgetContracted("");
      setTotalBudgetEstimated("");
      setRetentionGuaranteeRate(5);
      setAddress("");
      setCity("Abidjan");
      setDistrict("Cocody");
      setCountry("Côte d'Ivoire");
      setAccessNotes("");
      setProjectManagerName("Ing. Koffi Kan Marc");
      setSiteManagerName("M. Kouamé Jean-Yves");
      setForemanName("M. Traoré Souleymane");
      setSafetyOfficerName("Mme Yao Affoué Sylvie");
      setTagsInput("Chantier Prioritaire, Béton Armé");
    }
  }, [projectToEdit, isOpen]);

  const handleClientSelect = (selectedId: string) => {
    setClientId(selectedId);
    const client = clientsList.find((c) => c.id === selectedId);
    if (client) {
      setClientName(client.name);
      const primaryContact = client.contacts?.find((c) => c.isPrimary) || client.contacts?.[0];
      if (primaryContact) {
        setClientContactPerson(primaryContact.name);
        setClientPhone(primaryContact.phone);
      } else {
        setClientContactPerson("");
        setClientPhone(client.phone || "");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !startDate || !estimatedEndDate) {
      return;
    }

    setIsSubmitting(true);
    try {
      const budgetContracted = Number(totalBudgetContracted) || 0;
      const budgetEstimated = Number(totalBudgetEstimated) || Math.round(budgetContracted * 0.9);

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const locationData = {
        address: address.trim(),
        city: city.trim(),
        district: district.trim(),
        country: country.trim(),
        accessNotes: accessNotes.trim(),
      };

      const teamData = {
        projectManagerName: projectManagerName.trim(),
        siteManagerName: siteManagerName.trim(),
        foremanName: foremanName.trim(),
        safetyOfficerName: safetyOfficerName.trim(),
      };

      if (projectToEdit) {
        const updatedProject: ProjectEntity = {
          ...projectToEdit,
          name: name.trim(),
          description: description.trim(),
          type,
          status,
          riskLevel,
          clientId,
          clientName: clientName.trim() || "Maître d'Ouvrage Non Spécifié",
          clientContactPerson: clientContactPerson.trim(),
          clientPhone: clientPhone.trim(),
          location: locationData,
          startDate,
          estimatedEndDate,
          surfaceAreaM2: Number(surfaceAreaM2) || 0,
          numberOfFloors: numberOfFloors.trim(),
          buildingPermitNumber: buildingPermitNumber.trim(),
          totalBudgetContracted: budgetContracted,
          totalBudgetEstimated: budgetEstimated,
          retentionGuaranteeRate: Number(retentionGuaranteeRate) || 5,
          managementTeam: teamData,
          tags,
        };
        await onSubmit(updatedProject);
      } else {
        const newDTO: CreateProjectDTO = {
          code: code.trim() || undefined,
          name: name.trim(),
          description: description.trim(),
          type,
          status,
          riskLevel,
          clientId,
          clientName: clientName.trim() || "Maître d'Ouvrage Non Spécifié",
          clientContactPerson: clientContactPerson.trim(),
          clientPhone: clientPhone.trim(),
          location: locationData,
          startDate,
          estimatedEndDate,
          surfaceAreaM2: Number(surfaceAreaM2) || 0,
          numberOfFloors: numberOfFloors.trim(),
          buildingPermitNumber: buildingPermitNumber.trim(),
          totalBudgetContracted: budgetContracted,
          totalBudgetEstimated: budgetEstimated,
          retentionGuaranteeRate: Number(retentionGuaranteeRate) || 5,
          managementTeam: teamData,
          tags,
        };
        await onSubmit(newDTO);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? `Modifier le Chantier : ${projectToEdit.code}` : "Initialiser un Nouveau Chantier BTP"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 pb-2 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "general"
                ? "bg-orange-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            1. Général & MOA
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("financial")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "financial"
                ? "bg-orange-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            2. Marché & Calendrier
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("location")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "location"
                ? "bg-orange-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            3. Localisation & Technique
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("team")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "team"
                ? "bg-orange-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            4. Équipe d'Encadrement
          </button>
        </div>

        {/* Tab 1: General & Client */}
        {activeTab === "general" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <AppTextField
                label="Code Chantier (Optionnel)"
                placeholder="Ex: CH-2026-005"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                helperText="Auto-généré si vide"
              />

              <div className="md:col-span-2">
                <AppTextField
                  label="Nom du Chantier / Ouvrage *"
                  placeholder="Ex: Immeuble Le Récif R+8 ou Extension Voie Rapide"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  leftIcon={<Building2 className="w-4 h-4" />}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <AppSelect
                label="Type d'Ouvrage *"
                value={type}
                onChange={(e) => setType(e.target.value as ProjectType)}
                options={PROJECT_TYPES}
              />

              <AppSelect
                label="Statut du Projet"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                options={PROJECT_STATUSES}
              />

              <AppSelect
                label="Niveau de Risque"
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value as ProjectRiskLevel)}
                options={RISK_LEVELS}
              />
            </div>

            {/* Client / MOA Section */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <HardHat className="w-4 h-4 text-orange-600" />
                  Maîtrise d'Ouvrage (Client Donneur d'Ordre)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Lié à l'Axe 03</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AppSelect
                  label="Sélectionner un Client Existant"
                  value={clientId}
                  onChange={(e) => handleClientSelect(e.target.value)}
                  options={[
                    { value: "", label: "-- Choisir dans le Répertoire Clients --" },
                    ...clientsList.map((c) => ({
                      value: c.id,
                      label: `${c.code} - ${c.name} (${c.city})`,
                    })),
                  ]}
                />

                <AppTextField
                  label="Nom Raison Sociale MOA *"
                  placeholder="Ex: AGEROUTE ou SIPI Immobilier"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AppTextField
                  label="Interlocuteur / Contact Référent"
                  placeholder="Ex: M. Bakary Coulibaly (Directeur Travaux)"
                  value={clientContactPerson}
                  onChange={(e) => setClientContactPerson(e.target.value)}
                />

                <AppTextField
                  label="Téléphone d'Urgence MOA"
                  placeholder="+225 07 00 00 00 00"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description du Projet & Consignes Particulières
              </label>
              <textarea
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-hidden resize-none"
                placeholder="Ex: Construction tous corps d'état avec 2 niveaux de sous-sol. Pieu foré et radier général..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Financial & Schedule */}
        {activeTab === "financial" && (
          <div className="space-y-4">
            <div className="p-3.5 bg-orange-50/50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-900/50 space-y-3">
              <span className="text-xs font-bold text-orange-900 dark:text-orange-300 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-orange-600" />
                Budget du Marché BTP (FCFA)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <AppTextField
                  label="Montant Marché Contracté (FCFA TTC) *"
                  type="number"
                  placeholder="Ex: 4850000000"
                  value={totalBudgetContracted}
                  onChange={(e) => setTotalBudgetContracted(e.target.value === "" ? "" : Number(e.target.value))}
                  required
                />

                <AppTextField
                  label="Budget Objectif Prévisionnel (FCFA)"
                  type="number"
                  placeholder="Ex: 4200000000"
                  value={totalBudgetEstimated}
                  onChange={(e) => setTotalBudgetEstimated(e.target.value === "" ? "" : Number(e.target.value))}
                  helperText="Marge prévisionnelle d'entreprise"
                />

                <AppTextField
                  label="Retenue de Garantie (%)"
                  type="number"
                  placeholder="5"
                  value={retentionGuaranteeRate}
                  onChange={(e) => setRetentionGuaranteeRate(Number(e.target.value))}
                  helperText="Standard BTP : 5%"
                />
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-orange-600" />
                Planning d'Exécution Contractuel (OS)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AppTextField
                  label="Date de Démarrage (Ordre de Service) *"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />

                <AppTextField
                  label="Date Fin Prévisionnelle (Délai Global) *"
                  type="date"
                  value={estimatedEndDate}
                  onChange={(e) => setEstimatedEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <AppTextField
              label="Mots-clés / Tags du Chantier"
              placeholder="Ex: Béton Armé, Structure R+14, Mur Rideau, Marché Public"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>
        )}

        {/* Tab 3: Location & Tech Specs */}
        {activeTab === "location" && (
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-600" />
                Emplacement Géographique du Chantier
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <AppTextField
                  label="Ville *"
                  placeholder="Ex: Abidjan, Bouaké, San-Pédro, Yamoussoukro"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />

                <AppTextField
                  label="Commune / Quartier"
                  placeholder="Ex: Plateau, Cocody, Yopougon, Marcory"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />

                <AppTextField
                  label="Pays"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              <AppTextField
                label="Adresse Précise & Repère d'Accès"
                placeholder="Ex: Boulevard de la République, Face Siège CCIA"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <AppTextField
                label="Contraintes d'Accès Poids Lourds / Toupie Béton"
                placeholder="Ex: Livraison toupies de nuit 21h-05h ou autorisation spéciale de voirie"
                value={accessNotes}
                onChange={(e) => setAccessNotes(e.target.value)}
              />
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-orange-600" />
                Spécifications Techniques de l'Ouvrage
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <AppTextField
                  label="Surface Bâtie (m² Shon)"
                  type="number"
                  placeholder="Ex: 12500"
                  value={surfaceAreaM2}
                  onChange={(e) => setSurfaceAreaM2(e.target.value === "" ? "" : Number(e.target.value))}
                />

                <AppTextField
                  label="Niveaux / Hauteur"
                  placeholder="Ex: 2SS + RDC + 14 Étages"
                  value={numberOfFloors}
                  onChange={(e) => setNumberOfFloors(e.target.value)}
                />

                <AppTextField
                  label="N° Permis de Construire / Marché"
                  placeholder="Ex: PC-ABJ-2025-0894"
                  value={buildingPermitNumber}
                  onChange={(e) => setBuildingPermitNumber(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Team */}
        {activeTab === "team" && (
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-orange-600" />
                Organigramme & Responsables Opérationnels du Chantier
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AppTextField
                  label="Directeur de Travaux"
                  placeholder="Ex: Ing. Koffi Kan Marc"
                  value={projectManagerName}
                  onChange={(e) => setProjectManagerName(e.target.value)}
                />

                <AppTextField
                  label="Conducteur de Travaux Principal *"
                  placeholder="Ex: M. Kouamé Jean-Yves"
                  value={siteManagerName}
                  onChange={(e) => setSiteManagerName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AppTextField
                  label="Chef de Chantier Principal *"
                  placeholder="Ex: M. Traoré Souleymane"
                  value={foremanName}
                  onChange={(e) => setForemanName(e.target.value)}
                  required
                />

                <AppTextField
                  label="Responsable Hygiène & Sécurité (HSE)"
                  placeholder="Ex: Mme Yao Affoué Sylvie"
                  value={safetyOfficerName}
                  onChange={(e) => setSafetyOfficerName(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <AppButton type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </AppButton>

          <div className="flex items-center gap-2">
            {activeTab !== "team" && (
              <AppButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (activeTab === "general") setActiveTab("financial");
                  else if (activeTab === "financial") setActiveTab("location");
                  else if (activeTab === "location") setActiveTab("team");
                }}
              >
                Suivant &rarr;
              </AppButton>
            )}

            <AppButton
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<Check className="w-4 h-4" />}
            >
              {projectToEdit ? "Enregistrer les Modifications" : "Créer le Chantier"}
            </AppButton>
          </div>
        </div>
      </form>
    </AppModal>
  );
};
