/**
 * AGB CHANTIER - Service de Génération et d'Impression des Rapports - AXE 19
 */

import { ReportConfig, ReportType } from "../domain/entities/report_entity";

export const AVAILABLE_REPORTS_TEMPLATES: ReportConfig[] = [
  {
    id: "rep-1",
    type: "RAPPORT_JOURNALIER_CHANTIER",
    title: "Rapport Quotidien de Chantier (Journal des Événements)",
    subtitle: "Synthèse officielle météo, effectifs, matériels, livraisons et travaux du jour",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    generatedDate: "2026-08-30",
    generatedBy: "Kouassi Jean-Marc (DT)",
    format: "PDF_A4",
    iconName: "BookOpen",
  },
  {
    id: "rep-2",
    type: "RAPPORT_HEBDOMADAIRE_AVANCEMENT",
    title: "Rapport Hebdomadaire d'Avancement des Travaux",
    subtitle: "Synthèse d'avancement physique par lot, jalons du planning et détection des écarts",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    generatedDate: "2026-08-29",
    generatedBy: "Direction de Projet AGB",
    format: "PDF_A4",
    iconName: "Calendar",
  },
  {
    id: "rep-3",
    type: "BILAN_FINANCIER_DEPENSES",
    title: "Bilan Financier & Analyse Budgétaire par Poste",
    subtitle: "Dépenses engagées, trésorerie de caisse et comparaison budget prévisionnel vs réel",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    generatedDate: "2026-08-30",
    generatedBy: "Comptabilité Chantier",
    format: "PDF_A4",
    iconName: "Coins",
  },
  {
    id: "rep-4",
    type: "RAPPORT_HSE_SECURITE",
    title: "Bilan Mensuel Hygiène, Sécurité & Environnement (HSE)",
    subtitle: "Taux de fréquence TF=0, registre des presqu'accidents et causeries 1/4h",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    generatedDate: "2026-08-30",
    generatedBy: "Coordinateur Sécurité HSE",
    format: "PDF_A4",
    iconName: "ShieldCheck",
  },
  {
    id: "rep-5",
    type: "PV_LEVEE_DE_RESERVES",
    title: "Procès-Verbal Officiel de Levée des Réserves (OPR)",
    subtitle: "Constat contradictoire des levées d'anomalies signé par la MOA, MOE et AGB",
    projectName: "Tour Résidentielle Ivoire - Cocody Riviera",
    generatedDate: "2026-08-30",
    generatedBy: "Conducteur Principal",
    format: "PDF_A4",
    iconName: "FileCheck",
  },
];

export class ReportService {
  public static triggerPrint(title: string, htmlContent: string) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - AGB CHANTIER</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #1e293b; }
            h1 { color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
            th { background: #f8fafc; font-weight: bold; }
            .header-box { background: #fff7ed; border: 1px solid #ffedd5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .badge { display: inline-block; padding: 4px 8px; font-weight: bold; font-size: 11px; border-radius: 4px; background: #ea580c; color: white; }
          </style>
        </head>
        <body>
          ${htmlContent}
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}
