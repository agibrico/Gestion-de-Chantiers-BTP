/**
 * AGB CHANTIER - Contexte Global d'Authentification, Rôles & Permissions (RBAC)
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserEntity, ProfileCategory, CreateEmployeeDTO } from "../domain/entities/user_entity";
import { IdentityDocument } from "../domain/entities/identity_document";
import { UserRole } from "../../../core/permissions/roles";
import { AppPermission } from "../../../core/permissions/permissions";
import { AuthRepositoryImpl } from "../data/auth_repository_impl";
import { useToast } from "../../../core/widgets/feedback/app_toast";

interface AuthContextType {
  currentUser: UserEntity | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  users: UserEntity[];
  employees: UserEntity[];
  gerants: UserEntity[];
  rolePermissions: Record<UserRole, AppPermission[]>;
  activeProfile: ProfileCategory | null;
  isFirstLoginModalRequired: boolean;
  
  // Actions
  login: (phone: string, password: string) => Promise<UserEntity>;
  logout: () => Promise<void>;
  completeFirstLogin: (newPassword: string, identityDoc: IdentityDocument) => Promise<UserEntity>;
  addEmployee: (dto: CreateEmployeeDTO) => Promise<UserEntity>;
  deleteEmployee: (id: string) => Promise<boolean>;
  resetPasswordToDefault: (userId: string) => Promise<boolean>;
  updateRolePermissions: (role: UserRole, permissions: AppPermission[]) => Promise<void>;
  resetRolePermissions: () => Promise<void>;
  hasPermission: (permission: AppPermission) => boolean;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [users, setUsers] = useState<UserEntity[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, AppPermission[]>>({} as any);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const authRepo = AuthRepositoryImpl.getInstance();

  const loadData = async () => {
    try {
      setIsLoading(true);
      await authRepo.initializeSeedData();
      const [user, allUsers, perms] = await Promise.all([
        authRepo.getCurrentUser(),
        authRepo.getUsers(),
        authRepo.getRolePermissions(),
      ]);
      setCurrentUser(user);
      setUsers(allUsers);
      setRolePermissions(perms);
    } catch (error) {
      console.error("Erreur chargement données Auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshUsers = async () => {
    const allUsers = await authRepo.getUsers();
    setUsers(allUsers);
    if (currentUser) {
      const refreshedCurrent = allUsers.find((u) => u.id === currentUser.id);
      if (refreshedCurrent) {
        setCurrentUser(refreshedCurrent);
      }
    }
  };

  const login = async (phone: string, password: string): Promise<UserEntity> => {
    try {
      const user = await authRepo.login(phone, password);
      setCurrentUser(user);
      await refreshUsers();
      toast.success("Connexion réussie", `Bienvenue, ${user.name} !`);
      return user;
    } catch (error: any) {
      toast.error("Échec de connexion", error.message || "Identifiants incorrects.");
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    await authRepo.logout();
    setCurrentUser(null);
    toast.info("Déconnexion", "Vous avez été déconnecté avec succès.");
  };

  const completeFirstLogin = async (
    newPassword: string,
    identityDoc: IdentityDocument
  ): Promise<UserEntity> => {
    if (!currentUser) throw new Error("Aucun utilisateur connecté.");
    try {
      const updated = await authRepo.completeFirstLogin(currentUser.id, newPassword, identityDoc);
      setCurrentUser(updated);
      await refreshUsers();
      toast.success("Profil sécurisé", "Mot de passe et pièce d'identité enregistrés avec succès !");
      return updated;
    } catch (error: any) {
      toast.error("Erreur de validation", error.message || "Erreur lors de la validation du profil.");
      throw error;
    }
  };

  const addEmployee = async (dto: CreateEmployeeDTO): Promise<UserEntity> => {
    try {
      const newEmp = await authRepo.createEmployee(dto);
      await refreshUsers();
      toast.success("Employé créé", `"${newEmp.name}" créé avec succès ! (Mot de passe : 1234)`);
      return newEmp;
    } catch (error: any) {
      toast.error("Erreur de création", error.message || "Erreur lors de l'enregistrement de l'employé.");
      throw error;
    }
  };

  const deleteEmployee = async (id: string): Promise<boolean> => {
    try {
      const success = await authRepo.deleteEmployee(id);
      if (success) {
        await refreshUsers();
        toast.success("Employé supprimé", "L'employé a été retiré avec succès.");
      }
      return success;
    } catch (error: any) {
      toast.error("Erreur de suppression", error.message || "Erreur lors de la suppression.");
      return false;
    }
  };

  const resetPasswordToDefault = async (userId: string): Promise<boolean> => {
    try {
      const success = await authRepo.resetPassword(userId, "1234");
      if (success) {
        await refreshUsers();
        toast.success("Mot de passe réinitialisé", "Réinitialisé à '1234'. La première connexion sera exigée.");
      }
      return success;
    } catch (error: any) {
      toast.error("Erreur", error.message || "Erreur réinitialisation mot de passe.");
      return false;
    }
  };

  const updateRolePermissions = async (
    role: UserRole,
    permissions: AppPermission[]
  ): Promise<void> => {
    try {
      const updated = await authRepo.updateRolePermissions(role, permissions);
      setRolePermissions(updated);
      toast.success("Permissions sauvegardées", `Privilèges mis à jour pour le rôle ${role}.`);
    } catch (error: any) {
      toast.error("Erreur", error.message || "Erreur mise à jour des permissions.");
    }
  };

  const resetRolePermissions = async (): Promise<void> => {
    try {
      const res = await authRepo.resetRolePermissionsToDefault();
      setRolePermissions(res);
      toast.info("Rétablissement", "Permissions restaurées aux valeurs d'origine.");
    } catch (error: any) {
      toast.error("Erreur", error.message || "Erreur réinitialisation.");
    }
  };

  const hasPermission = (permission: AppPermission): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === UserRole.ADMINISTRATEUR) return true;

    // Permissions personnalisées directes de l'utilisateur
    if (currentUser.customPermissions && currentUser.customPermissions.includes(permission)) {
      return true;
    }

    // Permissions du rôle
    const perms = rolePermissions[currentUser.role] || [];
    return perms.includes(permission);
  };

  const employees = users.filter((u) => u.profileCategory === "EMPLOYE");
  const gerants = users.filter((u) => u.profileCategory === "GERANT");

  const isFirstLoginModalRequired =
    !!currentUser && (currentUser.mustChangePassword || !currentUser.isFirstLoginCompleted);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        users,
        employees,
        gerants,
        rolePermissions,
        activeProfile: currentUser ? currentUser.profileCategory : null,
        isFirstLoginModalRequired,
        login,
        logout,
        completeFirstLogin,
        addEmployee,
        deleteEmployee,
        resetPasswordToDefault,
        updateRolePermissions,
        resetRolePermissions,
        hasPermission,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur de AuthProvider");
  }
  return context;
};
