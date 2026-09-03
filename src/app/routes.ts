/**
 * AGB CHANTIER - Définition des Routes & Métadonnées de Navigation
 */

export const AppRoutes = {
  // Axe 01 : Socle & Showcase
  SPLASH: "/",
  OVERVIEW: "/overview",
  DESIGN_SYSTEM: "/design-system",

  // Axe 02 : Authentification
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
  AUTH_PROFILE: "/profile",

  // Navigation Principale
  DASHBOARD: "/dashboard",
  PROJECTS: "/projects",
  PROJECT_DETAIL: "/projects/:id",
  CLIENTS: "/clients",
  PLANNING: "/planning",
  TASKS: "/tasks",
  ATTENDANCE: "/attendance",
  INVENTORY: "/inventory",
  SUPPLIERS: "/suppliers",
  FINANCE: "/finance",
  EQUIPMENT: "/equipment",
  SITE_DIARY: "/site-diary",
  PHOTOS: "/photos",
  QUALITY: "/quality",
  HSE: "/hse",
  RESERVATIONS: "/reservations",
  DOCUMENTS: "/documents",
  REPORTS: "/reports",
  RECEPTION: "/reception",
  QR_SCANNER: "/qr-scanner",
  AI_ASSISTANT: "/ai-assistant",
  AUDIT: "/audit",
  SETTINGS: "/settings",
} as const;

export interface NavItem {
  key: string;
  label: string;
  route: string;
  iconName: string;
  requiredPermission?: string;
  badgeCount?: number;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { key: "overview", label: "Architecture", route: AppRoutes.OVERVIEW, iconName: "Layers" },
  { key: "design_system", label: "Design System", route: AppRoutes.DESIGN_SYSTEM, iconName: "Palette" },
  { key: "dashboard", label: "Chantiers", route: AppRoutes.PROJECTS, iconName: "HardHat" },
  { key: "planning", label: "Planning", route: AppRoutes.PLANNING, iconName: "Calendar" },
  { key: "finances", label: "Finances", route: AppRoutes.FINANCE, iconName: "Coins" },
];
