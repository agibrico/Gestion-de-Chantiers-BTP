/**
 * AGB CHANTIER - Système de Traçabilité & Journal d'Audit
 */

import { BaseEntity, IdbAdapter } from "../storage/idb_adapter";

export type AuditActionType =
  | "LOGIN"
  | "LOGOUT"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "VALIDATE"
  | "PAYMENT"
  | "STATUS_CHANGE"
  | "EXPORT_DATA"
  | "PERMISSION_CHANGE";

export interface AuditLogEntry extends BaseEntity {
  userId?: string;
  userName?: string;
  userRole?: string;
  action: AuditActionType;
  entityType: string;
  entityId?: string;
  oldValue?: string | null;
  newValue?: string | null;
  description: string;
  ipAddress?: string;
  timestamp: string;
}

export class AuditLogger {
  public static async log(
    action: AuditActionType,
    entityType: string,
    description: string,
    options?: {
      userId?: string;
      userName?: string;
      userRole?: string;
      entityId?: string;
      oldValue?: unknown;
      newValue?: unknown;
    }
  ): Promise<AuditLogEntry> {
    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      action,
      entityType,
      entityId: options?.entityId,
      userId: options?.userId || "anonymous",
      userName: options?.userName || "Système",
      userRole: options?.userRole || "ADMINISTRATEUR",
      description,
      oldValue: options?.oldValue ? JSON.stringify(options.oldValue) : null,
      newValue: options?.newValue ? JSON.stringify(options.newValue) : null,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await IdbAdapter.put(IdbAdapter.STORES.AUDIT_LOGS, entry);
    } catch (e) {
      console.warn("[AuditLogger] Failed to save audit entry:", e);
    }

    return entry;
  }

  public static async getRecentLogs(limit = 50): Promise<AuditLogEntry[]> {
    try {
      const logs = await IdbAdapter.getAll<AuditLogEntry>(IdbAdapter.STORES.AUDIT_LOGS);
      return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
    } catch {
      return [];
    }
  }
}
