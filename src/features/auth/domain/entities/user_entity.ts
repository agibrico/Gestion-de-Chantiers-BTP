/**
 * AGB CHANTIER - Entité Utilisateur & Profil Métier (RBAC)
 */

import { UserRole } from "../../../../core/permissions/roles";
import { AppPermission } from "../../../../core/permissions/permissions";
import { IdentityDocument } from "./identity_document";
import { BaseEntity } from "../../../../core/storage/idb_adapter";

export type ProfileCategory = "ADMINISTRATEUR" | "GERANT" | "EMPLOYE";

export interface UserEntity extends BaseEntity {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  profileCategory: ProfileCategory;
  passwordHash: string; // Mot de passe (1234 par défaut)
  mustChangePassword: boolean; // true si mot de passe par défaut
  isFirstLoginCompleted: boolean; // true quand mdp changé ET pièce d'identité fournie
  identityDocument?: IdentityDocument | null;
  customPermissions?: AppPermission[]; // Permissions personnalisées allouées par l'administrateur
  speciality?: string;
  matricule?: string;
  avatarUrl?: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
  lastLoginAt?: string;
}

export interface UserCredentials {
  phone: string;
  password: string;
}

export interface CreateEmployeeDTO {
  name: string;
  phone: string;
  role: UserRole;
  speciality?: string;
  customPermissions?: AppPermission[];
}
