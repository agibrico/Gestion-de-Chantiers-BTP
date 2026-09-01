/**
 * AGB CHANTIER - Service Centralisé de Base de Données
 */

import { IdbAdapter } from "./idb_adapter";
import { LocalStorageService } from "./local_storage";

export class DatabaseService {
  private static isInitialized = false;

  public static async initialize(): Promise<void> {
    if (this.isInitialized) return;
    try {
      await IdbAdapter.getDb();
      this.isInitialized = true;
      console.log("[DatabaseService] IndexedDB AGB CHANTIER initialisée avec succès.");
    } catch (e) {
      console.error("[DatabaseService] Échec initialisation IndexedDB:", e);
    }
  }

  /**
   * Exporte l'intégralité de la base de données en format JSON pour sauvegarde
   */
  public static async exportAllData(): Promise<Record<string, unknown[]>> {
    const backup: Record<string, unknown[]> = {};
    for (const [key, storeName] of Object.entries(IdbAdapter.STORES)) {
      try {
        const items = await IdbAdapter.getAll(storeName);
        backup[key] = items;
      } catch {
        backup[key] = [];
      }
    }
    return backup;
  }

  /**
   * Restaure les données depuis un export JSON
   */
  public static async importData(backup: Record<string, unknown[]>): Promise<void> {
    for (const [key, items] of Object.entries(backup)) {
      const storeName = (IdbAdapter.STORES as Record<string, string>)[key];
      if (storeName && Array.isArray(items)) {
        for (const item of items) {
          if (item && typeof item === "object" && "id" in item) {
            await IdbAdapter.put(storeName, item as any);
          }
        }
      }
    }
  }

  /**
   * Réinitialise les données locales (utile pour tests / mise à zéro)
   */
  public static async resetDatabase(): Promise<void> {
    for (const storeName of Object.values(IdbAdapter.STORES)) {
      const items = await IdbAdapter.getAll(storeName);
      for (const item of items) {
        await IdbAdapter.hardDelete(storeName, item.id);
      }
    }
    LocalStorageService.clearAll();
  }
}
