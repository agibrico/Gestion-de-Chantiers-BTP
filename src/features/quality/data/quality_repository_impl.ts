/**
 * AGB CHANTIER - Implémentation du Repository Contrôle Qualité - AXE 15
 */

import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { QualityInspectionEntity } from "../domain/entities/quality_entity";

const INITIAL_QUALITY_MOCK: Omit<QualityInspectionEntity, "id" | "createdAt" | "updatedAt">[] = [
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    inspectionNumber: "CQ-2026-0038",
    inspectionType: "COULAGE_BETON_EPROUVETTES",
    title: "Essais d'Écrasement Béton C25/30 - Dalle R+1",
    locationDetails: "Dalle Plancher Haut R+1 - Zone Centrale",
    inspectorName: "Ing. Diallo Mamadou",
    inspectorOrganization: "Laboratoire du Bâtiment et des Travaux Publics (LBTP CI)",
    inspectionDate: "2026-08-25",
    status: "CONFORME",
    criteriaChecked: [
      { criterionName: "Affaissement au cône d'Abrams (Slump Test S3 10-15cm)", isOk: true, remarks: "Mesuré à 13.5 cm - Très bonne ouvrabilité" },
      { criterionName: "Température du béton frais à la livraison (< 32°C)", isOk: true, remarks: "Relevé à 28.5°C" },
      { criterionName: "Vibration et serrage à l'aiguille vibrante", isOk: true },
    ],
    concreteTests: [
      { sampleNumber: "EP-R1-01", crushAgeDays: 7, targetStrengthMPa: 17.5, measuredStrengthMPa: 21.2, isCompliant: true },
      { sampleNumber: "EP-R1-02", crushAgeDays: 7, targetStrengthMPa: 17.5, measuredStrengthMPa: 20.8, isCompliant: true },
      { sampleNumber: "EP-R1-03", crushAgeDays: 28, targetStrengthMPa: 25.0, measuredStrengthMPa: 29.4, isCompliant: true },
      { sampleNumber: "EP-R1-04", crushAgeDays: 28, targetStrengthMPa: 25.0, measuredStrengthMPa: 30.1, isCompliant: true },
    ],
    observations: "Résistance caractéristique à 28 jours supérieure à la valeur contractuelle fc28 = 25 MPa. Autorisation de décoffrage total accordée.",
  },
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    inspectionNumber: "CQ-2026-0039",
    inspectionType: "ARMATURES_FERRAILLAGE",
    title: "Ferraillage Poteaux et Voiles P1-P8 Niveau R+2",
    locationDetails: "Bâtiment Principal - File B-C",
    inspectorName: "M. Kouamé Sylvain",
    inspectorOrganization: "SOCOTEC Côte d'Ivoire",
    inspectionDate: "2026-08-29",
    status: "CONFORME",
    criteriaChecked: [
      { criterionName: "Respect des diamètres et nuances d'aciers (FeE500 HA12/HA16)", isOk: true },
      { criterionName: "Espacement des étriers en zone critique (10 cm) et zone courante (15 cm)", isOk: true },
      { criterionName: "Enrobage minimal de 3 cm (cales à béton posées)", isOk: true },
      { criterionName: "Longueur de recouvrement des barres (40 à 50 diamètres)", isOk: true },
    ],
    observations: "Ferraillage conforme au plan d'exécution BA-EXE-04 Indice B. Autorisation de coulage validée.",
  },
  {
    projectId: "proj-002",
    projectName: "Complexe Commercial & Bureaux - Plateau",
    inspectionNumber: "CQ-2026-0040",
    inspectionType: "ETANCHEITE_TERRASSE",
    title: "Test de mise en eau étanchéité toiture terrasse",
    locationDetails: "Toiture Terrasse Bâtiment Bureaux",
    inspectorName: "Kouassi Jean-Marc",
    inspectorOrganization: "AGB BTP - Contrôle Interne",
    inspectionDate: "2026-08-28",
    status: "AVEC_RESERVES",
    criteriaChecked: [
      { criterionName: "Relevés d'étanchéité bitumineuse SBS hauteur minimale 15cm", isOk: true },
      { criterionName: "Test d'inondation 48h sans baisse anormale de niveau", isOk: false, remarks: "Micro-suintement détecté près de l'évacuation EP Nord" },
    ],
    observations: "Reprise locale de la flamme et du solin nécessaire sur l'évacuation EP N°2 avant validation finale.",
    actionRequiredIfNonCompliant: "Reprise par l'applicateur étanchéité sous 48h.",
  },
];

export class QualityRepositoryImpl {
  private static isInitialized = false;

  public static async init(): Promise<void> {
    if (this.isInitialized) return;
    try {
      const items = await IdbAdapter.getAll<QualityInspectionEntity>(IdbAdapter.STORES.QUALITY_INSPECTIONS);
      if (items.length === 0) {
        const now = new Date().toISOString();
        for (let i = 0; i < INITIAL_QUALITY_MOCK.length; i++) {
          const item = INITIAL_QUALITY_MOCK[i];
          const entity: QualityInspectionEntity = {
            ...item,
            id: `cq-${100 + i}`,
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          };
          await IdbAdapter.put<QualityInspectionEntity>(IdbAdapter.STORES.QUALITY_INSPECTIONS, entity);
        }
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn("Init Quality error:", e);
    }
  }

  public static async getAllInspections(): Promise<QualityInspectionEntity[]> {
    await this.init();
    return IdbAdapter.getAll<QualityInspectionEntity>(IdbAdapter.STORES.QUALITY_INSPECTIONS);
  }

  public static async createInspection(
    data: Omit<QualityInspectionEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ): Promise<QualityInspectionEntity> {
    await this.init();
    const now = new Date().toISOString();
    const newEntity: QualityInspectionEntity = {
      ...data,
      id: `cq-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };
    await IdbAdapter.put<QualityInspectionEntity>(IdbAdapter.STORES.QUALITY_INSPECTIONS, newEntity);
    return newEntity;
  }
}
