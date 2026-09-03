/**
 * AGB CHANTIER - Système de Permissions Fines Granulaires (RBAC)
 */

import { UserRole } from "./roles";

export enum AppPermission {
  // Chantiers & Projets
  PROJECT_VIEW = "project:view",
  PROJECT_CREATE = "project:create",
  PROJECT_EDIT = "project:edit",
  PROJECT_DELETE = "project:delete",
  PROJECT_ARCHIVE = "project:archive",

  // Clients & Maîtrise d'Ouvrage
  CLIENT_VIEW = "client:view",
  CLIENT_CREATE = "client:create",
  CLIENT_EDIT = "client:edit",
  CLIENT_DELETE = "client:delete",

  // Planning & Tâches
  PLANNING_VIEW = "planning:view",
  PLANNING_MANAGE = "planning:manage",
  TASK_CREATE = "task:create",
  TASK_UPDATE_STATUS = "task:update_status",
  TASK_ASSIGN = "task:assign",

  // Pointage & Effectif
  ATTENDANCE_VIEW = "attendance:view",
  ATTENDANCE_RECORD = "attendance:record",
  ATTENDANCE_VALIDATE = "attendance:validate",

  // Stocks & Matériaux
  STOCK_VIEW = "stock:view",
  STOCK_MANAGE = "stock:manage",
  PURCHASE_ORDER_CREATE = "purchase_order:create",
  PURCHASE_ORDER_APPROVE = "purchase_order:approve",

  // Finances & Dépenses
  FINANCE_VIEW = "finance:view",
  FINANCE_EXPENSE_ADD = "finance:expense_add",
  FINANCE_EXPENSE_APPROVE = "finance:expense_approve",
  FINANCE_BUDGET_EDIT = "finance:budget_edit",

  // Journal de Chantier
  SITE_DIARY_VIEW = "site_diary:view",
  SITE_DIARY_WRITE = "site_diary:write",
  SITE_DIARY_VALIDATE = "site_diary:validate",

  // HSE & Sécurité
  HSE_VIEW = "hse:view",
  HSE_INCIDENT_REPORT = "hse:incident_report",
  HSE_INSPECTION_CONDUCT = "hse:inspection_conduct",

  // Contrôle Qualité & Réserves
  QUALITY_VIEW = "quality:view",
  QUALITY_INSPECT = "quality:inspect",
  RESERVATION_CREATE = "reservation:create",
  RESERVATION_RESOLVE = "reservation:resolve",
  RESERVATION_LIFT = "reservation:lift", // Levée définitive par architecte/MOE

  // Documents & Rapports
  DOCUMENT_VIEW = "document:view",
  DOCUMENT_UPLOAD = "document:upload",
  REPORT_GENERATE = "report:generate",
  REPORT_SIGN = "report:sign",

  // Audit & Paramètres
  AUDIT_VIEW = "audit:view",
  SETTINGS_MANAGE = "settings:manage",
  USERS_MANAGE = "users:manage",
  BACKUP_MANAGE = "backup:manage",
}

