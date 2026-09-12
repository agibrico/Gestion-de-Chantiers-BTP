/**
 * AGB CHANTIER - Composant Dashboard Principal (Vue d'ensemble des chantiers)
 * Affiche une vue d'ensemble des chantiers avec des indicateurs clés :
 * - Projets Actifs
 * - Retards & Alertes Planning
 * - Budget Total & Consommation Financière
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import {
  HardHat,
  Building2,
  Calendar,
  Clock,
  Coins,
  TrendingUp,
  AlertTriangle,
  Users,
  Search,
  Plus,
  Download,
  Filter,
  Eye,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Layers,
  ChevronRight,
  TrendingDown,
  Activity,
  Briefcase,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  Tablet,
} from "lucide-react";
import { ProjectEntity, ProjectType, ProjectStatus, ProjectRiskLevel } from "../features/projects/domain/entities/project_entity";
import { ProjectRepositoryImpl } from "../features/projects/data/project_repository_impl";
import { ProjectFormModal } from "../features/projects/presentation/project_form_modal";
import { ProjectDetailModal } from "../features/projects/presentation/project_detail_modal";

export interface DashboardProps {
  onNavigateToProjects?: () => void;
  onNavigateToPlanning?: () => void;
  onNavigateToFinance?: () => void;
  onOpenChantierDetail?: (projectId: string) => void;
}

// Données initiales réalistes pour affichage instantané et résilient
const FALLBACK_PROJECTS: ProjectEntity[] = [
  {
    id: "proj_001_horizon",
    code: "CH-2026-001",
    name: "Tour Horizon Plateau R+14",
    description: "Construction d'une tour d'affaires haut standing de 14 étages avec 2 niveaux de sous-sol.",
    type: "BATIMENT_TERTIAIRE",
    status: "EN_COURS",
    riskLevel: "MOYEN",
    clientId: "client_001_saphir",
    clientName: "SAPHIR Immobilier CI",
    clientType: "PROMOTEUR_PRIVE",
    clientContactPerson: "M. Kouamé Jean-Luc",
    clientPhone: "+225 07 08 09 10 11",
    location: {
      address: "Avenue Delafosse, Plateau",
      city: "Abidjan",
      district: "Plateau",
      country: "Côte d'Ivoire",
    },
    startDate: "2025-06-15",
    estimatedEndDate: "2027-03-30",
    surfaceAreaM2: 14500,
    numberOfFloors: "2SS + R+14",
    buildingPermitNumber: "PC-ABJ-2025-0189",
    totalBudgetEstimated: 4500000000,
    totalBudgetContracted: 4850000000,
    totalExpensesRealized: 2150000000,
    totalBilledAmount: 2600000000,
    totalPaidAmount: 2400000000,
    retentionGuaranteeRate: 5,
    progressPercentage: 42,
    financialProgressPercentage: 53,
    managementTeam: {
      projectManagerName: "Ing. Koffi Kan Marc",
      siteManagerName: "M. Traoré Souleymane",
      foremanName: "M. Bamba Bakary",
      safetyOfficerName: "Mme Yao Affoué Sylvie",
    },
    phases: [
      {
        id: "ph_01",
        name: "Fondations profondes & Parois moulées",
        order: 1,
        startDate: "2025-06-15",
        endDate: "2025-11-30",
        progressPercentage: 100,
        status: "TERMINEE",
        budgetAllocated: 1100000000,
        budgetSpent: 1050000000,
      },
      {
        id: "ph_02",
        name: "Gros Œuvre Niveaux RDC à R+7",
        order: 2,
        startDate: "2025-12-01",
        endDate: "2026-07-31",
        progressPercentage: 65,
        status: "EN_COURS",
        budgetAllocated: 1800000000,
        budgetSpent: 1100000000,
      },
      {
        id: "ph_03",
        name: "Second Œuvre, Façades & Climatisation",
        order: 3,
        startDate: "2026-08-01",
        endDate: "2027-03-30",
        progressPercentage: 0,
        status: "NON_DEBUTEE",
        budgetAllocated: 1950000000,
        budgetSpent: 0,
      },
    ],
    milestones: [
      {
        id: "ms_01",
        title: "Coulage Radier Général",
        targetDate: "2025-10-15",
        completedDate: "2025-10-12",
        status: "VALIDE",
        isCritical: true,
      },
      {
        id: "ms_02",
        title: "Achèvement Structure R+7",
        targetDate: "2026-07-31",
        status: "EN_ATTENTE",
        isCritical: true,
      },
    ],
    metrics: {
      workersOnSiteToday: 64,
      totalHoursWorked: 38400,
      openReservationsCount: 3,
      safetyIncidentsCount: 0,
      siteDiaryEntriesCount: 88,
      photosCount: 240,
      activeAlertsCount: 0,
    },
    weatherCondition: "ENSOLEILLE",
    temperatureCelsius: 32,
    tags: ["Tour Tertiaire", "Plateau", "Marché Privé"],
    createdAt: "2025-06-01T08:00:00.000Z",
    updatedAt: "2026-09-10T14:30:00.000Z",
  },
  {
    id: "proj_002_jardins_eden",
    code: "CH-2025-014",
    name: "Résidence Les Jardins d'Éden (4 Blocs)",
    description: "Complexe immobilier résidentiel standing de 64 appartements avec piscine et espaces verts.",
    type: "BATIMENT_RESIDENTIEL",
    status: "EN_COURS",
    riskLevel: "FAIBLE",
    clientId: "client_002_sipi",
    clientName: "SIPI Promotion Immobilière",
    clientType: "PROMOTEUR_PRIVE",
    clientContactPerson: "Mme Estelle Bamba",
    clientPhone: "+225 05 67 89 01 23",
    location: {
      address: "Riviera Golf 4, Cocody",
      city: "Abidjan",
      district: "Cocody",
      country: "Côte d'Ivoire",
    },
    startDate: "2025-10-01",
    estimatedEndDate: "2026-12-15",
    surfaceAreaM2: 8600,
    numberOfFloors: "R+3 (4 Blocs)",
    buildingPermitNumber: "PC-COCODY-2025-0412",
    totalBudgetEstimated: 1950000000,
    totalBudgetContracted: 2200000000,
    totalExpensesRealized: 1450000000,
    totalBilledAmount: 1760000000,
    totalPaidAmount: 1650000000,
    retentionGuaranteeRate: 5,
    progressPercentage: 78,
    financialProgressPercentage: 80,
    managementTeam: {
      projectManagerName: "Ing. Koffi Kan Marc",
      siteManagerName: "M. N'Goran Patrick",
      foremanName: "M. Diallo Ibrahima",
      safetyOfficerName: "Mme Yao Affoué Sylvie",
    },
    phases: [
      {
        id: "ph_21",
        name: "Gros Œuvre & Maçonnerie Blocs A, B, C, D",
        order: 1,
        startDate: "2025-10-01",
        endDate: "2026-04-30",
        progressPercentage: 100,
        status: "TERMINEE",
        budgetAllocated: 1200000000,
        budgetSpent: 1180000000,
      },
      {
        id: "ph_22",
        name: "Étanchéité, Plomberie & Électricité",
        order: 2,
        startDate: "2026-04-01",
        endDate: "2026-08-30",
        progressPercentage: 90,
        status: "EN_COURS",
        budgetAllocated: 550000000,
        budgetSpent: 270000000,
      },
    ],
    milestones: [
      {
        id: "ms_21",
        title: "Achèvement Gros Œuvre",
        targetDate: "2026-04-30",
        completedDate: "2026-04-25",
        status: "VALIDE",
        isCritical: true,
      },
    ],
    metrics: {
      workersOnSiteToday: 42,
      totalHoursWorked: 26800,
      openReservationsCount: 1,
      safetyIncidentsCount: 0,
      siteDiaryEntriesCount: 74,
      photosCount: 180,
      activeAlertsCount: 0,
    },
    weatherCondition: "ENSOLEILLE",
    temperatureCelsius: 30,
    tags: ["Résidentiel", "Cocody", "Standing"],
    createdAt: "2025-09-15T08:00:00.000Z",
    updatedAt: "2026-09-11T10:15:00.000Z",
  },
  {
    id: "proj_003_echangeur_nord",
    code: "CH-2025-008",
    name: "Aménagement Échangeur Nord & VRD",
    description: "Échangeur autoroutier à 3 niveaux, voiries d'accès, caniveaux d'assainissement et éclairage LED.",
    type: "TRAVAUX_PUBLICS_VRD",
    status: "EN_COURS",
    riskLevel: "ELEVE",
    clientId: "client_003_ageroute",
    clientName: "AGEROUTE / Ministère de l'Équipement",
    clientType: "PUBLIC_ETAT",
    clientContactPerson: "Ing. Dossou Roger",
    clientPhone: "+225 01 23 45 67 89",
    location: {
      address: "Carrefour Nord, Voie Express",
      city: "Abidjan",
      district: "Yopougon / Songon",
      country: "Côte d'Ivoire",
    },
    startDate: "2025-04-01",
    estimatedEndDate: "2026-08-31", // Date dépassée -> RETARD !
    surfaceAreaM2: 52000,
    buildingPermitNumber: "DEC-MIN-EQUIP-2025-004",
    totalBudgetEstimated: 8500000000,
    totalBudgetContracted: 8900000000,
    totalExpensesRealized: 6700000000,
    totalBilledAmount: 6400000000,
    totalPaidAmount: 5900000000,
    retentionGuaranteeRate: 10,
    progressPercentage: 68,
    financialProgressPercentage: 72,
    managementTeam: {
      projectManagerName: "Ing. Dossou Roger",
      siteManagerName: "M. Kouassi Firmin",
      foremanName: "M. Ouedraogo Moussa",
      safetyOfficerName: "M. Koné Adama",
    },
    phases: [
      {
        id: "ph_31",
        name: "Terrassements généraux & Dévoiement réseaux",
        order: 1,
        startDate: "2025-04-01",
        endDate: "2025-09-30",
        progressPercentage: 100,
        status: "TERMINEE",
        budgetAllocated: 2200000000,
        budgetSpent: 2350000000,
      },
      {
        id: "ph_32",
        name: "Tablier Béton Précontraint & Piles",
        order: 2,
        startDate: "2025-10-01",
        endDate: "2026-06-30",
        progressPercentage: 75,
        status: "RETARDEE",
        budgetAllocated: 4100000000,
        budgetSpent: 3600000000,
        description: "Retard de 42 jours suite au dévoiement tardif de la conduite d'eau SODECI 600mm.",
      },
    ],
    milestones: [
      {
        id: "ms_31",
        title: "Coulage Pile Centrale P3",
        targetDate: "2026-03-31",
        status: "EN_RETARD",
        isCritical: true,
      },
      {
        id: "ms_32",
        title: "Ouverture des bretelles Sud",
        targetDate: "2026-08-31",
        status: "EN_RETARD",
        isCritical: true,
      },
    ],
    metrics: {
      workersOnSiteToday: 78,
      totalHoursWorked: 52000,
      openReservationsCount: 7,
      safetyIncidentsCount: 1,
      siteDiaryEntriesCount: 120,
      photosCount: 310,
      activeAlertsCount: 2,
    },
    weatherCondition: "NUAGEUX",
    temperatureCelsius: 29,
    tags: ["Marché Public", "Ouvrage d'Art", "Retard Critique"],
    createdAt: "2025-03-20T08:00:00.000Z",
    updatedAt: "2026-09-11T16:45:00.000Z",
  },
  {
    id: "proj_004_entrepot_logistique",
    code: "CH-2026-004",
    name: "Plateforme Logistique PK24 Vridi",
    description: "Construction de 2 hangars de stockage grande hauteur avec charpente métallique et quais de déchargement.",
    type: "INDUSTRIEL_ENTREPOT",
    status: "EN_COURS",
    riskLevel: "MOYEN",
    clientId: "client_004_bollore",
    clientName: "Africa Logistics Hub CI",
    clientType: "ENTREPRISE_PRIVEE",
    clientContactPerson: "M. Diomandé Amadou",
    clientPhone: "+225 07 44 55 66 77",
    location: {
      address: "Zone Industrielle PK24",
      city: "Abidjan",
      district: "PK24",
      country: "Côte d'Ivoire",
    },
    startDate: "2026-01-15",
    estimatedEndDate: "2026-09-15", // Échéance critique dans 3 jours !
    surfaceAreaM2: 12000,
    buildingPermitNumber: "PC-PK24-2025-0091",
    totalBudgetEstimated: 1600000000,
    totalBudgetContracted: 1750000000,
    totalExpensesRealized: 1380000000,
    totalBilledAmount: 1400000000,
    totalPaidAmount: 1350000000,
    retentionGuaranteeRate: 5,
    progressPercentage: 88,
    financialProgressPercentage: 80,
    managementTeam: {
      projectManagerName: "Ing. Koffi Kan Marc",
      siteManagerName: "M. Coulibaly Daouda",
      foremanName: "M. Sanogo Lassina",
      safetyOfficerName: "Mme Yao Affoué Sylvie",
    },
    phases: [
      {
        id: "ph_41",
        name: "Dallage Industriel & Charpente Métallique",
        order: 1,
        startDate: "2026-01-15",
        endDate: "2026-06-15",
        progressPercentage: 100,
        status: "TERMINEE",
        budgetAllocated: 1100000000,
        budgetSpent: 1060000000,
      },
      {
        id: "ph_42",
        name: "Bardage, Quais & Voirie Lourde",
        order: 2,
        startDate: "2026-06-16",
        endDate: "2026-09-15",
        progressPercentage: 75,
        status: "RETARDEE",
        budgetAllocated: 650000000,
        budgetSpent: 320000000,
        description: "Retard de 14 jours sur l'approvisionnement des portes sectionnelles automatiques.",
      },
    ],
    milestones: [
      {
        id: "ms_41",
        title: "Mise hors d'eau Charpente",
        targetDate: "2026-06-15",
        completedDate: "2026-06-10",
        status: "VALIDE",
        isCritical: true,
      },
      {
        id: "ms_42",
        title: "Livraison Quais de Déchargement",
        targetDate: "2026-09-01",
        status: "EN_RETARD",
        isCritical: true,
      },
    ],
    metrics: {
      workersOnSiteToday: 35,
      totalHoursWorked: 18400,
      openReservationsCount: 4,
      safetyIncidentsCount: 0,
      siteDiaryEntriesCount: 52,
      photosCount: 140,
      activeAlertsCount: 1,
    },
    weatherCondition: "ENSOLEILLE",
    temperatureCelsius: 31,
    tags: ["Industriel", "Charpente", "PK24"],
    createdAt: "2026-01-05T08:00:00.000Z",
    updatedAt: "2026-09-11T12:00:00.000Z",
  },
  {
    id: "proj_005_rehabilitation_palais",
    code: "CH-2026-006",
    name: "Rénovation & Surélévation Siège Tertiaire",
    description: "Rénovation complète d'un ensemble de bureaux R+5 avec renforcement structurel carbone et mise aux normes.",
    type: "RENOVATION_REHABILITATION",
    status: "ETUDE_PREPARATION",
    riskLevel: "FAIBLE",
    clientId: "client_005_banque",
    clientName: "Banque Atlantique CI",
    clientType: "BANQUE_ASSURANCE",
    clientContactPerson: "M. Touré Mamadou",
    clientPhone: "+225 05 11 22 33 44",
    location: {
      address: "Boulevard de la République",
      city: "Abidjan",
      district: "Plateau",
      country: "Côte d'Ivoire",
    },
    startDate: "2026-10-01",
    estimatedEndDate: "2027-06-30",
    surfaceAreaM2: 4200,
    buildingPermitNumber: "PC-ABJ-2026-0033",
    totalBudgetEstimated: 1100000000,
    totalBudgetContracted: 1250000000,
    totalExpensesRealized: 95000000,
    totalBilledAmount: 120000000,
    totalPaidAmount: 120000000,
    retentionGuaranteeRate: 5,
    progressPercentage: 8,
    financialProgressPercentage: 10,
    managementTeam: {
      projectManagerName: "Ing. Koffi Kan Marc",
      siteManagerName: "M. Traoré Souleymane",
      foremanName: "M. Diallo Ibrahima",
    },
    phases: [
      {
        id: "ph_51",
        name: "Diagnostic structurel & Curage intérieur",
        order: 1,
        startDate: "2026-10-01",
        endDate: "2026-11-30",
        progressPercentage: 20,
        status: "EN_COURS",
        budgetAllocated: 250000000,
        budgetSpent: 95000000,
      },
    ],
    milestones: [
      {
        id: "ms_51",
        title: "Installation de Chantier & Sécurisation",
        targetDate: "2026-10-15",
        status: "EN_ATTENTE",
        isCritical: true,
      },
    ],
    metrics: {
      workersOnSiteToday: 12,
      totalHoursWorked: 1200,
      openReservationsCount: 0,
      safetyIncidentsCount: 0,
      siteDiaryEntriesCount: 14,
      photosCount: 45,
      activeAlertsCount: 0,
    },
    weatherCondition: "ENSOLEILLE",
    temperatureCelsius: 32,
    tags: ["Rénovation", "Tertiaire", "Plateau"],
    createdAt: "2026-08-15T08:00:00.000Z",
    updatedAt: "2026-09-08T09:00:00.000Z",
  },
  {
    id: "proj_006_centre_medical",
    code: "CH-2024-032",
    name: "Clinique Médico-Chirurgicale Sainte Marie",
    description: "Bâtiment hospitalier R+4 avec 3 blocs opératoires et unité de radiologie.",
    type: "BATIMENT_TERTIAIRE",
    status: "RECEPTIONNE",
    riskLevel: "FAIBLE",
    clientId: "client_006_sante",
    clientName: "Groupe Médical Sainte Marie",
    clientType: "ENTREPRISE_PRIVEE",
    clientContactPerson: "Dr. Lawson Patrick",
    location: {
      address: "Boulevard Mitterrand",
      city: "Abidjan",
      district: "Cocody",
      country: "Côte d'Ivoire",
    },
    startDate: "2024-09-01",
    estimatedEndDate: "2026-05-31",
    actualEndDate: "2026-06-10",
    receptionDate: "2026-06-15",
    surfaceAreaM2: 6800,
    totalBudgetEstimated: 2900000000,
    totalBudgetContracted: 3150000000,
    totalExpensesRealized: 2980000000,
    totalBilledAmount: 3150000000,
    totalPaidAmount: 3150000000,
    retentionGuaranteeRate: 5,
    progressPercentage: 100,
    financialProgressPercentage: 100,
    managementTeam: {
      projectManagerName: "Ing. Koffi Kan Marc",
      siteManagerName: "M. N'Goran Patrick",
      foremanName: "M. Bamba Bakary",
    },
    phases: [],
    milestones: [],
    metrics: {
      workersOnSiteToday: 0,
      totalHoursWorked: 64200,
      openReservationsCount: 0,
      safetyIncidentsCount: 0,
      siteDiaryEntriesCount: 160,
      photosCount: 420,
      activeAlertsCount: 0,
    },
    tags: ["Santé", "Réceptionné", "Livré"],
    createdAt: "2024-08-10T08:00:00.000Z",
    updatedAt: "2026-06-20T11:00:00.000Z",
  },
];

// Formatage FCFA / Monétaire
export const formatCurrencyFCFA = (amount: number): string => {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(2)} Md FCFA`;
  }
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} M FCFA`;
  }
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
};

// Variantes d'animation framer-motion pour l'entrée fluide des cartes KPI
const kpiContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const kpiCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 24,
      stiffness: 260,
      mass: 0.8,
    },
  },
};

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigateToProjects,
  onNavigateToPlanning,
  onNavigateToFinance,
  onOpenChantierDetail,
}) => {
  const [projects, setProjects] = useState<ProjectEntity[]>(FALLBACK_PROJECTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "ACTIFS" | "RETARD" | "PREPARATION" | "LIVRES">("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<ProjectEntity | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [fullscreenWidget, setFullscreenWidget] = useState<
    "KPI_ACTIFS" | "KPI_RETARD" | "KPI_BUDGET" | "CHANTIERS_LIST" | "DASHBOARD_ALL" | null
  >(null);

  // Gestion du plein écran pour tablette (avec fallback élégant pour iframe)
  const handleEnterFullscreen = (
    widget: "KPI_ACTIFS" | "KPI_RETARD" | "KPI_BUDGET" | "CHANTIERS_LIST" | "DASHBOARD_ALL"
  ) => {
    setFullscreenWidget(widget);
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {
          // Iframe restrictions safely handled by in-app overlay
        });
      }
    } catch {
      // Safe fallback
    }
  };

  const handleExitFullscreen = () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {
      // Safe fallback
    }
    setFullscreenWidget(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullscreenWidget) {
        handleExitFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenWidget]);

  // Chargement des données réelles depuis le Repository avec fallback sécurisé
  const loadProjectsData = async () => {
    setIsLoading(true);
    try {
      const repo = new ProjectRepositoryImpl();
      const loaded = await repo.getAllProjects();
      if (loaded && loaded.length > 0) {
        setProjects(loaded);
      } else {
        setProjects(FALLBACK_PROJECTS);
      }
    } catch {
      // Fallback si IndexedDB est en cours d'init ou environnement test
      setProjects(FALLBACK_PROJECTS);
    } finally {
      setIsLoading(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    loadProjectsData();
  }, []);

  // Détection des retards par chantier
  const isProjectDelayed = (p: ProjectEntity): boolean => {
    // 1. Jalons ou phases avec statut explicitement en retard
    const hasDelayedMilestone = p.milestones?.some((m) => m.status === "EN_RETARD");
    const hasDelayedPhase = p.phases?.some((ph) => ph.status === "RETARDEE");
    if (hasDelayedMilestone || hasDelayedPhase) return true;

    // 2. Date estimée de fin dépassée alors que le chantier n'est pas terminé
    if (p.status === "EN_COURS" && p.estimatedEndDate) {
      const today = new Date().toISOString().split("T")[0];
      if (p.estimatedEndDate < today && p.progressPercentage < 100) {
        return true;
      }
    }

    // 3. Risque élevé avec avancement < 70% et alertes
    if (p.riskLevel === "ELEVE" && (p.metrics?.activeAlertsCount || 0) > 0) {
      return true;
    }

    return false;
  };

  // Calcul du retard en jours approximatif pour un chantier
  const getProjectDelayDays = (p: ProjectEntity): number => {
    if (!isProjectDelayed(p)) return 0;
    // Si la date de fin estimée est dépassée
    const today = new Date();
    const end = new Date(p.estimatedEndDate);
    if (end < today && p.status === "EN_COURS") {
      const diffTime = Math.abs(today.getTime() - end.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    // Délai lié aux phases retardées
    return p.phases?.some((ph) => ph.status === "RETARDEE") ? 28 : 14;
  };

  // Calcul des Indicateurs Clés Demandés
  const stats = useMemo(() => {
    // 1. Projets Actifs
    const activeProjectsList = projects.filter((p) => p.status === "EN_COURS");
    const activeProjectsCount = activeProjectsList.length;

    // 2. Retard
    const delayedProjectsList = projects.filter((p) => isProjectDelayed(p));
    const delayedProjectsCount = delayedProjectsList.length;
    const maxDelayDays = delayedProjectsList.reduce((max, p) => Math.max(max, getProjectDelayDays(p)), 0);

    // 3. Budget Total
    const totalContractedBudget = projects.reduce((sum, p) => sum + (p.totalBudgetContracted || 0), 0);
    const totalExpensesRealized = projects.reduce((sum, p) => sum + (p.totalExpensesRealized || 0), 0);
    const totalBilled = projects.reduce((sum, p) => sum + (p.totalBilledAmount || 0), 0);
    const budgetConsumptionRate =
      totalContractedBudget > 0 ? Math.round((totalExpensesRealized / totalContractedBudget) * 100) : 0;

    // Métriques complémentaires de chantier
    const totalWorkers = projects.reduce((sum, p) => sum + (p.metrics?.workersOnSiteToday || 0), 0);
    const averageProgress =
      projects.length > 0
        ? Math.round(projects.reduce((sum, p) => sum + (p.progressPercentage || 0), 0) / projects.length)
        : 0;

    const preparationProjectsCount = projects.filter((p) => p.status === "ETUDE_PREPARATION").length;
    const completedProjectsCount = projects.filter(
      (p) => p.status === "RECEPTIONNE" || p.status === "CLOTURE"
    ).length;
    const highRiskProjectsCount = projects.filter(
      (p) => p.riskLevel === "ELEVE"
    ).length;

    return {
      totalProjects: projects.length,
      activeProjectsCount,
      activePercentage: projects.length > 0 ? Math.round((activeProjectsCount / projects.length) * 100) : 0,
      delayedProjectsCount,
      delayedPercentage: projects.length > 0 ? Math.round((delayedProjectsCount / projects.length) * 100) : 0,
      maxDelayDays,
      delayedProjectsList,
      totalContractedBudget,
      totalExpensesRealized,
      totalBilled,
      budgetConsumptionRate,
      totalWorkers,
      averageProgress,
      preparationProjectsCount,
      completedProjectsCount,
      highRiskProjectsCount,
    };
  }, [projects]);

  // Filtrage des chantiers
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Recherche textuelle
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.managementTeam.siteManagerName.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtre rapide de statut
      let matchesStatus = true;
      if (selectedFilter === "ACTIFS") {
        matchesStatus = p.status === "EN_COURS";
      } else if (selectedFilter === "RETARD") {
        matchesStatus = isProjectDelayed(p);
      } else if (selectedFilter === "PREPARATION") {
        matchesStatus = p.status === "ETUDE_PREPARATION";
      } else if (selectedFilter === "LIVRES") {
        matchesStatus = p.status === "RECEPTIONNE" || p.status === "CLOTURE";
      }

      // Filtre type d'ouvrage
      const matchesType = selectedType === "ALL" || p.type === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [projects, searchQuery, selectedFilter, selectedType]);

  // Export CSV de la vue d'ensemble
  const handleExportCsv = () => {
    const headers = [
      "Code Chantier",
      "Nom du Projet",
      "Statut",
      "Retard Détecté",
      "Délai Retard (jours)",
      "Avancement (%)",
      "Budget Total (FCFA)",
      "Dépenses Réalisées (FCFA)",
      "Client",
      "Ville",
      "Conducteur de Travaux",
      "Effectif Chantier",
    ];

    const rows = filteredProjects.map((p) => [
      `"${p.code}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.status}"`,
      isProjectDelayed(p) ? '"OUI"' : '"NON"',
      getProjectDelayDays(p),
      p.progressPercentage,
      p.totalBudgetContracted,
      p.totalExpensesRealized,
      `"${p.clientName.replace(/"/g, '""')}"`,
      `"${p.location.city}"`,
      `"${p.managementTeam.siteManagerName}"`,
      p.metrics?.workersOnSiteToday || 0,
    ]);

    const csvContent = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `agb_vue_ensemble_chantiers_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateProjectSuccess = async (newProject: any) => {
    setIsFormModalOpen(false);
    await loadProjectsData();
  };

  return (
    <div id="agb-dashboard-root" className="space-y-6">
      {/* 1. EN-TÊTE DU TABLEAU DE BORD BTP */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
              <HardHat className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-orange-500/15 text-orange-600 dark:text-orange-400 px-2.5 py-0.5 rounded-md border border-orange-500/25">
                  Direction des Travaux
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  Mise à jour : {lastRefreshed.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Tableau de Bord des Chantiers
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                Vue d'ensemble et pilotage stratégique : suivi des chantiers actifs, maîtrise des délais & retards, et consommation du budget total.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-fullscreen-dashboard"
              onClick={() => handleEnterFullscreen("DASHBOARD_ALL")}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-orange-700 dark:text-orange-300 transition-colors border border-orange-200 dark:border-orange-800/60 cursor-pointer"
              title="Plein écran Tableau de Bord (Mode tablette)"
            >
              <Maximize2 className="w-3.5 h-3.5 text-orange-600" />
              <span>Plein écran</span>
            </button>

            <button
              onClick={loadProjectsData}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Rafraîchir les données des chantiers"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-orange-600" : ""}`} />
              Actualiser
            </button>

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Exporter les indicateurs en CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Exporter Synthèse
            </button>

            <button
              onClick={() => setIsFormModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Nouveau Chantier
            </button>
          </div>
        </div>
      </div>

      {/* 2. LES 3 INDICATEURS CLÉS FONDAMENTAUX (PROJETS ACTIFS, RETARD, BUDGET TOTAL) */}
      <motion.div
        variants={kpiContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {/* INDICATEUR 1 : PROJETS ACTIFS */}
        <motion.div
          id="kpi-projets-actifs"
          variants={kpiCardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:border-blue-300 dark:hover:border-blue-700/60 transition-all group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                  Chantiers en Cours
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                Projets Actifs
              </h3>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tabular-nums">
                  {stats.activeProjectsCount}
                </span>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  / {stats.totalProjects} chantiers au total
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                id="btn-fullscreen-actifs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnterFullscreen("KPI_ACTIFS");
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors cursor-pointer"
                title="Plein écran Projets Actifs (Mode tablette)"
                aria-label="Plein écran Projets Actifs"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              {stats.totalWorkers} ouvriers mobilisés
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
              {stats.activePercentage}% du portefeuille
            </span>
          </div>
        </motion.div>

        {/* INDICATEUR 2 : RETARD */}
        <motion.div
          id="kpi-retard"
          variants={kpiCardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:border-amber-300 dark:hover:border-amber-700/60 transition-all group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  stats.delayedProjectsCount > 0
                    ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60"
                    : "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60"
                }`}>
                  {stats.delayedProjectsCount > 0 ? "Alerte Délais BTP" : "Planning Maîtrisé"}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                Chantiers en Retard
              </h3>
              <div className="flex items-baseline gap-2 mt-2">
                <span className={`text-3xl sm:text-4xl font-black tabular-nums ${
                  stats.delayedProjectsCount > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                }`}>
                  {stats.delayedProjectsCount}
                </span>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {stats.delayedProjectsCount > 1 ? "chantiers impactés" : "chantier impacté"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                id="btn-fullscreen-retard"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnterFullscreen("KPI_RETARD");
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors cursor-pointer"
                title="Plein écran Retards (Mode tablette)"
                aria-label="Plein écran Retards"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
                stats.delayedProjectsCount > 0
                  ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400"
                  : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Retard max : {stats.maxDelayDays} jours
            </span>
            <button
              onClick={() => setSelectedFilter("RETARD")}
              className="font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Voir les alertes
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* INDICATEUR 3 : BUDGET TOTAL */}
        <motion.div
          id="kpi-budget-total"
          variants={kpiCardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  Marchés BTP Signés
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                Budget Total Contracté
              </h3>
              <div className="mt-2">
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                  {formatCurrencyFCFA(stats.totalContractedBudget)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                id="btn-fullscreen-budget"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnterFullscreen("KPI_BUDGET");
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer"
                title="Plein écran Budget Total (Mode tablette)"
                aria-label="Plein écran Budget Total"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Coins className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              Dépenses : {formatCurrencyFCFA(stats.totalExpensesRealized)}
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {stats.budgetConsumptionRate}% engagé
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* 3. BANNIÈRE D'ALERTE DES CHANTIERS EN RETARD SI DÉTECTÉS */}
      {stats.delayedProjectsCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35, ease: "easeOut" }}
          className="bg-amber-500/10 border border-amber-500/30 dark:border-amber-500/20 rounded-2xl p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Attention requise : {stats.delayedProjectsCount} chantier(s) en retard sur le planning cible
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Des pénalités de retard ou des blocages d'approvisionnement nécessitent un arbitrage de la Direction des Travaux.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {stats.delayedProjectsList.map((dp) => (
                    <button
                      key={dp.id}
                      onClick={() => setSelectedProjectForDetail(dp)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700/50 text-slate-800 dark:text-slate-200 hover:bg-amber-100/50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      {dp.code} : {dp.name} (+{getProjectDelayDays(dp)}j)
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedFilter("RETARD")}
              className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline shrink-0 flex items-center gap-1 cursor-pointer self-start sm:self-center"
            >
              Isoler les chantiers en retard
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* 4. SECTION PRINCIPALE : VUE D'ENSEMBLE DES CHANTIERS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        {/* Titre & Filtres de la vue d'ensemble */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-orange-600" />
              Vue d'Ensemble des Chantiers
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {filteredProjects.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Suivi détaillé de l'avancement physique, des coûts et des responsabilités opérationnelles
            </p>
          </div>

          {/* Onglets rapides de filtrage & Plein écran */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
              <button
                onClick={() => setSelectedFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedFilter === "ALL"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Tous ({stats.totalProjects})
              </button>
              <button
                onClick={() => setSelectedFilter("ACTIFS")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedFilter === "ACTIFS"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600"
                }`}
              >
                En cours ({stats.activeProjectsCount})
              </button>
              <button
                onClick={() => setSelectedFilter("RETARD")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedFilter === "RETARD"
                    ? "bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-red-600"
                }`}
              >
                En retard ({stats.delayedProjectsCount})
              </button>
              <button
                onClick={() => setSelectedFilter("PREPARATION")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedFilter === "PREPARATION"
                    ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-amber-600"
                }`}
              >
                Études ({stats.preparationProjectsCount})
              </button>
              <button
                onClick={() => setSelectedFilter("LIVRES")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedFilter === "LIVRES"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-emerald-600"
                }`}
              >
                Réceptionnés ({stats.completedProjectsCount})
              </button>
            </div>

            <button
              id="btn-fullscreen-chantiers"
              onClick={() => handleEnterFullscreen("CHANTIERS_LIST")}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Plein écran Chantiers (Mode tablette)"
            >
              <Maximize2 className="w-3.5 h-3.5 text-orange-600" />
              <span className="hidden sm:inline">Plein écran</span>
            </button>
          </div>
        </div>

        {/* Barre de Recherche et Type d'ouvrage */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, code chantier, client, ville, conducteur de travaux..."
              className="w-full pl-9.5 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white font-medium"
            >
              <option value="ALL">Tous types d'ouvrages</option>
              <option value="BATIMENT_RESIDENTIEL">Bâtiment Résidentiel</option>
              <option value="BATIMENT_TERTIAIRE">Bâtiment Tertiaire</option>
              <option value="TRAVAUX_PUBLICS_VRD">Travaux Publics & VRD</option>
              <option value="GENIE_CIVIL_OUVRAGES">Génie Civil & Ouvrages d'Art</option>
              <option value="INDUSTRIEL_ENTREPOT">Industriel & Entrepôts</option>
              <option value="RENOVATION_REHABILITATION">Rénovation & Réhabilitation</option>
            </select>
          </div>
        </div>

        {/* LISTE DES CHANTIERS SOUS FORME DE CARTES RICHES BTP */}
        {filteredProjects.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Aucun chantier ne correspond aux critères
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Essayez de modifier vos termes de recherche ou réinitialisez les filtres.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("ALL");
                setSelectedType("ALL");
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-orange-600 text-white hover:bg-orange-700 cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredProjects.map((project) => {
              const delayed = isProjectDelayed(project);
              const delayDays = getProjectDelayDays(project);
              const financialRatio =
                project.totalBudgetContracted > 0
                  ? Math.round((project.totalExpensesRealized / project.totalBudgetContracted) * 100)
                  : 0;

              return (
                <div
                  key={project.id}
                  className={`rounded-2xl border transition-all hover:shadow-md bg-white dark:bg-slate-900 p-5 flex flex-col justify-between relative ${
                    delayed
                      ? "border-red-300 dark:border-red-900/60 bg-red-50/10"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {/* Haut de carte : Code, Statut & Retard */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                          {project.code}
                        </span>

                        {/* Badge de statut métier */}
                        {project.status === "EN_COURS" && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                            En cours
                          </span>
                        )}
                        {project.status === "ETUDE_PREPARATION" && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800">
                            Études / Préparation
                          </span>
                        )}
                        {project.status === "RECEPTIONNE" && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                            Réceptionné
                          </span>
                        )}

                        {/* Alerte de retard mise en avant */}
                        {delayed && (
                          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-800 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Retard (+{delayDays}j)
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {project.location.city}
                      </span>
                    </div>

                    {/* Nom et Client */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Client : <span className="font-semibold text-slate-700 dark:text-slate-300">{project.clientName}</span>
                    </p>

                    {/* Avancement physique */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-orange-500" />
                          Avancement physique
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                          {project.progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            delayed
                              ? "bg-amber-500"
                              : project.progressPercentage >= 100
                              ? "bg-emerald-500"
                              : "bg-orange-500"
                          }`}
                          style={{ width: `${project.progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Synthèse financière BTP */}
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Budget Contracté</span>
                        <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                          {formatCurrencyFCFA(project.totalBudgetContracted)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Dépenses Engagées</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                          {formatCurrencyFCFA(project.totalExpensesRealized)} ({financialRatio}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bas de carte : Équipe & Bouton Détail */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div className="truncate">
                      <span className="text-slate-400 text-[11px] block">Conducteur :</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {project.managementTeam.siteManagerName || "Non assigné"}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (onOpenChantierDetail) {
                          onOpenChantierDetail(project.id);
                        } else {
                          setSelectedProjectForDetail(project);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 font-semibold transition-colors cursor-pointer shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Consulter
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. MODAL DE DÉTAIL RAPIDE D'UN CHANTIER */}
      {selectedProjectForDetail && (
        <ProjectDetailModal
          project={selectedProjectForDetail}
          isOpen={!!selectedProjectForDetail}
          onClose={() => setSelectedProjectForDetail(null)}
          onEdit={() => {}}
        />
      )}

      {/* 6. MODAL DE CRÉATION DE NOUVEAU CHANTIER */}
      <ProjectFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleCreateProjectSuccess}
      />

      {/* 7. VUE PLEIN ÉCRAN TABLETTE POUR LES WIDGETS DU DASHBOARD */}
      {fullscreenWidget && (
        <div
          id="dashboard-fullscreen-modal"
          className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col overflow-hidden animate-in fade-in duration-200"
        >
          {/* Barre supérieure spéciale Tablette Chef de Chantier */}
          <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black shadow-md shadow-orange-600/20 shrink-0">
                <Tablet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-orange-500/15 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded">
                    Mode Plein Écran Tablette
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 hidden md:inline">
                    • Optimisé pour l'usage terrain & réunion de chantier (Échap pour quitter)
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {fullscreenWidget === "KPI_ACTIFS" && "Indicateur Clé : Projets Actifs & Mobilisation Terrain"}
                  {fullscreenWidget === "KPI_RETARD" && "Indicateur Clé : Chantiers en Retard & Alertes Délais"}
                  {fullscreenWidget === "KPI_BUDGET" && "Indicateur Clé : Budget Total & Consommation Financière"}
                  {fullscreenWidget === "CHANTIERS_LIST" && "Vue d'Ensemble Plein Écran des Chantiers"}
                  {fullscreenWidget === "DASHBOARD_ALL" && "Tableau de Bord Intégral BTP"}
                </h2>
              </div>
            </div>

            {/* Sélecteur de widget direct en plein écran */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setFullscreenWidget("DASHBOARD_ALL")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  fullscreenWidget === "DASHBOARD_ALL"
                    ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Vue Globale
              </button>
              <button
                onClick={() => setFullscreenWidget("KPI_ACTIFS")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  fullscreenWidget === "KPI_ACTIFS"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Actifs ({stats.activeProjectsCount})
              </button>
              <button
                onClick={() => setFullscreenWidget("KPI_RETARD")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  fullscreenWidget === "KPI_RETARD"
                    ? "bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Retards ({stats.delayedProjectsCount})
              </button>
              <button
                onClick={() => setFullscreenWidget("KPI_BUDGET")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  fullscreenWidget === "KPI_BUDGET"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Budget
              </button>
              <button
                onClick={() => setFullscreenWidget("CHANTIERS_LIST")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  fullscreenWidget === "CHANTIERS_LIST"
                    ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Chantiers ({filteredProjects.length})
              </button>
            </div>

            {/* Bouton Quitter Plein Écran */}
            <button
              id="btn-exit-fullscreen"
              onClick={handleExitFullscreen}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm transition-all cursor-pointer min-h-[44px]"
              title="Quitter le plein écran"
            >
              <Minimize2 className="w-4 h-4 text-orange-500" />
              <span>Quitter Plein écran</span>
            </button>
          </header>

          {/* Contenu plein écran avec défilement fluide et ergonomie tablette */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
            {/* VUE 1 : PLEIN ÉCRAN WIDGET PROJETS ACTIFS */}
            {fullscreenWidget === "KPI_ACTIFS" && (
              <div className="space-y-6">
                {/* 3 Cartes Géantes pour Tablette */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-blue-200 dark:border-blue-900/50 shadow-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Chantiers En Cours
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tabular-nums">
                        {stats.activeProjectsCount}
                      </span>
                      <span className="text-base text-slate-500">/ {stats.totalProjects} chantiers</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Représente {stats.activePercentage}% du volume total de marchés BTP supervisés.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-blue-200 dark:border-blue-900/50 shadow-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Effectif Terrain Mobilisé
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tabular-nums">
                        {stats.totalWorkers}
                      </span>
                      <span className="text-base text-slate-500">ouvriers & techniciens</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Pointage opérationnel consolidé sur l'ensemble des sites de construction.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-blue-200 dark:border-blue-900/50 shadow-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Avancement Moyen
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tabular-nums">
                        {Math.round(
                          projects.filter((p) => p.status === "EN_COURS").reduce((acc, p) => acc + p.progressPercentage, 0) /
                            (stats.activeProjectsCount || 1)
                        )}%
                      </span>
                      <span className="text-base text-emerald-500 font-bold">physique</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Progression globale des travaux en phase d'exécution.
                    </p>
                  </div>
                </div>

                {/* Grille des chantiers actifs avec grande lisibilité tactile */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      Détail des Chantiers Actifs ({stats.activeProjectsCount})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects
                      .filter((p) => p.status === "EN_COURS")
                      .map((p) => (
                        <div
                          key={p.id}
                          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                                {p.code}
                              </span>
                              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                                {p.name}
                              </h4>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3.5 h-3.5" />
                                {p.location.city} • Client : {p.clientName}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                handleExitFullscreen();
                                if (onOpenChantierDetail) {
                                  onOpenChantierDetail(p.id);
                                } else {
                                  setSelectedProjectForDetail(p);
                                }
                              }}
                              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer min-h-[40px] flex items-center gap-1.5"
                            >
                              <Eye className="w-4 h-4" />
                              Fiche
                            </button>
                          </div>

                          {/* Barre d'avancement tactile */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-slate-500 font-medium">Avancement des travaux</span>
                              <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                                {p.progressPercentage}%
                              </span>
                            </div>
                            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${p.progressPercentage}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-slate-700/80 text-xs">
                            <span className="text-slate-600 dark:text-slate-300">
                              Conducteur : <strong className="font-bold">{p.managementTeam.siteManagerName || "Non assigné"}</strong>
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                              {formatCurrencyFCFA(p.totalBudgetContracted)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* VUE 2 : PLEIN ÉCRAN WIDGET RETARDS */}
            {fullscreenWidget === "KPI_RETARD" && (
              <div className="space-y-6">
                {/* 3 Cartes d'alertes délais pour tablette */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-red-200 dark:border-red-900/50 shadow-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                      Chantiers En Retard
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-4xl sm:text-5xl font-black text-red-600 dark:text-red-400 tabular-nums">
                        {stats.delayedProjectsCount}
                      </span>
                      <span className="text-base text-slate-500">chantiers impactés</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Dépassement par rapport au planning d'exécution initial.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Retard Maximal Constaté
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-4xl sm:text-5xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
                        +{stats.maxDelayDays}
                      </span>
                      <span className="text-base text-slate-500">jours de dérive</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Chantier le plus critique nécessitant une réunion de coordination immédiate.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Risque Élevé
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tabular-nums">
                        {stats.highRiskProjectsCount}
                      </span>
                      <span className="text-base text-slate-500">chantiers surveillés</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Indice de risque opérationnel ou contractuel sous surveillance.
                    </p>
                  </div>
                </div>

                {/* Liste détaillée des chantiers en retard */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Analyse Détaillée des Retards et Dérives Planning
                  </h3>

                  {stats.delayedProjectsList.length === 0 ? (
                    <div className="p-8 text-center bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                      <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                        Aucun retard constaté
                      </h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                        Tous les chantiers respectent scrupuleusement les jalons prévisionnels.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stats.delayedProjectsList.map((dp) => {
                        const delayDays = getProjectDelayDays(dp);
                        return (
                          <div
                            key={dp.id}
                            className="p-5 rounded-2xl border-2 border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-black text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/60 px-2 py-0.5 rounded">
                                  {dp.code}
                                </span>
                                <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-full border border-red-300 dark:border-red-800">
                                  +{delayDays} jours de retard
                                </span>
                              </div>
                              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                {dp.name}
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                Client : <strong>{dp.clientName}</strong> • Conducteur : <strong>{dp.managementTeam.siteManagerName || "Non assigné"}</strong>
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                handleExitFullscreen();
                                if (onOpenChantierDetail) {
                                  onOpenChantierDetail(dp.id);
                                } else {
                                  setSelectedProjectForDetail(dp);
                                }
                              }}
                              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Ouvrir la fiche de crise
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VUE 3 : PLEIN ÉCRAN WIDGET BUDGET */}
            {fullscreenWidget === "KPI_BUDGET" && (
              <div className="space-y-6">
                {/* 3 Cartes Géantes Budget pour Tablette */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Budget Total Contracté
                    </span>
                    <div className="mt-2">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                        {formatCurrencyFCFA(stats.totalContractedBudget)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Montant global cumulé des marchés signés avec les maîtres d'ouvrage.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Dépenses Réelles Engagées
                    </span>
                    <div className="mt-2">
                      <span className="text-3xl sm:text-4xl font-black text-slate-700 dark:text-slate-200 tabular-nums tracking-tight">
                        {formatCurrencyFCFA(stats.totalExpensesRealized)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Achats matériaux, prestations sous-traitants et salaires ouvriers.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Taux d'Engagement
                    </span>
                    <div className="mt-2">
                      <span className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {stats.budgetConsumptionRate}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Ratio de consommation par rapport au plafond contractuel total.
                    </p>
                  </div>
                </div>

                {/* Tableau récapitulatif financier par chantier */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Coins className="w-5 h-5 text-emerald-600" />
                    Consommation Financière par Chantier
                  </h3>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {projects.map((p) => {
                      const consumption = p.totalBudgetContracted > 0
                        ? Math.round((p.totalExpensesRealized / p.totalBudgetContracted) * 100)
                        : 0;
                      return (
                        <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                                {p.code}
                              </span>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {p.name}
                              </h4>
                            </div>
                            <p className="text-xs text-slate-500">
                              Budget : <strong>{formatCurrencyFCFA(p.totalBudgetContracted)}</strong> • Dépensé : <strong>{formatCurrencyFCFA(p.totalExpensesRealized)}</strong> ({consumption}%)
                            </p>
                          </div>

                          <div className="w-full sm:w-64 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">Conso. budget</span>
                              <span className="font-bold tabular-nums text-slate-900 dark:text-white">{consumption}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  consumption > 95
                                    ? "bg-red-500"
                                    : consumption > 75
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                                style={{ width: `${Math.min(consumption, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* VUE 4 : PLEIN ÉCRAN VUE D'ENSEMBLE DES CHANTIERS */}
            {fullscreenWidget === "CHANTIERS_LIST" && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-6 h-6 text-orange-600" />
                    Catalogue des Chantiers en Plein Écran ({filteredProjects.length})
                  </h3>

                  {/* Filtres tablettes */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
                    {(["ALL", "ACTIFS", "RETARD", "PREPARATION", "LIVRES"] as const).map((filterKey) => (
                      <button
                        key={filterKey}
                        onClick={() => setSelectedFilter(filterKey)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedFilter === filterKey
                            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                        }`}
                      >
                        {filterKey === "ALL" && `Tous (${stats.totalProjects})`}
                        {filterKey === "ACTIFS" && `En cours (${stats.activeProjectsCount})`}
                        {filterKey === "RETARD" && `En retard (${stats.delayedProjectsCount})`}
                        {filterKey === "PREPARATION" && `Études (${stats.preparationProjectsCount})`}
                        {filterKey === "LIVRES" && `Réceptionnés (${stats.completedProjectsCount})`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recherche plein écran */}
                <div className="relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par nom, code chantier, client, ville, conducteur..."
                    className="w-full pl-12 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Grille tactile des chantiers */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProjects.map((project) => {
                    const delayed = isProjectDelayed(project);
                    return (
                      <div
                        key={project.id}
                        className="bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 hover:border-orange-300 dark:hover:border-orange-700 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded">
                              {project.code}
                            </span>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                              {project.name}
                            </h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5" />
                              {project.location.city} • {project.clientName}
                            </p>
                          </div>
                          {delayed && (
                            <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
                              Retard
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-500">Avancement physique</span>
                            <span className="font-bold text-slate-900 dark:text-white">{project.progressPercentage}%</span>
                          </div>
                          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full"
                              style={{ width: `${project.progressPercentage}%` }}
                            />
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                            {formatCurrencyFCFA(project.totalBudgetContracted)}
                          </span>
                          <button
                            onClick={() => {
                              handleExitFullscreen();
                              if (onOpenChantierDetail) {
                                onOpenChantierDetail(project.id);
                              } else {
                                setSelectedProjectForDetail(project);
                              }
                            }}
                            className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer min-h-[40px] flex items-center gap-1.5"
                          >
                            <Eye className="w-4 h-4" />
                            Consulter
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VUE 5 : PLEIN ÉCRAN TABLEAU DE BORD INTÉGRAL */}
            {fullscreenWidget === "DASHBOARD_ALL" && (
              <div className="space-y-6">
                {/* Cartes KPI */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-blue-200 dark:border-blue-900 shadow-xs">
                    <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">Projets Actifs</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-4xl font-black text-slate-900 dark:text-white tabular-nums">{stats.activeProjectsCount}</span>
                      <span className="text-sm text-slate-500">/ {stats.totalProjects} chantiers</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{stats.totalWorkers} ouvriers déployés aujourd'hui</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-red-200 dark:border-red-900 shadow-xs">
                    <span className="text-xs font-bold uppercase text-red-600 dark:text-red-400">Chantiers en Retard</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-4xl font-black text-red-600 dark:text-red-400 tabular-nums">{stats.delayedProjectsCount}</span>
                      <span className="text-sm text-slate-500">retard max: {stats.maxDelayDays}j</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{stats.highRiskProjectsCount} chantiers à risque sous surveillance</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900 shadow-xs">
                    <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">Budget Total Contracté</span>
                    <div className="mt-2">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">{formatCurrencyFCFA(stats.totalContractedBudget)}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{stats.budgetConsumptionRate}% engagé ({formatCurrencyFCFA(stats.totalExpensesRealized)})</p>
                  </div>
                </div>

                {/* Liste des Chantiers */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-orange-600" />
                      Chantiers Supervisés ({filteredProjects.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[11px] font-mono font-bold text-orange-600 dark:text-orange-400">{p.code}</span>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{p.name}</h4>
                            <p className="text-[11px] text-slate-500">{p.location.city} • {p.clientName}</p>
                          </div>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {p.progressPercentage}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                          <span className="font-bold tabular-nums text-slate-900 dark:text-white">{formatCurrencyFCFA(p.totalBudgetContracted)}</span>
                          <button
                            onClick={() => {
                              handleExitFullscreen();
                              if (onOpenChantierDetail) {
                                onOpenChantierDetail(p.id);
                              } else {
                                setSelectedProjectForDetail(p);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs cursor-pointer"
                          >
                            Consulter
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
