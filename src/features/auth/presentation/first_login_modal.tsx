/**
 * AGB CHANTIER - Modal Obligatoire de Première Connexion
 * Exige :
 * 1. Changement du mot de passe par défaut (1234)
 * 2. Ajout de la pièce d'identité (CNI, Passeport, Permis, Attestation BTP)
 */

import React, { useState, useRef } from "react";
import { useAuth } from "./auth_context";
import { IdentityDocType, IDENTITY_DOC_LABELS } from "../domain/entities/identity_document";
import {
  KeyRound,
  FileCheck2,
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";

export const FirstLoginModal: React.FC = () => {
  const { currentUser, isFirstLoginModalRequired, completeFirstLogin, logout } = useAuth();

  // Étape 1 : Mot de passe
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Étape 2 : Pièce d'identité
  const [docType, setDocType] = useState<IdentityDocType>("CNI");
  const [docNumber, setDocNumber] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isFirstLoginModalRequired || !currentUser) {
    return null;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Le fichier ne doit pas dépasser 5 Mo.");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoBase64(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleDocument = () => {
    // Générer une pièce d'identité modèle pour test rapide
    setDocNumber(`CI-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setFileName("cni_recto_verso_scan.jpg");
    setPhotoBase64(
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect width='400' height='250' fill='%231e293b' rx='12'/><rect x='20' y='20' width='90' height='110' fill='%230284c7' rx='8'/><text x='65' y='80' fill='white' font-size='12' font-family='sans-serif' text-anchor='middle'>PHOTO ID</text><text x='130' y='50' fill='white' font-size='14' font-weight='bold' font-family='sans-serif'>REPUBLIQUE DE COTE D'IVOIRE</text><text x='130' y='80' fill='%2394a3b8' font-size='12' font-family='sans-serif'>CARTE NATIONALE D'IDENTITE</text><text x='130' y='110' fill='%2338bdf8' font-size='14' font-weight='bold' font-family='monospace'>N° CNI00984712</text><rect x='20' y='160' width='360' height='60' fill='%230f172a' rx='6'/><text x='35' y='195' fill='%2364748b' font-size='11' font-family='monospace'>IDCI1234567890<<<<<<<<<<<</text></svg>"
    );
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!newPassword || newPassword.length < 4) {
      setError("Le nouveau mot de passe doit comporter au moins 4 caractères.");
      return;
    }

    if (newPassword === "1234") {
      setError("Le nouveau mot de passe doit être différent du mot de passe par défaut '1234'.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe saisis ne correspondent pas.");
      return;
    }

    if (!docNumber.trim()) {
      setError("Veuillez saisir le numéro de votre pièce d'identité.");
      return;
    }

    if (!photoBase64) {
      setError("Veuillez joindre la photo ou le scan de votre pièce d'identité.");
      return;
    }

    try {
      setIsSubmitting(true);
      await completeFirstLogin(newPassword, {
        type: docType,
        documentNumber: docNumber.trim(),
        photoBase64,
        fileName: fileName || "document_identite.jpg",
        verified: true,
        uploadedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      setError(err.message || "Erreur lors de la validation du profil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Onboarding */}
        <div className="text-center space-y-2 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="w-14 h-14 bg-orange-600/10 dark:bg-orange-600/20 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-orange-500/30">
            <Lock className="w-7 h-7 text-orange-600" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-500/15 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-full border border-orange-500/30">
            Première Connexion Sécurisée
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Finalisation de votre Profil BTP
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Bonjour <strong>{currentUser.name}</strong>. Pour sécuriser votre compte et vos accès aux chantiers, vous devez définir votre mot de passe personnel et enregistrer votre pièce d'identité.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1 : MODIFICATION DU MOT DE PASSE */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-orange-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                1. Définir votre nouveau mot de passe
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Le mot de passe par défaut <code>1234</code> doit être remplacé par un mot de passe personnel.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AppTextField
                label="Nouveau mot de passe"
                type={showPassword ? "text" : "password"}
                placeholder="Ex: P@ssword2026"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <AppTextField
                label="Confirmer le mot de passe"
                type={showPassword ? "text" : "password"}
                placeholder="Répétez le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* SECTION 2 : AJOUT DE LA PIECE D'IDENTITE */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  2. Enregistrement de votre pièce d'identité
                </h3>
              </div>
              <button
                type="button"
                onClick={handleSampleDocument}
                className="text-[11px] font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400 underline cursor-pointer"
              >
                Générer un exemple de test
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Conformément à la réglementation des chantiers BTP, chaque intervenant doit justifier de son identité.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AppSelect
                label="Type de pièce d'identité"
                value={docType}
                onChange={(e) => setDocType(e.target.value as IdentityDocType)}
                options={Object.entries(IDENTITY_DOC_LABELS).map(([value, label]) => ({
                  value,
                  label,
                }))}
                required
              />

              <AppTextField
                label="Numéro du document / CNI"
                placeholder="Ex: C0098765432"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                required
              />
            </div>

            {/* Upload Zone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Photo ou Scan du document <span className="text-red-500">*</span>
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,.pdf"
                className="hidden"
              />

              {!photoBase64 ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-white dark:bg-slate-900 group"
                >
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Cliquez pour téléverser votre pièce d'identité
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Formats acceptés : JPG, PNG, PDF (Max 5 Mo)
                  </p>
                </div>
              ) : (
                <div className="relative p-3 bg-white dark:bg-slate-900 border border-emerald-500/40 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center overflow-hidden border border-emerald-500/30 shrink-0">
                      {photoBase64.startsWith("data:image") ? (
                        <img
                          src={photoBase64}
                          alt="Pièce d'identité"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <CheckCircle2 className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                        {fileName || "Document d'identité chargé"}
                      </p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Fichier prêt pour validation
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-orange-600 hover:text-orange-500 underline cursor-pointer shrink-0"
                  >
                    Remplacer
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={logout}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline cursor-pointer"
            >
              Me déconnecter
            </button>

            <AppButton
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Valider mon profil & Accéder à l'application
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
};
