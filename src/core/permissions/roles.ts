/**
 * AGB CHANTIER - Définition des Rôles Métier BTP (RBAC)
 */

export enum UserRole {
  ADMINISTRATEUR = "ADMINISTRATEUR",
  MAITRE_D_OUVRAGE = "MAITRE_D_OUVRAGE",
  MAITRE_D_OEUVRE = "MAITRE_D_OEUVRE",
  ARCHITECTE = "ARCHITECTE",
  CONDUCTEUR_DE_TRAVAUX = "CONDUCTEUR_DE_TRAVAUX",
  CHEF_DE_CHANTIER = "CHEF_DE_CHANTIER",
  CHEF_D_EQUIPE = "CHEF_D_EQUIPE",
  OUVRIER = "OUVRIER",
  HSE = "HSE",
  GEOMETRE = "GEOMETRE",
  CONTROLEUR = "CONTROLEUR",
  FOURNISSEUR = "FOURNISSEUR",
  SOUS_TRAITANT = "SOUS_TRAITANT",
}

export interface RoleMetadata {
  id: UserRole;
  label: string;
  description: string;
  badgeColor: string;
  category: "DIRECTION" | "ENCADREMENT" | "TERRAIN" | "EXPERTISE" | "EXTERNE";
}

export const USER_ROLES_METADATA: Record<UserRole, RoleMetadata> = {
  [UserRole.ADMINISTRATEUR]: {
    id: UserRole.ADMINISTRATEUR,
    label: "Administrateur Général",
    description: "Accès total au système, gestion des utilisateurs, finances et configuration",
    badgeColor: "#DC2626",
    category: "DIRECTION",
  },
  [UserRole.MAITRE_D_OUVRAGE]: {
    id: UserRole.MAITRE_D_OUVRAGE,
    label: "Maître d'Ouvrage (Client / Promoteur)",
    description: "Consultation globale, validation des étapes, suivi budgétaire et réceptions",
    badgeColor: "#7C3AED",
    category: "DIRECTION",
  },
  [UserRole.MAITRE_D_OEUVRE]: {
    id: UserRole.MAITRE_D_OEUVRE,
    label: "Maître d'Œuvre / Ingénieur Conseil",
    description: "Direction technique, validation des avancements, visas techniques et PV",
    badgeColor: "#2563EB",
    category: "ENCADREMENT",
  },
  [UserRole.ARCHITECTE]: {
    id: UserRole.ARCHITECTE,
    label: "Architecte",
    description: "Gestion des plans, visas architecturaux, conformité esthétique et réserves",
    badgeColor: "#0284C7",
    category: "EXPERTISE",
  },
  [UserRole.CONDUCTEUR_DE_TRAVAUX]: {
    id: UserRole.CONDUCTEUR_DE_TRAVAUX,
    label: "Conducteur de Travaux",
    description: "Gestion multi-chantiers, plannings, budgets, approvisionnements et équipes",
    badgeColor: "#EA580C",
    category: "ENCADREMENT",
  },
  [UserRole.CHEF_DE_CHANTIER]: {
    id: UserRole.CHEF_DE_CHANTIER,
    label: "Chef de Chantier",
    description: "Pilotage quotidien terrain, journal de chantier, pointages et matériels",
    badgeColor: "#D97706",
    category: "TERRAIN",
  },
  [UserRole.CHEF_D_EQUIPE]: {
    id: UserRole.CHEF_D_EQUIPE,
    label: "Chef d'Équipe",
    description: "Suivi des tâches de son équipe, exécution des travaux et pointages directs",
    badgeColor: "#EAB308",
    category: "TERRAIN",
  },
  [UserRole.OUVRIER]: {
    id: UserRole.OUVRIER,
    label: "Ouvrier / Compagnon",
    description: "Consultation des tâches assignées, pointage présence et signalement terrain",
    badgeColor: "#64748B",
    category: "TERRAIN",
  },
  [UserRole.HSE]: {
    id: UserRole.HSE,
    label: "Responsable HSE / Sécurité",
    description: "Inspections sécurité, gestion des EPI, déclaration et suivi des incidents",
    badgeColor: "#16A34A",
    category: "EXPERTISE",
  },
  [UserRole.GEOMETRE]: {
    id: UserRole.GEOMETRE,
    label: "Géomètre / Topographe",
    description: "Implantations, relevés topographiques et métrés de terrain",
    badgeColor: "#0D9488",
    category: "EXPERTISE",
  },
  [UserRole.CONTROLEUR]: {
    id: UserRole.CONTROLEUR,
    label: "Contrôleur Technique / Qualité",
    description: "Contrôles qualité, essais béton/matériaux et levée des réserves",
    badgeColor: "#4F46E5",
    category: "EXPERTISE",
  },
  [UserRole.FOURNISSEUR]: {
    id: UserRole.FOURNISSEUR,
    label: "Fournisseur de Matériaux",
    description: "Suivi des bons de commande, bordereaux de livraison et factures",
    badgeColor: "#9333EA",
    category: "EXTERNE",
  },
  [UserRole.SOUS_TRAITANT]: {
    id: UserRole.SOUS_TRAITANT,
    label: "Sous-Traitant BTP",
    description: "Exécution de lots spécialisés, rapports d'avancement et états d'acompte",
    badgeColor: "#CA8A04",
    category: "EXTERNE",
  },
};
