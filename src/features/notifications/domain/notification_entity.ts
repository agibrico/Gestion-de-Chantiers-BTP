/**
 * AGB CHANTIER - Entité Notification & Alertes Visuelles Terrain - AXE 22
 */

import { BaseEntity } from "../../../core/storage/idb_adapter";

export type AlertSeverity = "CRITIQUE" | "MAJEURE" | "AVERTISSEMENT" | "INFO";

export type AlertCategory =
  | "ACCIDENT_TERRAIN" // Accident corporel, arrêt de travail, chute
  | "NON_CONFORMITE_MAJEURE" // Arrêt de coulage, ferraillage non conforme, béton rejeté
  | "RESERVE_BLOQUANTE" // Réserve OPR bloquant la livraison
  | "SECURITE_EPI" // Non-respect grave consignes sécurité / absence harnais
  | "TECHNIQUE_ENGIN" // Panne majeure grue / risque basculement
  | "DOCUMENT_URGENT"; // Plan EXE rejeté par le Bureau de Contrôle

export interface AlertNotificationEntity {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  projectId: string;
  projectName: string;
  locationDetails: string;
  reportedBy: string;
  reportedAt: string; // ISO string
  isRead: boolean;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  targetRoute: string; // Route vers laquelle naviguer (ex: /hse, /quality, /reservations)
  actionLabel?: string;
  audioAlertPlayed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
