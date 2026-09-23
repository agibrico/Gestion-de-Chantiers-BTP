/**
 * AGB CHANTIER - Explorateur & Bac à Sable Interactif du Design System BTP
 */

import React, { useState } from "react";
import {
  HardHat,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  AlertTriangle,
  Send,
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Layers,
} from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppIconButton } from "../../../core/widgets/buttons/app_icon_button";
import { AppCard } from "../../../core/widgets/cards/app_card";
import { StatCard } from "../../../core/widgets/cards/stat_card";
import { AppBadge } from "../../../core/widgets/badges/app_badge";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppDialog } from "../../../core/widgets/feedback/app_dialog";
import { AppAvatar } from "../../../core/widgets/display/app_avatar";
import { AppEmptyState } from "../../../core/widgets/display/app_empty_state";
import { useToast } from "../../../core/widgets/feedback/app_toast";
import { UserRole, USER_ROLES_METADATA } from "../../../core/permissions/roles";
import { ROLE_PERMISSIONS } from "../../../core/permissions/permissions";
import { FormValidators } from "../../../core/validators/form_validators";

export const DesignSystemScreen: React.FC = () => {
  const toast = useToast();

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Button Loading Test
  const [btnLoading, setBtnLoading] = useState(false);

  // Form Validation State Test
  const [testEmail, setTestEmail] = useState("");
  const [testPhone, setTestPhone] = useState("");
  const [testBudget, setTestBudget] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Role Inspector State
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CONDUCTEUR_DE_TRAVAUX);

  const handleTestFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    const emailErr = FormValidators.email(testEmail) || FormValidators.required(testEmail, "L'email");
    if (emailErr) errors.email = emailErr;

    const phoneErr = FormValidators.phone(testPhone) || FormValidators.required(testPhone, "Le téléphone");
    if (phoneErr) errors.phone = phoneErr;

    const budgetErr = FormValidators.positiveNumber(parseFloat(testBudget), "Le budget");
    if (budgetErr) errors.budget = budgetErr;

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      toast.success("Validation réussie !", "Les règles de validation métier BTP sont conformes.");
    } else {
      toast.error("Formulaire invalide", "Veuillez corriger les champs en rouge.");
    }
  };

  const handleSimulateLoading = () => {
    setBtnLoading(true);
    setTimeout(() => {
      setBtnLoading(false);
      toast.success("Action terminée", "Le traitement asynchrone a réussi.");
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          Design System BTP — AGB CHANTIER
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Composants graphiques, formulaires, retours d'information et matrice de sécurité RBAC.
        </p>
      </div>

      {/* 1. Boutons & Variantes */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
          1. Boutons d'Action & Tailles
        </h2>

        <AppCard>
          <div className="space-y-6">
            {/* Variants */}
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 mb-3">Variantes Graphiques</p>
              <div className="flex flex-wrap items-center gap-3">
                <AppButton variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                  Bouton Principal
                </AppButton>
                <AppButton variant="secondary" leftIcon={<Edit className="w-4 h-4" />}>
                  Bouton Secondaire
                </AppButton>
                <AppButton variant="outline" leftIcon={<Calendar className="w-4 h-4" />}>
                  Bouton Contour
                </AppButton>
                <AppButton variant="amber" leftIcon={<AlertTriangle className="w-4 h-4" />}>
                  Alerte Chantier
                </AppButton>
                <AppButton variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}>
                  Supprimer
                </AppButton>
                <AppButton variant="ghost">Bouton Ghost</AppButton>
              </div>
            </div>

            {/* Sizes & States */}
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 mb-3">Tailles & États Interactifs</p>
              <div className="flex flex-wrap items-center gap-3">
                <AppButton size="sm">Taille Small (32px)</AppButton>
                <AppButton size="md">Taille Medium (40px)</AppButton>
                <AppButton size="lg">Taille Large (48px)</AppButton>
                <AppButton
                  isLoading={btnLoading}
                  onClick={handleSimulateLoading}
                  variant="primary"
                >
                  {btnLoading ? "Enregistrement..." : "Tester Chargement"}
                </AppButton>
                <AppButton disabled>Désactivé</AppButton>
              </div>
            </div>

            {/* Icon Buttons */}
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 mb-3">Boutons Icônes Seuls</p>
              <div className="flex items-center gap-3">
                <AppIconButton
                  icon={<Plus className="w-4 h-4" />}
                  label="Ajouter"
                  variant="primary"
                  onClick={() => toast.info("Bouton Icône", "Action cliquée")}
                />
                <AppIconButton icon={<Edit className="w-4 h-4" />} label="Modifier" variant="secondary" />
                <AppIconButton icon={<Trash2 className="w-4 h-4" />} label="Supprimer" variant="danger" />
                <AppIconButton icon={<Save className="w-4 h-4" />} label="Sauvegarder" variant="outline" />
              </div>
            </div>
          </div>
        </AppCard>
      </section>

      {/* 2. Badges de Statuts BTP */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          2. Badges de Statut & Signalétique
        </h2>

        <AppCard>
          <div className="flex flex-wrap items-center gap-3">
            <AppBadge variant="preparation" dot={true}>
              En Préparation
            </AppBadge>
            <AppBadge variant="inProgress" dot={true}>
              En Cours (Gros Œuvre)
            </AppBadge>
            <AppBadge variant="suspended" dot={true}>
              Suspendu (Météo / Appro)
            </AppBadge>
            <AppBadge variant="delayed" dot={true}>
              En Retard
            </AppBadge>
            <AppBadge variant="completed" dot={true}>
              Terminé & Réceptionné
            </AppBadge>
            <AppBadge variant="archived">Archivé</AppBadge>
            <AppBadge variant="success">Sécurité HSE OK</AppBadge>
            <AppBadge variant="danger">Incident Majeur</AppBadge>
          </div>
        </AppCard>
      </section>

      {/* 3. Formulaires & Validation */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          3. Saisie de Données & Moteur de Validation
        </h2>

        <AppCard title="Testeur de Formulaire BTP">
          <form onSubmit={handleTestFormSubmit} className="space-y-4 max-w-xl">
            <AppTextField
              label="Email Conducteur / Client"
              placeholder="exemple@agb-btp.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              error={formErrors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <AppTextField
              label="Téléphone Contact Chantier"
              placeholder="+225 07 00 00 00 00"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              error={formErrors.phone}
              leftIcon={<Phone className="w-4 h-4" />}
              required
            />

            <AppTextField
              label="Budget Prévisionnel (FCFA)"
              placeholder="Ex: 50000000"
              type="number"
              value={testBudget}
              onChange={(e) => setTestBudget(e.target.value)}
              error={formErrors.budget}
              required
            />

            <AppSelect
              label="Type de Chantier"
              options={[
                { value: "residential", label: "Résidentiel (Villas / Immeubles)" },
                { value: "commercial", label: "Tertiaire & Commercial" },
                { value: "industrial", label: "Industriel & Hangars" },
                { value: "infrastructure", label: "Infrastructures & VRD" },
              ]}
            />

            <div className="pt-2 flex items-center gap-3">
              <AppButton type="submit" variant="primary" leftIcon={<Send className="w-4 h-4" />}>
                Tester la Validation
              </AppButton>
              <AppButton
                type="button"
                variant="outline"
                onClick={() => {
                  setTestEmail("conducteur@agb-chantier.ci");
                  setTestPhone("+2250789451234");
                  setTestBudget("125000000");
                  setFormErrors({});
                }}
              >
                Remplir Données Valides
              </AppButton>
            </div>
          </form>
        </AppCard>
      </section>

      {/* 4. Notifications Toasts & Modals */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
          4. Feedback Utilisateur (Toasts & Boîtes de Dialogue)
        </h2>

        <AppCard>
          <div className="flex flex-wrap items-center gap-3">
            <AppButton
              variant="secondary"
              onClick={() => toast.success("Enregistrement validé", "Le rapport journalier a été sauvegardé en local.")}
            >
              Toast Succès
            </AppButton>

            <AppButton
              variant="secondary"
              onClick={() => toast.warning("Stock critique", "Le stock de ciment CPJ 42.5 est inférieur au seuil.")}
            >
              Toast Alerte
            </AppButton>

            <AppButton
              variant="secondary"
              onClick={() => toast.error("Échec de connexion", "Serveur distant temporairement injoignable.")}
            >
              Toast Erreur
            </AppButton>

            <AppButton
              variant="secondary"
              onClick={() => toast.info("Mode Hors-ligne", "Les modifications sont en file d'attente.")}
            >
              Toast Info
            </AppButton>

            <AppButton variant="primary" onClick={() => setIsDialogOpen(true)}>
              Ouvrir Dialogue Modal
            </AppButton>
          </div>
        </AppCard>
      </section>

      {/* 5. Matrice RBAC des 13 Rôles */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          5. Matrice des Rôles & Permissions Métiers BTP (RBAC)
        </h2>

        <AppCard
          title="Inspecteur des Permissions par Rôle"
          subtitle="Sélectionnez un rôle pour voir les autorisations attribuées dans l'application."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Role List */}
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-2">
              {Object.values(UserRole).map((roleKey) => {
                const meta = USER_ROLES_METADATA[roleKey];
                const isSelected = selectedRole === roleKey;

                return (
                  <button
                    key={roleKey}
                    onClick={() => setSelectedRole(roleKey)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-600 dark:text-orange-300 shadow-xs"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{meta.label}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {meta.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Permission Details */}
            <div className="md:col-span-2 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {USER_ROLES_METADATA[selectedRole].label}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {USER_ROLES_METADATA[selectedRole].description}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Permissions Actives ({ROLE_PERMISSIONS[selectedRole]?.length || 0})
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                  {ROLE_PERMISSIONS[selectedRole]?.map((perm) => (
                    <span
                      key={perm}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </section>

      {/* 6. Empty States & Avatars */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
          6. États Vides & Avatars Professionnels
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AppCard title="Avatars Métiers">
            <div className="flex items-center gap-4">
              <AppAvatar name="Kouamé Jean" size="sm" />
              <AppAvatar name="Diallo Amadou" size="md" roleBadge="MOE" />
              <AppAvatar name="Bamba Sékou" size="lg" roleBadge="HSE" />
              <AppAvatar name="Koné Gilles" size="xl" roleBadge="ADMIN" />
            </div>
          </AppCard>

          <AppEmptyState
            title="Aucun chantier trouvé"
            description="Créez votre premier chantier ou ajustez vos critères de recherche."
            actionLabel="Nouveau Chantier"
            onAction={() => toast.info("Création Chantier", "Module prêt pour l'Axe 04.")}
            actionIcon={<Plus className="w-4 h-4" />}
          />
        </div>
      </section>

      {/* Modal Dialogue Exemple */}
      <AppDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Fiche de Contrôle BTP"
        subtitle="Exemple de modal de validation opérationnelle"
        footer={
          <>
            <AppButton variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </AppButton>
            <AppButton
              variant="primary"
              onClick={() => {
                setIsDialogOpen(false);
                toast.success("Dialogue Validé", "L'opération a été confirmée.");
              }}
            >
              Confirmer
            </AppButton>
          </>
        }
      >
        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <p>
            Cette boîte de dialogue illustre l'intégration du Design System AGB CHANTIER.
            Elle supporte la fermeture par la touche Échap, le clic sur le bouton de fermeture ou les boutons d'action.
          </p>
          <div className="p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 rounded-lg text-orange-900 dark:text-orange-200">
            <strong>Règle BTP :</strong> Toutes les actions destructives ou de validation de PV requièrent une confirmation explicite.
          </div>
        </div>
      </AppDialog>
    </div>
  );
};
