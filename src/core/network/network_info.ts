/**
 * AGB CHANTIER - Gestionnaire d'État Réseau et Détection de Connectivité
 */

export type NetworkStatusListener = (isOnline: boolean) => void;

export class NetworkInfo {
  private static listeners: Set<NetworkStatusListener> = new Set();
  private static isOnlineState = typeof navigator !== "undefined" ? navigator.onLine : true;
  private static initialized = false;

  public static initialize(): void {
    if (this.initialized || typeof window === "undefined") return;

    window.addEventListener("online", () => {
      this.isOnlineState = true;
      this.notifyListeners(true);
    });

    window.addEventListener("offline", () => {
      this.isOnlineState = false;
      this.notifyListeners(false);
    });

    this.initialized = true;
  }

  public static get isOnline(): boolean {
    if (typeof navigator !== "undefined") {
      return navigator.onLine;
    }
    return this.isOnlineState;
  }

  public static addListener(listener: NetworkStatusListener): () => void {
    this.listeners.add(listener);
    // Notify immediately with current status
    listener(this.isOnline);
    return () => this.listeners.delete(listener);
  }

  private static notifyListeners(isOnline: boolean): void {
    this.listeners.forEach((listener) => {
      try {
        listener(isOnline);
      } catch (e) {
        console.error("[NetworkInfo] Error notifying listener:", e);
      }
    });
  }
}
