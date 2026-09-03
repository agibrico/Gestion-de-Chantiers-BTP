/**
 * AGB CHANTIER - Implémentation du Repository Journal de Chantier - AXE 13
 */

import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { SiteDiaryEntryEntity } from "../domain/entities/site_diary_entity";

const INITIAL_DIARY_MOCK: Omit<SiteDiaryEntryEntity, "id" | "createdAt" | "updatedAt">[] = [
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    date: "2026-08-30",
    entryNumber: 85,
    weatherMorning: "ENSOLEILLE",
    weatherAfternoon: "NUAGEUX",
    temperatureCelsius: 29,
    totalWorkersOnSite: 28,
    hoursWorkedStandard: 8,
    hoursWorkedOvertime: 2,
    workReports: [
      {
        lotName: "Gros Œuvre - Ferraillage",
        workDescription: "Pose des armatures longitudinales et cadres HA12 sur poteaux P1 à P8 du niveau R+2. Validation avant coffrage.",
        workersCount: 12,
        progressNotes: "Conforme aux plans d'armatures BA-EXE-04",
      },
      {
        lotName: "Gros Œuvre - Coffrage",
        workDescription: "Mise en place des banches métalliques pour voile périphérique Est.",
        workersCount: 8,
      },
      {
        lotName: "Électricité CFO / CFA",
        workDescription: "Passage des gaines ICTA et boîtes d'encastrement incorporées au coulage de plancher.",
        workersCount: 4,
      },
      {
        lotName: "Plomberie Sanitaire",
        workDescription: "Réservation pour colonnes d'évacuation EU/EV DN100.",
        workersCount: 4,
      },
    ],
    materialDeliveries: [
      "Livraison 20T Ciment CPJ 42.5 (CIMIVOIRE) - Conforme",
      "Livraison 15T Aciers FeE500 torsadés HA10/HA12/HA16 (SOTACI)",
    ],
    visitors: [
      {
        visitorName: "M. Kouamé Sylvain",
        organization: "Bureau de Contrôle SOCOTEC CI",
        purpose: "Visite de contrôle armatures poteaux R+2 avant autorisation de coulage",
        arrivalTime: "10:30",
      },
      {
        visitorName: "Mme Bédié Claire",
        organization: "Cabinet Architecture ARCHI-DESIGN",
        purpose: "Validation échantillon menuiserie aluminium",
        arrivalTime: "14:15",
      },
    ],
    incidentsOrDelays: "Micro-coupure CIE de 45 minutes résolue par basculement sur groupe électrogène SDMO.",
    authorName: "Kouassi Jean-Marc",
    authorRole: "Directeur Travaux Principal",
    isSigned: true,
    signedAt: "2026-08-30T17:45:00Z",
  },
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    date: "2026-08-29",
    entryNumber: 84,
    weatherMorning: "PLUIE_LEGERE",
    weatherAfternoon: "ENSOLEILLE",
    temperatureCelsius: 27,
    totalWorkersOnSite: 26,
    hoursWorkedStandard: 8,
    hoursWorkedOvertime: 0,
    workReports: [
      {
        lotName: "Gros Œuvre - Coulage Béton",
        workDescription: "Coulage de la dalle R+2 Zone B (Volume béton prêt à l'emploi C25/30 : 65 m3 à la pompe à béton).",
        workersCount: 16,
      },
      {
        lotName: "Terrassement & Remblai",
        workDescription: "Nivellement plateforme zone de stockage technique.",
        workersCount: 6,
      },
    ],
    materialDeliveries: [
      "65 m3 Béton BPE C25/30 (Béton de Côte d'Ivoire BCI)",
    ],
    visitors: [
      {
        visitorName: "Ing. Diallo Mamadou",
        organization: "Laboratoire LBTP",
        purpose: "Prélèvement de 6 éprouvettes béton pour essais d'écrasement 7j et 28j",
        arrivalTime: "08:45",
      },
    ],
    authorName: "Amadou Touré",
    authorRole: "Conducteur de Travaux",
    isSigned: true,
    signedAt: "2026-08-29T18:00:00Z",
  },
];

export class SiteDiaryRepositoryImpl {
  private static isInitialized = false;

  public static async init(): Promise<void> {
    if (this.isInitialized) return;
    try {
      const items = await IdbAdapter.getAll<SiteDiaryEntryEntity>(IdbAdapter.STORES.SITE_DIARY_ENTRIES);
      if (items.length === 0) {
        const now = new Date().toISOString();
        for (let i = 0; i < INITIAL_DIARY_MOCK.length; i++) {
          const item = INITIAL_DIARY_MOCK[i];
          const entity: SiteDiaryEntryEntity = {
            ...item,
            id: `diary-${100 + i}`,
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          };
          await IdbAdapter.put<SiteDiaryEntryEntity>(IdbAdapter.STORES.SITE_DIARY_ENTRIES, entity);
        }
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn("Init Site Diary error:", e);
    }
  }

  public static async getAllEntries(): Promise<SiteDiaryEntryEntity[]> {
    await this.init();
    return IdbAdapter.getAll<SiteDiaryEntryEntity>(IdbAdapter.STORES.SITE_DIARY_ENTRIES);
  }

  public static async createEntry(
    data: Omit<SiteDiaryEntryEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ): Promise<SiteDiaryEntryEntity> {
    await this.init();
    const now = new Date().toISOString();
    const newEntity: SiteDiaryEntryEntity = {
      ...data,
      id: `diary-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };
    await IdbAdapter.put<SiteDiaryEntryEntity>(IdbAdapter.STORES.SITE_DIARY_ENTRIES, newEntity);
    return newEntity;
  }

  public static async signEntry(id: string, signerName: string): Promise<SiteDiaryEntryEntity> {
    await this.init();
    const all = await this.getAllEntries();
    const item = all.find((x) => x.id === id);
    if (!item) throw new Error("Entrée de journal non trouvée");
    const updated: SiteDiaryEntryEntity = {
      ...item,
      isSigned: true,
      signedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await IdbAdapter.put<SiteDiaryEntryEntity>(IdbAdapter.STORES.SITE_DIARY_ENTRIES, updated);
    return updated;
  }
}
