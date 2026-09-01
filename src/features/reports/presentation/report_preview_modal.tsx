/**
 * AGB CHANTIER - Modal de Prévisualisation et d'Impression de Rapport - AXE 19
 */

import React from "react";
import { AppModal } from "../../../core/widgets/feedback/app_modal";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { ReportConfig } from "../domain/entities/report_entity";
import { Printer, Download, Share2, FileText, CheckCircle2 } from "lucide-react";

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportConfig | null;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({ isOpen, onClose, report }) => {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Prévisualisation : ${report.title}`}
      subtitle="Document certifié conforme prêt pour export PDF vectoriel A4 ou impression directe"
      icon={<FileText className="w-5 h-5 text-orange-600" />}
      size="xl"
    >
      <div className="space-y-6">
        {/* Top actions */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Format A4 Standard • En-tête officiel AGB BTP
          </div>
          <div className="flex items-center gap-2">
            <AppButton size="sm" variant="outline" leftIcon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
              Imprimer
            </AppButton>
            <AppButton size="sm" variant="primary" leftIcon={<Download className="w-4 h-4" />} onClick={handlePrint}>
              Télécharger PDF
            </AppButton>
          </div>
        </div>

        {/* Paper Sheet Preview */}
        <div className="bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-300 max-h-[60vh] overflow-y-auto font-sans space-y-6">
          {/* Official Letterhead */}
          <div className="flex justify-between items-start border-b-2 border-orange-600 pb-4">
            <div>
              <div className="text-2xl font-black tracking-tight text-slate-900">
                AGB <span className="text-orange-600">CHANTIER</span>
              </div>
              <div className="text-xs text-slate-500 font-medium">Entreprise Générale de Bâtiment & Travaux Publics</div>
              <div className="text-[11px] text-slate-400">Abidjan, Côte d'Ivoire • info@agb-btp.ci</div>
            </div>
            <div className="text-right text-xs space-y-1">
              <div className="font-bold text-slate-800 uppercase">{report.projectName}</div>
              <div className="font-mono text-slate-500">Date d'édition : {report.generatedDate}</div>
              <div className="text-orange-600 font-semibold">{report.type}</div>
            </div>
          </div>

          {/* Title Box */}
          <div className="bg-orange-50/60 p-4 rounded-lg border border-orange-100">
            <h2 className="text-lg font-bold text-slate-900">{report.title}</h2>
            <p className="text-xs text-slate-600 mt-1">{report.subtitle}</p>
          </div>

          {/* Sample Data Sections */}
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 border-b pb-1">
              1. Synthèse Générale & Indicateurs Clés
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded border">
                <div className="text-slate-400">Avancement Global</div>
                <div className="text-base font-bold text-slate-800 font-mono">68.4 %</div>
              </div>
              <div className="p-3 bg-slate-50 rounded border">
                <div className="text-slate-400">Effectif Présent</div>
                <div className="text-base font-bold text-emerald-600 font-mono">42 Ouvriers</div>
              </div>
              <div className="p-3 bg-slate-50 rounded border">
                <div className="text-slate-400">Sécurité HSE</div>
                <div className="text-base font-bold text-emerald-600 font-mono">TF = 0 (0 Arrêt)</div>
              </div>
            </div>

            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 border-b pb-1 pt-2">
              2. Travaux Réalisés par Corps d'État
            </h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-bold border-b">
                  <th className="p-2">Lot de Travaux</th>
                  <th className="p-2">Localisation</th>
                  <th className="p-2">Avancement</th>
                  <th className="p-2">Conformité</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                <tr>
                  <td className="p-2 font-medium">Gros Œuvre - Dalles & Voiles</td>
                  <td className="p-2">Niveau R+2 Zone B</td>
                  <td className="p-2 font-mono">92 %</td>
                  <td className="p-2 text-emerald-600 font-bold">Conforme BPE</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Plomberie & Évacuations</td>
                  <td className="p-2">Niveau R+1 Colonnes</td>
                  <td className="p-2 font-mono">75 %</td>
                  <td className="p-2 text-emerald-600 font-bold">Essais Réussis</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Électricité Courants Forts</td>
                  <td className="p-2">Niveau R+1 Tableaux</td>
                  <td className="p-2 font-mono">80 %</td>
                  <td className="p-2 text-emerald-600 font-bold">Validé SOCOTEC</td>
                </tr>
              </tbody>
            </table>

            {/* Signatures */}
            <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs">
              <div className="p-4 border rounded">
                <div className="font-bold text-slate-800">Le Conducteur de Travaux</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Amadou Touré (AGB)</div>
                <div className="mt-6 text-[10px] text-emerald-600 font-mono">Signé électroniquement</div>
              </div>
              <div className="p-4 border rounded">
                <div className="font-bold text-slate-800">Le Maître d'Œuvre (MOE)</div>
                <div className="text-slate-400 text-[11px] mt-0.5">ARCHI-DESIGN CI</div>
                <div className="mt-6 text-[10px] text-emerald-600 font-mono">Visa Bon pour Accord</div>
              </div>
              <div className="p-4 border rounded">
                <div className="font-bold text-slate-800">Le Contrôleur Technique</div>
                <div className="text-slate-400 text-[11px] mt-0.5">SOCOTEC Côte d'Ivoire</div>
                <div className="mt-6 text-[10px] text-emerald-600 font-mono">Approuvé sans réserve</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Close */}
        <div className="flex justify-end gap-3 pt-2">
          <AppButton variant="outline" onClick={onClose}>
            Fermer l'Aperçu
          </AppButton>
        </div>
      </div>
    </AppModal>
  );
};
