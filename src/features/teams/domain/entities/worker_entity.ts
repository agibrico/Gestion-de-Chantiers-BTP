/**
 * AGB CHANTIER - Entité Compagnon & Ouvrier de Chantier BTP - AXE 05
 */

import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type WorkerTrade =
  | "MACON" // Maçon Finisseur / Coffreur
  | "COFFREUR_BANCHEUR" // Coffreur Bancheur Spécialisé
  | "FERRAILLEUR" // Ferrailleur / Façonnier d'aciers
  | "GRUTIER" // Grutier / Conducteur d'Engin Lourd
  | "CONDUCTEUR_ENGIN" // Conducteur Pelle / Niveleuse / Tractopelle
  | "ELECTRICIEN" // Électricien Bâtiment & Courants Forts/Faibles
  | "PLOMBIER_CHAUFFAGISTE" // Plombier / Installateur Sanitaire
  | "PEINTRE_APPLICATEUR" // Peintre / Applicateur d'enduits
  | "CARRELEUR" // Poseur Carrelage & Faïence
  | "ETANCHEUR" // Poseur Étanchéité Toitures & Terrasses
  | "MANOEUVRE_SPECIALISE" // Manœuvre Gros Œuvre / Polyvalent
  | "CHEF_EQUIPE_TERRAIN" // Chef d'Équipe de Terrain
  | "AGENT_SECURITE_HSE"; // Homme de Trafic / Gardien / Assistant HSE

export type WorkerContractType = "CDI" | "CDD" | "JOURNALIER_TACHERON" | "INTERIMAIRE" | "SOUS_TRAITANT";

export type WorkerStatus = "SUR_CHANTIER" | "DISPONIBLE" | "EN_CONGE" | "ARRET_MALADIE" | "INDISPONIBLE";

export interface WorkerCertification {
  id: string;
  name: string; // Ex: CACES R487 Grue, Habilitation Électrique B2V, Travail en Hauteur, SST
  issuer: string;
  obtainedDate: string;
  expiryDate: string;
  isValid: boolean;
}

export interface WorkerEntity extends BaseEntity {
  id: string;
  registrationNumber: string; // Matricule Ex: OUV-2026-084
  firstName: string;
  lastName: string;
  photoUrl?: string;
  trade: WorkerTrade;
  tradeLevel: string; // Ex: N3P2 (Compagnon Professionnel), N2, N4P1 (Maître Ouvrier)
  contractType: WorkerContractType;
  status: WorkerStatus;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  birthDate?: string;
  nationality: string;
  nationalIdNumber?: string; // CNI / Carte de Séjour
  dailyRateFCFA: number; // Taux journalier ou base salaire
  monthlySalaryFCFA?: number;
  currentProjectId?: string; // ID Chantier d'affectation
  currentProjectName?: string;
  currentTeamId?: string; // ID Équipe d'affectation
  currentTeamName?: string;
  medicalCheckupExpiryDate?: string; // Visite médicale d'aptitude BTP
  certifications: WorkerCertification[];
  bloodGroup?: string;
  ppeDelivered: boolean; // EPI Fournis (Casque, Chaussures S3, Gilet HV, Gants, Lunettes)
  notes?: string;
}
