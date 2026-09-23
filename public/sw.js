/**
 * AGB CHANTIER SaaS - Service Worker v2 (Offline-First BTP)
 * Stratégie de mise en cache multi-niveaux pour Chefs de Chantier :
 * 1. Cache Shell Applicatif (Navigation & App Shell SPA)
 * 2. Cache Données Principales (Chantiers, Jalons, Journal, Effectifs, Métriques)
 * 3. Cache Ressources Statiques (Scripts, Styles, Fonts, Icônes, SVGs)
 * 4. Gestion IPC postMessage pour synchronisation bidirectionnelle client <-> SW
 */

const CACHE_VERSION = 'agb-chantier-v3-review';
const CACHE_STATIC_NAME = `${CACHE_VERSION}-static`;
const CACHE_DATA_NAME = `${CACHE_VERSION}-data`;
const CACHE_RUNTIME_NAME = `${CACHE_VERSION}-runtime`;

const ALL_CACHES = [CACHE_STATIC_NAME, CACHE_DATA_NAME, CACHE_RUNTIME_NAME];

// Ressources essentielles du Shell applicatif à pré-mettre en cache
const PRECACHE_STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.svg',
  '/icon-512.svg',
  '/agb_signature.svg'
];

// Snapshot initial par défaut des données principales BTP (fallback immédiat)
const DEFAULT_OFFLINE_DATA_SNAPSHOT = {
  offline: true,
  generatedAt: new Date().toISOString(),
  app: 'AGB CHANTIER SaaS',
  version: '2.0.0',
  description: 'Cache local offline des données principales pour chefs de chantier',
  summary: {
    status: 'CACHED_OFFLINE',
    message: 'Données disponibles en mode consultation déconnectée'
  },
  projectsCount: 0,
  projects: []
};

// URL virtuelle du snapshot de données pour les chefs de chantier
const OFFLINE_SNAPSHOT_URL = '/api/offline/main-data-snapshot.json';
const OFFLINE_PROJECTS_URL = '/api/projects';
const OFFLINE_STATS_URL = '/api/dashboard-stats';

/**
 * 1. INSTALLATION : Pré-mise en cache des fichiers essentiels et snapshot initial
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache des ressources statiques
      caches.open(CACHE_STATIC_NAME).then((cache) => {
        return cache.addAll(PRECACHE_STATIC_ASSETS).catch((err) => {
          console.warn('[AGB SW] Pré-cache partiel des statiques:', err);
        });
      }),
      // Cache du snapshot initial de données principales
      caches.open(CACHE_DATA_NAME).then((cache) => {
        const jsonResponse = new Response(JSON.stringify(DEFAULT_OFFLINE_DATA_SNAPSHOT), {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-AGB-Offline-Cache': 'true',
            'X-AGB-Cache-Time': new Date().toISOString(),
          },
        });
        return cache.put(OFFLINE_SNAPSHOT_URL, jsonResponse).catch((err) => {
          console.warn('[AGB SW] Pré-cache snapshot données:', err);
        });
      }),
    ]).then(() => self.skipWaiting())
  );
});

/**
 * 2. ACTIVATION : Nettoyage des anciens caches obsolètes et prise de contrôle
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => !ALL_CACHES.includes(key))
          .map((key) => {
            console.log('[AGB SW] Suppression ancien cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

/**
 * 3. INTERCEPTION FETCH : Stratégies différenciées par type de requête
 */
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignorer requêtes non-GET et schémas hors HTTP(S)
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // A. REQUÊTES DE NAVIGATION (Page HTML / SPA App Shell)
  // Stratégie : Réseau d'abord avec bascule ultra-rapide sur le cache hors-ligne
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_STATIC_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Hors-ligne : Retourner le App Shell pré-mis en cache
          console.log('[AGB SW] Mode hors-ligne détecté pour la navigation, retour App Shell index.html');
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;

          const cachedShell = await caches.match('/index.html');
          if (cachedShell) return cachedShell;

          return caches.match('/');
        })
    );
    return;
  }

  // B. REQUÊTES DE DONNÉES PRINCIPALES & APIs (/api/*, *.json, offline snapshot)
  // Stratégie : Réseau d'abord avec mise en cache, fallback automatique sur le snapshot de données hors-ligne
  const isDataRequest =
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/offline-data') ||
    url.pathname.endsWith('.json') ||
    url.searchParams.has('format', 'json');

  if (isDataRequest) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_DATA_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          console.log('[AGB SW] Réseau indisponible pour les données, consultation du cache:', url.pathname);
          // 1. Chercher la requête exacte en cache
          const matchedResponse = await caches.match(request);
          if (matchedResponse) return matchedResponse;

          // 2. Si non trouvée, fallback sur le snapshot de données principales
          const snapshotResponse = await caches.match(OFFLINE_SNAPSHOT_URL);
          if (snapshotResponse) {
            return snapshotResponse;
          }

          // 3. Fallback d'urgence JSON formaté
          return new Response(JSON.stringify(DEFAULT_OFFLINE_DATA_SNAPSHOT), {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'X-AGB-Fallback': 'emergency-snapshot',
            },
          });
        })
    );
    return;
  }

  // C. RESSOURCES STATIQUES LOCALES (JS, CSS, SVGs, Images, Polices)
  // Stratégie : Stale-While-Revalidate (affichage instantané depuis le cache + actualisation en tâche de fond)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const copy = networkResponse.clone();
              caches.open(CACHE_STATIC_NAME).then((cache) => cache.put(request, copy));
            }
            return networkResponse;
          })
          .catch(() => {
            // Ignorer l'erreur si on a déjà une réponse en cache
            return null;
          });

        // Si disponible en cache, on sert immédiatement tout en actualisant
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // D. RESSOURCES EXTERNES (Google Fonts, CDNs...)
  // Stratégie : Cache First avec fallback réseau
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_RUNTIME_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          return new Response('', { status: 408, statusText: 'Offline' });
        });
    })
  );
});

