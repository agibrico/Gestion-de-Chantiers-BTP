# AGB CHANTIER — Solution BTP Flutter Professionnelle

**AGB CHANTIER** est une application mobile et bureau de gestion de chantiers, conçue avec Flutter et une architecture Clean Architecture stricte.

## 🏗️ Architecture Technique
- **Framework** : Flutter 3.x
- **Langage** : Dart
- **Pattern** : Clean Architecture (Presentation, Domain, Data)
- **State Management** : Bloc / Cubit
- **Navigation** : GoRouter
- **Persistance** : Isar Database (Offline-First)
- **DI** : GetIt

## 📂 Structure du Projet
- `lib/app` : Configuration globale, router, widget principal.
- `lib/core` : Constantes, thèmes, widgets partagés, services de base.
- `lib/features` : Modules métiers (Auth, Projets, Inventaire...).

## 🚀 Compilation & Hébergement GitHub

Cette application est configurée pour une compilation automatisée via **GitHub Actions**.

### 📦 Obtenir l'APK de production
1. Poussez votre code sur GitHub.
2. Créez un **Tag** de version (ex: `v1.0.0`) et poussez-le.
3. GitHub Actions compilera automatiquement l'APK optimisé avec obfuscation.
4. Le fichier sera disponible dans l'onglet **Releases** de votre dépôt.

### 🛠️ Compilation Manuelle
```bash
./build_release.ps1
```

## 🛡️ Concepteur
**AGB CIRCUIT TECHNOLOGIQUE**
Email : atsegillesbrice@gmail.com
Téléphones : 0104818092 / 0797709693
