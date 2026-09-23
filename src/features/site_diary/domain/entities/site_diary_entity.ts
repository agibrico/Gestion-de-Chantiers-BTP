/**
 * AGB CHANTIER - Entités du Domaine Journal de Chantier - AXE 13
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type WeatherCondition = "ENSOLEILLE" | "NUAGEUX" | "PLUIE_LEGERE" | "ORAGE_INTEMPERIE" | "CANICULE";

export interface WorkLotReport {
  lotName: string; // Ex: Gros Œuvre, Ferraillage, Électricité CFO
  workDescription: string; // Tâches réalisées dans la journée
  workersCount: number;
  progressNotes?: string;
}

export interface VisitorLog {
  visitorName: string;
  organization: string; // SOCOTEC, LBTP, Architecte DPLG, Maître d'ouvrage...
  purpose: string; // Visite hebdomadaire, contrôle armatures, PV arrêt...
  arrivalTime: string;
}

export interface SiteDiaryEntryEntity extends BaseEntity {
  projectId: string;
  projectName: string;
  date: string; // YYYY-MM-DD
  entryNumber: number; // Numéro séquentiel (ex: Journal N° 84)
  weatherMorning: WeatherCondition;
  weatherAfternoon: WeatherCondition;
  temperatureCelsius: number;
  totalWorkersOnSite: number; // Somme AGB + Sous-traitants
  hoursWorkedStandard: number;
  hoursWorkedOvertime: number;
  workReports: WorkLotReport[];
  materialDeliveries: string[]; // Ex: 20t Ciment CPJ 42.5, 12m3 Sable lagunaire
  visitors: VisitorLog[];
  incidentsOrDelays?: string; // Aléas, coupure courant, intempéries...
  authorName: string; // Conducteur de travaux
  authorRole: string;
  isSigned: boolean;
  signedAt?: string;
}