/**
 * 4. GESTION DES MESSAGES (IPC entre l'application React et le Service Worker)
 * Permet au Chef de Chantier de déclencher ou forcer la mise en cache des données
 */
self.addEventListener('message', (event) => {
  if (!event.data || typeof event.data !== 'object') return;

  const { type, payload } = event.data;

  switch (type) {
    // A. Enregistrement d'un snapshot complet des données principales
    case 'SAVE_OFFLINE_DATA_SNAPSHOT': {
      const snapshot = {
        offline: true,
        savedAt: new Date().toISOString(),
        chefDeChantier: payload.siteManager || 'Non spécifié',
        projectsCount: payload.projects ? payload.projects.length : 0,
        projects: payload.projects || [],
        stats: payload.stats || {},
        siteDiaries: payload.siteDiaries || [],
        attendance: payload.attendance || [],
        safetyAlerts: payload.safetyAlerts || [],
        weatherInfo: payload.weatherInfo || null,
        syncStatus: 'SYNCHRONIZED_FOR_FIELD',
      };

      caches.open(CACHE_DATA_NAME).then((cache) => {
        const jsonResponse = new Response(JSON.stringify(snapshot), {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-AGB-Offline-Cache': 'true',
            'X-AGB-Cache-Saved-At': snapshot.savedAt,
          },
        });

        // Mettre en cache sous l'URL du snapshot et sous les alias courants
        return Promise.all([
          cache.put(OFFLINE_SNAPSHOT_URL, jsonResponse.clone()),
          cache.put(OFFLINE_PROJECTS_URL, jsonResponse.clone()),
          cache.put(OFFLINE_STATS_URL, jsonResponse.clone()),
        ]).then(() => {
          console.log('[AGB SW] Snapshot données principales enregistré avec succès:', snapshot.projectsCount, 'chantiers');
          if (event.source && typeof event.source.postMessage === 'function') {
            event.source.postMessage({
              type: 'OFFLINE_DATA_SNAPSHOT_SAVED',
              success: true,
              savedAt: snapshot.savedAt,
              projectsCount: snapshot.projectsCount,
            });
          }
        });
      });
      break;
    }

    // B. Requête d'informations sur l'état du cache pour l'UI
    case 'GET_OFFLINE_CACHE_INFO': {
      Promise.all([
        caches.open(CACHE_STATIC_NAME).then((c) => c.keys()),
        caches.open(CACHE_DATA_NAME).then((c) => c.keys()),
        caches.open(CACHE_RUNTIME_NAME).then((c) => c.keys()),
      ]).then(([staticKeys, dataKeys, runtimeKeys]) => {
        if (event.source && typeof event.source.postMessage === 'function') {
          event.source.postMessage({
            type: 'OFFLINE_CACHE_INFO_RESULT',
            cacheVersion: CACHE_VERSION,
            staticCount: staticKeys.length,
            dataCount: dataKeys.length,
            runtimeCount: runtimeKeys.length,
            isReady: staticKeys.length > 0 && dataKeys.length > 0,
          });
        }
      });
      break;
    }

    // C. Forcer l'activation immédiate du nouveau Service Worker
    case 'SKIP_WAITING': {
      self.skipWaiting();
      break;
    }

    // D. Vider les caches sur demande
    case 'PURGE_CACHE': {
      Promise.all(ALL_CACHES.map((c) => caches.delete(c))).then(() => {
        if (event.source && typeof event.source.postMessage === 'function') {
          event.source.postMessage({ type: 'CACHE_PURGED_SUCCESS' });
        }
      });
      break;
    }

    default:
      break;
  }
});
