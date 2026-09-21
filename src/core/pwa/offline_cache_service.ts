/**
 * AGB CHANTIER SaaS - Service de Gestion du Cache Hors-Ligne pour Chefs de Chantier
 * Coordonne la synchronisation des données principales avec le Service Worker (sw.js)
 * et garantit la consultation offline-first sur tablette ou smartphone de chantier.
 */

import { ProjectEntity } from "../../features/projects/domain/entities/project_entity";
import { ProjectRepositoryImpl } from "../../features/projects/data/project_repository_impl";
import { NetworkInfo } from "../network/network_info";

export interface OfflineDataSnapshot {
  offline: boolean;
  savedAt: string;
  chefDeChantier?: string;
  projectsCount: number;
  projects: ProjectEntity[];
  stats: {
    totalBudget: number;
    activeCount: number;
    delayedCount: number;
    workersCount: number;
  };
  siteDiaries: Array<{
    id: string;
    projectId: string;
    projectCode: string;
    date: string;
    weather: string;
    workSummary: string;
    workersCount: number;
  }>;
  safetyAlerts: Array<{
    id: string;
    projectCode: string;
    title: string;
    severity: string;
    date: string;
  }>;
  syncStatus: string;
}

export interface CacheInfoState {
  isServiceWorkerRegistered: boolean;
  isServiceWorkerActive: boolean;
  cacheVersion: string;
  cachedProjectsCount: number;
  lastSavedAt: string | null;
  staticAssetsCount: number;
  dataAssetsCount: number;
  isSyncing: boolean;
}

class OfflineCacheService {
  private static instance: OfflineCacheService;
  private readonly projectRepo = new ProjectRepositoryImpl();
  private cacheListeners: Set<(state: CacheInfoState) => void> = new Set();

  private currentState: CacheInfoState = {
    isServiceWorkerRegistered: false,
    isServiceWorkerActive: false,
    cacheVersion: "agb-chantier-v2",
    cachedProjectsCount: 0,
    lastSavedAt: null,
    staticAssetsCount: 0,
    dataAssetsCount: 0,
    isSyncing: false,
  };

  private constructor() {
    this.init();
  }

  public static getInstance(): OfflineCacheService {
    if (!OfflineCacheService.instance) {
      OfflineCacheService.instance = new OfflineCacheService();
    }
    return OfflineCacheService.instance;
  }

  /**
   * Initialisation du service et écoute des messages du Service Worker
   */
  private init(): void {
    if (typeof window === "undefined") return;

    // Charger les métadonnées de dernier enregistrement depuis localStorage
    try {
      const savedTime = localStorage.getItem("agb_sw_offline_last_sync");
      const savedCount = localStorage.getItem("agb_sw_offline_projects_count");
      if (savedTime) this.currentState.lastSavedAt = savedTime;
      if (savedCount) this.currentState.cachedProjectsCount = parseInt(savedCount, 10) || 0;
    } catch {
      // Ignorer si localStorage restreint
    }

    if ("serviceWorker" in navigator) {
      this.currentState.isServiceWorkerRegistered = true;

      // Écouter les messages émis par sw.js
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (!event.data || typeof event.data !== "object") return;

        const { type } = event.data;

        if (type === "OFFLINE_DATA_SNAPSHOT_SAVED") {
          this.currentState.lastSavedAt = event.data.savedAt || new Date().toISOString();
          this.currentState.cachedProjectsCount = event.data.projectsCount || 0;
          this.currentState.isSyncing = false;
          try {
            localStorage.setItem("agb_sw_offline_last_sync", this.currentState.lastSavedAt);
            localStorage.setItem("agb_sw_offline_projects_count", String(this.currentState.cachedProjectsCount));
          } catch {}
          this.notifyListeners();
        }

        if (type === "OFFLINE_CACHE_INFO_RESULT") {
          this.currentState.cacheVersion = event.data.cacheVersion || "agb-chantier-v2";
          this.currentState.staticAssetsCount = event.data.staticCount || 0;
          this.currentState.dataAssetsCount = event.data.dataCount || 0;
          this.currentState.isServiceWorkerActive = true;
          this.notifyListeners();
        }
      });

