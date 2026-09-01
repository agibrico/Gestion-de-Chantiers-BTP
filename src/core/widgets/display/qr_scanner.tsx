import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Camera, XCircle } from "lucide-react";
import { AppButton } from "../buttons/app_button";

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  onClose: () => void;
  title?: string;
}

export const QrScanner: React.FC<QrScannerProps> = ({
  onScanSuccess,
  onScanError,
  onClose,
  title = "Scanner un QR Code BTP",
}) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Initialisation du scanner
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      /* verbose= */ false
    );

    scannerRef.current.render(
      (decodedText) => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(console.error);
        }
        onScanSuccess(decodedText);
      },
      (error) => {
        if (onScanError) onScanError(error);
      }
    );

    // Nettoyage lors du démontage
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50">
        <div className="p-4 bg-slate-800 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-sm tracking-tight uppercase">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <XCircle className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          <div
            id="qr-reader"
            className="w-full rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
          ></div>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Placez le QR code de l'élément (Matériau ou Engin) dans le cadre pour l'identifier automatiquement.
            </p>
            <div className="pt-2">
              <AppButton variant="outline" size="sm" onClick={onClose} fullWidth>
                Annuler le Scan
              </AppButton>
            </div>
          </div>
        </div>

        {/* Signature AGB */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-center">
          <div className="flex items-center gap-1.5 opacity-50">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
            <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">AGB CIRCUIT TECHNOLOGIQUE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
