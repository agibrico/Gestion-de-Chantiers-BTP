/**
 * AGB CHANTIER - Interface du Repository d'Authentification et Utilisateurs
 */

import { UserEntity, CreateEmployeeDTO, ProfileCategory } from "../entities/user_entity";
import { IdentityDocument } from "../entities/identity_document";
import { UserRole } from "../../../../core/permissions/roles";
import { AppPermission } from "../../../../core/permissions/permissions";

export interface IAuthRepository {
  // Session & Auth
  login(phone: string, password: string): Promise<UserEntity>;
  getCurrentUser(): Promise<UserEntity | null>;
  logout(): Promise<void>;
  completeFirstLogin(userId: string, newPassword: string, identityDoc: IdentityDocument): Promise<UserEntity>;
  
  // Gestion des Employés (Administrateur)
  getUsers(profileCategory?: ProfileCategory): Promise<UserEntity[]>;
  getUserById(id: string): Promise<UserEntity | null>;
  createEmployee(dto: CreateEmployeeDTO): Promise<UserEntity>;
  deleteEmployee(id: string): Promise<boolean>;
  resetPassword(userId: string, defaultPassword?: string): Promise<boolean>;
  updateUser(user: Partial<UserEntity> & { id: string }): Promise<UserEntity>;

  // Gestion des Permissions par Rôle (Administrateur)
  getRolePermissions(): Promise<Record<UserRole, AppPermission[]>>;
  updateRolePermissions(role: UserRole, permissions: AppPermission[]): Promise<Record<UserRole, AppPermission[]>>;
  resetRolePermissionsToDefault(): Promise<Record<UserRole, AppPermission[]>>;
}
