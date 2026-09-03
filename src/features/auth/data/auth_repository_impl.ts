/**
 * AGB CHANTIER - Implémentation du Repository d'Authentification & RBAC (Offline-First)
 */

import { IAuthRepository } from "../domain/repositories/auth_repository";
import { UserEntity, CreateEmployeeDTO, ProfileCategory } from "../domain/entities/user_entity";
import { IdentityDocument } from "../domain/entities/identity_document";
import { IdbAdapter } from "../../../core/storage/idb_adapter";
import { UserRole } from "../../../core/permissions/roles";
import { AppPermission, ROLE_PERMISSIONS } from "../../../core/permissions/permissions";
import { AuthException, NotFoundException } from "../../../core/errors/app_exception";

const CURRENT_USER_STORAGE_KEY = "agb_current_user_id";
const ROLE_PERMISSIONS_STORAGE_KEY = "agb_custom_role_permissions";

export class AuthRepositoryImpl implements IAuthRepository {
  private static instance: AuthRepositoryImpl;

  public static getInstance(): AuthRepositoryImpl {
    if (!AuthRepositoryImpl.instance) {
      AuthRepositoryImpl.instance = new AuthRepositoryImpl();
    }
    return AuthRepositoryImpl.instance;
  }

  /**
   * Initialise les données de démarrage si la base est vierge
   */
  public async initializeSeedData(): Promise<void> {
    try {
      const existingUsers = await IdbAdapter.getAll<UserEntity>(IdbAdapter.STORES.USERS);
      if (existingUsers.length === 0) {
        const now = new Date().toISOString();

        const defaultUsers: UserEntity[] = [
          {
            id: "usr_admin_01",
            name: "Directeur Général AGB",
            phone: "0104818092",
            email: "atsegillesbrice@gmail.com",
            role: UserRole.ADMINISTRATEUR,
            profileCategory: "ADMINISTRATEUR",
            passwordHash: "1234",
            mustChangePassword: true,
            isFirstLoginCompleted: false,
            identityDocument: null,
            status: "ACTIVE",
            matricule: "AGB-ADM-001",
            speciality: "Direction Générale & Stratégie BTP",
            createdAt: now,
            updatedAt: now,
          },
          {
            id: "usr_gerant_01",
            name: "Conducteur de Travaux Principal",
            phone: "0797709693",
            email: "gerant.btp@agb.ci",
            role: UserRole.CONDUCTEUR_DE_TRAVAUX,
            profileCategory: "GERANT",
            passwordHash: "1234",
            mustChangePassword: true,
            isFirstLoginCompleted: false,
            identityDocument: null,
            status: "ACTIVE",
            matricule: "AGB-GER-002",
            speciality: "Pilotage Multi-Chantiers & Budgets",
            createdAt: now,
            updatedAt: now,
          },
          {
            id: "usr_emp_01",
            name: "Kouamé Jean-Luc",
            phone: "0501020304",
            email: "kouame.jl@agb.ci",
            role: UserRole.CHEF_D_EQUIPE,
            profileCategory: "EMPLOYE",
            passwordHash: "1234",
            mustChangePassword: true,
            isFirstLoginCompleted: false,
            identityDocument: null,
            status: "ACTIVE",
            matricule: "AGB-EMP-003",
            speciality: "Gros Œuvre & Maçonnerie",
            createdAt: now,
            updatedAt: now,
          },
          {
            id: "usr_emp_02",
            name: "Traoré Moussa",
            phone: "0708091011",
            email: "traore.moussa@agb.ci",
            role: UserRole.OUVRIER,
            profileCategory: "EMPLOYE",
            passwordHash: "1234",
            mustChangePassword: true,
            isFirstLoginCompleted: false,
            identityDocument: null,
            status: "ACTIVE",
            matricule: "AGB-EMP-004",
            speciality: "Ferraillage & Coffrage",
            createdAt: now,
            updatedAt: now,
          },
          {
            id: "usr_emp_03",
            name: "Bamba Fatou",
            phone: "0102030405",
            email: "bamba.hse@agb.ci",
            role: UserRole.HSE,
            profileCategory: "EMPLOYE",
            passwordHash: "1234",
            mustChangePassword: true,
            isFirstLoginCompleted: false,
            identityDocument: null,
            status: "ACTIVE",
            matricule: "AGB-EMP-005",
            speciality: "Contrôle Sécurité & Port des EPI",
            createdAt: now,
            updatedAt: now,
          },
        ];

        for (const user of defaultUsers) {
          await IdbAdapter.put(IdbAdapter.STORES.USERS, user);
        }
      }
    } catch (e) {
      console.warn("Erreur initialisation données utilisateurs:", e);
    }
  }

