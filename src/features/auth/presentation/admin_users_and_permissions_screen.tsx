/**
 * AGB CHANTIER - Console Administrateur : Gestion des Employés & Attribution des Permissions
 */

import React, { useState } from "react";
import { useAuth } from "./auth_context";
import { UserRole, USER_ROLES_METADATA } from "../../../core/permissions/roles";
import { AppPermission, ROLE_PERMISSIONS } from "../../../core/permissions/permissions";
import { UserEntity } from "../domain/entities/user_entity";
import {
  Users,
  ShieldCheck,
  UserPlus,
  Trash2,
  KeyRound,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Phone,
  HardHat,
  Search,
  RotateCcw,
  Eye,
  Sliders,
  Check,
  X,
} from "lucide-react";
import { AppButton } from "../../../core/widgets/buttons/app_button";
import { AppTextField } from "../../../core/widgets/inputs/app_text_field";
import { AppSelect } from "../../../core/widgets/inputs/app_select";
import { AppCard } from "../../../core/widgets/cards/app_card";
import { AppBadge } from "../../../core/widgets/badges/app_badge";

// Catégories logiques de permissions pour la matrice
const PERMISSION_GROUPS: { label: string; permissions: AppPermission[] }[] = [
  {
    label: "🏗️ Chantiers & Projets",
    permissions: [
      AppPermission.PROJECT_VIEW,
      AppPermission.PROJECT_CREATE,
      AppPermission.PROJECT_EDIT,
      AppPermission.PROJECT_DELETE,
      AppPermission.PROJECT_ARCHIVE,
    ],
  },
  {
    label: "👥 Clients & Maîtrise d'Ouvrage",
    permissions: [
      AppPermission.CLIENT_VIEW,
      AppPermission.CLIENT_CREATE,
      AppPermission.CLIENT_EDIT,
      AppPermission.CLIENT_DELETE,
    ],
  },
  {
    label: "📅 Planning & Tâches BTP",
    permissions: [
      AppPermission.PLANNING_VIEW,
      AppPermission.PLANNING_MANAGE,
      AppPermission.TASK_CREATE,
      AppPermission.TASK_UPDATE_STATUS,
      AppPermission.TASK_ASSIGN,
    ],
  },
  {
    label: "⏱️ Pointage & Présence des Équipes",
    permissions: [
      AppPermission.ATTENDANCE_VIEW,
      AppPermission.ATTENDANCE_RECORD,
      AppPermission.ATTENDANCE_VALIDATE,
    ],
  },
  {
    label: "📦 Matériaux, Stocks & Fournisseurs",
    permissions: [
      AppPermission.STOCK_VIEW,
      AppPermission.STOCK_MANAGE,
      AppPermission.PURCHASE_ORDER_CREATE,
      AppPermission.PURCHASE_ORDER_APPROVE,
    ],
  },
  {
    label: "💰 Finances, Caisse & Dépenses",
    permissions: [
      AppPermission.FINANCE_VIEW,
      AppPermission.FINANCE_EXPENSE_ADD,
      AppPermission.FINANCE_EXPENSE_APPROVE,
      AppPermission.FINANCE_BUDGET_EDIT,
    ],
  },
  {
    label: "📖 Journal de Chantier",
    permissions: [
      AppPermission.SITE_DIARY_VIEW,
      AppPermission.SITE_DIARY_WRITE,
      AppPermission.SITE_DIARY_VALIDATE,
    ],
  },
  {
    label: "🦺 HSE, Sécurité & Incidents",
    permissions: [
      AppPermission.HSE_VIEW,
      AppPermission.HSE_INCIDENT_REPORT,
      AppPermission.HSE_INSPECTION_CONDUCT,
    ],
  },
  {
    label: "🔍 Contrôle Qualité & Réserves OPR",
    permissions: [
      AppPermission.QUALITY_VIEW,
      AppPermission.QUALITY_INSPECT,
      AppPermission.RESERVATION_CREATE,
      AppPermission.RESERVATION_RESOLVE,
      AppPermission.RESERVATION_LIFT,
    ],
  },
  {
    label: "📄 Documents, GED & Rapports PDF",
    permissions: [
      AppPermission.DOCUMENT_VIEW,
      AppPermission.DOCUMENT_UPLOAD,
      AppPermission.REPORT_GENERATE,
      AppPermission.REPORT_SIGN,
    ],
  },
  {
    label: "⚙️ Administration, Utilisateurs & Audit",
    permissions: [
      AppPermission.USERS_MANAGE,
      AppPermission.SETTINGS_MANAGE,
      AppPermission.AUDIT_VIEW,
      AppPermission.BACKUP_MANAGE,
    ],
  },
];

