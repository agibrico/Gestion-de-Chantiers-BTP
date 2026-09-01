/**
 * AGB CHANTIER - File d'attente de synchronisation Offline -> Online
 */

import { BaseEntity, IdbAdapter } from "../storage/idb_adapter";
import { NetworkInfo } from "./network_info";

export type SyncActionType = "CREATE" | "UPDATE" | "DELETE";

export interface SyncQueueItem extends BaseEntity {
  action: SyncActionType;
  entityType: string;
  entityId: string;
  payload: Record<string, unknown>;
  retryCount: number;
  lastAttemptAt?: string;
  errorMessage?: string;
  status: "pending" | "syncing" | "synced" | "failed";
}

export class SyncQueueManager {
  private static isSyncing = false;

  public static async enqueue(
    action: SyncActionType,
    entityType: string,
    entityId: string,
    payload: Record<string, unknown>
  ): Promise<SyncQueueItem> {
    const item: SyncQueueItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      action,
      entityType,
      entityId,
      payload,
      retryCount: 0,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await IdbAdapter.put(IdbAdapter.STORES.SYNC_QUEUE, item);

    // Auto-trigger sync if online
    if (NetworkInfo.isOnline) {
      this.processQueue().catch((e) => console.error("[SyncQueueManager] Auto-sync failed:", e));
    }

    return item;
  }

  public static async getPendingCount(): Promise<number> {
    try {
      const items = await IdbAdapter.getAll<SyncQueueItem>(IdbAdapter.STORES.SYNC_QUEUE);
      return items.filter((i) => i.status === "pending" || i.status === "failed").length;
    } catch {
      return 0;
    }
  }

  public static async processQueue(): Promise<{ syncedCount: number; failedCount: number }> {
    if (this.isSyncing || !NetworkInfo.isOnline) {
      return { syncedCount: 0, failedCount: 0 };
    }

    this.isSyncing = true;
    let syncedCount = 0;
    let failedCount = 0;

    try {
      const items = await IdbAdapter.getAll<SyncQueueItem>(IdbAdapter.STORES.SYNC_QUEUE);
      const pendingItems = items.filter((i) => i.status === "pending" || (i.status === "failed" && i.retryCount < 5));

      for (const item of pendingItems) {
        try {
          item.status = "syncing";
          item.lastAttemptAt = new Date().toISOString();
          await IdbAdapter.put(IdbAdapter.STORES.SYNC_QUEUE, item);

          // Simulation of remote API syncing (future remote connector)
          await new Promise((resolve) => setTimeout(resolve, 80));

          item.status = "synced";
          item.updatedAt = new Date().toISOString();
          await IdbAdapter.put(IdbAdapter.STORES.SYNC_QUEUE, item);
          syncedCount++;
        } catch (e) {
          item.status = "failed";
          item.retryCount += 1;
          item.errorMessage = e instanceof Error ? e.message : "Erreur sync";
          await IdbAdapter.put(IdbAdapter.STORES.SYNC_QUEUE, item);
          failedCount++;
        }
      }
    } finally {
      this.isSyncing = false;
    }

    return { syncedCount, failedCount };
  }
}
