# AGB CHANTIER — Solution BTP Multi-Plateformes Flutter (Android Studio)

**AGB CHANTIER** est une solution logicielle professionnelle de gestion, de suivi, de contrôle et de pilotage des chantiers de construction, conçue avec une Clean Architecture stricte, un fonctionnement Offline-First (hors ligne natif), prête à être compilée dans **Android Studio** en fichiers installables natifs pour toutes les plateformes (Android APK/AAB, iOS IPA, Windows EXE, macOS, Linux).

---

## 📱 1. Compilation Multi-Plateformes Flutter & Android Studio

L'application est conçue pour être compilée directement dans **Android Studio** en exécutables et paquets installables sans aucun bouton d'installation web dans l'interface :

* **Android** : Fichiers installables **APK** et paquets signés **AAB** (Google Play Store) :
  ```bash
  flutter build apk --release
  flutter build appbundle --release
  ```
* **Apple iOS** : Paquet **IPA** et archives Xcode :
  ```bash
  flutter build ipa --release
  ```
* **Windows Desktop** : Exécutables autonomes **EXE** et paquets **MSIX** :
  ```bash
  flutter build windows --release
  ```
* **macOS & Linux** : Applications de bureau natives pour stations de travail de chantier :
  ```bash
  flutter build macos --release
  flutter build linux --release
  ```

---

## 🛡️ 2. Signature Officielle du Concepteur AGB

Le logo et la signature officielle du concepteur figurent **systématiquement en dessous de toutes les applications** :
* **Identité Visuelle** : Monogramme AGB Circuit Technologique Bleu.
* **Mention Officielle** : `CONCEPTEUR D'APPLICATIONS MOBILES ET SOLUTIONS WEB SUR MESURE`.
* **Coordonnées Directes** : Email `atsegillesbrice@gmail.com` • Téléphones `0104818092 / 0797709693`.

---

## 🐙 3. Hébergement & CI/CD GitHub

Le projet est configuré pour être hébergé sur votre dépôt GitHub avec pipelines CI/CD :
```bash
git init
git add .
git commit -m "feat: AGB CHANTIER Flutter Multiplatform Suite"
git branch -M main
git remote add origin https://github.com/<votre-organisation>/agb-chantier-flutter.git
git push -u origin main
```

---

## 🏗️ 4. Architecture & Conception

* **Clean Architecture** : Séparation stricte `Presentation` / `Domain` / `Data`.
* **Pattern MVVM & Repository Pattern** : Découplage complet de la logique métier et des données.
* **Offline-First Natif** : Stockage local avec 25 stores relationnels et file d'attente de synchronisation (`SyncQueueManager`).
* **Design System BTP** : Thème sombre / clair, ergonomie terrain (doigts gantés), typographie et palette BTP (Orange Sécurité `#EA580C`, Acier BTP `#0F172A`).
* **Sécurité & RBAC** : 13 rôles métiers (Direction, Encadrement, Terrain, Expertise, Sous-Traitance) et permissions d'actions précises.

---

## 📋 5. Feuille de Route des 30 Axes de Développement

| Axe | Désignation | Statut |
| :--- | :--- | :--- |
| **AXE 01** | **Architecture + Configuration + Design System** | **VALIDÉ** ✅ |
| **AXE 02** | **Authentification + Utilisateurs + Rôles + Permissions (3 Boutons, Gestion Employés, Pièce d'Identité & MDP)** | **VALIDÉ** ✅ |
| **AXE 03** | **Clients + Maîtres d'Ouvrage + Contacts** | **VALIDÉ** ✅ |
| AXE 04 | Gestion des Chantiers | EN ATTENTE ⏳ |
| AXE 05 | Intervenants + Employés + Équipes | EN ATTENTE ⏳ |
| AXE 06 | Planning + Phases + Diagramme de Gantt | EN ATTENTE ⏳ |
| AXE 07 | Travaux + Tâches + Avancement | EN ATTENTE ⏳ |
| AXE 08 | Pointage + Présences + Main-d'Œuvre | EN ATTENTE ⏳ |
| AXE 09 | Matériaux + Stocks + Inventaire | EN ATTENTE ⏳ |
| AXE 10 | Fournisseurs + Commandes + Livraisons | EN ATTENTE ⏳ |
| AXE 11 | Budget + Dépenses + Caisse + Finances | EN ATTENTE ⏳ |
| AXE 12 | Engins + Matériels + Équipements | EN ATTENTE ⏳ |
| AXE 13 | Journal de Chantier | EN ATTENTE ⏳ |
| AXE 14 | Photos + Galerie + Géolocalisation | EN ATTENTE ⏳ |
| AXE 15 | Contrôle Qualité | EN ATTENTE ⏳ |
| AXE 16 | HSE + Sécurité + Incidents + EPI | EN ATTENTE ⏳ |
| AXE 17 | Réserves + Non-Conformités + Actions Correctives | EN ATTENTE ⏳ |
| AXE 18 | Documents + GED + Plans | EN ATTENTE ⏳ |
| AXE 19 | Rapports + PV + Exports | EN ATTENTE ⏳ |
| AXE 20 | Tableau de Bord + KPI + Analytics | EN ATTENTE ⏳ |
| AXE 21 | Météo + Conditions de Travail | EN ATTENTE ⏳ |
| AXE 22 | Sous-Traitants + Contrats | EN ATTENTE ⏳ |
| AXE 23 | Réunions + Ordres du Jour + PV | EN ATTENTE ⏳ |
| AXE 24 | Messagerie + Notifications | EN ATTENTE ⏳ |
| AXE 25 | Cartographie + Plans Interactifs + GPS | EN ATTENTE ⏳ |
| AXE 26 | Synchronisation Offline/Online | EN ATTENTE ⏳ |
| AXE 27 | Paramètres + Configuration Générale | EN ATTENTE ⏳ |
| AXE 28 | Audit + Logs + Traçabilité | EN ATTENTE ⏳ |
| AXE 29 | Multi-Chantiers + Consolidation | EN ATTENTE ⏳ |
| AXE 30 | Tests + Optimisation + Déploiement | EN ATTENTE ⏳ |