export const AdminUsersAndPermissionsScreen: React.FC = () => {
  const {
    users,
    rolePermissions,
    addEmployee,
    deleteEmployee,
    resetPasswordToDefault,
    updateRolePermissions,
    resetRolePermissions,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"employees" | "permissions" | "audit">("employees");

  // Recherche et filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");

  // Modal Ajout Employé
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeePhone, setNewEmployeePhone] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState<UserRole>(UserRole.OUVRIER);
  const [newEmployeeSpeciality, setNewEmployeeSpeciality] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Modal Visualisation Pièce d'Identité
  const [selectedUserForDoc, setSelectedUserForDoc] = useState<UserEntity | null>(null);

  // Édition des permissions par rôle
  const [selectedRoleForPerms, setSelectedRoleForPerms] = useState<UserRole>(UserRole.CHEF_DE_CHANTIER);
  const [editedPermissions, setEditedPermissions] = useState<AppPermission[]>([]);

  // Initialiser les permissions lors de la sélection d'un rôle
  React.useEffect(() => {
    const current = rolePermissions[selectedRoleForPerms] || ROLE_PERMISSIONS[selectedRoleForPerms] || [];
    setEditedPermissions(current);
  }, [selectedRoleForPerms, rolePermissions]);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    if (!newEmployeeName.trim()) {
      setAddError("Le nom de l'employé est obligatoire.");
      return;
    }

    if (!newEmployeePhone.trim()) {
      setAddError("Le numéro de téléphone est obligatoire.");
      return;
    }

    try {
      setIsAdding(true);
      await addEmployee({
        name: newEmployeeName.trim(),
        phone: newEmployeePhone.trim(),
        role: newEmployeeRole,
        speciality: newEmployeeSpeciality.trim() || undefined,
      });

      // Réinitialiser le formulaire
      setNewEmployeeName("");
      setNewEmployeePhone("");
      setNewEmployeeSpeciality("");
      setIsAddModalOpen(false);
    } catch (err: any) {
      setAddError(err.message || "Erreur lors de l'enregistrement de l'employé.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleTogglePermission = (perm: AppPermission) => {
    if (editedPermissions.includes(perm)) {
      setEditedPermissions(editedPermissions.filter((p) => p !== perm));
    } else {
      setEditedPermissions([...editedPermissions, perm]);
    }
  };

  const handleSaveRolePermissions = async () => {
    await updateRolePermissions(selectedRoleForPerms, editedPermissions);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm) ||
      (u.matricule && u.matricule.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = filterRole === "ALL" || u.role === filterRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header Titre & Navigation Onglets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Administration & Sécurité
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Gestion des Employés & Attribution des Permissions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Contrôle d'accès RBAC : attribution des privilèges par rôle et gestion complète de la main-d'œuvre.
          </p>
        </div>

        {/* Bouton d'action ajout */}
        <div className="flex items-center gap-2">
          <AppButton
            variant="primary"
            size="md"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Ajouter un Employé
          </AppButton>
        </div>
      </div>

      {/* Barre d'onglets de navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("employees")}
          className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
            activeTab === "employees"
              ? "bg-red-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Liste des Employés & Rôles ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("permissions")}
          className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
            activeTab === "permissions"
              ? "bg-red-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Matrice des Permissions par Rôle</span>
        </button>
      </div>

      {/* ONGLET 1 : LISTE DES EMPLOYÉS */}
      {activeTab === "employees" && (
        <div className="space-y-4">
          {/* Filtres de recherche */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex-1">
              <AppTextField
                placeholder="Rechercher par nom, téléphone, matricule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="sm:w-64">
              <AppSelect
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                options={[
                  { value: "ALL", label: "Tous les rôles BTP" },
                  ...Object.values(UserRole).map((r) => ({
                    value: r,
                    label: USER_ROLES_METADATA[r]?.label || r,
                  })),
                ]}
              />
            </div>
          </div>

          {/* Tableau des Employés */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-4 py-3">Employé / Identité</th>
                    <th className="px-4 py-3">Téléphone</th>
                    <th className="px-4 py-3">Rôle BTP</th>
                    <th className="px-4 py-3">Mot de Passe</th>
                    <th className="px-4 py-3">Pièce d'Identité</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredUsers.map((user) => {
                    const roleMeta = USER_ROLES_METADATA[user.role];
                    const isDefaultPassword = user.mustChangePassword || user.passwordHash === "1234";

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* Identité */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-xs shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">
                                {user.name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                {user.matricule || user.id} {user.speciality ? `• ${user.speciality}` : ""}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Téléphone */}
                        <td className="px-4 py-3.5 font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {user.phone}
                        </td>

                        {/* Rôle */}
                        <td className="px-4 py-3.5">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold"
                            style={{
                              backgroundColor: `${roleMeta?.badgeColor || "#64748B"}20`,
                              color: roleMeta?.badgeColor || "#64748B",
                            }}
                          >
                            {roleMeta?.label || user.role}
                          </span>
                        </td>

                        {/* Mot de passe */}
                        <td className="px-4 py-3.5">
                          {isDefaultPassword ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                              <KeyRound className="w-3 h-3" /> Par défaut (1234)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3" /> Personnalisé
                            </span>
                          )}
                        </td>

                        {/* Pièce d'identité */}
                        <td className="px-4 py-3.5">
                          {user.identityDocument ? (
                            <button
                              type="button"
                              onClick={() => setSelectedUserForDoc(user)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded border border-sky-300 dark:border-sky-800"
                            >
                              <FileCheck className="w-3 h-3" /> {user.identityDocument.type} : {user.identityDocument.documentNumber}
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                              <XCircle className="w-3 h-3" /> Non fournie (1ère connexion requise)
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Réinitialiser MDP */}
                            <button
                              type="button"
                              title="Réinitialiser le mot de passe à 1234"
                              onClick={() => {
                                if (window.confirm(`Réinitialiser le mot de passe de ${user.name} à "1234" ?`)) {
                                  resetPasswordToDefault(user.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>

                            {/* Supprimer */}
                            {user.role !== UserRole.ADMINISTRATEUR && (
                              <button
                                type="button"
                                title="Supprimer l'employé"
                                onClick={() => {
                                  if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'employé ${user.name} ?`)) {
                                    deleteEmployee(user.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                        Aucun employé ne correspond aux critères de recherche.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ONGLET 2 : MATRICE DES PERMISSIONS PAR RÔLE */}
      {activeTab === "permissions" && (
        <div className="space-y-6">
          <AppCard
            title="Attribution Granulaire des Permissions par Rôle"
            subtitle="Modifiez les privilèges d'accès pour chaque métier BTP en cochant ou décochant les permissions souhaitées."
          >
            <div className="space-y-6">
              {/* Sélecteur de Rôle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">
                    Sélectionner le Rôle à Configurer :
                  </label>
                  <AppSelect
                    value={selectedRoleForPerms}
                    onChange={(e) => setSelectedRoleForPerms(e.target.value as UserRole)}
                    options={Object.values(UserRole).map((r) => ({
                      value: r,
                      label: `${USER_ROLES_METADATA[r]?.label} (${USER_ROLES_METADATA[r]?.category})`,
                    }))}
                  />
                </div>

                <div className="flex items-center gap-2 pt-4 sm:pt-0">
                  <AppButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const defaults = ROLE_PERMISSIONS[selectedRoleForPerms] || [];
                      setEditedPermissions(defaults);
                    }}
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                  >
                    Rétablir défaut
                  </AppButton>

                  <AppButton
                    variant="primary"
                    size="sm"
                    onClick={handleSaveRolePermissions}
                    leftIcon={<Check className="w-4 h-4" />}
                  >
                    Sauvegarder les permissions
                  </AppButton>
                </div>
              </div>

              {/* Grille des Groupes de Permissions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PERMISSION_GROUPS.map((group) => (
                  <div
                    key={group.label}
                    className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                        {group.label}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const allGroupIn = group.permissions.every((p) => editedPermissions.includes(p));
                          if (allGroupIn) {
                            setEditedPermissions(editedPermissions.filter((p) => !group.permissions.includes(p)));
                          } else {
                            const union = Array.from(new Set([...editedPermissions, ...group.permissions]));
                            setEditedPermissions(union);
                          }
                        }}
                        className="text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                      >
                        Tout basculer
                      </button>
                    </div>

                    <div className="space-y-2">
                      {group.permissions.map((perm) => {
                        const isChecked = editedPermissions.includes(perm);
                        return (
                          <label
                            key={perm}
                            className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors text-xs select-none ${
                              isChecked
                                ? "bg-orange-50/70 dark:bg-orange-950/30 text-slate-900 dark:text-white font-medium"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleTogglePermission(perm)}
                              className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                            />
                            <span className="font-mono text-[11px]">{perm}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AppCard>
        </div>
      )}

      {/* MODAL : AJOUTER UN EMPLOYÉ (Informations requises : Nom & Numéro de téléphone) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Création d'un Employé BTP
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Mot de passe initial fixé à <strong>1234</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <AppTextField
                label="Nom et Prénoms de l'employé"
                placeholder="Ex: Kouamé Jean-Luc"
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
                required
              />

              <AppTextField
                label="Numéro de téléphone"
                placeholder="Ex: 0501020304"
                value={newEmployeePhone}
                onChange={(e) => setNewEmployeePhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
                helperText="Sera utilisé comme identifiant de connexion par l'employé."
                required
              />

              <AppSelect
                label="Rôle et Fonction BTP"
                value={newEmployeeRole}
                onChange={(e) => setNewEmployeeRole(e.target.value as UserRole)}
                options={Object.values(UserRole).map((r) => ({
                  value: r,
                  label: USER_ROLES_METADATA[r]?.label || r,
                }))}
                required
              />

              <AppTextField
                label="Spécialité / Métier (Optionnel)"
                placeholder="Ex: Maçonnerie, Électricité, Coffrage, HSE..."
                value={newEmployeeSpeciality}
                onChange={(e) => setNewEmployeeSpeciality(e.target.value)}
              />

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-900 dark:text-amber-300 text-[11px] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" /> Règles de première connexion :
                </p>
                <p>
                  L'employé utilisera son numéro de téléphone et le mot de passe par défaut <code>1234</code>. L'application lui demandera obligatoirement de changer son mot de passe et d'ajouter sa pièce d'identité dès sa 1ère connexion.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <AppButton
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Annuler
                </AppButton>

                <AppButton
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isAdding}
                  leftIcon={<Check className="w-4 h-4" />}
                >
                  Créer l'Employé
                </AppButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL : VISUALISER LA PIÈCE D'IDENTITÉ D'UN EMPLOYÉ */}
      {selectedUserForDoc && selectedUserForDoc.identityDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Pièce d'Identité : {selectedUserForDoc.name}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  {selectedUserForDoc.phone} • {selectedUserForDoc.matricule}
                </p>
              </div>

              <button
                onClick={() => setSelectedUserForDoc(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Type</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedUserForDoc.identityDocument.type}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Numéro de pièce</span>
                  <span className="font-mono font-bold text-orange-600 dark:text-orange-400">
                    {selectedUserForDoc.identityDocument.documentNumber}
                  </span>
                </div>
              </div>

              {/* Affichage de la photo / scan */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-950 p-2 flex items-center justify-center min-h-48">
                {selectedUserForDoc.identityDocument.photoBase64 ? (
                  <img
                    src={selectedUserForDoc.identityDocument.photoBase64}
                    alt="Pièce d'identité"
                    className="max-h-64 object-contain rounded"
                  />
                ) : (
                  <p className="text-xs text-slate-400">Aucun aperçu visuel disponible.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <AppButton
                variant="outline"
                size="sm"
                onClick={() => setSelectedUserForDoc(null)}
              >
                Fermer
              </AppButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
