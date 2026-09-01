/**
 * AGB CHANTIER - Implémentation du Repository HSE & Sécurité - AXE 16
 */

import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { HseIncidentEntity, SafetyTalkTopicEntity } from "../domain/entities/hse_entity";

const INITIAL_INCIDENTS_MOCK: Omit<HseIncidentEntity, "id" | "createdAt" | "updatedAt">[] = [
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    incidentNumber: "HSE-2026-0014",
    title: "Coupure superficielle lors de la ligature de barres d'acier",
    category: "COUPURE_OUTILLAGE",
    severity: "BENIN_SOINS_SUR_PLACE",
    dateTime: "2026-08-27T11:15:00Z",
    exactLocation: "Plancher R+2 - Atelier de ferraillage",
    victimName: "Bamba Souleymane",
    victimCompany: "AGB BTP - Équipe Ferraillage",
    daysOfSickLeave: 0,
    description: "Écorchure à la main droite lors de la manipulation d'un fil de fer recuit sans gants anticoupure adaptés.",
    rootCauseAnalysis: "Non-port des gants de protection EN388 niveau 5.",
    correctiveActions: "Rappel à l'ordre, renouvellement immédiat de la paire de gants et causerie sécurité ferrailleurs.",
    responsibleFollowUp: "Responsable HSE Chantier",
    isClosed: true,
  },
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    incidentNumber: "HSE-2026-0015",
    title: "Chute d'un étai métallique sans blessé (Presqu'accident)",
    category: "CHUTE_OBJET_MANUTENTION",
    severity: "PRESQU_ACCIDENT_NEAR_MISS",
    dateTime: "2026-08-29T15:40:00Z",
    exactLocation: "Pied de grue - Zone de décoffrage R+1",
    daysOfSickLeave: 0,
    description: "Un étai tirant-poussant a glissé lors du gerbage sur la palette de stockage. Aucune personne en dessous grâce au balisage.",
    rootCauseAnalysis: "Arrimage insuffisant de la charge sur palette avant translation.",
    correctiveActions: "Mise en place de paniers grillagés métalliques obligatoires pour la manutention de tout le matériel d'étaiement.",
    responsibleFollowUp: "Kouassi Jean-Marc (Directeur Travaux)",
    isClosed: true,
  },
];

export class HseRepositoryImpl {
  private static isInitialized = false;

  public static async init(): Promise<void> {
    if (this.isInitialized) return;
    try {
      const items = await IdbAdapter.getAll<HseIncidentEntity>(IdbAdapter.STORES.HSE_INCIDENTS);
      if (items.length === 0) {
        const now道德 = new Date().toISOString();
        for (let i = 0; i < INITIAL_INCIDENTS_MOCK.length; i++) {
          const item = INITIAL_INCIDENTS_MOCK[i];
          const entity: HseIncidentEntity = {
            ...item,
            id: `hse-${100 + i}`,
            createdAt: now道德,
            updatedAt: now道德,
            syncStatus: "synced",
          };
          await IdbAdapter.put<HseIncidentEntity>(IdbAdapter.STORES.HSE_INCIDENTS, entity);
        }
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn("Init HSE error:", e);
    }
  }

  public static async getAllIncidents(): Promise<HseIncidentEntity[]> {
    await this.init();
    return IdbAdapter.getAll<HseIncidentEntity>(IdbAdapter.STORES.HSE_INCIDENTS);
  }

  public static async createIncident(
    data: Omit<HseIncidentEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ): Promise<HseIncidentEntity> {
    await this.init();
    const now = new Date().toISOString();
    const newEntity: HseIncidentEntity = {
      ...data,
      id: `hse-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };
    await IdbAdapter.put<HseIncidentEntity>(IdbAdapter.STORES.HSE_INCIDENTS, newEntity);
    return newEntity;
  }
}
