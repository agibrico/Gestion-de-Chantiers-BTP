/**
 * AGB CHANTIER - Composant de Signature Manuscrite Tactile (Touchscreen Signature Pad)
 * Conforme BTP : capture de tracé haute fidélité, signature électronique horodatée
 */

import React, { useRef, useState, useEffect, useCallback } from "react";
import { RotateCcw, Trash2, Check, PenTool, ShieldCheck, Clock, User, Building } from "lucide-react";
import { AppButton } from "../buttons/app_button";
import { AppTextField } from "./app_text_field";
import { AppSelect } from "./app_select";

export interface SignatureData {
  signatureDataUrl: string; // Base64 PNG
  signatoryName: string;
  signatoryRole: string;
  signatoryCompany?: string;
  timestamp: string;
  documentRef?: string;
}

interface AppSignaturePadProps {
  documentTitle?: string;
  documentRef?: string;
  defaultSignatoryName?: string;
  defaultSignatoryRole?: string;
  defaultSignatoryCompany?: string;
  rolesOptions?: string[];
  onSaveSignature: (data: SignatureData) => void;
  onCancel?: () => void;
}

const DEFAULT_ROLES = [
  "Conducteur de Travaux Principal",
  "Chef de Chantier",
  "Chauffeur Livreur Fournisseur",
  "Magasinier Chantier",
  "Maître d'Œuvre (Architecte / BET)",
  "Contrôleur Technique (SOCOTEC / Veritas)",
  "Client / Maître d'Ouvrage (MOA)",
  "Sous-traitant Titulaire de Lot",
];

