/**
 * AGB CHANTIER - Système Dimensionnel & Grille Responsive
 */

export const Dimensions = {
  // Espacements BTP
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },

  // Rayons de courbure
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  // Hauteurs minimales pour manipulation aisée sur chantier (doigts gantés / terrain)
  touchTarget: {
    min: 44, // Minimum ergonomique terrain
    button: 48,
    input: 46,
    tab: 52,
  },

  // Breakpoints responsifs
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  },

  // Navigation
  headerHeight: 64,
  bottomBarHeight: 64,
  sidebarWidth: 260,
  sidebarCollapsedWidth: 72,
} as const;
