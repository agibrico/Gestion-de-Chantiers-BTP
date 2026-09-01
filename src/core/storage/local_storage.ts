/**
 * AGB CHANTIER - Stockage Local Clé-Valeur Sécurisé
 */

export class LocalStorageService {
  private static PREFIX = "agb_chantier_";

  public static setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.PREFIX + key, serialized);
    } catch (e) {
      console.error("[LocalStorageService] Failed to set item:", key, e);
    }
  }

  public static getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (e) {
      console.error("[LocalStorageService] Failed to parse item:", key, e);
      return defaultValue;
    }
  }

  public static removeItem(key: string): void {
    try {
      localStorage.removeItem(this.PREFIX + key);
    } catch (e) {
      console.error("[LocalStorageService] Failed to remove item:", key, e);
    }
  }

  public static clearAll(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.error("[LocalStorageService] Failed to clear items:", e);
    }
  }
}
