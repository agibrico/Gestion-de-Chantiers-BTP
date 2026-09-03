/**
 * AGB CHANTIER - Implémentation du Repository Engins & Matériels - AXE 12
 */

import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { EquipmentEntity, MaintenanceLog } from "../domain/entities/equipment_entity";

const INITIAL_EQUIPMENT_MOCK: Omit<EquipmentEntity, "id" | "createdAt" | "updatedAt">[] = [
  {
    code: "ENG-PELLE-01",
    name: "Pelle Hydraulique sur Chenilles 22T",
    category: "TERRASSEMENT",
    brand: "Caterpillar",
    model: "CAT 320D3",
    serialNumber: "CAT320D3-CI-2023",
    status: "EN_SERVICE_CHANTIER",
    currentProjectId: "proj-001",
    currentProjectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    assignedOperator: "Koffi N'Guessan (Machiniste Agréé)",
    fuelType: "DIESEL",
    hourMeterCurrent: 2450,
    fuelConsumptionAvgLitrePerHour: 18.5,
    lastMaintenanceDate: "2026-08-10",
    nextMaintenanceHourMeter: 2600,
    dailyCostRateFCFA: 185000,
    maintenanceHistory: [
      {
        id: "maint-1",
        date: "2026-08-10",
        type: "VIDANGE_FILTRES",
        description: "Vidange moteur 15W40, remplacement filtre huile, gazole et air",
        costFCFA: 220000,
        mechanic: "Atelier Central AGB Vridi",
        hourMeter: 2350,
      },
    ],
  },
  {
    code: "ENG-GRUE-02",
    name: "Grue à Tour Topless 50m / 5 Tonnes",
    category: "LEVAGE_MANUTENTION",
    brand: "Potain",
    model: "MDT 178",
    serialNumber: "POTAIN-MDT178-994",
    status: "EN_SERVICE_CHANTIER",
    currentProjectId: "proj-001",
    currentProjectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    assignedOperator: "Konan Yao (Grutier Certifié)",
    fuelType: "ELECTRIQUE",
    hourMeterCurrent: 1840,
    fuelConsumptionAvgLitrePerHour: 0,
    lastMaintenanceDate: "2026-08-01",
    nextMaintenanceHourMeter: 2000,
    dailyCostRateFCFA: 150000,
    maintenanceHistory: [
      {
        id: "maint-2",
        date: "2026-08-01",
        type: "VISITE_TECHNIQUE",
        description: "Contrôle périodique câbles de levage et anémomètre par SOCOTEC",
        costFCFA: 350000,
        mechanic: "SOCOTEC Côte d'Ivoire",
        hourMeter: 1750,
      },
    ],
  },
  {
    code: "ENG-GROUPE-01",
    name: "Groupe Électrogène Insonorisé 150 kVA",
    category: "ENERGIE_COMPRESSEUR",
    brand: "SDMO",
    model: "J150K",
    serialNumber: "SDMO-J150-5542",
    status: "EN_SERVICE_CHANTIER",
    currentProjectId: "proj-001",
    currentProjectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    assignedOperator: "Équipe Énergie Chantier",
    fuelType: "DIESEL",
    hourMeterCurrent: 3120,
    fuelConsumptionAvgLitrePerHour: 22.0,
    lastMaintenanceDate: "2026-08-15",
    nextMaintenanceHourMeter: 3300,
    dailyCostRateFCFA: 65000,
    maintenanceHistory: [],
  },
  {
    code: "ENG-BETON-03",
    name: "Bétonnière Autochargeuse 800 Litres",
    category: "BETON_MALAXAGE",
    brand: "Dieci",
    model: "L4700",
    serialNumber: "DIECI-L4700-112",
    status: "EN_PANNE",
    currentProjectId: "proj-002",
    currentProjectName: "Complexe Commercial & Bureaux - Plateau",
    assignedOperator: "Bamba Souleymane",
    fuelType: "DIESEL",
    hourMeterCurrent: 1980,
    fuelConsumptionAvgLitrePerHour: 12.0,
    lastMaintenanceDate: "2026-07-20",
    nextMaintenanceHourMeter: 2000,
    dailyCostRateFCFA: 95000,
    maintenanceHistory: [
      {
        id: "maint-3",
        date: "2026-08-30",
        type: "CURATIF",
        description: "Fuite flexible hydraulique vérin de cuve malaxeuse",
        costFCFA: 85000,
        mechanic: "Mécano Mobile Soro",
        hourMeter: 1980,
      },
    ],
  },
  {
    code: "ENG-COMPACT-01",
    name: "Compacteur Tandem Vibrant 3.5T",
    category: "COMPACTAGE_ROUTIER",
    brand: "Hamm",
    model: "HD 12 VV",
    serialNumber: "HAMM-HD12-772",
    status: "DISPONIBLE_PARC",
    fuelType: "DIESEL",
    hourMeterCurrent: 890,
    fuelConsumptionAvgLitrePerHour: 7.5,
    lastMaintenanceDate: "2026-08-20",
    nextMaintenanceHourMeter: 1100,
    dailyCostRateFCFA: 75000,
    maintenanceHistory: [],
  },
];

