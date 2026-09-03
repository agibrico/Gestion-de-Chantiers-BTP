/**
 * AGB CHANTIER - Implémentation du Repository Chantiers & Projets - AXE 04
 * Persistance IndexedDB Offline-First avec gestion du cycle de vie BTP
 */

import { IdbAdapter } from "../../../core/storage/idb_adapter";
import {
  ProjectEntity,
  ProjectPhase,
  ProjectMilestone,
  ProjectFilterQuery,
  ProjectStats,
} from "../domain/entities/project_entity";
import {
  IProjectRepository,
  CreateProjectDTO,
} from "../domain/repositories/project_repository";

export class ProjectRepositoryImpl implements IProjectRepository {
  private readonly storeName = IdbAdapter.STORES.PROJECTS;

  /**
   * Récupère tous les chantiers avec filtres et tris
   */
  public async getAllProjects(query?: ProjectFilterQuery): Promise<ProjectEntity[]> {
    await this.initializeSeedData();
    let projects = await IdbAdapter.getAll<ProjectEntity>(this.storeName);

    if (!query) {
      return projects.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    if (query.search && query.search.trim() !== "") {
      const search = query.search.toLowerCase().trim();
      projects = projects.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.code.toLowerCase().includes(search) ||
          p.clientName.toLowerCase().includes(search) ||
          p.location.city.toLowerCase().includes(search) ||
          (p.location.district && p.location.district.toLowerCase().includes(search)) ||
          p.managementTeam.siteManagerName.toLowerCase().includes(search)
      );
    }

    if (query.type && query.type !== "ALL") {
      projects = projects.filter((p) => p.type === query.type);
    }

    if (query.status && query.status !== "ALL") {
      projects = projects.filter((p) => p.status === query.status);
    }

    if (query.riskLevel && query.riskLevel !== "ALL") {
      projects = projects.filter((p) => p.riskLevel === query.riskLevel);
    }

    if (query.clientId) {
      projects = projects.filter((p) => p.clientId === query.clientId);
    }

    if (query.city) {
      projects = projects.filter((p) => p.location.city.toLowerCase() === query.city?.toLowerCase());
    }

    if (query.siteManagerName) {
      projects = projects.filter((p) =>
        p.managementTeam.siteManagerName.toLowerCase().includes(query.siteManagerName!.toLowerCase())
      );
    }

    // Tri
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";

    projects.sort((a, b) => {
      let valA: any = a[sortBy as keyof ProjectEntity] || "";
      let valB: any = b[sortBy as keyof ProjectEntity] || "";

      if (typeof valA === "string") {
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });

    return projects;
  }

  public async getProjectById(id: string): Promise<ProjectEntity | null> {
    await this.initializeSeedData();
    return IdbAdapter.getById<ProjectEntity>(this.storeName, id);
  }

  public async createProject(dto: CreateProjectDTO): Promise<ProjectEntity> {
    const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const currentYear = new Date().getFullYear();
    const existingCount = await IdbAdapter.count(this.storeName);
    const code = dto.code || `CH-${currentYear}-${(existingCount + 1).toString().padStart(3, "0")}`;

    const defaultPhases: ProjectPhase[] = [
      {
        id: `phase_${Date.now()}_1`,
        name: "Installation de Chantier & Terrassement",
        order: 1,
        startDate: dto.startDate,
        endDate: dto.startDate,
        progressPercentage: 100,
        status: "TERMINEE",
        budgetAllocated: Math.round(dto.totalBudgetContracted * 0.1),
        budgetSpent: Math.round(dto.totalBudgetContracted * 0.09),
      },
      {
        id: `phase_${Date.now()}_2`,
        name: "Fondations & Gros Œuvre / Béton Armé",
        order: 2,
        startDate: dto.startDate,
        endDate: dto.estimatedEndDate,
        progressPercentage: 40,
        status: "EN_COURS",
        budgetAllocated: Math.round(dto.totalBudgetContracted * 0.45),
        budgetSpent: Math.round(dto.totalBudgetContracted * 0.2),
      },
      {
        id: `phase_${Date.now()}_3`,
        name: "Corps d'État Secondaires (CES / Fluides)",
        order: 3,
        startDate: dto.startDate,
        endDate: dto.estimatedEndDate,
        progressPercentage: 0,
        status: "NON_DEBUTEE",
        budgetAllocated: Math.round(dto.totalBudgetContracted * 0.3),
        budgetSpent: 0,
      },
      {
        id: `phase_${Date.now()}_4`,
        name: "Finitions, Essais & Réception",
        order: 4,
        startDate: dto.estimatedEndDate,
        endDate: dto.estimatedEndDate,
        progressPercentage: 0,
        status: "NON_DEBUTEE",
        budgetAllocated: Math.round(dto.totalBudgetContracted * 0.15),
        budgetSpent: 0,
      },
    ];

    const defaultMilestones: ProjectMilestone[] = [
      {
        id: `m_${Date.now()}_1`,
        title: "Coulage Radier / Fondations",
        targetDate: dto.startDate,
        status: "VALIDE",
        isCritical: true,
      },
      {
        id: `m_${Date.now()}_2`,
        title: "Achèvement Structure Gros Œuvre",
        targetDate: dto.estimatedEndDate,
        status: "EN_ATTENTE",
        isCritical: true,
      },
      {
        id: `m_${Date.now()}_3`,
        title: "Visite de Réception Provisoire (OPR)",
        targetDate: dto.estimatedEndDate,
        status: "EN_ATTENTE",
        isCritical: true,
      },
    ];

    const newProject: ProjectEntity = {
      id,
      code,
      name: dto.name,
      description: dto.description,
      type: dto.type,
      status: dto.status || "EN_COURS",
      riskLevel: dto.riskLevel || "FAIBLE",
      clientId: dto.clientId,
      clientName: dto.clientName,
      clientType: dto.clientType,
      clientContactPerson: dto.clientContactPerson,
      clientPhone: dto.clientPhone,
      location: dto.location,
      startDate: dto.startDate,
      estimatedEndDate: dto.estimatedEndDate,
      surfaceAreaM2: dto.surfaceAreaM2 || 0,
      numberOfFloors: dto.numberOfFloors || "RDC",
      buildingPermitNumber: dto.buildingPermitNumber || "",
      totalBudgetEstimated: dto.totalBudgetEstimated,
      totalBudgetContracted: dto.totalBudgetContracted,
      totalExpensesRealized: Math.round(dto.totalBudgetContracted * 0.18),
      totalBilledAmount: Math.round(dto.totalBudgetContracted * 0.25),
      totalPaidAmount: Math.round(dto.totalBudgetContracted * 0.2),
      retentionGuaranteeRate: dto.retentionGuaranteeRate || 5,
      progressPercentage: 15,
      financialProgressPercentage: 25,
      managementTeam: dto.managementTeam,
      phases: defaultPhases,
      milestones: defaultMilestones,
      metrics: {
        workersOnSiteToday: 18,
        totalHoursWorked: 1420,
        openReservationsCount: 0,
        safetyIncidentsCount: 0,
        siteDiaryEntriesCount: 6,
        photosCount: 12,
        activeAlertsCount: 0,
      },
      weatherCondition: "ENSOLEILLE",
      temperatureCelsius: 31,
      tags: dto.tags || ["Priorité BTP", "Chantier Actif"],
      notes: dto.notes || "",
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };

    return IdbAdapter.put(this.storeName, newProject);
  }

  public async updateProject(project: ProjectEntity): Promise<ProjectEntity> {
    project.updatedAt = new Date().toISOString();
    project.syncStatus = "pending";
    return IdbAdapter.put(this.storeName, project);
  }

  public async deleteProject(id: string): Promise<boolean> {
    return IdbAdapter.delete(this.storeName, id);
  }

  public async updateProgress(id: string, progress: number): Promise<ProjectEntity> {
    const project = await this.getProjectById(id);
    if (!project) throw new Error("Chantier non trouvé");
    project.progressPercentage = Math.min(100, Math.max(0, progress));
    if (project.progressPercentage === 100 && project.status === "EN_COURS") {
      project.status = "RECEPTIONNE";
      project.actualEndDate = new Date().toISOString().split("T")[0];
    }
    return this.updateProject(project);
  }

  public async addPhase(projectId: string, phase: Omit<ProjectPhase, "id">): Promise<ProjectEntity> {
    const project = await this.getProjectById(projectId);
    if (!project) throw new Error("Chantier non trouvé");
    const newPhase: ProjectPhase = {
      ...phase,
      id: `phase_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    project.phases.push(newPhase);
    project.phases.sort((a, b) => a.order - b.order);
    return this.updateProject(project);
  }

  public async updatePhase(projectId: string, phase: ProjectPhase): Promise<ProjectEntity> {
    const project = await this.getProjectById(projectId);
    if (!project) throw new Error("Chantier non trouvé");
    project.phases = project.phases.map((p) => (p.id === phase.id ? phase : p));
    return this.updateProject(project);
  }

  public async deletePhase(projectId: string, phaseId: string): Promise<ProjectEntity> {
    const project = await this.getProjectById(projectId);
    if (!project) throw new Error("Chantier non trouvé");
    project.phases = project.phases.filter((p) => p.id !== phaseId);
    return this.updateProject(project);
  }

  public async addMilestone(projectId: string, milestone: Omit<ProjectMilestone, "id">): Promise<ProjectEntity> {
    const project = await this.getProjectById(projectId);
    if (!project) throw new Error("Chantier non trouvé");
    const newMilestone: ProjectMilestone = {
      ...milestone,
      id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    project.milestones.push(newMilestone);
    return this.updateProject(project);
  }

  public async updateMilestone(projectId: string, milestone: ProjectMilestone): Promise<ProjectEntity> {
    const project = await this.getProjectById(projectId);
    if (!project) throw new Error("Chantier non trouvé");
    project.milestones = project.milestones.map((m) => (m.id === milestone.id ? milestone : m));
    return this.updateProject(project);
  }

  public async deleteMilestone(projectId: string, milestoneId: string): Promise<ProjectEntity> {
    const project = await this.getProjectById(projectId);
    if (!project) throw new Error("Chantier non trouvé");
    project.milestones = project.milestones.filter((m) => m.id !== milestoneId);
    return this.updateProject(project);
  }

  public async getProjectStats(): Promise<ProjectStats> {
    const projects = await this.getAllProjects();
    const active = projects.filter((p) => p.status === "EN_COURS");
    const planning = projects.filter((p) => p.status === "ETUDE_PREPARATION");
    const completed = projects.filter((p) => p.status === "RECEPTIONNE" || p.status === "CLOTURE");

    const totalContractedValue = projects.reduce((sum, p) => sum + (p.totalBudgetContracted || 0), 0);
    const totalExpensesRealized = projects.reduce((sum, p) => sum + (p.totalExpensesRealized || 0), 0);
    const totalPaidValue = projects.reduce((sum, p) => sum + (p.totalPaidAmount || 0), 0);
    const totalWorkers = projects.reduce((sum, p) => sum + (p.metrics?.workersOnSiteToday || 0), 0);
    const activeAlerts = projects.reduce((sum, p) => sum + (p.metrics?.activeAlertsCount || 0), 0);

    const averageProgress =
      projects.length > 0
        ? Math.round(projects.reduce((sum, p) => sum + (p.progressPercentage || 0), 0) / projects.length)
        : 0;

    return {
      totalProjects: projects.length,
      activeProjects: active.length,
      planningProjects: planning.length,
      completedProjects: completed.length,
      totalContractedValue,
      totalExpensesRealized,
      totalPaidValue,
      averageProgress,
      totalWorkersOnSites: totalWorkers,
      activeAlerts,
    };
  }

  public exportToCsv(projects: ProjectEntity[]): string {
    const headers = [
      "Code Chantier",
      "Nom du Chantier",
      "Type d'Ouvrage",
      "Statut",
      "Niveau de Risque",
      "Maître d'Ouvrage (Client)",
      "Ville",
      "Commune / Quartier",
      "Date Début",
      "Date Fin Estimée",
      "Surface (m2)",
      "Niveaux",
      "Montant Marché (FCFA)",
      "Dépenses Réalisées (FCFA)",
      "Facturé (FCFA)",
      "Encaissé (FCFA)",
      "Avancement Physique (%)",
      "Conducteur de Travaux",
      "Chef de Chantier",
      "Effectif du Jour",
    ];

    const rows = projects.map((p) => [
      `"${p.code}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.type}"`,
      `"${p.status}"`,
      `"${p.riskLevel}"`,
      `"${p.clientName.replace(/"/g, '""')}"`,
      `"${p.location.city}"`,
      `"${p.location.district || ""}"`,
      `"${p.startDate}"`,
      `"${p.estimatedEndDate}"`,
      `"${p.surfaceAreaM2 || 0}"`,
      `"${p.numberOfFloors || ""}"`,
      `"${p.totalBudgetContracted}"`,
      `"${p.totalExpensesRealized}"`,
      `"${p.totalBilledAmount}"`,
      `"${p.totalPaidAmount}"`,
      `"${p.progressPercentage}%"`,
      `"${p.managementTeam.siteManagerName}"`,
      `"${p.managementTeam.foremanName}"`,
      `"${p.metrics.workersOnSiteToday}"`,
    ]);

    return [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
  }

  /**
   * Initialise un jeu de données BTP de référence réaliste pour la Côte d'Ivoire / Afrique de l'Ouest
   */
  public async initializeSeedData(): Promise<void> {
    const count = await IdbAdapter.count(this.storeName);
    if (count > 0) return;

    const seedProjects: ProjectEntity[] = [
      {
        id: "proj_001_plateau",
        code: "CH-2026-001",
        name: "Tour Horizon Prestige - R+14",
        description: "Construction d'un complexe de bureaux haut standing avec 2 sous-sols de parking, mur-rideau vitré et certification environnementale.",
        type: "BATIMENT_TERTIAIRE",
        status: "EN_COURS",
        riskLevel: "FAIBLE",
        clientId: "client_002_sipi",
        clientName: "SIPI Promotion Immobilière",
        clientType: "PROMOTEUR_PRIVE",
        clientContactPerson: "M. Bakary Coulibaly",
        clientPhone: "+225 07 45 12 34 56",
        location: {
          address: "Boulevard de la République, Face CCIA",
          city: "Abidjan",
          district: "Plateau",
          country: "Côte d'Ivoire",
          latitude: 5.3214,
          longitude: -4.0198,
          accessNotes: "Accès poids lourds autorisé uniquement entre 21h et 06h.",
        },
        startDate: "2026-01-15",
        estimatedEndDate: "2027-08-30",
        surfaceAreaM2: 12500,
        numberOfFloors: "2SS + RDC + 14 Étages",
        buildingPermitNumber: "PC-ABJ-2025-0894",
        totalBudgetEstimated: 4200000000,
        totalBudgetContracted: 4850000000,
        totalExpensesRealized: 1680000000,
        totalBilledAmount: 2182500000,
        totalPaidAmount: 1940000000,
        retentionGuaranteeRate: 5,
        progressPercentage: 45,
        financialProgressPercentage: 45,
        managementTeam: {
          projectManagerName: "Ing. Koffi Kan Marc",
          siteManagerName: "M. Kouamé Jean-Yves",
          foremanName: "M. Traoré Souleymane",
          safetyOfficerName: "Mme Yao Affoué Sylvie",
        },
        phases: [
          {
            id: "ph_01_terrassement",
            name: "Paroi moulée, Terrassement & 2 Sous-sols",
            order: 1,
            startDate: "2026-01-15",
            endDate: "2026-04-30",
            progressPercentage: 100,
            status: "TERMINEE",
            budgetAllocated: 950000000,
            budgetSpent: 920000000,
          },
          {
            id: "ph_02_structure",
            name: "Structure Béton Armé RDC à R+7",
            order: 2,
            startDate: "2026-05-01",
            endDate: "2026-10-31",
            progressPercentage: 70,
            status: "EN_COURS",
            budgetAllocated: 1600000000,
            budgetSpent: 760000000,
          },
          {
            id: "ph_03_structure_sup",
            name: "Structure R+8 à R+14 & Toiture Terrasse",
            order: 3,
            startDate: "2026-11-01",
            endDate: "2027-02-28",
            progressPercentage: 0,
            status: "NON_DEBUTEE",
            budgetAllocated: 1100000000,
            budgetSpent: 0,
          },
          {
            id: "ph_04_second_oeuvre",
            name: "Façades Mur-Rideau & Lots Techniques (CFO/CFA/HVAC)",
            order: 4,
            startDate: "2027-01-15",
            endDate: "2027-07-31",
            progressPercentage: 0,
            status: "NON_DEBUTEE",
            budgetAllocated: 1200000000,
            budgetSpent: 0,
          },
        ],
        milestones: [
          {
            id: "ms_01",
            title: "Achèvement du Radier Général",
            targetDate: "2026-03-15",
            completedDate: "2026-03-12",
            status: "VALIDE",
            isCritical: true,
          },
          {
            id: "ms_02",
            title: "Sortie de terre (Plancher RDC)",
            targetDate: "2026-05-10",
            completedDate: "2026-05-08",
            status: "VALIDE",
            isCritical: true,
          },
          {
            id: "ms_03",
            title: "Hors d'Eau / Hors d'Air (Toiture)",
            targetDate: "2027-03-01",
            status: "EN_ATTENTE",
            isCritical: true,
          },
        ],
        metrics: {
          workersOnSiteToday: 64,
          totalHoursWorked: 28400,
          openReservationsCount: 2,
          safetyIncidentsCount: 0,
          siteDiaryEntriesCount: 84,
          photosCount: 156,
          activeAlertsCount: 0,
        },
        weatherCondition: "ENSOLEILLE",
        temperatureCelsius: 32,
        tags: ["Grand Compte", "Plateau", "Structure R+14", "Grue à Tour"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        syncStatus: "synced",
      },
      {
        id: "proj_002_cocody_residence",
        code: "CH-2026-002",
        name: "Résidence Les Jardins d'Éden - 48 Logements",
        description: "Programme immobilier de 4 blocs R+3 avec piscine, voiries intérieures et poste transformateur privé.",
        type: "BATIMENT_RESIDENTIEL",
        status: "EN_COURS",
        riskLevel: "FAIBLE",
        clientId: "client_002_sipi",
        clientName: "SIPI Promotion Immobilière",
        clientType: "PROMOTEUR_PRIVE",
        clientContactPerson: "Mme Estelle Bamba",
        clientPhone: "+225 05 67 89 01 23",
        location: {
          address: "Riviera Golf 4, Proche Ambassade des USA",
          city: "Abidjan",
          district: "Cocody",
          country: "Côte d'Ivoire",
          latitude: 5.352,
          longitude: -3.974,
        },
        startDate: "2025-10-01",
        estimatedEndDate: "2026-12-15",
        surfaceAreaM2: 8600,
        numberOfFloors: "RDC + 3 Étages (4 Blocs)",
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
            id: "ph_21_go",
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
            id: "ph_22_corps_etat",
            name: "Étanchéité, Plomberie & Électricité",
            order: 2,
            startDate: "2026-04-01",
            endDate: "2026-08-30",
            progressPercentage: 90,
            status: "EN_COURS",
            budgetAllocated: 550000000,
            budgetSpent: 270000000,
          },
          {
            id: "ph_23_finitions",
            name: "Carrelage, Peinture & Menuiserie Alu",
            order: 3,
            startDate: "2026-07-01",
            endDate: "2026-11-30",
            progressPercentage: 45,
            status: "EN_COURS",
            budgetAllocated: 450000000,
            budgetSpent: 0,
          },
        ],
        milestones: [
          {
            id: "ms_21",
            title: "Achèvement Gros Œuvre 4 Blocs",
            targetDate: "2026-04-30",
            completedDate: "2026-04-25",
            status: "VALIDE",
            isCritical: true,
          },
          {
            id: "ms_22",
            title: "Appartement Témoin Validé",
            targetDate: "2026-06-15",
            completedDate: "2026-06-18",
            status: "VALIDE",
            isCritical: false,
          },
          {
            id: "ms_23",
            title: "Réception Provisoire & Remise des Clés",
            targetDate: "2026-12-15",
            status: "EN_ATTENTE",
            isCritical: true,
          },
        ],
        metrics: {
          workersOnSiteToday: 42,
          totalHoursWorked: 19800,
          openReservationsCount: 5,
          safetyIncidentsCount: 0,
          siteDiaryEntriesCount: 112,
          photosCount: 210,
          activeAlertsCount: 1,
        },
        weatherCondition: "NUAGEUX",
        temperatureCelsius: 29,
        tags: ["Résidentiel", "Cocody", "Logements Standing", "VRD"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        syncStatus: "synced",
      },
      {
        id: "proj_003_assainissement_vrd",
        code: "CH-2026-003",
        name: "Aménagement VRD & Drainage Primaire Akwaba - Port-Bouët",
        description: "Pose de dalots préfabriqués 2x2m, bordures T2, caniveaux béton armé et voirie bitumée 2x2 voies.",
        type: "TRAVAUX_PUBLICS_VRD",
        status: "EN_COURS",
        riskLevel: "MOYEN",
        clientId: "client_001_ageroute",
        clientName: "AGEROUTE - Direction des Infrastructures",
        clientType: "MOA_PUBLIC",
        clientContactPerson: "Ing. N'Dri Konan Lambert",
        clientPhone: "+225 27 20 25 10 00",
        location: {
          address: "Avenue Houphouët-Boigny, Axe Aéroport",
          city: "Abidjan",
          district: "Port-Bouët",
          country: "Côte d'Ivoire",
          latitude: 5.258,
          longitude: -3.931,
          accessNotes: "Zone maritime à forte nappe phréatique. Pompage permanent requis.",
        },
        startDate: "2026-02-01",
        estimatedEndDate: "2026-10-31",
        surfaceAreaM2: 34000,
        numberOfFloors: "Ouvrage Linéaire (4,2 km)",
        buildingPermitNumber: "MARCHE-PUBLIC-TP-2025-112",
        totalBudgetEstimated: 3100000000,
        totalBudgetContracted: 3450000000,
        totalExpensesRealized: 1820000000,
        totalBilledAmount: 2070000000,
        totalPaidAmount: 1850000000,
        retentionGuaranteeRate: 5,
        progressPercentage: 60,
        financialProgressPercentage: 60,
        managementTeam: {
          projectManagerName: "Ing. Koffi Kan Marc",
          siteManagerName: "M. Doumbia Mamadou",
          foremanName: "M. Camara Oumar",
          safetyOfficerName: "M. Koné Lassina",
        },
        phases: [
          {
            id: "ph_31_deblai",
            name: "Déviation Réseaux & Terrassement / Purge",
            order: 1,
            startDate: "2026-02-01",
            endDate: "2026-04-15",
            progressPercentage: 100,
            status: "TERMINEE",
            budgetAllocated: 600000000,
            budgetSpent: 590000000,
          },
          {
            id: "ph_32_dalots",
            name: "Pose Dalots 2x2m & Caniveaux Béton",
            order: 2,
            startDate: "2026-04-16",
            endDate: "2026-07-31",
            progressPercentage: 85,
            status: "EN_COURS",
            budgetAllocated: 1500000000,
            budgetSpent: 1230000000,
          },
          {
            id: "ph_33_chaussee",
            name: "Couche de Base Grave Bitume & Enrobé BB",
            order: 3,
            startDate: "2026-08-01",
            endDate: "2026-10-31",
            progressPercentage: 15,
            status: "EN_COURS",
            budgetAllocated: 1350000000,
            budgetSpent: 0,
          },
        ],
        milestones: [
          {
            id: "ms_31",
            title: "Validation Épreuve d'Écoulement Canaux",
            targetDate: "2026-07-15",
            status: "VALIDE",
            isCritical: true,
          },
          {
            id: "ms_32",
            title: "Mise en Circulation Première Voie",
            targetDate: "2026-09-01",
            status: "EN_ATTENTE",
            isCritical: true,
          },
        ],
        metrics: {
          workersOnSiteToday: 51,
          totalHoursWorked: 22100,
          openReservationsCount: 1,
          safetyIncidentsCount: 0,
          siteDiaryEntriesCount: 78,
          photosCount: 140,
          activeAlertsCount: 0,
        },
        weatherCondition: "ENSOLEILLE",
        temperatureCelsius: 30,
        tags: ["Marché Public", "AGEROUTE", "VRD", "Assainissement"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        syncStatus: "synced",
      },
      {
        id: "proj_004_entrepot_yopougon",
        code: "CH-2026-004",
        name: "Plateforme Logistique & Entrepôt Froid - ZI Yopougon",
        description: "Construction d'un entrepôt sous charpente métallique de 10 000 m² avec dallage industriel renforcé, 8 quais de déchargement et zone bureaux R+1.",
        type: "INDUSTRIEL_ENTREPOT",
        status: "ETUDE_PREPARATION",
        riskLevel: "FAIBLE",
        clientId: "client_003_cie",
        clientName: "Compagnie Ivoirienne d'Entreposage (CIE-Log)",
        clientType: "INVESTISSEUR",
        clientContactPerson: "M. Armand Gnahoré",
        clientPhone: "+225 01 23 45 67 89",
        location: {
          address: "Zone Industrielle Yopougon, Sortie Autoroute du Nord",
          city: "Abidjan",
          district: "Yopougon",
          country: "Côte d'Ivoire",
          latitude: 5.378,
          longitude: -4.089,
        },
        startDate: "2026-09-15",
        estimatedEndDate: "2027-04-30",
        surfaceAreaM2: 10200,
        numberOfFloors: "RDC Hauteur Libre 11m + Bureaux R+1",
        buildingPermitNumber: "PC-YOP-2026-0105",
        totalBudgetEstimated: 1750000000,
        totalBudgetContracted: 1890000000,
        totalExpensesRealized: 65000000,
        totalBilledAmount: 189000000,
        totalPaidAmount: 189000000,
        retentionGuaranteeRate: 5,
        progressPercentage: 5,
        financialProgressPercentage: 10,
        managementTeam: {
          projectManagerName: "Ing. Koffi Kan Marc",
          siteManagerName: "M. Kouamé Jean-Yves",
          foremanName: "M. Touré Brahima",
          safetyOfficerName: "Mme Yao Affoué Sylvie",
        },
        phases: [
          {
            id: "ph_41_etudes",
            name: "Installation de Chantier & Piquage Topo",
            order: 1,
            startDate: "2026-09-15",
            endDate: "2026-10-15",
            progressPercentage: 40,
            status: "EN_COURS",
            budgetAllocated: 120000000,
            budgetSpent: 65000000,
          },
          {
            id: "ph_42_dallage",
            name: "Fondations Spéciales & Dallage Industriel Quartzé",
            order: 2,
            startDate: "2026-10-16",
            endDate: "2026-12-31",
            progressPercentage: 0,
            status: "NON_DEBUTEE",
            budgetAllocated: 650000000,
            budgetSpent: 0,
          },
          {
            id: "ph_43_charpente",
            name: "Montage Charpente Métallique & Bardage Double Peau",
            order: 3,
            startDate: "2027-01-01",
            endDate: "2027-03-15",
            progressPercentage: 0,
            status: "NON_DEBUTEE",
            budgetAllocated: 820000000,
            budgetSpent: 0,
          },
        ],
        milestones: [
          {
            id: "ms_41",
            title: "Validation Notes de Calcul Charpente Métallique",
            targetDate: "2026-09-30",
            status: "EN_ATTENTE",
            isCritical: true,
          },
        ],
        metrics: {
          workersOnSiteToday: 8,
          totalHoursWorked: 480,
          openReservationsCount: 0,
          safetyIncidentsCount: 0,
          siteDiaryEntriesCount: 4,
          photosCount: 8,
          activeAlertsCount: 0,
        },
        weatherCondition: "ENSOLEILLE",
        temperatureCelsius: 33,
        tags: ["Industriel", "Yopougon", "Charpente Métallique", "Entrepôt"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        syncStatus: "synced",
      },
    ];

    for (const project of seedProjects) {
      await IdbAdapter.put(this.storeName, project);
    }
  }
}
