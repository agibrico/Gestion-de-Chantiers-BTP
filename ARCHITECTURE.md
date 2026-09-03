# AGB CHANTIER — Spécifications Architecturales

## 1. Principes Directeurs
1. **Clean Architecture**
   - **Presentation Layer** : Vues réactives, composants modulaires, Scaffold adaptatif, gestion des thèmes et retours utilisateurs.
   - **Domain Layer** : Entités pures, Use Cases d'orchestration, contrats de Repositories, validateurs métier et matrice de permissions.
   - **Data Layer** : Implémentation des Repositories, IdbAdapter (IndexedDB), LocalStorage, File de synchronisation et auditeur.

2. **Offline-First & Résilience Réseau**
   - L'application fonctionne sans aucune connexion Internet.
   - Toutes les écritures (mutations) sont appliquées localement en premier dans IndexedDB.
   - La file `SyncQueueManager` accumule les événements (CREATE, UPDATE, DELETE) et les rejoue dès que la connectivité réseau est rétablie.

3. **Pattern Result / Failure**
   - Aucune exception brute non capturée.
   - Utilisation des conteneurs fonctionnels `Ok(data)` et `Err(failure)`.
