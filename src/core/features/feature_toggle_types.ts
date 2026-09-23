/**
 * AGB CHANTIER - Système de Personnalisation Modulaire & Feature Toggling
 * Types et interfaces pour permettre aux utilisateurs de choisir les options
 * et fonctions qu'ils souhaitent voir apparaître dans leur application.
 */

export type FeatureCategory =
  | "operations" // Chantiers, planning, travaux, journal, photos
  | "human_resources" // Équipes, sous-traitants, pointage
  | "logistics" // Matériaux, stocks, engins, fournisseurs
  | "finance" // Budgets, facturation, clients, BI D3.js
  | "quality_safety" // Qualité, HSE, réserves, réceptions
  | "tools" // Documents, scanner QR, alertes, audit
  | "dashboard_widgets"; // Widgets spécifiques du tableau de bord

export interface FeatureDefinition {
  id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  categoryLabel: string;
  iconName: string;
  route?: string;
  axeNumber?: number;
  isCore?: boolean; // Fonctionnalité essentielle (ex: Projets/Chantiers)
  defaultEnabled: boolean;
  badge?: string;
}

export interface FeaturePreset {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  iconName: string;
  enabledFeatureIds: string[];
  color: string;
}

export interface UserFeaturePreferences {
  activePresetId: string;
  enabledFeatures: Record<string, boolean>;
  lastUpdated: string;
}
