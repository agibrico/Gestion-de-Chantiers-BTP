/**
 * AGB CHANTIER - Entité Équipe de Chantier BTP - AXE 05
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";
import { WorkerTrade } from "./worker_entity";

export type TeamCategory =
  | "GROS_OEUVRE" // Fondations, Béton Armé, Voiles, Dalles
  | "FERRAILLAGE" // Façonnage et pose des armatures
  | "MACONNERIE_FINITIONS" // Maçonnerie agglos, briques, enduits
  | "ELECTRICITE_CFO_CFA" // Courant fort et faible
  | "PLOMBERIE_CVC" // Plomberie sanitaire, Climatisation
  | "VRD_TERRASSEMENT" // Voirie, Réseaux Divers, Assainissement
  | "ETANCHEITE_ISOLATION" // Toitures terrasses, cuvelages
  | "SECOND_OEUVRE_POLYVALENT"; // Cloisons, Peinture, Carrelage

export interface TeamEntity extends BaseEntity {
  id: string;
  code: string; // Ex: EQP-GO-01
  name: string; // Ex: Équipe Gros Œuvre Alpha
  category: TeamCategory;
  leaderId?: string; // Chef d'équipe référent
  leaderName: string;
  leaderPhone: string;
  assignedProjectId?: string; // Chantier actuel
  assignedProjectName?: string;
  memberCount: number;
  workerIds: string[];
  productivityScore: number; // 0 à 100%
  colorTag: string; // Pour les plannings
  notes?: string;
}
