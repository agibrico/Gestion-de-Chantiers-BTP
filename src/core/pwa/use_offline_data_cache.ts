/**
 * AGB CHANTIER SaaS - Hook React pour la Gestion du Cache Hors-Ligne Chef de Chantier
 */

import { useState, useEffect, useCallback } from "react";
import {
  offlineCacheService,
  CacheInfoState,
  OfflineDataSnapshot,
} from "./offline_cache_service";
import { ProjectEntity } from "../../features/projects/domain/entities/project_entity";

export function useOfflineDataCache() {
  const [cacheState, setCacheState] = useState<CacheInfoState>(() =>
    offlineCacheService.getState()
  );
  const [cachedSnapshot, setCachedSnapshot] = useState<OfflineDataSnapshot | null>(null);
  const [isLoadingSnapshot, setIsLoadingSnapshot] = useState(false);

  useEffect(() => {
    const unsubscribe = offlineCacheService.subscribe((state) => {
      setCacheState(state);
    });
    return () => unsubscribe();
  }, []);

  const syncNow = useCallback(async (projects?: ProjectEntity[]) => {
    return await offlineCacheService.syncMainDataSnapshot(projects);
  }, []);

  const loadSnapshot = useCallback(async () => {
    setIsLoadingSnapshot(true);
    try {
      const data = await offlineCacheService.getCachedSnapshot();
      setCachedSnapshot(data);
      return data;
    } finally {
      setIsLoadingSnapshot(false);
    }
  }, []);

  return {
    ...cacheState,
    syncNow,
    loadSnapshot,
    cachedSnapshot,
    isLoadingSnapshot,
  };
}
