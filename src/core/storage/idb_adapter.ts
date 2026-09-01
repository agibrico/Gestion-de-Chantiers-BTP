/**
 * AGB CHANTIER - Adaptateur IndexedDB Robuste pour Mode Hors Connexion (Offline-First)
 */

import { APP_CONFIG } from "../constants/app_constants";
import { DatabaseException } from "../errors/app_exception";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  syncStatus?: "local" | "pending" | "syncing" | "synced" | "failed";
}

export class IdbAdapter {
  private static dbInstance: IDBDatabase | null = null;

  public static readonly STORES = {
    USERS: "users",
    PROJECTS: "projects",
    CLIENTS: "clients",
    STAKEHOLDERS: "stakeholders",
    TEAMS: "teams",
    PHASES: "phases",
    TASKS: "tasks",
    ATTENDANCE: "attendance",
    INVENTORY_ITEMS: "inventory_items",
    STOCK_MOVEMENTS: "stock_movements",
    SUPPLIERS: "suppliers",
    PURCHASE_ORDERS: "purchase_orders",
    EXPENSES: "expenses",
    BUDGETS: "budgets",
    EQUIPMENTS: "equipments",
    SITE_DIARY_ENTRIES: "site_diary_entries",
    PHOTOS: "photos",
    QUALITY_INSPECTIONS: "quality_inspections",
    HSE_INCIDENTS: "hse_incidents",
    RESERVATIONS: "reservations",
    DOCUMENTS: "documents",
    RECEPTIONS: "receptions",
    HANDOVERS: "handovers",
    NOTIFICATIONS: "notifications",
    AUDIT_LOGS: "audit_logs",
    SYNC_QUEUE: "sync_queue",
  } as const;

  /**
   * Initialise ou récupère l'instance ouverte de la base IndexedDB
   */
  public static async getDb(): Promise<IDBDatabase> {
    if (this.dbInstance) {
      return this.dbInstance;
    }

    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.indexedDB) {
        reject(new DatabaseException("IndexedDB non disponible dans cet environnement"));
        return;
      }

      const request = window.indexedDB.open(APP_CONFIG.DB_NAME, APP_CONFIG.DB_VERSION);

      request.onerror = () => {
        reject(new DatabaseException(`Erreur ouverture IndexedDB: ${request.error?.message}`));
      };

      request.onsuccess = () => {
        this.dbInstance = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Création de tous les stores métier
        Object.values(this.STORES).forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: "id" });
            store.createIndex("createdAt", "createdAt", { unique: false });
            store.createIndex("updatedAt", "updatedAt", { unique: false });
            if (storeName === this.STORES.PROJECTS) {
              store.createIndex("status", "status", { unique: false });
              store.createIndex("clientId", "clientId", { unique: false });
            }
            if (storeName === this.STORES.TASKS) {
              store.createIndex("projectId", "projectId", { unique: false });
              store.createIndex("status", "status", { unique: false });
            }
            if (storeName === this.STORES.EXPENSES) {
              store.createIndex("projectId", "projectId", { unique: false });
              store.createIndex("category", "category", { unique: false });
            }
            if (storeName === this.STORES.SYNC_QUEUE) {
              store.createIndex("status", "status", { unique: false });
            }
          }
        });
      };
    });
  }

  /**
   * Insère ou met à jour une entité
   */
  public static async put<T extends BaseEntity>(storeName: string, entity: T): Promise<T> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);

      const record: T = {
        ...entity,
        updatedAt: entity.updatedAt || new Date().toISOString(),
        createdAt: entity.createdAt || new Date().toISOString(),
        syncStatus: entity.syncStatus || "local",
      };

      const request = store.put(record);

      request.onsuccess = () => resolve(record);
      request.onerror = () => reject(new DatabaseException(`Erreur d'écriture dans ${storeName}: ${request.error?.message}`));
    });
  }

  /**
   * Récupère un enregistrement par son identifiant unique
   */
  public static async getById<T extends BaseEntity>(storeName: string, id: string): Promise<T | null> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        const item = request.result as T | undefined;
        if (!item || item.deletedAt) {
          resolve(null);
        } else {
          resolve(item);
        }
      };
      request.onerror = () => reject(new DatabaseException(`Erreur de lecture dans ${storeName}: ${request.error?.message}`));
    });
  }

  /**
   * Récupère tous les enregistrements actifs (non supprimés)
   */
  public static async getAll<T extends BaseEntity>(storeName: string): Promise<T[]> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const items = (request.result as T[]).filter((item) => !item.deletedAt);
        resolve(items);
      };
      request.onerror = () => reject(new DatabaseException(`Erreur de listing ${storeName}: ${request.error?.message}`));
    });
  }

  /**
   * Soft Delete d'une entité
   */
  public static async delete(storeName: string, id: string): Promise<boolean> {
    const item = await this.getById<BaseEntity>(storeName, id);
    if (!item) return false;

    item.deletedAt = new Date().toISOString();
    item.syncStatus = "pending";
    await this.put(storeName, item);
    return true;
  }

  /**
   * Suppression définitive (Hard Delete)
   */
  public static async hardDelete(storeName: string, id: string): Promise<boolean> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(new DatabaseException(`Erreur suppression dans ${storeName}: ${request.error?.message}`));
    });
  }

  /**
   * Compte les enregistrements actifs
   */
  public static async count(storeName: string): Promise<number> {
    const items = await this.getAll(storeName);
    return items.length;
  }
}
