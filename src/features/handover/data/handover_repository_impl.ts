/**
 * AGB CHANTIER - Implémentation du Repository Réception Provisoire & Définitive - AXE 20
 */

import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { HandoverPVEntity } from "../domain/entities/handover_entity";

const INITIAL_HANDOVERS_MOCK: Omit<HandoverPVEntity, "id" | "createdAt" | "updatedAt">[] = [
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    pvNumber: "PV-REC-PROV-2026-01",
    handoverType: "RECEPTION_PROVISOIRE_AVEC_RESERVES",
    title: "Procès-Verbal de Réception Provisoire - Bâtiment Principal R+5",
    visitDate: "2026-08-28",
    effectiveDate: "2026-09-01",
    warrantyEndDate: "2027-09-01", // GPA 1 an
    verdict: "PRONONCEE_AVEC_RESERVES",
    totalReservationsCount: 12,
    resolvedReservationsCount: 8,
    retentionGuaranteePercent: 5,
    retentionAmountFCFA: 42500000,
    isFinalReleaseGranted: false,
    signatories: [
      { role: "MAITRE_OUVRAGE_MOA", name: "Koffi N'Guessan", organization: "SCI Ivoire Prestige", isSigned: true, signedDate: "2026-08-28" },
      { role: "MAITRE_OEUVRE_MOE", name: "Archi. Sylla Ibrahim", organization: "ARCHI-DESIGN CI", isSigned: true, signedDate: "2026-08-28" },
      { role: "ENTREPRISE_AGB", name: "Kouassi Jean-Marc", organization: "AGB BTP Côte d'Ivoire", isSigned: true, signedDate: "2026-08-28" },
      { role: "CONTROLEUR_TECHNIQUE", name: "M. Kouamé Sylvain", organization: "SOCOTEC CI", isSigned: true, signedDate: "2026-08-28" },
    ],
    observationsMOA: "Réception prononcée sous condition expresse de levée de l'ensemble des réserves annexées sous 30 jours calendaires.",
    observationsMOE: "Ouvrage conforme au permis de construire et aux règles de l'art.",
    observationsAGB: "Prise en compte des 4 dernières réserves de finitions peinture, intervention programmée le 02/09/2026.",
  },
  {
    projectId: "proj-002",
    projectName: "Complexe Commercial & Bureaux - Plateau",
    pvNumber: "PV-REC-DEF-2026-02",
    handoverType: "RECEPTION_DEFINITIVE_FIN_GPA",
    title: "Procès-Verbal de Réception Définitive & Clôture GPA",
    visitDate: "2026-08-15",
    effectiveDate: "2026-08-15",
    warrantyEndDate: "2026-08-15",
    verdict: "LEVEE_TOTALE_GPA_VALIDEE",
    totalReservationsCount: 18,
    resolvedReservationsCount: 18,
    retentionGuaranteePercent: 5,
    retentionAmountFCFA: 65000000,
    isFinalReleaseGranted: true,
    signatories: [
      { role: "MAITRE_OUVRAGE_MOA", name: "Directeur Général Immo", organization: "Plateau Plaza SA", isSigned: true, signedDate: "2026-08-15" },
      { role: "MAITRE_OEUVRE_MOE", name: "Ing. Coulibaly", organization: "BUREAU D'ETUDES BET", isSigned: true, signedDate: "2026-08-15" },
      { role: "ENTREPRISE_AGB", name: "Kouassi Jean-Marc", organization: "AGB BTP Côte d'Ivoire", isSigned: true, signedDate: "2026-08-15" },
    ],
    observationsMOA: "Mainlevée intégrale de la caution bancaire de bonne fin accordée à l'entreprise AGB BTP.",
  },
];

export class HandoverRepositoryImpl {
  private static isInitialized = false;

  public static async init(): Promise<void> {
    if (this.isInitialized) return;
    try {
      const items = await IdbAdapter.getAll<HandoverPVEntity>(IdbAdapter.STORES.HANDOVERS);
      if (items.length === 0) {
        const now = new Date().toISOString();
        for (let i = 0; i < INITIAL_HANDOVERS_MOCK.length; i++) {
          const item = INITIAL_HANDOVERS_MOCK[i];
          const entity: HandoverPVEntity = {
            ...item,
            id: `handover-${100 + i}`,
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          };
          await IdbAdapter.put<HandoverPVEntity>(IdbAdapter.STORES.HANDOVERS, entity);
        }
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn("Init Handovers error:", e);
    }
  }

  public static async getAllHandovers(): Promise<HandoverPVEntity[]> {
    await this.init();
    return IdbAdapter.getAll<HandoverPVEntity>(IdbAdapter.STORES.HANDOVERS);
  }

  public static async createHandover(
    data: Omit<HandoverPVEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ): Promise<HandoverPVEntity> {
    await this.init();
    const now = new Date().toISOString();
    const newEntity: HandoverPVEntity = {
      ...data,
      id: `handover-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };
    await IdbAdapter.put<HandoverPVEntity>(IdbAdapter.STORES.HANDOVERS, newEntity);
    return newEntity;
  }
}
