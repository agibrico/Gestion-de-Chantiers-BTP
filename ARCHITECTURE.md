# AGB CHANTIER — Architecture Logicielle

Cette application suit les principes de la **Clean Architecture** et du **SOLID**.

## 1. Couches (Layers)

### 🔴 Presentation Layer
- **Widgets** : Composants UI.
- **Bloc/Cubit** : Gestion des états et logique de présentation.
- **Pages** : Écrans complets.

### 🟢 Domain Layer (Core Logic)
- **Entities** : Objets métier simples.
- **Repositories (Interfaces)** : Contrats de données.
- **Use Cases** : Actions spécifiques (ex: `CreateProject`).

### 🔵 Data Layer
- **Repositories (Impl)** : Implémentation des contrats.
- **Data Sources** : Accès direct (Local DB, Remote API).
- **Models** : Mappage des données (JSON/ISAR to Entities).

## 2. Injection de Dépendances
Utilisation de `GetIt` pour découpler les couches et faciliter les tests.

## 3. Gestion des Erreurs
Utilisation de `Failure` (Domain) et `Exception` (Data).
