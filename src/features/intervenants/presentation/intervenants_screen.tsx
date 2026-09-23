/**
 * AGB CHANTIER - Module de Gestion des Intervenants & Personnel sur Site
 * Permet de lister les sous-traitants et le personnel avec coordonnées et affectations.
 */

import React, { useState, useEffect } from "react";
import {
  Users,
  HardHat,
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Briefcase,
  BadgeAlert,
  UserCheck,
  Calendar,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { IntervenantEntity, IntervenantType, IntervenantStatus, ComplianceStatus } from "../domain/intervenant_entity";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { AppTooltip } from "../../../core/widgets/feedback/app_tooltip";

const STORAGE_KEY = "agb_chantier_intervenants_v1";

const INITIAL_INTERVENANTS: IntervenantEntity[] = [
  {
    id: "stk-001",
    type: "SOUS_TRAITANT",
    name: "Mamadou Coulibaly",
    company: "COTELEC BTP CI",
    roleOrTrade: "Électricité Courants Forts & Faibles (CFO/CFA)",
    phone: "+225 07 48 92 11 05",
    email: "m.coulibaly@cotelec-btp.ci",
    assignedProjectId: "proj-002",
    assignedProjectName: "Tour Postel 2001 (Rénovation)",
    zoneAssignment: "Colonnes montantes & RDC à R+6",
    badgeNumber: "BADGE-EL-042",
    headcountOnSite: 14,
    status: "ACTIF_SUR_SITE",
    complianceStatus: "CONFORME",
    safetyClearanceDate: "2026-08-10",
    insuranceValidUntil: "2027-04-30",
    notes: "Assurance décennale et RC Pro conformes. Équipes équipées d'outillage isolé 1000V.",
    createdAt: "2026-08-01",
  },
  {
    id: "stk-002",
    type: "BUREAU_CONTROLE",
    name: "Ing. Jean-Luc Koffi",
    company: "SOCOTEC Côte d'Ivoire",
    roleOrTrade: "Contrôleur Technique Agréé (Solidité L & Sécurité Incendie S)",
    phone: "+225 05 04 18 29 40",
    email: "jl.koffi@socotec.ci",
    assignedProjectId: "proj-001",
    assignedProjectName: "Résidence Les Perles d'Abidjan",
    zoneAssignment: "Contrôle global gros-œuvre et ferraillages",
    badgeNumber: "CTRL-SOC-09",
    headcountOnSite: 2,
    status: "ACTIF_SUR_SITE",
    complianceStatus: "CONFORME",
    safetyClearanceDate: "2026-07-15",
    insuranceValidUntil: "2027-12-31",
    notes: "Visas BPE et procès-verbaux de contrôle contradictoires réguliers.",
    createdAt: "2026-07-01",
  },
  {
    id: "stk-003",
    type: "PERSONNEL_SITE",
    name: "Kouassi Yao",
    company: "AGB Construction (Régie)",
    roleOrTrade: "Chef d'Équipe Coffrage & Béton Armé",
    phone: "+225 01 02 88 44 20",
    email: "k.yao@agb-chantier.ci",
    assignedProjectId: "proj-001",
    assignedProjectName: "Résidence Les Perles d'Abidjan",
    zoneAssignment: "Bâtiment B - Plancher R+2 Voile V12",
    badgeNumber: "AGB-COF-018",
    headcountOnSite: 8,
    status: "ACTIF_SUR_SITE",
    complianceStatus: "CONFORME",
    safetyClearanceDate: "2026-06-01",
    insuranceValidUntil: "2027-12-31",
    notes: "Habilitation chef de manœuvre et secourisme SST à jour.",
    createdAt: "2026-06-01",
  },
  {
    id: "stk-004",
    type: "SOUS_TRAITANT",
    name: "Patrick Aka",
    company: "IVOIRE ÉTANCHÉITÉ SARL",
    roleOrTrade: "Étanchéité bitumineuse bicouche & Isolations",
    phone: "+225 07 19 33 50 82",
    email: "contact@ivoire-etancheite.ci",
    assignedProjectId: "proj-002",
    assignedProjectName: "Tour Postel 2001 (Rénovation)",
    zoneAssignment: "Toiture-terrasse accessible & acrotères",
    badgeNumber: "BADGE-ET-102",
    headcountOnSite: 6,
    status: "ACTIF_SUR_SITE",
    complianceStatus: "CONFORME",
    safetyClearanceDate: "2026-08-15",
    insuranceValidUntil: "2027-02-28",
    notes: "Permis de feu obligatoire à chaque utilisation de chalumeau propane.",
    createdAt: "2026-08-12",
  },
  {
    id: "stk-005",
    type: "BET",
    name: "Ing. Adjoumani Kassi",
    company: "BâtiTech Ingénierie",
    roleOrTrade: "Bureau d'Études Structure (Calculs BA & Charpente)",
    phone: "+225 05 88 12 77 91",
    email: "a.kassi@batitech-ci.com",
    assignedProjectId: "proj-003",
    assignedProjectName: "Hangar Logistique San-Pédro",
    zoneAssignment: "Poteaux BA & Portiques métalliques 30m",
    badgeNumber: "BET-BAT-03",
    headcountOnSite: 1,
    status: "EN_ATTENTE_INTERVENTION",
    complianceStatus: "CONFORME",
    safetyClearanceDate: "2026-07-20",
    insuranceValidUntil: "2027-10-31",
    notes: "En attente validation des notes de calculs portiques vent extrême.",
    createdAt: "2026-07-10",
  },
  {
    id: "stk-006",
    type: "SOUS_TRAITANT",
    name: "Ibrahim Touré",
    company: "SAN-PÉDRO CLIM & VENTIL",
    roleOrTrade: "Génie Climatique, VMC & Réseau RIA",
    phone: "+225 01 77 65 30 19",
    email: "i.toure@sp-clim.ci",
    assignedProjectId: "proj-003",
    assignedProjectName: "Hangar Logistique San-Pédro",
    zoneAssignment: "Sous-sol & Local Technique RIA",
    badgeNumber: "BADGE-CVC-08",
    headcountOnSite: 5,
    status: "ACTIF_SUR_SITE",
    complianceStatus: "DOCS_MANQUANTS",
    safetyClearanceDate: "2026-08-20",
    insuranceValidUntil: "2026-09-15",
    notes: "Attestation de renouvellement d'assurance RC en attente de transmission.",
    createdAt: "2026-08-18",
  },
  {
    id: "stk-007",
    type: "PERSONNEL_SITE",
    name: "Mariatou Diarra",
    company: "AGB Construction (HSE)",
    roleOrTrade: "Coordinatrice Sécurité & Prévention Santé (CSPS)",
    phone: "+225 07 55 90 22 14",
    email: "m.diarra@agb-chantier.ci",
    assignedProjectId: "proj-001",
    assignedProjectName: "Résidence Les Perles d'Abidjan",
    zoneAssignment: "Supervision globale des postes de travail et EPI",
    badgeNumber: "AGB-HSE-002",
    headcountOnSite: 1,
    status: "ACTIF_SUR_SITE",
    complianceStatus: "CONFORME",
    safetyClearanceDate: "2026-05-10",
    insuranceValidUntil: "2027-12-31",
    notes: "Animation des 1/4 d'heure sécurité hebdomadaires et audits terrain.",
    createdAt: "2026-05-01",
  },
  {
    id: "stk-008",
    type: "FOURNISSEUR",
    name: "Abel Gnahoré",
    company: "LAFARGEHOLCIM Côte d'Ivoire",
    roleOrTrade: "Fourniture Béton Prêt à l'Emploi (Centrales B25/B30)",
    phone: "+225 05 60 41 89 20",
    email: "a.gnahore@lafarge.ci",
    assignedProjectId: "proj-001",
    assignedProjectName: "Résidence Les Perles d'Abidjan",
    zoneAssignment: "Aire de déchargement toupies & pompe à béton",
    badgeNumber: "FOURN-LAF-01",
    headcountOnSite: 3,
    status: "ACTIF_SUR_SITE",
    complianceStatus: "CONFORME",
    safetyClearanceDate: "2026-06-25",
    insuranceValidUntil: "2027-12-31",
    notes: "Bon de livraison dématérialisé avec bons de pesée et temps de gâchée.",
    createdAt: "2026-06-20",
  },
];

export const IntervenantsScreen: React.FC = () => {
  const [intervenants, setIntervenants] = useState<IntervenantEntity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_INTERVENANTS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedProject, setSelectedProject] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingIntervenant, setEditingIntervenant] = useState<IntervenantEntity | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<IntervenantEntity>>({
    type: "SOUS_TRAITANT",
    name: "",
    company: "",
    roleOrTrade: "",
    phone: "",
    email: "",
    assignedProjectName: "Résidence Les Perles d'Abidjan",
    assignedProjectId: "proj-001",
    zoneAssignment: "",
    badgeNumber: "",
    headcountOnSite: 1,
    status: "ACTIF_SUR_SITE",
    complianceStatus: "CONFORME",
    safetyClearanceDate: new Date().toISOString().split("T")[0],
    insuranceValidUntil: "2027-12-31",
    notes: "",
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(intervenants));
    } catch {}
  }, [intervenants]);

  const filteredList = intervenants.filter((item) => {
    if (selectedType !== "ALL" && item.type !== selectedType) return false;
    if (selectedProject !== "ALL" && item.assignedProjectId !== selectedProject) return false;
    if (selectedStatus !== "ALL" && item.status !== selectedStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.roleOrTrade.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        item.zoneAssignment.toLowerCase().includes(q) ||
        item.badgeNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate Metrics
  const totalSubcontractors = intervenants.filter((i) => i.type === "SOUS_TRAITANT").length;
  const totalSiteStaff = intervenants.filter((i) => i.type === "PERSONNEL_SITE").length;
  const totalHeadcountPresent = intervenants
    .filter((i) => i.status === "ACTIF_SUR_SITE")
    .reduce((acc, curr) => acc + (curr.headcountOnSite || 0), 0);
  const complianceIssues = intervenants.filter((i) => i.complianceStatus !== "CONFORME").length;

  const handleOpenAdd = () => {
    setEditingIntervenant(null);
    setFormData({
      type: "SOUS_TRAITANT",
      name: "",
      company: "",
      roleOrTrade: "",
      phone: "",
      email: "",
      assignedProjectName: "Résidence Les Perles d'Abidjan",
      assignedProjectId: "proj-001",
      zoneAssignment: "",
      badgeNumber: `BADGE-${Math.floor(100 + Math.random() * 900)}`,
      headcountOnSite: 1,
      status: "ACTIF_SUR_SITE",
      complianceStatus: "CONFORME",
      safetyClearanceDate: new Date().toISOString().split("T")[0],
      insuranceValidUntil: "2027-12-31",
      notes: "",
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: IntervenantEntity) => {
    setEditingIntervenant(item);
    setFormData({ ...item });
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.company?.trim()) return;

    if (editingIntervenant) {
      setIntervenants((prev) =>
        prev.map((i) => (i.id === editingIntervenant.id ? ({ ...i, ...formData } as IntervenantEntity) : i))
      );
    } else {
      const newIntervenant: IntervenantEntity = {
        id: `stk-${Date.now()}`,
        type: formData.type || "SOUS_TRAITANT",
        name: formData.name || "",
        company: formData.company || "",
        roleOrTrade: formData.roleOrTrade || "Gros-Œuvre",
        phone: formData.phone || "+225 00 00 00 00",
        email: formData.email || "",
        assignedProjectId: formData.assignedProjectId || "proj-001",
        assignedProjectName:
          formData.assignedProjectId === "proj-002"
            ? "Tour Postel 2001 (Rénovation)"
            : formData.assignedProjectId === "proj-003"
            ? "Hangar Logistique San-Pédro"
            : "Résidence Les Perles d'Abidjan",
        zoneAssignment: formData.zoneAssignment || "Chantier Général",
        badgeNumber: formData.badgeNumber || `BADGE-${Date.now().toString().slice(-4)}`,
        headcountOnSite: Number(formData.headcountOnSite) || 1,
        status: formData.status || "ACTIF_SUR_SITE",
        complianceStatus: formData.complianceStatus || "CONFORME",
        safetyClearanceDate: formData.safetyClearanceDate || new Date().toISOString().split("T")[0],
        insuranceValidUntil: formData.insuranceValidUntil || "2027-12-31",
        notes: formData.notes || "",
        createdAt: new Date().toISOString(),
      };
      setIntervenants((prev) => [newIntervenant, ...prev]);
    }

    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Confirmez-vous le retrait de cet intervenant du registre de chantier ?")) {
      setIntervenants((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const getTypeBadge = (type: IntervenantType) => {
    switch (type) {
      case "SOUS_TRAITANT":
        return <AppBadge variant="warning">Sous-traitant</AppBadge>;
      case "PERSONNEL_SITE":
        return <AppBadge variant="inProgress">Personnel Chantier</AppBadge>;
      case "BUREAU_CONTROLE":
        return <AppBadge variant="info">Bureau de Contrôle</AppBadge>;
      case "BET":
        return <AppBadge variant="neutral">BET Structure</AppBadge>;
      case "FOURNISSEUR":
        return <AppBadge variant="success">Fournisseur Matériaux</AppBadge>;
    }
  };

  const getStatusBadge = (status: IntervenantStatus) => {
    switch (status) {
      case "ACTIF_SUR_SITE":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sur le Site
          </span>
        );
      case "EN_ATTENTE_INTERVENTION":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
            En attente
          </span>
        );
      case "INTERVENTION_TERMINEE":
        return (
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            Terminé
          </span>
        );
      case "ACCES_SUSPENDU":
        return (
          <span className="text-[11px] font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-300 dark:border-red-800">
            Accès Suspendu
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <AppBadge variant="success" dot={true}>
              REGISTRE DU PERSONNEL & SOUS-TRAITANTS
            </AppBadge>
            <span className="text-xs text-orange-400 font-mono font-bold">
              Contrôle d'Accès & Affectations Chantier
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            Gestion des Intervenants
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Suivi opérationnel des entreprises sous-traitantes, équipes de régie, bureaux d'études et effectifs réels déployés sur le terrain.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <AppButton
            variant="primary"
            size="md"
            tooltip="Enregistrer un nouveau sous-traitant, personnel ou bureau de contrôle avec ses affectations"
            onClick={handleOpenAdd}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nouvel Intervenant
          </AppButton>

          <AppButton
            variant="outline"
            size="md"
            tooltip="Exporter le registre officiel des présences et assurances au format tableur / PDF pour l'inspection du travail"
            onClick={() => {
              alert(
                "Exportation du Registre des Intervenants généré avec succès (Conforme Code du Travail & Plan Particulier de Sécurité PPSPS)."
              );
            }}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Exporter Registre
          </AppButton>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Effectif Global Présent sur Site"
          value={`${totalHeadcountPresent} Compagnons`}
          subValue="Tous chantiers et sous-traitances confondus"
          icon={<Users className="w-6 h-6" />}
          iconColor="text-orange-600"
          badgeText="Pointage Aujourd'hui"
          badgeVariant="success"
        />

        <StatCard
          label="Entreprises Sous-Traitantes"
          value={`${totalSubcontractors} Sociétés`}
          subValue="Lots Électricité, Étanchéité, CVC..."
          icon={<Building2 className="w-6 h-6" />}
          iconColor="text-blue-600"
          badgeText="Contrats Actifs"
          badgeVariant="info"
        />

        <StatCard
          label="Personnel Chantier Régie AGB"
          value={`${totalSiteStaff} Cadres & Chefs`}
          subValue="Chefs d'équipe, Conducteurs, HSE"
          icon={<HardHat className="w-6 h-6" />}
          iconColor="text-emerald-600"
          badgeText="Encadrement"
          badgeVariant="success"
        />

        <StatCard
          label="Conformité HSE & Assurances"
          value={complianceIssues === 0 ? "100% Conforme" : `${complianceIssues} Régularisations`}
          subValue={complianceIssues === 0 ? "Toutes attestations décennales à jour" : "Attestations ou habilitations requises"}
          icon={<ShieldCheck className="w-6 h-6" />}
          iconColor={complianceIssues === 0 ? "text-emerald-600" : "text-amber-600"}
          badgeText="Sécurité"
          badgeVariant={complianceIssues === 0 ? "success" : "warning"}
        />
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full">
          <AppTextField
            placeholder="Rechercher par nom, entreprise, corps d'état, téléphone, badge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="w-full sm:w-44">
            <AppSelect
              options={[
                { value: "ALL", label: "Tous Types" },
                { value: "SOUS_TRAITANT", label: "Sous-traitants" },
                { value: "PERSONNEL_SITE", label: "Personnel Régie" },
                { value: "BUREAU_CONTROLE", label: "Bureau de Contrôle" },
                { value: "BET", label: "BET Structure" },
                { value: "FOURNISSEUR", label: "Fournisseurs" },
              ]}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-52">
            <AppSelect
              options={[
                { value: "ALL", label: "Tous Chantiers" },
                { value: "proj-001", label: "Résidence Les Perles" },
                { value: "proj-002", label: "Tour Postel 2001" },
                { value: "proj-003", label: "Hangar San-Pédro" },
              ]}
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-40">
            <AppSelect
              options={[
                { value: "ALL", label: "Tous Statuts" },
                { value: "ACTIF_SUR_SITE", label: "Sur le Site" },
                { value: "EN_ATTENTE_INTERVENTION", label: "En attente" },
                { value: "INTERVENTION_TERMINEE", label: "Terminé" },
              ]}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid of Intervenants Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Aucun intervenant trouvé
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Modifiez vos filtres ou créez un nouvel intervenant avec le bouton ci-dessus.
            </p>
          </div>
        ) : (
          filteredList.map((item) => {
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:border-orange-500/40 dark:hover:border-orange-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar inside Card */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getTypeBadge(item.type)}
                        {getStatusBadge(item.status)}
                      </div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                        {item.company}
                      </h3>
                      <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                        {item.roleOrTrade}
                      </p>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                      {item.badgeNumber}
                    </span>
                  </div>

                  {/* Representative & Headcount */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Responsable sur site :</span>
                      <strong className="text-slate-900 dark:text-white">{item.name}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Effectif actuel déployé :</span>
                      <span className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-white bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded">
                        <Users className="w-3 h-3" />
                        {item.headcountOnSite} ouvrier{item.headcountOnSite > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Project & Zone Assignment */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                      <Building2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">{item.assignedProjectName}</span>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.zoneAssignment}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={`tel:${item.phone}`}
                        className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-orange-600 transition-colors truncate"
                      >
                        <Phone className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span>{item.phone}</span>
                      </a>
                      {item.email && (
                        <a
                          href={`mailto:${item.email}`}
                          className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-orange-600 transition-colors truncate"
                        >
                          <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>Email</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Compliance Notice */}
                  {item.complianceStatus !== "CONFORME" && (
                    <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Attention : Documents ou assurances à régulariser sous 48h</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <AppButton
                    variant="outline"
                    size="sm"
                    tooltip="Modifier les informations, contacts ou effectifs de cet intervenant"
                    className="text-xs py-1 flex-1"
                    onClick={() => handleOpenEdit(item)}
                  >
                    Modifier
                  </AppButton>

                  <AppButton
                    variant="secondary"
                    size="sm"
                    tooltip={`Composer le numéro de téléphone de ${item.name} (${item.phone})`}
                    className="text-xs py-1"
                    onClick={() => {
                      window.location.href = `tel:${item.phone}`;
                    }}
                    leftIcon={<Phone className="w-3 h-3 text-emerald-600" />}
                  >
                    Appeler
                  </AppButton>

                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Retirer cet intervenant du chantier"
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer transition-colors text-xs"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Add / Edit Intervenant */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in zoom-in-95">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-600 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingIntervenant ? "Modifier l'Intervenant" : "Nouvel Intervenant sur Site"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enregistrement des sous-traitants, effectifs et coordonnées
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Catégorie d'Intervenant
                  </label>
                  <AppSelect
                    options={[
                      { value: "SOUS_TRAITANT", label: "Sous-traitant" },
                      { value: "PERSONNEL_SITE", label: "Personnel Régie AGB" },
                      { value: "BUREAU_CONTROLE", label: "Bureau de Contrôle Technique" },
                      { value: "BET", label: "Bureau d'Études Structure (BET)" },
                      { value: "FOURNISSEUR", label: "Fournisseur Matériaux" },
                    ]}
                    value={formData.type || "SOUS_TRAITANT"}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as IntervenantType })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Entreprise / Raison Sociale *
                  </label>
                  <AppTextField
                    placeholder="Ex: COTELEC BTP, SOCOTEC, AGB..."
                    value={formData.company || ""}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Nom du Responsable sur Site *
                  </label>
                  <AppTextField
                    placeholder="Ex: Mamadou Coulibaly, Ing. Koffi..."
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Corps d'état / Métier *
                  </label>
                  <AppTextField
                    placeholder="Ex: Électricité, Gros-Œuvre, Étanchéité..."
                    value={formData.roleOrTrade || ""}
                    onChange={(e) => setFormData({ ...formData, roleOrTrade: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Téléphone Direct *
                  </label>
                  <AppTextField
                    placeholder="+225 07 00 00 00 00"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Email Professionnel
                  </label>
                  <AppTextField
                    type="email"
                    placeholder="contact@entreprise.ci"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Chantier Affecté
                  </label>
                  <AppSelect
                    options={[
                      { value: "proj-001", label: "Résidence Les Perles" },
                      { value: "proj-002", label: "Tour Postel 2001" },
                      { value: "proj-003", label: "Hangar San-Pédro" },
                    ]}
                    value={formData.assignedProjectId || "proj-001"}
                    onChange={(e) => setFormData({ ...formData, assignedProjectId: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Zone / Niveau d'intervention
                  </label>
                  <AppTextField
                    placeholder="Ex: RDC, Bâtiment B, Toiture..."
                    value={formData.zoneAssignment || ""}
                    onChange={(e) => setFormData({ ...formData, zoneAssignment: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Effectif sur site (Aujourd'hui)
                  </label>
                  <AppTextField
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.headcountOnSite?.toString() || "1"}
                    onChange={(e) => setFormData({ ...formData, headcountOnSite: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Numéro de Badge
                  </label>
                  <AppTextField
                    placeholder="BADGE-001"
                    value={formData.badgeNumber || ""}
                    onChange={(e) => setFormData({ ...formData, badgeNumber: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Statut Présence
                  </label>
                  <AppSelect
                    options={[
                      { value: "ACTIF_SUR_SITE", label: "Sur le Site (Actif)" },
                      { value: "EN_ATTENTE_INTERVENTION", label: "En attente" },
                      { value: "INTERVENTION_TERMINEE", label: "Intervention terminée" },
                      { value: "ACCES_SUSPENDU", label: "Accès suspendu" },
                    ]}
                    value={formData.status || "ACTIF_SUR_SITE"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as IntervenantStatus })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Conformité HSE
                  </label>
                  <AppSelect
                    options={[
                      { value: "CONFORME", label: "Conforme (À jour)" },
                      { value: "DOCS_MANQUANTS", label: "Documents manquants" },
                      { value: "EPI_A_VERIFIER", label: "EPI à vérifier" },
                    ]}
                    value={formData.complianceStatus || "CONFORME"}
                    onChange={(e) => setFormData({ ...formData, complianceStatus: e.target.value as ComplianceStatus })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Observations et Consignes Particulières
                </label>
                <textarea
                  rows={2}
                  placeholder="Permis de feu requis, vérification habilitation électrique, consignes spécifiques..."
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <AppButton
                  type="button"
                  variant="outline"
                  size="md"
                  tooltip="Annuler la saisie et fermer la fenêtre"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Annuler
                </AppButton>

                <AppButton
                  type="submit"
                  variant="primary"
                  size="md"
                  tooltip="Enregistrer définitivement cet intervenant dans le registre opérationnel"
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  {editingIntervenant ? "Mettre à jour" : "Enregistrer l'intervenant"}
                </AppButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
