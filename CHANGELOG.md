# AGB CHANTIER — Journal des Modifications (CHANGELOG)

## [1.0.0] - 2026-08-25
### AXE 01 — Architecture + Configuration + Design System [VALIDÉ]
- Initialisation du socle logiciel Clean Architecture (Presentation, Domain, Data).
- Implémentation du moteur de persistance locale `IdbAdapter` (IndexedDB) avec 25 stores relationnels.
- Mise en place du `SyncQueueManager` et de la gestion de connectivité réseau `NetworkInfo` (Offline-First).
- Déploiement du système de sécurité RBAC avec 13 rôles métiers BTP et permissions granulaires.
- Création du Design System complet BTP (Palette Orange Sécurité/Acier, Typographie, Boutons, Cartes, Modals, Toasts, Badges, Formulaires, États Vides).
- Intégration du Scaffold réactif avec TopBar 3 zones, Sidebar desktop et BottomBar mobile.
- Création de l'écran Splash Screen avec initialisation asynchrone des services.
- Création du bac à sable interactif de démonstration et de diagnostic du Design System.
- Rédaction des documentations techniques : README.md, ARCHITECTURE.md, DATABASE.md, PERMISSIONS.md.
