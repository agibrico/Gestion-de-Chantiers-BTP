/**
 * AGB CHANTIER - Implémentation du Repository Intervenants & Équipes (IndexedDB Offline-First) - AXE 05
 */

import {
  IStakeholdersTeamsRepository,
  StakeholdersFilterQuery,
  WorkersFilterQuery,
  Axe05Stats,
} from "../domain/repositories/stakeholders_teams_repository";
import { StakeholderEntity } from "../domain/entities/stakeholder_entity";
import { TeamEntity } from "../domain/entities/team_entity";
import { WorkerEntity, WorkerStatus } from "../domain/entities/worker_entity";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { NotFoundException } from "../../../core/errors/app_exception";

export class StakeholdersTeamsRepositoryImpl implements IStakeholdersTeamsRepository {
  private static instance: StakeholdersTeamsRepositoryImpl;

  public static getInstance(): StakeholdersTeamsRepositoryImpl {
    if (!StakeholdersTeamsRepositoryImpl.instance) {
      StakeholdersTeamsRepositoryImpl.instance = new StakeholdersTeamsRepositoryImpl();
    }
    return StakeholdersTeamsRepositoryImpl.instance;
  }

  /**
   * Initialisation des données BTP réalistes pour les intervenants, équipes et compagnons
   */
  public async initializeSeedData(): Promise<void> {
    try {
      const existingStakeholders = await IdbAdapter.getAll<StakeholderEntity>(IdbAdapter.STORES.STAKEHOLDERS);
      const now = new Date().toISOString();

      if (existingStakeholders.length === 0) {
        const defaultStakeholders: StakeholderEntity[] = [
          {
            id: "stk_veritas_01",
            code: "STK-BC-001",
            name: "Bureau Veritas Côte d'Ivoire",
            category: "BUREAU_CONTROLE",
            specialty: "Contrôle Technique des Constructions, Solidité L/S, Sécurité Incendie",
            status: "AGREE",
            rccm: "CI-ABJ-1995-B-12894",
            taxNumber: "9501248K",
            phone: "+225 27 21 25 36 00",
            email: "contact.ci@bureauveritas.com",
            address: "Boulevard de Marseille, Zone 3",
            city: "Abidjan (Treichville)",
            country: "Côte d'Ivoire",
            assignedProjectIds: ["prj_thp_001", "prj_rje_002"],
            assignedProjectNames: ["Tour Horizon Prestige R+14", "Résidence Les Jardins d'Éden R+5"],
            rating: 5,
            insuranceCompany: "AXA Assurances CI",
            insurancePolicyNumber: "DEC-2026-98124",
            contacts: [
              {
                id: "ctc_v1",
                name: "Ing. Koffi Alain",
                role: "Ingénieur Contrôleur Principal L/S",
                phone: "+225 07 48 12 34 56",
                email: "alain.koffi@bureauveritas.com",
                isPrimary: true,
              },
            ],
            documents: [
              {
                id: "doc_v1",
                name: "Agrément Ministère de la Construction 2026",
                fileType: "PDF",
                isValid: true,
                expirationDate: "2026-12-31",
              },
            ],
            notes: "Bureau de contrôle officiel sur la Tour Horizon. Visites hebdomadaires préalables aux coulages de planchers.",
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          },
          {
            id: "stk_bnetd_02",
            code: "STK-BET-002",
            name: "BNETD - Dpt Bâtiment & Génie Civil",
            category: "BUREAU_ETUDES_TECHNIQUES",
            specialty: "Études Béton Armé, Géotechnique, Calculs Sismiques & VRD",
            status: "AGREE",
            rccm: "CI-ABJ-1978-B-00124",
            taxNumber: "7809124A",
            phone: "+225 27 22 48 20 00",
            email: "pole.batiment@bnetd.ci",
            address: "Boulevard Hassan II, Cocody",
            city: "Abidjan",
            country: "Côte d'Ivoire",
            assignedProjectIds: ["prj_thp_001", "prj_evr_003"],
            assignedProjectNames: ["Tour Horizon Prestige R+14", "Voie Express Industrielle VRD"],
            rating: 5,
            contacts: [
              {
                id: "ctc_b1",
                name: "Ing. N'Dri Yao Patrice",
                role: "Chef de Projet BET Structure",
                phone: "+225 05 06 11 22 33",
                email: "patrice.ndri@bnetd.ci",
                isPrimary: true,
              },
            ],
            documents: [
              {
                id: "doc_b1",
                name: "Attestation de Responsabilité Civile Professionnelle",
                fileType: "PDF",
                isValid: true,
                expirationDate: "2026-12-31",
              },
            ],
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          },
          {
            id: "stk_ivoire_clim_03",
            code: "STK-ST-003",
            name: "Ivoire Climatisation & Fluides SAS",
            category: "SOUS_TRAITANT_SPECIALISE",
            specialty: "Génie Climatique, VRV Centralisé, Extraction & Désenfumage",
            status: "ACTIF",
            rccm: "CI-ABJ-2016-B-14092",
            taxNumber: "1604928M",
            phone: "+225 27 21 35 78 90",
            email: "contact@ivoireclim.ci",
            address: "Rue des Carrossiers, Zone 4C",
            city: "Abidjan (Marcory)",
            country: "Côte d'Ivoire",
            assignedProjectIds: ["prj_thp_001"],
            assignedProjectNames: ["Tour Horizon Prestige R+14"],
            rating: 4,
            insuranceCompany: "NSIA Assurances",
            insurancePolicyNumber: "RC-ST-48201",
            contacts: [
              {
                id: "ctc_c1",
                name: "M. Coulibaly Daouda",
                role: "Directeur Technique Sous-Traitance",
                phone: "+225 07 09 88 77 66",
                email: "d.coulibaly@ivoireclim.ci",
                isPrimary: true,
              },
            ],
            documents: [
              {
                id: "doc_c1",
                name: "Attestation Fiscale et Sociale CNPS à Jour",
                fileType: "PDF",
                isValid: true,
                expirationDate: "2026-06-30",
              },
            ],
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          },
          {
            id: "stk_lbtp_04",
            code: "STK-LAB-004",
            name: "LBTP - Laboratoire du Bâtiment et des Travaux Publics",
            category: "LABORATOIRE_SOLS_BETON",
            specialty: "Écrasement éprouvettes béton, carottage, essais de sol & compacité",
            status: "AGREE",
            phone: "+225 27 20 37 40 00",
            email: "analyses@lbtp.ci",
            address: "Rue des Brasseurs, Zone 3",
            city: "Abidjan",
            country: "Côte d'Ivoire",
            assignedProjectIds: ["prj_thp_001", "prj_rje_002", "prj_evr_003"],
            assignedProjectNames: ["Tour Horizon Prestige R+14", "Résidence Les Jardins d'Éden R+5", "Voie Express Industrielle VRD"],
            rating: 5,
            contacts: [
              {
                id: "ctc_l1",
                name: "Dr. Touré Ibrahim",
                role: "Responsable Essais Béton & Matériaux",
                phone: "+225 01 02 03 04 05",
                email: "i.toure@lbtp.ci",
                isPrimary: true,
              },
            ],
            documents: [
              {
                id: "doc_l1",
                name: "Agrément d'Essais Officiel État de CI",
                fileType: "PDF",
                isValid: true,
              },
            ],
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          },
          {
            id: "stk_sps_05",
            code: "STK-SPS-005",
            name: "Sécurité BTP & Prévention SPS",
            category: "COORDONNATEUR_SPS",
            specialty: "Coordination Sécurité & Protection de la Santé, Plan Général de Coordination (PGC)",
            status: "AGREE",
            phone: "+225 27 22 41 55 66",
            email: "coordination@sps-prevention.ci",
            address: "Cocody II Plateaux, 7ème Tranche",
            city: "Abidjan",
            country: "Côte d'Ivoire",
            assignedProjectIds: ["prj_thp_001"],
            assignedProjectNames: ["Tour Horizon Prestige R+14"],
            rating: 5,
            contacts: [
              {
                id: "ctc_s1",
                name: "Mme Bakayoko Fatoumata",
                role: "Coordonnatrice SPS Niveau 1",
                phone: "+225 07 77 88 99 00",
                email: "f.bakayoko@sps-prevention.ci",
                isPrimary: true,
              },
            ],
            documents: [],
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          },
        ];

        for (const item of defaultStakeholders) {
          await IdbAdapter.put(IdbAdapter.STORES.STAKEHOLDERS, item);
        }
      }

      // Teams Seed Data
      const existingTeams = await IdbAdapter.getAll<TeamEntity>(IdbAdapter.STORES.TEAMS);
      if (existingTeams.length === 0) {
        const defaultTeams: TeamEntity[] = [
          {
            id: "team_go_01",
            code: "EQP-GO-01",
            name: "Équipe Gros Œuvre & Voiles Béton Alpha",
            category: "GROS_OEUVRE",
            leaderName: "M. Traoré Souleymane",
            leaderPhone: "+225 07 48 90 12 34",
            assignedProjectId: "prj_thp_001",
            assignedProjectName: "Tour Horizon Prestige R+14",
            memberCount: 14,
            workerIds: ["w_001", "w_002", "w_003", "w_004", "w_005"],
            productivityScore: 96,
            colorTag: "#ea580c",
            notes: "Équipe d'élite spécialisée dans le coulage continu et les voiles en béton architectonique.",
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          },
          {
            id: "team_fer_02",
            code: "EQP-FER-02",
            name: "Équipe Ferraillage & Façonnage Armatures",
            category: "FERRAILLAGE",
            leaderName: "M. Yao Kouassi Germain",
            leaderPhone: "+225 05 06 78 12 34",
            assignedProjectId: "prj_thp_001",
            assignedProjectName: "Tour Horizon Prestige R+14",
            memberCount: 10,
            workerIds: ["w_006", "w_007", "w_008"],
            productivityScore: 92,
            colorTag: "#2563eb",
            notes: "Responsable du respect strict des plans de ferraillage validés par le BET.",
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          },
          {
            id: "team_elec_03",
            code: "EQP-ELEC-03",
            name: "Équipe Électricité Bâtiment & CFO/CFA",
            category: "ELECTRICITE_CFO_CFA",
            leaderName: "M. Diallo Amadou",
            leaderPhone: "+225 07 11 22 33 44",
            assignedProjectId: "prj_rje_002",
            assignedProjectName: "Résidence Les Jardins d'Éden R+5",
            memberCount: 6,
            workerIds: ["w_009", "w_010"],
            productivityScore: 89,
            colorTag: "#16a34a",
            notes: "Tirage de câbles, pose de chemins de câbles et tableaux divisionnaires.",
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          },
          {
            id: "team_fin_04",
            code: "EQP-FIN-04",
            name: "Équipe Second Œuvre, Cloisons & Finitions",
            category: "SECOND_OEUVRE_POLYVALENT",
            leaderName: "M. Koné Bakary",
            leaderPhone: "+225 01 99 88 77 66",
            assignedProjectId: "prj_rje_002",
            assignedProjectName: "Résidence Les Jardins d'Éden R+5",
            memberCount: 8,
            workerIds: ["w_011", "w_012"],
            productivityScore: 94,
            colorTag: "#9333ea",
            notes: "Pose de carreaux grands formats, enduits fins et peinture projetée.",
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          },
        ];

        for (const item of defaultTeams) {
          await IdbAdapter.put(IdbAdapter.STORES.TEAMS, item);
        }
      }

      // Workers Seed Data (stored in USERS or custom store)
      const existingWorkers = await IdbAdapter.getAll<WorkerEntity>(IdbAdapter.STORES.USERS);
      // Check if we have workers in users
      const hasWorkers = existingWorkers.some((w) => (w as any).trade !== undefined);
      if (!hasWorkers) {
        const defaultWorkers: WorkerEntity[] = [
          {
            id: "w_001",
            registrationNumber: "OUV-2026-001",
            firstName: "Souleymane",
            lastName: "Traoré",
            trade: "CHEF_EQUIPE_TERRAIN",
            tradeLevel: "N4P1 (Maître Ouvrier)",
            contractType: "CDI",
            status: "SUR_CHANTIER",
            phone: "+225 07 48 90 12 34",
            emergencyContactName: "Mme Traoré Mariam (Épouse)",
            emergencyContactPhone: "+225 07 12 34 56 78",
            nationality: "Ivoirienne",
            nationalIdNumber: "CI002910482",
            dailyRateFCFA: 18000,
            monthlySalaryFCFA: 450000,
            currentProjectId: "prj_thp_001",
            currentProjectName: "Tour Horizon Prestige R+14",
            currentTeamId: "team_go_01",
            currentTeamName: "Équipe Gros Œuvre Alpha",
            medicalCheckupExpiryDate: "2026-11-15",
            bloodGroup: "O+",
            ppeDelivered: true,
            certifications: [
              {
                id: "c_1",
                name: "SST - Sauveteur Secouriste du Travail BTP",
                issuer: "Croix-Rouge CI / CNPS",
                obtainedDate: "2025-05-10",
                expiryDate: "2027-05-10",
                isValid: true,
              },
              {
                id: "c_2",
                name: "Formation Encadrement Sécurité Travail en Hauteur",
                issuer: "APAVE Afrique",
                obtainedDate: "2025-08-14",
                expiryDate: "2027-08-14",
                isValid: true,
              },
            ],
            notes: "Chef d'équipe très rigoureux sur le respect du port des EPI et les cadences de coulage.",
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          },
          {
            id: "w_002",
            registrationNumber: "OUV-2026-002",
            firstName: "Moussa",
            lastName: "Diomandé",
            trade: "GRUTIER",
            tradeLevel: "N3P2 (Professionnel Spécialisé)",
            contractType: "CDI",
            status: "SUR_CHANTIER",
            phone: "+225 05 44 33 22 11",
            emergencyContactName: "M. Diomandé Salif (Frère)",
            emergencyContactPhone: "+225 07 99 88 11 22",
            nationality: "Ivoirienne",
            nationalIdNumber: "CI001928471",
            dailyRateFCFA: 22000,
            monthlySalaryFCFA: 550000,
            currentProjectId: "prj_thp_001",
            currentProjectName: "Tour Horizon Prestige R+14",
            currentTeamId: "team_go_01",
            currentTeamName: "Équipe Gros Œuvre Alpha",
            medicalCheckupExpiryDate: "2026-09-30",
            bloodGroup: "A+",
            ppeDelivered: true,
            certifications: [
              {
                id: "c_3",
                name: "CACES R487 - Grue à Tour à Montage par Éléments",
                issuer: "Bureau Veritas Formations",
                obtainedDate: "2024-06-15",
                expiryDate: "2029-06-15",
                isValid: true,
              },
            ],
            notes: "Grutier principal sur la Grue Potain MDT 219 de la Tour Horizon.",
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          },
          {
            id: "w_003",
            registrationNumber: "OUV-2026-003",
            firstName: "Koffi",
            lastName: "Adjoumani",
            trade: "COFFREUR_BANCHEUR",
            tradeLevel: "N3P1 (Compagnon)",
            contractType: "CDI",
            status: "SUR_CHANTIER",
            phone: "+225 07 88 99 00 11",
            emergencyContactName: "Mme Adjoumani Akissi",
            emergencyContactPhone: "+225 01 02 03 04 05",
            nationality: "Ivoirienne",
            dailyRateFCFA: 12000,
            currentProjectId: "prj_thp_001",
            currentProjectName: "Tour Horizon Prestige R+14",
            currentTeamId: "team_go_01",
            currentTeamName: "Équipe Gros Œuvre Alpha",
            medicalCheckupExpiryDate: "2026-10-10",
            ppeDelivered: true,
            certifications: [
              {
                id: "c_4",
                name: "Habilitation Échafaudage & Travail en Hauteur R408",
                issuer: "Socotec Afrique",
                obtainedDate: "2025-02-10",
                expiryDate: "2028-02-10",
                isValid: true,
              },
            ],
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          },
          {
            id: "w_004",
            registrationNumber: "OUV-2026-004",
            firstName: "Amadou",
            lastName: "Diallo",
            trade: "ELECTRICIEN",
            tradeLevel: "N3P2 (Technicien Électricien)",
            contractType: "CDI",
            status: "SUR_CHANTIER",
            phone: "+225 07 11 22 33 44",
            emergencyContactName: "M. Diallo Ousmane",
            emergencyContactPhone: "+225 05 55 44 33 22",
            nationality: "Guinéenne",
            dailyRateFCFA: 15000,
            currentProjectId: "prj_rje_002",
            currentProjectName: "Résidence Les Jardins d'Éden R+5",
            currentTeamId: "team_elec_03",
            currentTeamName: "Équipe Électricité Bâtiment",
            medicalCheckupExpiryDate: "2026-12-01",
            bloodGroup: "B+",
            ppeDelivered: true,
            certifications: [
              {
                id: "c_5",
                name: "Habilitation Électrique BR / B2V / BC (Basse Tension)",
                issuer: "APAVE Côte d'Ivoire",
                obtainedDate: "2025-04-12",
                expiryDate: "2028-04-12",
                isValid: true,
              },
            ],
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          },
          {
            id: "w_005",
            registrationNumber: "OUV-2026-005",
            firstName: "Kouassi Germain",
            lastName: "Yao",
            trade: "FERRAILLEUR",
            tradeLevel: "N3P2 (Chef Ferrailleur)",
            contractType: "CDI",
            status: "SUR_CHANTIER",
            phone: "+225 05 06 78 12 34",
            emergencyContactName: "Mme Yao Affoué",
            emergencyContactPhone: "+225 07 12 34 56 00",
            nationality: "Ivoirienne",
            dailyRateFCFA: 15000,
            currentProjectId: "prj_thp_001",
            currentProjectName: "Tour Horizon Prestige R+14",
            currentTeamId: "team_fer_02",
            currentTeamName: "Équipe Ferraillage Beta",
            medicalCheckupExpiryDate: "2026-08-20",
            ppeDelivered: true,
            certifications: [],
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          },
          {
            id: "w_006",
            registrationNumber: "OUV-2026-006",
            firstName: "Sékou",
            lastName: "Bamba",
            trade: "CONDUCTEUR_ENGIN",
            tradeLevel: "N3P1",
            contractType: "CDD",
            status: "SUR_CHANTIER",
            phone: "+225 07 66 55 44 33",
            emergencyContactName: "M. Bamba Adama",
            emergencyContactPhone: "+225 05 11 22 33 44",
            nationality: "Ivoirienne",
            dailyRateFCFA: 16000,
            currentProjectId: "prj_evr_003",
            currentProjectName: "Voie Express Industrielle VRD",
            medicalCheckupExpiryDate: "2026-07-15",
            ppeDelivered: true,
            certifications: [
              {
                id: "c_6",
                name: "CACES R482 Catégorie B1 (Pelle Hydraulique)",
                issuer: "Bureau Veritas Formations",
                obtainedDate: "2024-03-10",
                expiryDate: "2029-03-10",
                isValid: true,
              },
            ],
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          },
        ];

        for (const item of defaultWorkers) {
          await IdbAdapter.put(IdbAdapter.STORES.USERS, item);
        }
      }
    } catch (e) {
      console.error("Erreur lors de l'initialisation des semences Axe 05", e);
    }
  }