export const ROLE_PERMISSIONS: Record<UserRole, AppPermission[]> = {
  [UserRole.ADMINISTRATEUR]: Object.values(AppPermission),

  [UserRole.MAITRE_D_OUVRAGE]: [
    AppPermission.PROJECT_VIEW,
    AppPermission.CLIENT_VIEW,
    AppPermission.PLANNING_VIEW,
    AppPermission.FINANCE_VIEW,
    AppPermission.SITE_DIARY_VIEW,
    AppPermission.HSE_VIEW,
    AppPermission.QUALITY_VIEW,
    AppPermission.RESERVATION_CREATE,
    AppPermission.DOCUMENT_VIEW,
    AppPermission.REPORT_GENERATE,
    AppPermission.REPORT_SIGN,
  ],

  [UserRole.MAITRE_D_OEUVRE]: [
    AppPermission.PROJECT_VIEW,
    AppPermission.PROJECT_EDIT,
    AppPermission.PLANNING_VIEW,
    AppPermission.PLANNING_MANAGE,
    AppPermission.TASK_CREATE,
    AppPermission.TASK_UPDATE_STATUS,
    AppPermission.SITE_DIARY_VIEW,
    AppPermission.SITE_DIARY_VALIDATE,
    AppPermission.HSE_VIEW,
    AppPermission.QUALITY_VIEW,
    AppPermission.QUALITY_INSPECT,
    AppPermission.RESERVATION_CREATE,
    AppPermission.RESERVATION_LIFT,
    AppPermission.DOCUMENT_VIEW,
    AppPermission.DOCUMENT_UPLOAD,
    AppPermission.REPORT_GENERATE,
    AppPermission.REPORT_SIGN,
  ],

  [UserRole.ARCHITECTE]: [
    AppPermission.PROJECT_VIEW,
    AppPermission.PLANNING_VIEW,
    AppPermission.QUALITY_VIEW,
    AppPermission.QUALITY_INSPECT,
    AppPermission.RESERVATION_CREATE,
    AppPermission.RESERVATION_LIFT,
    AppPermission.DOCUMENT_VIEW,
    AppPermission.DOCUMENT_UPLOAD,
    AppPermission.REPORT_GENERATE,
    AppPermission.SITE_DIARY_VIEW,
  ],

  [UserRole.CONDUCTEUR_DE_TRAVAUX]: [
    AppPermission.PROJECT_VIEW,
    AppPermission.PROJECT_CREATE,
    AppPermission.PROJECT_EDIT,
    AppPermission.CLIENT_VIEW,
    AppPermission.PLANNING_VIEW,
    AppPermission.PLANNING_MANAGE,
    AppPermission.TASK_CREATE,
    AppPermission.TASK_UPDATE_STATUS,
    AppPermission.TASK_ASSIGN,
    AppPermission.ATTENDANCE_VIEW,
    AppPermission.ATTENDANCE_VALIDATE,
    AppPermission.STOCK_VIEW,
    AppPermission.STOCK_MANAGE,
    AppPermission.PURCHASE_ORDER_CREATE,
    AppPermission.PURCHASE_ORDER_APPROVE,
    AppPermission.FINANCE_VIEW,
    AppPermission.FINANCE_EXPENSE_ADD,
    AppPermission.FINANCE_EXPENSE_APPROVE,
    AppPermission.FINANCE_BUDGET_EDIT,
    AppPermission.SITE_DIARY_VIEW,
    AppPermission.SITE_DIARY_WRITE,
    AppPermission.SITE_DIARY_VALIDATE,
    AppPermission.HSE_VIEW,
    AppPermission.HSE_INCIDENT_REPORT,
    AppPermission.QUALITY_VIEW,
    AppPermission.RESERVATION_CREATE,
    AppPermission.RESERVATION_RESOLVE,
    AppPermission.DOCUMENT_VIEW,
    AppPermission.DOCUMENT_UPLOAD,
    AppPermission.REPORT_GENERATE,
  ],

  [UserRole.CHEF_DE_CHANTIER]: [
    AppPermission.PROJECT_VIEW,
    AppPermission.PLANNING_VIEW,
    AppPermission.TASK_CREATE,
    AppPermission.TASK_UPDATE_STATUS,
    AppPermission.TASK_ASSIGN,
    AppPermission.ATTENDANCE_VIEW,
    AppPermission.ATTENDANCE_RECORD,
    AppPermission.STOCK_VIEW,
    AppPermission.STOCK_MANAGE,
    AppPermission.PURCHASE_ORDER_CREATE,
    AppPermission.FINANCE_EXPENSE_ADD,
    AppPermission.SITE_DIARY_VIEW,
    AppPermission.SITE_DIARY_WRITE,
    AppPermission.HSE_VIEW,
    AppPermission.HSE_INCIDENT_REPORT,
    AppPermission.QUALITY_VIEW,
    AppPermission.RESERVATION_CREATE,
    AppPermission.RESERVATION_RESOLVE,
    AppPermission.DOCUMENT_VIEW,
    AppPermission.DOCUMENT_UPLOAD,
    AppPermission.REPORT_GENERATE,
  ],

  [UserRole.CHEF_D_EQUIPE]: [
    AppPermission.PROJECT_VIEW,
    AppPermission.PLANNING_VIEW,
    AppPermission.TASK_UPDATE_STATUS,
    AppPermission.ATTENDANCE_RECORD,
    AppPermission.SITE_DIARY_VIEW,
    AppPermission.HSE_INCIDENT_REPORT,
    AppPermission.DOCUMENT_VIEW,
  ],

  [UserRole.OUVRIER]: [
    AppPermission.PROJECT_VIEW,
    AppPermission.TASK_UPDATE_STATUS,
    AppPermission.ATTENDANCE_RECORD,
    AppPermission.HSE_INCIDENT_REPORT,
  ],

  [UserRole.HSE]: [
    AppPermission.PROJECT_VIEW,
    AppPermission.HSE_VIEW,
    AppPermission.HSE_INCIDENT_REPORT,
    AppPermission.HSE_INSPECTION_CONDUCT,
    AppPermission.SITE_DIARY_VIEW,
    AppPermission.DOCUMENT_VIEW,
    AppPermission.DOCUMENT_UPLOAD,
    AppPermission.REPORT_GENERATE,
  ],

  [UserRole.GEOMETRE]: [
    AppPermission.PROJECT_VIEW,
    AppPermission.QUALITY_VIEW,
    AppPermission.QUALITY_INSPECT,
    AppPermission.DOCUMENT_VIEW,
    AppPermission.DOCUMENT_UPLOAD,
  ],

  [UserRole.CONTROLEUR]: [
    AppPermission.PROJECT_VIEW,
    AppPermission.QUALITY_VIEW,
    AppPermission.QUALITY_INSPECT,
    AppPermission.RESERVATION_CREATE,
    AppPermission.RESERVATION_LIFT,
    AppPermission.DOCUMENT_VIEW,
    AppPermission.DOCUMENT_UPLOAD,
    AppPermission.REPORT_GENERATE,
  ],

  [UserRole.FOURNISSEUR]: [
    AppPermission.STOCK_VIEW,
    AppPermission.DOCUMENT_VIEW,
  ],

  [UserRole.SOUS_TRAITANT]: [
    AppPermission.PROJECT_VIEW,
    AppPermission.PLANNING_VIEW,
    AppPermission.TASK_UPDATE_STATUS,
    AppPermission.DOCUMENT_VIEW,
    AppPermission.DOCUMENT_UPLOAD,
  ],
};

export class PermissionService {
  public static hasPermission(userRole: UserRole, permission: AppPermission): boolean {
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    return permissions.includes(permission);
  }

  public static hasAnyPermission(userRole: UserRole, permissions: AppPermission[]): boolean {
    return permissions.some((perm) => this.hasPermission(userRole, perm));
  }

  public static hasAllPermissions(userRole: UserRole, permissions: AppPermission[]): boolean {
    return permissions.every((perm) => this.hasPermission(userRole, perm));
  }
}
