/**
 * AGB CHANTIER - Entités et Modèles de Génération de Rapports PDF - AXE 19
 */

export type ReportType =
  | "RAPPORT_JOURNALIER_CHANTIER"
  | "RAPPORT_HEBDOMADAIRE_AVANCEMENT"
  | "BILAN_FINANCIER_DEPENSES"
  | "RAPPORT_HSE_SECURITE"
  | "PV_LEVEE_DE_RESERVES"
  | "FICHE_CONTROLE_QUALITE";

export interface ReportConfig {
  id: string;
  type: ReportType;
  title: string;
  subtitle: string;
  projectName: string;
  generatedDate: string;
  generatedBy: string;
  format: "PDF_A4" | "EXCEL_XLSX" | "PRINT_HTML";
  iconName: string;
}