  public async login(phone: string, password: string): Promise<UserEntity> {
    await this.initializeSeedData();
    const cleanPhone = phone.replace(/\s+/g, "").trim();

    const users = await IdbAdapter.getAll<UserEntity>(IdbAdapter.STORES.USERS);
    const user = users.find((u) => u.phone.replace(/\s+/g, "").trim() === cleanPhone);

    if (!user) {
      throw new AuthException(
        `Aucun compte n'a été trouvé avec le numéro ${phone}. Veuillez vérifier ou contacter l'Administrateur.`
      );
    }

    if (user.passwordHash !== password) {
      throw new AuthException("Mot de passe incorrect. Le mot de passe par défaut est '1234'.");
    }

    if (user.status === "SUSPENDED" || user.status === "INACTIVE") {
      throw new AuthException("Ce compte est actuellement désactivé. Veuillez contacter l'Administrateur.");
    }

    user.lastLoginAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();
    await IdbAdapter.put(IdbAdapter.STORES.USERS, user);

    if (typeof window !== "undefined") {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, user.id);
    }

    return user;
  }

  public async getCurrentUser(): Promise<UserEntity | null> {
    await this.initializeSeedData();
    if (typeof window === "undefined") return null;

    const currentUserId = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!currentUserId) return null;

    const user = await IdbAdapter.getById<UserEntity>(IdbAdapter.STORES.USERS, currentUserId);
    return user;
  }

  public async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  }

  public async completeFirstLogin(
    userId: string,
    newPassword: string,
    identityDoc: IdentityDocument
  ): Promise<UserEntity> {
    const user = await IdbAdapter.getById<UserEntity>(IdbAdapter.STORES.USERS, userId);
    if (!user) {
      throw new NotFoundException("Utilisateur non trouvé");
    }

    if (!newPassword || newPassword.trim().length < 4) {
      throw new AuthException("Le nouveau mot de passe doit comporter au moins 4 caractères.");
    }

    if (newPassword === "1234") {
      throw new AuthException("Le nouveau mot de passe ne peut pas être le mot de passe par défaut '1234'.");
    }

    if (!identityDoc || !identityDoc.documentNumber || !identityDoc.type) {
      throw new AuthException("Veuillez renseigner le type et le numéro de votre pièce d'identité.");
    }

    const updatedUser: UserEntity = {
      ...user,
      passwordHash: newPassword,
      mustChangePassword: false,
      isFirstLoginCompleted: true,
      identityDocument: {
        ...identityDoc,
        verified: true,
        uploadedAt: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    };

    await IdbAdapter.put(IdbAdapter.STORES.USERS, updatedUser);

    if (typeof window !== "undefined") {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, updatedUser.id);
    }

    return updatedUser;
  }

  public async getUsers(profileCategory?: ProfileCategory): Promise<UserEntity[]> {
    await this.initializeSeedData();
    const users = await IdbAdapter.getAll<UserEntity>(IdbAdapter.STORES.USERS);
    if (profileCategory) {
      return users.filter((u) => u.profileCategory === profileCategory);
    }
    return users;
  }

  public async getUserById(id: string): Promise<UserEntity | null> {
    return IdbAdapter.getById<UserEntity>(IdbAdapter.STORES.USERS, id);
  }

  public async createEmployee(dto: CreateEmployeeDTO): Promise<UserEntity> {
    await this.initializeSeedData();
    const cleanPhone = dto.phone.replace(/\s+/g, "").trim();

    if (!dto.name || dto.name.trim().length < 2) {
      throw new AuthException("Le nom de l'employé est obligatoire (au moins 2 caractères).");
    }

    if (!cleanPhone || cleanPhone.length < 6) {
      throw new AuthException("Le numéro de téléphone est obligatoire.");
    }

    const existingUsers = await IdbAdapter.getAll<UserEntity>(IdbAdapter.STORES.USERS);
    const alreadyExists = existingUsers.some(
      (u) => u.phone.replace(/\s+/g, "").trim() === cleanPhone
    );

    if (alreadyExists) {
      throw new AuthException(`Un employé avec le numéro de téléphone ${dto.phone} existe déjà.`);
    }

    // Déterminer la catégorie de profil selon le rôle
    let profileCat: ProfileCategory = "EMPLOYE";
    if (dto.role === UserRole.ADMINISTRATEUR) {
      profileCat = "ADMINISTRATEUR";
    } else if (
      dto.role === UserRole.CONDUCTEUR_DE_TRAVAUX ||
      dto.role === UserRole.CHEF_DE_CHANTIER ||
      dto.role === UserRole.MAITRE_D_OEUVRE
    ) {
      profileCat = "GERANT";
    }

    const now = new Date().toISOString();
    const matricule = `AGB-${profileCat.substring(0, 3)}-${Math.floor(100 + Math.random() * 900)}`;

    const newEmployee: UserEntity = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: dto.name.trim(),
      phone: cleanPhone,
      role: dto.role,
      profileCategory: profileCat,
      passwordHash: "1234", // Mot de passe par défaut
      mustChangePassword: true, // Doit changer à la 1ère connexion
      isFirstLoginCompleted: false, // Doit fournir sa pièce d'identité
      identityDocument: null,
      customPermissions: dto.customPermissions || undefined,
      speciality: dto.speciality?.trim() || "Ouvrier Spécialisé BTP",
      matricule,
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };

    await IdbAdapter.put(IdbAdapter.STORES.USERS, newEmployee);
    return newEmployee;
  }

  public async deleteEmployee(id: string): Promise<boolean> {
    const user = await IdbAdapter.getById<UserEntity>(IdbAdapter.STORES.USERS, id);
    if (!user) return false;

    // Ne pas supprimer le compte Administrateur racine
    if (user.role === UserRole.ADMINISTRATEUR && user.id === "usr_admin_01") {
      throw new AuthException("Impossible de supprimer le compte Administrateur Principal.");
    }

    return IdbAdapter.delete(IdbAdapter.STORES.USERS, id);
  }

  public async resetPassword(userId: string, defaultPassword = "1234"): Promise<boolean> {
    const user = await IdbAdapter.getById<UserEntity>(IdbAdapter.STORES.USERS, userId);
    if (!user) return false;

    user.passwordHash = defaultPassword;
    user.mustChangePassword = true;
    user.isFirstLoginCompleted = false;
    user.updatedAt = new Date().toISOString();

    await IdbAdapter.put(IdbAdapter.STORES.USERS, user);
    return true;
  }

  public async updateUser(userPartial: Partial<UserEntity> & { id: string }): Promise<UserEntity> {
    const existing = await IdbAdapter.getById<UserEntity>(IdbAdapter.STORES.USERS, userPartial.id);
    if (!existing) {
      throw new NotFoundException("Utilisateur introuvable");
    }

    const updated: UserEntity = {
      ...existing,
      ...userPartial,
      updatedAt: new Date().toISOString(),
    };

    await IdbAdapter.put(IdbAdapter.STORES.USERS, updated);
    return updated;
  }

  public async getRolePermissions(): Promise<Record<UserRole, AppPermission[]>> {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(ROLE_PERMISSIONS_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.warn("Erreur lecture permissions personnalisées:", e);
        }
      }
    }
    return { ...ROLE_PERMISSIONS };
  }

  public async updateRolePermissions(
    role: UserRole,
    permissions: AppPermission[]
  ): Promise<Record<UserRole, AppPermission[]>> {
    const current = await this.getRolePermissions();
    const updated = {
      ...current,
      [role]: permissions,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(ROLE_PERMISSIONS_STORAGE_KEY, JSON.stringify(updated));
    }

    return updated;
  }

  public async resetRolePermissionsToDefault(): Promise<Record<UserRole, AppPermission[]>> {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ROLE_PERMISSIONS_STORAGE_KEY);
    }
    return { ...ROLE_PERMISSIONS };
  }
}
