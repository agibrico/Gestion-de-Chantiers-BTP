/**
 * AGB CHANTIER - Écran des Rapports, PDF, Impression & Partage - AXE 19
 */

import React, { useState } from "react";
import {
  FileText,
  Printer,
  Download,
  Share2,
  Calendar,
  Layers,
  Coins,
  ShieldCheck,
  FileCheck,
  BookOpen,
  Search,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { ReportConfig } from "../domain/entities/report_entity";
import { AVAILABLE_REPORTS_TEMPLATES } from "../data/report_service";
import { ReportPreviewModal } from "./report_preview_modal";

export const ReportsManagementScreen: React.FC = () => {
  const [reports, setReports] = useState<ReportConfig[]>(AVAILABLE_REPORTS_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<ReportConfig | null>(null);

  const filteredReports = reports.filter((r) => {
    return (
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getReportIcon = (type: string) => {
    switch (type) {
      case "RAPPORT_JOURNALIER_CHANTIER":
        return <BookOpen className="w-5 h-5 text-orange-600" />;
      case "RAPPORT_HEBDOMADAIRE_AVANCEMENT":
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case "BILAN_FINANCIER_DEPENSES":
        return <Coins className="w-5 h-5 text-emerald-600" />;
      case "RAPPORT_HSE_SECURITE":
        return <ShieldCheck className="w-5 h-5 text-purple-600" />;
      case "PV_LEVEE_DE_RESERVES":
        return <FileCheck className="w-5 h-5 text-amber-600" />;
      default:
        return <FileText className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              AXE 19
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Rapports, PDF, Impression & Partage
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Génération instantanée de documents officiels A4, bilans périodiques, procès-verbaux et export PDF
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Modèles de Rapports Actifs"
          value="5 Formats"
          subValue="Conformes normes BTP"
          icon={<FileText className="w-6 h-6" />}
          iconColor="text-orange-600"
          badgeText="Standard A4"
          badgeVariant="neutral"
        />
        <StatCard
          label="Exports Mensuels"
          value="48 Éditions"
          subValue="PDF générés sans connexion"
          icon={<Download className="w-6 h-6" />}
          iconColor="text-emerald-600"
          badgeText="100% Vectoriel"
          badgeVariant="success"
        />
        <StatCard
          label="Signature Électronique"
          value="Intégrée"
          subValue="Conducteur, MOE & SOCOTEC"
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconColor="text-blue-600"
          badgeText="Sécurisé"
          badgeVariant="info"
        />
        <StatCard
          label="Partage Instantané"
          value="Actif"
          subValue="Email & Impression directe"
          icon={<Printer className="w-6 h-6" />}
          iconColor="text-purple-600"
          badgeText="Temps Réel"
          badgeVariant="info"
        />
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <AppTextField
            placeholder="Rechercher un modèle de rapport (Journalier, Hebdomadaire, HSE, Finances...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-orange-500/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {getReportIcon(report.type)}
                </div>
                <div>
                  <span className="font-mono text-[11px] font-bold text-orange-600 dark:text-orange-400">
                    {report.type}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">{report.title}</h3>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">{report.subtitle}</p>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs space-y-1 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                <div>Chantier : <strong>{report.projectName}</strong></div>
                <div>Édité par : <span>{report.generatedBy}</span></div>
                <div className="font-mono text-[11px] text-slate-400">Dernière génération : {report.generatedDate}</div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">Format A4 PDF</span>
              <AppButton
                size="sm"
                variant="primary"
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => setSelectedReport(report)}
              >
                Générer & Imprimer
              </AppButton>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ReportPreviewModal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
      />
    </div>
  );
};
