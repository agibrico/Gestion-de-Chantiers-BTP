# Hébergement sur GitHub et Firebase

Ce plan détaille les étapes pour initialiser le dépôt Git, préparer l'hébergement Firebase et automatiser le déploiement via GitHub Actions.

## User Review Required

> [!IMPORTANT]
> Vous devrez créer manuellement :
> 1. Un dépôt vide sur votre compte GitHub nommé `agb-chantier`.
> 2. Un projet Firebase sur la [Console Firebase](https://console.firebase.google.com/).

## Proposed Changes

### Configuration Git
#### [MODIFY] [.gitignore](file:///C:/Users/aaaa/Downloads/agb-chantier-—-gestion-de-chantiers-btp(3)/.gitignore)
Ajout des fichiers Firebase et des dossiers de build pour éviter de suivre des fichiers inutiles.

### Configuration Firebase
#### [NEW] [firebase.json](file:///C:/Users/aaaa/Downloads/agb-chantier-—-gestion-de-chantiers-btp(3)/firebase.json)
Configuration du déploiement Hosting (pointant vers le dossier `dist`).

#### [NEW] [.firebaserc](file:///C:/Users/aaaa/Downloads/agb-chantier-—-gestion-de-chantiers-btp(3)/.firebaserc)
Définition de l'ID du projet Firebase (à remplacer par votre ID de projet).

### Automatisation (CI/CD)
#### [NEW] [firebase-hosting-pull-request.yml](file:///C:/Users/aaaa/Downloads/agb-chantier-—-gestion-de-chantiers-btp(3)/.github/workflows/firebase-hosting-pull-request.yml)
Déploiement automatique d'un aperçu lors d'une Pull Request.

#### [NEW] [firebase-hosting-merge.yml](file:///C:/Users/aaaa/Downloads/agb-chantier-—-gestion-de-chantiers-btp(3)/.github/workflows/firebase-hosting-merge.yml)
Déploiement automatique en production lors d'un merge sur `main`.

## Verification Plan

### Manual Verification
1. Exécuter `git init` et vérifier que les fichiers sont suivis (sauf `node_modules` et `dist`).
2. Vérifier que `npm run build` génère bien le dossier `dist`.
3. Une fois poussé sur GitHub, configurer le secret `FIREBASE_SERVICE_ACCOUNT_...` dans les paramètres du dépôt GitHub.
