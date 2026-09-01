/**
 * AGB CHANTIER - Implémentation du Repository Réserves & OPR - AXE 17
 */

import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { ReservationEntity } from "../domain/entities/reservation_entity";

const INITIAL_RESERVATIONS_MOCK: Omit<ReservationEntity, "id" | "createdAt" | "updatedAt">[] = [
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    reservationNumber: "RES-2026-0081",
    title: "Défaut d'étanchéité sous bac à douche SDB Principale",
    lotName: "Plomberie & Sanitaire",
    location: "Bâtiment A - Appartement 102 - Salle de Bain",
    severity: "MAJEURE",
    status: "EN_COURS_TRAITEMENT",
    companyResponsible: "Ivoire Plomberie Pro SAS",
    description: "Joint silicone dégradé et pente d'évacuation insuffisante créant une stagnation d'eau.",
    reportedDate: "2026-08-25",
    deadlineDate: "2026-09-05",
    authorName: "Kouassi Jean-Marc (DT)",
  },
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    reservationNumber: "RES-2026-0082",
    title: "Raye sur châssis coulissant aluminium baie vitrée",
    lotName: "Menuiserie Aluminium & Vitrerie",
    location: "Bâtiment A - Appartement 201 - Séjour",
    severity: "MINEURE",
    status: "LEVEE_A_VERIFIER",
    companyResponsible: "AluTech Côte d'Ivoire",
    description: "Éraflure visible sur montant thermo-laqué gris anthracite.",
    reportedDate: "2026-08-26",
    deadlineDate: "2026-09-02",
    resolvedDate: "2026-08-30",
    authorName: "Architecte ARCHI-DESIGN",
    verifiedBy: "Conducteur Travaux AGB",
  },
  {
    projectId: "proj-001",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    reservationNumber: "RES-2026-0083",
    title: "Inversion neutre / phase sur prise cuisine",
    lotName: "Électricité & Courants Forts",
    location: "Bâtiment A - Appartement 304 - Cuisine",
    severity: "MAJEURE",
    status: "CLOTUREE_VALIDEE",
    companyResponsible: "Électro-Pro CI",
    description: "Câblage inversé détecté lors du testeur de polarité.",
    reportedDate: "2026-08-20",
    deadlineDate: "2026-08-22",
    resolvedDate: "2026-08-22",
    authorName: "Bureau SOCOTEC",
    verifiedBy: "Directeur Travaux AGB",
  },
];

export class ReservationRepositoryImpl {
  private static isInitialized = false;

  public static async init(): Promise<void> {
    if (this.isInitialized) return;
    try {
      const items = await IdbAdapter.getAll<ReservationEntity>(IdbAdapter.STORES.RESERVATIONS);
      if (items.length === 0) {
        const now = new Date().toISOString();
        for (let i = 0; i < INITIAL_RESERVATIONS_MOCK.length; i++) {
          const item = INITIAL_RESERVATIONS_MOCK[i];
          const entity: ReservationEntity = {
            ...item,
            id: `res-${100 + i}`,
            createdAt: now,
            updatedAt: now,
            syncStatus: "synced",
          };
          await IdbAdapter.put<ReservationEntity>(IdbAdapter.STORES.RESERVATIONS, entity);
        }
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn("Init Reservations error:", e);
    }
  }

  public static async getAllReservations(): Promise<ReservationEntity[]> {
    await this.init();
    return IdbAdapter.getAll<ReservationEntity>(IdbAdapter.STORES.RESERVATIONS);
  }

  public static async createReservation(
    data: Omit<ReservationEntity, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ): Promise<ReservationEntity> {
    await this.init();
    const now = new Date().toISOString();
    const newEntity: ReservationEntity = {
      ...data,
      id: `res-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      syncStatus: "local",
    };
    await IdbAdapter.put<ReservationEntity>(IdbAdapter.STORES.RESERVATIONS, newEntity);
    return newEntity;
  }

  public static async updateStatus(
    id: string,
    status: ReservationEntity["status"],
    verifierName?: string
  ): Promise<ReservationEntity> {
    await this.init();
    const all = await this.getAllReservations();
    const item = all.find((x) => x.id === id);
    if (!item) throw new Error("Réserve non trouvée");
    const updated: ReservationEntity = {
      ...item,
      status,
      resolvedDate: status === "CLOTUREE_VALIDEE" || status === "LEVEE_A_VERIFIER" ? new Date().toISOString().split("T")[0] : item.resolvedDate,
      verifiedBy: verifierName || item.verifiedBy,
      updatedAt: new Date().toISOString(),
    };
    await IdbAdapter.put<ReservationEntity>(IdbAdapter.STORES.RESERVATIONS, updated);
    return updated;
  }
}
