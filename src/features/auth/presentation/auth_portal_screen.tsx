/**
 * AGB CHANTIER - Portail d'Accueil Client & Authentification Multi-Rôles
 * Contient les 3 boutons d'accès :
 * 1. Administrateur
 * 2. Gérant
 * 3. Employés
 */

import React, { useState } from "react";
import { useAuth } from "./auth_context";
import { ProfileCategory, UserEntity } from "../domain/entities/user_entity";
import {
  ShieldCheck,
  Briefcase,
  HardHat,
  ArrowRight,
  Lock,
  Phone,
  Eye,
  EyeOff,
  UserCheck,
  Info,
  CheckCircle2,
  Users,
} from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AgbCreatorSignature } from "../../../core/widgets/display/agb_creator_signature";

interface AuthPortalScreenProps {
  onLoginSuccess?: (user: UserEntity) => void;
}

export const AuthPortalScreen: React.FC<AuthPortalScreenProps> = ({ onLoginSuccess }) => {
  const { login, users, currentUser, logout } = useAuth();
  
  // Profil sélectionné ("ADMINISTRATEUR" | "GERANT" | "EMPLOYE" | null)
  const [selectedProfile, setSelectedProfile] = useState<ProfileCategory | null>("ADMINISTRATEUR");
  
  // Formulaire de connexion
  const [phone, setPhone] = useState("0104818092"); // Numéro admin par défaut
  const [password, setPassword] = useState("1234"); // Mot de passe par défaut
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mettre à jour les champs selon le profil sélectionné
  const handleSelectProfile = (profile: ProfileCategory) => {
    setSelectedProfile(profile);
    setErrorMessage(null);

    // Pré-remplir avec un utilisateur modèle pour faciliter le test
    const categoryUsers = users.filter((u) => u.profileCategory === profile);
    if (categoryUsers.length > 0) {
      setPhone(categoryUsers[0].phone);
      setPassword(categoryUsers[0].passwordHash || "1234");
    } else {
      if (profile === "ADMINISTRATEUR") {
        setPhone("0104818092");
        setPassword("1234");
      } else if (profile === "GERANT") {
        setPhone("0797709693");
        setPassword("1234");
      } else {
        setPhone("0501020304");
        setPassword("1234");
      }
    }
  };

  const handleQuickSelectUser = (user: UserEntity) => {
    setPhone(user.phone);
    setPassword(user.passwordHash || "1234");
    setErrorMessage(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!phone.trim()) {
      setErrorMessage("Veuillez saisir votre numéro de téléphone.");
      return;
    }

    if (!password) {
      setErrorMessage("Veuillez saisir votre mot de passe.");
      return;
    }

    try {
      setIsLoading(true);
      const user = await login(phone, password);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Identifiants invalides.");
    } finally {
      setIsLoading(false);
    }
  };

  const profileUsers = users.filter((u) => u.profileCategory === selectedProfile);

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Hero Welcome Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full border border-orange-500/20 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Axe 02 • Authentification & Rôles BTP</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          Portail d'Accès Sécurisé BTP
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Sélectionnez votre profil d'accès pour vous connecter à la plateforme de gestion et de pilotage des chantiers.
        </p>
      </div>

      {/* LES 3 BOUTONS / PROFILS D'ACCÈS MAJEURS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* 1. Administrateur */}
        <button
          type="button"
          onClick={() => handleSelectProfile("ADMINISTRATEUR")}
          className={`relative p-5 sm:p-6 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
            selectedProfile === "ADMINISTRATEUR"
              ? "bg-red-500/10 dark:bg-red-950/40 border-red-500 shadow-md ring-2 ring-red-500/30"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-red-400 hover:shadow-xs"
          }`}
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400">
                Direction & Contrôle
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Administrateur
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Attribution des permissions de chaque rôle, ajout et suppression des employés, audit et sécurité.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] font-bold text-red-600 dark:text-red-400">
              {selectedProfile === "ADMINISTRATEUR" ? "Profil Sélectionné" : "Choisir ce profil"}
            </span>
            <ArrowRight className={`w-4 h-4 transition-transform ${selectedProfile === "ADMINISTRATEUR" ? "translate-x-1 text-red-600" : "text-slate-400"}`} />
          </div>
        </button>

        {/* 2. Gérant */}
        <button
          type="button"
          onClick={() => handleSelectProfile("GERANT")}
          className={`relative p-5 sm:p-6 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
            selectedProfile === "GERANT"
              ? "bg-orange-500/10 dark:bg-orange-950/40 border-orange-500 shadow-md ring-2 ring-orange-500/30"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-orange-400 hover:shadow-xs"
          }`}
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Supervision & Travaux
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Gérant
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Conducteurs de travaux, ingénieurs et chefs de chantier pour le suivi financier, plannings et équipes.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400">
              {selectedProfile === "GERANT" ? "Profil Sélectionné" : "Choisir ce profil"}
            </span>
            <ArrowRight className={`w-4 h-4 transition-transform ${selectedProfile === "GERANT" ? "translate-x-1 text-orange-600" : "text-slate-400"}`} />
          </div>
        </button>

        {/* 3. Employés */}
        <button
          type="button"
          onClick={() => handleSelectProfile("EMPLOYE")}
          className={`relative p-5 sm:p-6 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
            selectedProfile === "EMPLOYE"
              ? "bg-sky-500/10 dark:bg-sky-950/40 border-sky-500 shadow-md ring-2 ring-sky-500/30"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-400 hover:shadow-xs"
          }`}
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Terrain & Exécution
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Employés
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Chefs d'équipe, ouvriers, compagnons, contrôleurs et agents HSE pour le pointage et l'exécution terrain.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400">
              {selectedProfile === "EMPLOYE" ? "Profil Sélectionné" : "Choisir ce profil"}
            </span>
            <ArrowRight className={`w-4 h-4 transition-transform ${selectedProfile === "EMPLOYE" ? "translate-x-1 text-sky-600" : "text-slate-400"}`} />
          </div>
        </button>
      </div>

      {/* PANNEAU DE CONNEXION DÉDIÉ AU PROFIL SÉLECTIONNÉ */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${
                selectedProfile === "ADMINISTRATEUR" ? "bg-red-600" : selectedProfile === "GERANT" ? "bg-orange-600" : "bg-sky-600"
              }`} />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Connexion Espace {selectedProfile === "ADMINISTRATEUR" ? "Administrateur" : selectedProfile === "GERANT" ? "Gérant" : "Employés"}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Saisissez votre numéro de téléphone et votre mot de passe pour accéder à vos outils.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs px-3 py-1.5 rounded-lg">
            <Info className="w-4 h-4 shrink-0" />
            <span>Mot de passe par défaut : <strong>1234</strong></span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5">
            <Info className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formulaire Principal */}
          <form onSubmit={handleLogin} className="lg:col-span-7 space-y-4">
            <AppTextField
              label="Numéro de téléphone"
              placeholder="Ex: 0104818092 ou 0501020304"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
              required
            />

            <AppTextField
              label="Mot de passe"
              type={showPassword ? "text" : "password"}
              placeholder="Saisissez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
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

            <div className="pt-2">
              <AppButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                leftIcon={<Lock className="w-4 h-4" />}
              >
                Se Connecter à l'Espace {selectedProfile}
              </AppButton>
            </div>
          </form>

          {/* Liste de sélection rapide pour test & démo */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-orange-500" />
                Comptes enregistrés ({profileUsers.length})
              </span>
              <span className="text-[10px] text-slate-400">Clic rapide</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {profileUsers.map((u) => {
                const isSelected = phone.replace(/\s+/g, "") === u.phone.replace(/\s+/g, "");
                return (
                  <div
                    key={u.id}
                    onClick={() => handleQuickSelectUser(u)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-white dark:bg-slate-800 border-orange-500 shadow-xs"
                        : "bg-white/80 dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 hover:border-slate-300"
                    }`}
                  >
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {u.name}
                      </p>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {u.phone} • {u.role}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 ml-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Signature Officielle Concepteur AGB */}
      <AgbCreatorSignature variant="full" />
    </div>
  );
};