export class EquipmentRepositoryImpl {
  private static isInitialized = false;

  public static async init(): Promise<void> {
    if (this.isInitialized) return;
    try {
      const items = await IdbAdapter.getAll<EquipmentEntity>(IdbAdapter.STORES.EQUIPMENTS);
      if (items.length === 0) {
        const now = new Date().toISOString();
        for (let i = 0; i < INITIAL_EQUIPMENT_MOCK.length; i++) {
          const item = INITIAL_EQUIPMENT_MOCK[i];
          const entity: EquipmentEntity = {
            ...item,
            id: `eq-${100 + i}`,
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          };
          await IdbAdapter.put<EquipmentEntity>(IdbAdapter.STORES.EQUIPMENTS, entity);
        }
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn("Init Equipments error:", e);
    }
  }

  public static async getAllEquipment(): Promise<EquipmentEntity[]> {
    await this.init();
    return IdbAdapter.getAll<EquipmentEntity>(IdbAdapter.STORES.EQUIPMENTS);
  }

  public static async createEquipment(
    data: Omit<EquipmentEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ): Promise<EquipmentEntity> {
    await this.init();
    const now = new Date().toISOString();
    const newEntity: EquipmentEntity = {
      ...data,
      id: `eq-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };
    await IdbAdapter.put<EquipmentEntity>(IdbAdapter.STORES.EQUIPMENTS, newEntity);
    return newEntity;
  }

  public static async updateEquipmentStatus(
    id: string,
    status: EquipmentEntity["status"],
    projectId?: string,
    projectName?: string
  ): Promise<EquipmentEntity> {
    await this.init();
    const all = await this.getAllEquipment();
    const item = all.find((x) => x.id === id);
    if (!item) throw new Error("Engin non trouvé");
    const updated: EquipmentEntity = {
      ...item,
      status,
      currentProjectId: projectId !== undefined ? projectId : item.currentProjectId,
      currentProjectName: projectName !== undefined ? projectName : item.currentProjectName,
      updatedAt: new Date().toISOString(),
    };
    await IdbAdapter.put<EquipmentEntity>(IdbAdapter.STORES.EQUIPMENTS, updated);
    return updated;
  }

  public static async addMaintenanceRecord(id: string, log: Omit<MaintenanceLog, "id">): Promise<EquipmentEntity> {
    await this.init();
    const all = await this.getAllEquipment();
    const item = all.find((x) => x.id === id);
    if (!item) throw new Error("Engin non trouvé");
    const newLog: MaintenanceLog = {
      ...log,
      id: `maint-${Date.now()}`,
    };
    const updated: EquipmentEntity = {
      ...item,
      lastMaintenanceDate: log.date,
      maintenanceHistory: [newLog, ...item.maintenanceHistory],
      updatedAt: new Date().toISOString(),
    };
    await IdbAdapter.put<EquipmentEntity>(IdbAdapter.STORES.EQUIPMENTS, updated);
    return updated;
  }
}
