/**
 * AGB CHANTIER - Palette de couleurs professionnelle BTP
 * Conçue pour une visibilité optimale sur le terrain, en plein soleil et en bureau.
 */

export const BtpColors = {
  // Couleurs Principales Chantier
  primary: "#EA580C", // Orange Sécurité BTP (Signalétique, boutons principaux)
  primaryHover: "#C2410C",
  primaryLight: "#FFEDD5",
  
  secondary: "#0F172A", // Acier / Anthracite BTP (Structure, menus, contrastes forts)
  secondaryLight: "#334155",
  
  amber: "#D97706", // Ambre / Alerte Chantier
  amberLight: "#FEF3C7",

  architectBlue: "#2563EB", // Bleu Plan / Architecte
  architectBlueLight: "#DBEAFE",

  // Statuts de Chantier
  status: {
    preparation: "#64748B", // Ardoise / Préparation
    inProgress: "#2563EB", // Bleu / En cours
    suspended: "#EA580C", // Orange / Suspendu
    delayed: "#DC2626", // Rouge / En retard
    completed: "#16A34A", // Vert / Terminé
    archived: "#475569", // Gris / Archivé
  },

  // Sécurité & HSE
  hse: {
    safetyGreen: "#16A34A", // Zéro incident / Valide
    warningYellow: "#D97706", // Risque modéré / Attention
    incidentRed: "#DC2626", // Incident / Danger critique
    ppeViolet: "#7C3AED", // Port EPI obligatoire
  },

  // Neutres & Surfaces
  light: {
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceSecondary: "#F1F5F9",
    border: "#E2E8F0",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#64748B",
  },
  dark: {
    background: "#0B1120",
    surface: "#131D31",
    surfaceSecondary: "#1E293B",
    border: "#27354D",
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    textMuted: "#64748B",
  },
} as const;