export const AppSignaturePad: React.FC<AppSignaturePadProps> = ({
  documentTitle = "Validation de Document Chantier",
  documentRef = "REF-" + new Date().getFullYear() + "-DOC",
  defaultSignatoryName = "",
  defaultSignatoryRole = "Conducteur de Travaux Principal",
  defaultSignatoryCompany = "AGB Construction & BTP",
  rolesOptions = DEFAULT_ROLES,
  onSaveSignature,
  onCancel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [penColor, setPenColor] = useState<string>("#1e3a8a"); // Bleu officiel BTP
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);

  // Metadata
  const [signatoryName, setSignatoryName] = useState(defaultSignatoryName);
  const [signatoryRole, setSignatoryRole] = useState(defaultSignatoryRole);
  const [signatoryCompany, setSignatoryCompany] = useState(defaultSignatoryCompany);
  const [timestamp] = useState(() => {
    const now = new Date();
    return (
      now.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
      " à " +
      now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    );
  });

  // Setup canvas with correct pixel ratio
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set display size
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = penColor;

    // Clear background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, [penColor]);

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initCanvas]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokeHistory((prev) => [...prev.slice(-10), imgData]);
  };

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    saveState();
    setIsDrawing(true);
    setHasSignature(true);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.5;
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHasSignature(false);
    setStrokeHistory([]);
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || strokeHistory.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lastState = strokeHistory[strokeHistory.length - 1];
    ctx.putImageData(lastState, 0, 0);
    setStrokeHistory((prev) => prev.slice(0, -1));
    if (strokeHistory.length <= 1) {
      setHasSignature(false);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    const dataUrl = canvas.toDataURL("image/png");
    onSaveSignature({
      signatureDataUrl: dataUrl,
      signatoryName: signatoryName.trim() || "Signataire non identifié",
      signatoryRole,
      signatoryCompany: signatoryCompany.trim() || "Entreprise non renseignée",
      timestamp,
      documentRef,
    });
  };

  return (
    <div className="space-y-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl mx-auto">
      {/* Document Reference Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-500/15 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">
              Écran Tactile Certifié
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">{documentRef}</span>
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
            {documentTitle}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <Clock className="w-3.5 h-3.5 text-orange-600" />
          <span>{timestamp}</span>
        </div>
      </div>

      {/* Signatory Details Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <AppTextField
          label="Nom & Prénom du Signataire"
          value={signatoryName}
          onChange={(e) => setSignatoryName(e.target.value)}
          placeholder="Ex: Kouamé Patrick"
          leftIcon={<User className="w-4 h-4 text-slate-400" />}
          required
        />

        <AppSelect
          label="Qualité / Rôle de l'Intervenant"
          value={signatoryRole}
          onChange={(e) => setSignatoryRole(e.target.value)}
          options={rolesOptions.map((r) => ({ value: r, label: r }))}
        />

        <div className="sm:col-span-2">
          <AppTextField
            label="Entreprise / Entité Représentée"
            value={signatoryCompany}
            onChange={(e) => setSignatoryCompany(e.target.value)}
            placeholder="Ex: AGB BTP, Lafarge Béton, SOCOTEC..."
            leftIcon={<Building className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Signature Canvas Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <PenTool className="w-3.5 h-3.5 text-orange-600" />
            Signature manuscrite au doigt ou au stylet :
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Couleur d'encre :</span>
            <button
              type="button"
              onClick={() => setPenColor("#1e3a8a")}
              className={`w-5 h-5 rounded-full bg-blue-900 border-2 cursor-pointer ${
                penColor === "#1e3a8a" ? "ring-2 ring-orange-500 scale-110 border-white" : "border-transparent"
              }`}
              title="Encre Bleue Officielle BTP"
            />
            <button
              type="button"
              onClick={() => setPenColor("#0f172a")}
              className={`w-5 h-5 rounded-full bg-slate-900 border-2 cursor-pointer ${
                penColor === "#0f172a" ? "ring-2 ring-orange-500 scale-110 border-white" : "border-transparent"
              }`}
              title="Encre Noire"
            />
            <button
              type="button"
              onClick={() => setPenColor("#047857")}
              className={`w-5 h-5 rounded-full bg-emerald-700 border-2 cursor-pointer ${
                penColor === "#047857" ? "ring-2 ring-orange-500 scale-110 border-white" : "border-transparent"
              }`}
              title="Encre Verte Visa"
            />
          </div>
        </div>

        {/* Touch Drawing Area */}
        <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white shadow-inner select-none touch-none">
          <canvas
            ref={canvasRef}
            className="w-full h-44 cursor-crosshair block"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />

          {/* Guidelines inside signature box */}
          <div className="absolute bottom-6 left-6 right-6 border-b border-slate-200 pointer-events-none flex justify-between text-[9px] text-slate-300 uppercase tracking-widest font-mono">
            <span>Ligne de signature</span>
            <span>AGB e-Signature Horodatée</span>
          </div>

          {!hasSignature && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 space-y-1">
              <PenTool className="w-6 h-6 stroke-1 text-slate-300 animate-pulse" />
              <span className="text-xs font-medium">Signez ici directement sur l'écran tactile</span>
              <span className="text-[10px] text-slate-400">Compatible doigt, stylet capacitif ou souris</span>
            </div>
          )}
        </div>
      </div>

      {/* Signature Controls & Legal Notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <AppButton
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={strokeHistory.length === 0}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Annuler
          </AppButton>
          <AppButton
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={!hasSignature}
            leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
          >
            Effacer
          </AppButton>
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <AppButton type="button" variant="secondary" size="sm" onClick={onCancel}>
              Annuler
            </AppButton>
          )}
          <AppButton
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!hasSignature || !signatoryName.trim()}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Valider la Signature
          </AppButton>
        </div>
      </div>

      {/* Legal & Security Compliance Footer */}
      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2 text-[11px] text-emerald-800 dark:text-emerald-300">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
        <div>
          <span className="font-bold">Valeur Probante Chantier :</span> En signant, le signataire atteste
          l'exactitude des quantités livrées ou des interventions constatées. La signature sera horodatée et
          intégrée irrévocablement au document PDF BTP.
        </div>
      </div>
    </div>
  );
};