  // STAKEHOLDERS CRUD
  public async getAllStakeholders(query?: StakeholdersFilterQuery): Promise<StakeholderEntity[]> {
    await this.initializeSeedData();
    let list = await IdbAdapter.getAll<StakeholderEntity>(IdbAdapter.STORES.STAKEHOLDERS);

    if (query?.category && query.category !== "ALL") {
      list = list.filter((s) => s.category === query.category);
    }

    if (query?.projectId) {
      list = list.filter((s) => s.assignedProjectIds?.includes(query.projectId!));
    }

    if (query?.search && query.search.trim() !== "") {
      const q = query.search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.specialty?.toLowerCase().includes(q) ||
          s.city?.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  }

  public async getStakeholderById(id: string): Promise<StakeholderEntity | null> {
    return IdbAdapter.getById<StakeholderEntity>(IdbAdapter.STORES.STAKEHOLDERS, id);
  }

  public async createStakeholder(
    stakeholder: Omit<StakeholderEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<StakeholderEntity> {
    const now = new Date().toISOString();
    const id = `stk_${Date.now()}`;
    const code = stakeholder.code || `STK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord: StakeholderEntity = {
      ...stakeholder,
      id,
      code,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };

    await IdbAdapter.put(IdbAdapter.STORES.STAKEHOLDERS, newRecord);
    return newRecord;
  }

  public async updateStakeholder(stakeholder: StakeholderEntity): Promise<StakeholderEntity> {
    const existing = await this.getStakeholderById(stakeholder.id);
    if (!existing) {
      throw new NotFoundException(`Intervenant ${stakeholder.id} introuvable`);
    }

    const updated: StakeholderEntity = {
      ...stakeholder,
      updatedAt: new Date().toISOString(),
      syncStatus: "local",
    };

    await IdbAdapter.put(IdbAdapter.STORES.STAKEHOLDERS, updated);
    return updated;
  }

  public async deleteStakeholder(id: string): Promise<boolean> {
    return IdbAdapter.delete(IdbAdapter.STORES.STAKEHOLDERS, id);
  }

  // TEAMS CRUD
  public async getAllTeams(projectId?: string): Promise<TeamEntity[]> {
    await this.initializeSeedData();
    let list = await IdbAdapter.getAll<TeamEntity>(IdbAdapter.STORES.TEAMS);

    if (projectId) {
      list = list.filter((t) => t.assignedProjectId === projectId);
    }

    return list.sort((a, b) => a.name.localeCompare(b.name));
  }

  public async getTeamById(id: string): Promise<TeamEntity | null> {
    return IdbAdapter.getById<TeamEntity>(IdbAdapter.STORES.TEAMS, id);
  }

  public async createTeam(team: Omit<TeamEntity, "id" | "createdAt" | "updatedAt">): Promise<TeamEntity> {
    const now = new Date().toISOString();
    const id = `team_${Date.now()}`;
    const code = team.code || `EQP-${Math.floor(10 + Math.random() * 90)}`;

    const newTeam: TeamEntity = {
      ...team,
      id,
      code,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };

    await IdbAdapter.put(IdbAdapter.STORES.TEAMS, newTeam);
    return newTeam;
  }

  public async updateTeam(team: TeamEntity): Promise<TeamEntity> {
    const existing = await this.getTeamById(team.id);
    if (!existing) {
      throw new NotFoundException(`Équipe ${team.id} introuvable`);
    }

    const updated: TeamEntity = {
      ...team,
      updatedAt: new Date().toISOString(),
      syncStatus: "local",
    };

    await IdbAdapter.put(IdbAdapter.STORES.TEAMS, updated);
    return updated;
  }

  public async deleteTeam(id: string): Promise<boolean> {
    return IdbAdapter.delete(IdbAdapter.STORES.TEAMS, id);
  }

  // WORKERS CRUD
  public async getAllWorkers(query?: WorkersFilterQuery): Promise<WorkerEntity[]> {
    await this.initializeSeedData();
    const all = await IdbAdapter.getAll<WorkerEntity>(IdbAdapter.STORES.USERS);
    let list = all.filter((w) => (w as any).trade !== undefined);

    if (query?.trade && query.trade !== "ALL") {
      list = list.filter((w) => w.trade === query.trade);
    }

    if (query?.status && query.status !== "ALL") {
      list = list.filter((w) => w.status === query.status);
    }

    if (query?.projectId) {
      list = list.filter((w) => w.currentProjectId === query.projectId);
    }

    if (query?.teamId) {
      list = list.filter((w) => w.currentTeamId === query.teamId);
    }

    if (query?.search && query.search.trim() !== "") {
      const q = query.search.toLowerCase().trim();
      list = list.filter(
        (w) =>
          w.firstName.toLowerCase().includes(q) ||
          w.lastName.toLowerCase().includes(q) ||
          w.registrationNumber.toLowerCase().includes(q) ||
          w.phone?.toLowerCase().includes(q) ||
          w.currentProjectName?.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => a.lastName.localeCompare(b.lastName));
  }

  public async getWorkerById(id: string): Promise<WorkerEntity | null> {
    return IdbAdapter.getById<WorkerEntity>(IdbAdapter.STORES.USERS, id);
  }

  public async createWorker(worker: Omit<WorkerEntity, "id" | "createdAt" | "updatedAt">): Promise<WorkerEntity> {
    const now = new Date().toISOString();
    const id = `w_${Date.now()}`;
    const registrationNumber =
      worker.registrationNumber || `OUV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newWorker: WorkerEntity = {
      ...worker,
      id,
      registrationNumber,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };

    await IdbAdapter.put(IdbAdapter.STORES.USERS, newWorker);
    return newWorker;
  }

  public async updateWorker(worker: WorkerEntity): Promise<WorkerEntity> {
    const existing = await this.getWorkerById(worker.id);
    if (!existing) {
      throw new NotFoundException(`Compagnon ${worker.id} introuvable`);
    }

    const updated: WorkerEntity = {
      ...worker,
      updatedAt: new Date().toISOString(),
      syncStatus: "local",
    };

    await IdbAdapter.put(IdbAdapter.STORES.USERS, updated);
    return updated;
  }

  public async deleteWorker(id: string): Promise<boolean> {
    return IdbAdapter.delete(IdbAdapter.STORES.USERS, id);
  }

  public async updateWorkerStatus(id: string, status: WorkerStatus, projectId?: string): Promise<void> {
    const worker = await this.getWorkerById(id);
    if (!worker) return;

    worker.status = status;
    if (projectId !== undefined) {
      worker.currentProjectId = projectId;
    }
    worker.updatedAt = new Date().toISOString();
    await IdbAdapter.put(IdbAdapter.STORES.USERS, worker);
  }

  // STATS & EXPORT
  public async getAxe05Stats(): Promise<Axe05Stats> {
    const [stakeholders, teams, workers] = await Promise.all([
      this.getAllStakeholders(),
      this.getAllTeams(),
      this.getAllWorkers(),
    ]);

    const totalSubcontractors = stakeholders.filter((s) => s.category === "SOUS_TRAITANT_SPECIALISE").length;
    const totalControlOffices = stakeholders.filter((s) => s.category === "BUREAU_CONTROLE" || s.category === "BUREAU_ETUDES_TECHNIQUES").length;
    const workersOnSiteToday = workers.filter((w) => w.status === "SUR_CHANTIER").length;

    // Check expiring certifications (within 60 days)
    const now = new Date();
    const sixtyDaysLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    let expiringCertificationsCount = 0;

    for (const w of workers) {
      for (const c of w.certifications || []) {
        if (c.expiryDate) {
          const exp = new Date(c.expiryDate);
          if (exp <= sixtyDaysLater) {
            expiringCertificationsCount++;
          }
        }
      }
    }

    return {
      totalStakeholders: stakeholders.length,
      totalSubcontractors,
      totalControlOffices,
      totalTeams: teams.length,
      totalWorkers: workers.length,
      workersOnSiteToday,
      expiringCertificationsCount,
    };
  }

  public exportWorkersToCsv(workers: WorkerEntity[]): string {
    const headers = [
      "Matricule",
      "Nom",
      "Prenom",
      "Metier",
      "Niveau Qualification",
      "Contrat",
      "Statut",
      "Chantier Actuel",
      "Equipe",
      "Telephone",
      "Taux Journalier FCFA",
      "EPI Livres",
    ];

    const rows = workers.map((w) => [
      w.registrationNumber,
      `"${w.lastName}"`,
      `"${w.firstName}"`,
      w.trade,
      w.tradeLevel,
      w.contractType,
      w.status,
      `"${w.currentProjectName || "Non affecté"}"`,
      `"${w.currentTeamName || "Non affecté"}"`,
      w.phone,
      w.dailyRateFCFA,
      w.ppeDelivered ? "OUI" : "NON",
    ]);

    return [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
  }

  public exportStakeholdersToCsv(stakeholders: StakeholderEntity[]): string {
    const headers = [
      "Code",
      "Raison Sociale",
      "Categorie",
      "Specialite",
      "Statut",
      "Telephone",
      "Email",
      "Ville",
      "Chantiers Affectes",
      "Compagnie Assurance",
    ];

    const rows = stakeholders.map((s) => [
      s.code,
      `"${s.name}"`,
      s.category,
      `"${s.specialty}"`,
      s.status,
      s.phone,
      s.email,
      s.city,
      `"${s.assignedProjectNames?.join(", ") || ""}"`,
      `"${s.insuranceCompany || ""}"`,
    ]);

    return [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
  }
}
