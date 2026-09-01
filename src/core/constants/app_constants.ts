/**
 * AGB CHANTIER - Constantes Fondamentales de l'Application
 */

export const APP_NAME = "AGB CHANTIER";
export const APP_VERSION = "1.0.0";
export const APP_BUILD_NUMBER = "100";
export const APP_TAGLINE = "Gestion, Suivi & Pilotage de Chantiers BTP";

export const APP_CONFIG = {
  DB_NAME: "agb_chantier_db",
  DB_VERSION: 1,
  SYNC_INTERVAL_MS: 30000,
  AUTO_SAVE_DELAY_MS: 1500,
  MAX_PHOTO_SIZE_MB: 5,
  PAGINATION_DEFAULT_LIMIT: 20,
  CURRENCY_DEFAULT: "FCFA", // Default for West/Central African BTP or configurable (EUR, USD, etc.)
  DATE_FORMAT_DISPLAY: "DD/MM/YYYY",
  DATETIME_FORMAT_DISPLAY: "DD/MM/YYYY HH:mm",
} as const;

export const AXES_ROADMAP = [
  { id: 1, name: "Architecture & Design System", status: "VALIDATED" },
  { id: 2, name: "Authentification & Rôles", status: "VALIDATED" },
  { id: 3, name: "Clients & Maîtres d'Ouvrage", status: "VALIDATED" },
  { id: 4, name: "Gestion des Chantiers", status: "VALIDATED" },
  { id: 5, name: "Intervenants & Équipes", status: "VALIDATED" },
  { id: 6, name: "Planning & Diagramme de Gantt", status: "VALIDATED" },
  { id: 7, name: "Travaux, Tâches & Avancement", status: "VALIDATED" },
  { id: 8, name: "Pointage & Présences", status: "VALIDATED" },
  { id: 9, name: "Matériaux, Stocks & Inventaire", status: "VALIDATED" },
  { id: 10, name: "Fournisseurs & Commandes", status: "VALIDATED" },
  { id: 11, name: "Budget, Dépenses & Caisse", status: "IN_PROGRESS" },
  { id: 12, name: "Engins & Équipements", status: "PENDING" },
  { id: 13, name: "Journal de Chantier", status: "PENDING" },
  { id: 14, name: "Photos & Géolocalisation", status: "PENDING" },
  { id: 15, name: "Contrôle Qualité", status: "PENDING" },
  { id: 16, name: "HSE, Sécurité & EPI", status: "PENDING" },
  { id: 17, name: "Réserves & Non-Conformités", status: "PENDING" },
  { id: 18, name: "Documents, Plans & Contrats", status: "PENDING" },
  { id: 19, name: "Rapports & Génération PDF", status: "PENDING" },
  { id: 20, name: "Réception Provisoire & Définitive", status: "PENDING" },
  { id: 21, name: "QR Code & Identification", status: "VALIDATED" },
  { id: 22, name: "Notifications & Alertes", status: "PENDING" },
  { id: 23, name: "Tableau de Bord & Statistiques", status: "PENDING" },
  { id: 24, name: "Synchronisation Offline / Online", status: "PENDING" },
  { id: 25, name: "Assistant IA AGB Chantier", status: "PENDING" },
  { id: 26, name: "Journal d'Audit & Historique", status: "PENDING" },
  { id: 27, name: "Paramètres & Sauvegarde", status: "PENDING" },
  { id: 28, name: "Sécurisation & Optimisation", status: "PENDING" },
  { id: 29, name: "Tests Complets & Validation", status: "PENDING" },
  { id: 30, name: "Finalisation Android Studio / Release", status: "PENDING" },
] as const;