      // Vérifier si le controller SW est actif
      if (navigator.serviceWorker.controller) {
        this.currentState.isServiceWorkerActive = true;
        this.queryServiceWorkerCacheInfo();
      } else {
        navigator.serviceWorker.ready.then((reg) => {
          this.currentState.isServiceWorkerActive = !!reg.active;
          this.queryServiceWorkerCacheInfo();
        });
      }
    }

    // Auto-sync initial au démarrage si connecté
    if (NetworkInfo.isOnline) {
      setTimeout(() => {
        this.syncMainDataSnapshot().catch((err) => {
          console.warn("[OfflineCacheService] Auto-sync initial en arrière-plan:", err);
        });
      }, 2000);
    }
  }

  /**
   * Envoie une requête d'information sur les caches au Service Worker
   */
  public queryServiceWorkerCacheInfo(): void {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const controller = navigator.serviceWorker.controller;
    if (controller) {
      controller.postMessage({ type: "GET_OFFLINE_CACHE_INFO" });
    }
  }

  /**
   * Synchronise l'ensemble des données principales (Chantiers, Alertes, Journal, Stats)
   * avec le Service Worker pour garantir la consultation hors-ligne sur le terrain.
   */
  public async syncMainDataSnapshot(providedProjects?: ProjectEntity[]): Promise<{
    success: boolean;
    projectsCount: number;
    savedAt: string;
  }> {
    this.currentState.isSyncing = true;
    this.notifyListeners();

    try {
      // 1. Récupérer tous les chantiers (fournis ou depuis le repository)
      const projects = providedProjects || (await this.projectRepo.getAllProjects());

      // 2. Calculer les statistiques globales consolidées
      const totalBudget = projects.reduce((sum, p) => sum + (p.totalBudgetContracted || 0), 0);
      const activeCount = projects.filter((p) => p.status === "EN_COURS").length;
      const delayedCount = projects.filter((p) => {
        if (p.milestones?.some((m) => m.status === "EN_RETARD")) return true;
        if (p.phases?.some((ph) => ph.status === "RETARDEE")) return true;
        return false;
      }).length;
      const workersCount = projects.reduce((sum, p) => sum + (p.metrics?.workersOnSiteToday || 0), 0);

      // 3. Fiches représentatives de journal de chantier
      const siteDiaries = projects.map((p) => ({
        id: `diary_${p.id}`,
        projectId: p.id,
        projectCode: p.code,
        date: new Date().toISOString().split("T")[0],
        weather: p.weatherCondition || "ENSOLEILLE",
        workSummary: `Travaux en cours sur ${p.name}. Effectif mobilisé : ${p.metrics?.workersOnSiteToday || 0} ouvriers.`,
        workersCount: p.metrics?.workersOnSiteToday || 0,
      }));

      // 4. Alertes sécurité & conformité
      const safetyAlerts = projects
        .filter((p) => (p.metrics?.safetyIncidentsCount || 0) > 0 || p.riskLevel === "ELEVE")
        .map((p) => ({
          id: `alert_${p.id}`,
          projectCode: p.code,
          title: `Suivi sécurité renforcé : ${p.name}`,
          severity: p.riskLevel,
          date: new Date().toISOString().split("T")[0],
        }));

      const now = new Date().toISOString();

      const snapshotPayload = {
        siteManager: "Chef de Chantier AGB",
        projects,
        stats: {
          totalBudget,
          activeCount,
          delayedCount,
          workersCount,
        },
        siteDiaries,
        safetyAlerts,
        weatherInfo: {
          condition: "ENSOLEILLE",
          temp: 32,
          humidity: "65%",
          uvIndex: 8,
          windSpeedKmH: 14,
        },
      };

      // 5. Transmettre au Service Worker via postMessage
      let swMessaged = false;
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: "SAVE_OFFLINE_DATA_SNAPSHOT",
            payload: snapshotPayload,
          });
          swMessaged = true;
        } else {
          // Enregistrer via l'enregistrement actif
          const reg = await navigator.serviceWorker.ready;
          if (reg.active) {
            reg.active.postMessage({
              type: "SAVE_OFFLINE_DATA_SNAPSHOT",
              payload: snapshotPayload,
            });
            swMessaged = true;
          }
        }
      }

      // 6. Sauvegarde directe dans le Cache API par précaution (si disponible côté fenêtre)
      if (typeof window !== "undefined" && "caches" in window) {
        try {
          const cache = await window.caches.open("agb-chantier-v2-data");
          const jsonResponse = new Response(JSON.stringify(snapshotPayload), {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "X-AGB-Direct-Cache": "true",
              "X-AGB-Saved-At": now,
            },
          });
          await cache.put("/api/offline/main-data-snapshot.json", jsonResponse.clone());
          await cache.put("/api/projects", jsonResponse.clone());
        } catch (cacheErr) {
          console.warn("[OfflineCacheService] Cache API direct fallback:", cacheErr);
        }
      }

      // 7. Mise à jour de l'état local
      this.currentState.lastSavedAt = now;
      this.currentState.cachedProjectsCount = projects.length;
      this.currentState.isSyncing = false;
      try {
        localStorage.setItem("agb_sw_offline_last_sync", now);
        localStorage.setItem("agb_sw_offline_projects_count", String(projects.length));
      } catch {}

      this.notifyListeners();

      return {
        success: true,
        projectsCount: projects.length,
        savedAt: now,
      };
    } catch (error) {
      this.currentState.isSyncing = false;
      this.notifyListeners();
      console.error("[OfflineCacheService] Échec synchronisation cache:", error);
      throw error;
    }
  }

  /**
   * Récupère le snapshot des données principales (depuis le cache Service Worker ou local)
   */
  public async getCachedSnapshot(): Promise<OfflineDataSnapshot | null> {
    if (typeof window === "undefined") return null;

    // 1. Tenter via fetch('/api/offline/main-data-snapshot.json') intercepté par le Service Worker
    try {
      const response = await fetch("/api/offline/main-data-snapshot.json", {
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        return data as OfflineDataSnapshot;
      }
    } catch (e) {
      console.warn("[OfflineCacheService] Fetch SW snapshot échoué, essai direct Cache API:", e);
    }

    // 2. Tenter via Cache API directement
    if ("caches" in window) {
      try {
        const cache = await window.caches.open("agb-chantier-v2-data");
        const match = await cache.match("/api/offline/main-data-snapshot.json");
        if (match) {
          const data = await match.json();
          return data as OfflineDataSnapshot;
        }
      } catch {}
    }

    return null;
  }

  public getState(): CacheInfoState {
    return { ...this.currentState };
  }

  public subscribe(listener: (state: CacheInfoState) => void): () => void {
    this.cacheListeners.add(listener);
    listener(this.getState());
    return () => {
      this.cacheListeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const state = this.getState();
    this.cacheListeners.forEach((fn) => {
      try {
        fn(state);
      } catch (err) {
        console.error("[OfflineCacheService] Listener error:", err);
      }
    });
  }
}

export const offlineCacheService = OfflineCacheService.getInstance();
