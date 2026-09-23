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
        const items = await IdbAdapter.getAllUnscoped(storeName);
        backup[key] = items;
      } catch (error) {
        throw new Error(`Sauvegarde interrompue : lecture impossible de ${key}`, { cause: error });
      }
    }
    return backup;
  }

  /**
   * Restaure les données depuis un export JSON
   */
  public static async importData(backup: Record<string, unknown[]>): Promise<void> {
    if (!backup || typeof backup !== "object" || Array.isArray(backup)) throw new Error("Sauvegarde invalide.");
    const entries = Object.entries(backup);
    const stores = IdbAdapter.STORES as Record<string, string>;
    for (const [key, items] of entries) {
      if (!Object.hasOwn(stores, key) || !Array.isArray(items)) throw new Error(`Table inconnue ou invalide : ${key}`);
      const ids = new Set<string>();
      for (const item of items) {
        if (!item || typeof item !== "object" || !("id" in item) || typeof item.id !== "string" || !item.id.trim() || ids.has(item.id)) {
          throw new Error(`Identifiant absent ou dupliqué dans ${key}`);
        }
        ids.add(item.id);
      }
    }
    if (!entries.length) return;
    const db = await IdbAdapter.getDb();
    // Merge all tables atomically. Existing records absent from the backup are preserved.
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(entries.map(([key]) => stores[key]), "readwrite");
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(new Error("Import annulé ; aucune modification conservée."));
      try {
        for (const [key, items] of entries) for (const item of items) tx.objectStore(stores[key]).put(item);
      } catch {
        tx.abort();
      }
    });
  }

  /**
   * Réinitialise les données locales (utile pour tests / mise à zéro)
   */
  public static async resetDatabase(): Promise<void> {
    for (const storeName of Object.values(IdbAdapter.STORES)) {
      const items = await IdbAdapter.getAllUnscoped(storeName);
      for (const item of items) {
        await IdbAdapter.hardDelete(storeName, item.id);
      }
    }
    LocalStorageService.clearAll();
    localStorage.removeItem("agb_current_user_id");
  }
}
