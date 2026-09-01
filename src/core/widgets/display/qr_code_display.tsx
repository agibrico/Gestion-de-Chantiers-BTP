import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Printer, XCircle, Download } from "lucide-react";
import { AppButton } from "../buttons/app_button";
import { AppBadge } from "../badges/app_badge";

interface QrCodeDisplayProps {
  value: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
  type?: "MATERIAU" | "ENGIN" | "EMPLOYE";
}

export const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({
  value,
  title,
  subtitle,
  onClose,
  type = "MATERIAU",
}) => {
  const handlePrint = () => {
    window.print();
  };

  const getBadgeColor = () => {
    switch (type) {
      case "MATERIAU": return "info";
      case "ENGIN": return "warning";
      case "EMPLOYE": return "success";
      default: return "default";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0F172A] w-full max-w-sm rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 print:shadow-none print:border-none">

        {/* Header - Hidden on Print */}
        <div className="p-6 pb-0 flex items-center justify-between print:hidden">
          <AppBadge variant={getBadgeColor()} size="sm">
            Identification {type}
          </AppBadge>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
          >
            <XCircle className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content for Printing */}
        <div className="p-8 flex flex-col items-center text-center space-y-6">
          <div className="p-4 bg-white rounded-3xl shadow-inner border-2 border-slate-100 print:border-slate-300">
            <QRCodeSVG
              value={value}
              size={180}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/favicon.svg",
                x: undefined,
                y: undefined,
                height: 30,
                width: 30,
                excavate: true,
              }}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {title}
            </h3>
            <p className="font-mono text-sm font-bold text-orange-600">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>

          {/* Logo AGB Signature */}
          <div className="pt-4 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <span className="text-[10px] font-black text-slate-900 dark:text-white tracking-[0.2em] uppercase">AGB CHANTIER</span>
            </div>
            <span className="text-[8px] font-bold text-slate-400 uppercase">Circuit Technologique</span>
          </div>
        </div>

        {/* Footer Actions - Hidden on Print */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 print:hidden">
          <AppButton
            variant="outline"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Imprimer
          </AppButton>
          <AppButton
            variant="primary"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => {
              // Logic to download as image could be added here
              alert("Téléchargement de l'étiquette lancé...");
            }}
          >
            Télécharger
          </AppButton>
        </div>
      </div>

      {/* CSS for printing specific area */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}} />
    </div>
  );
};
