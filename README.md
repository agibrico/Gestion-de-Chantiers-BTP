# AGB Chantier — Android 0.2.0 de test

Commencer par **GUIDE_ANDROID.md**, qui décrit la nouvelle version, son installation et ses limites. Le dossier Android est désormais présent. Les informations ci-dessous décrivent la revue web précédente et sont conservées pour historique.

# AGB CHANTIER — application web React

Version de revue 0.1.1 — 21 septembre 2026.

Ce dépôt contient une application **React / TypeScript / Vite**, avec stockage local IndexedDB et service worker. Il ne contient pas de projet Flutter compilable : les exemples Dart présents sont uniquement documentaires. Les commandes `flutter build` ne s'appliquent pas à cette archive.

## Démarrer

Avec Node.js 22 et npm :

```bash
npm ci
npm run dev
```

Ouvrir l'adresse indiquée par Vite. Utiliser localhost ou HTTPS pour le hachage des mots de passe via Web Crypto.

## Vérifier et compiler

```bash
npm run check
npm run preview
```

`check` exécute TypeScript, les tests de régression et le build Vite. Le résultat web est placé dans `dist/`. Le script `lint` vérifie les types, il ne lance pas ESLint. npm et `package-lock.json` constituent la référence pour cette version ; `bun.lock` est conservé comme fichier historique et n'est pas actualisé.

## Démonstration uniquement

Le jeu de démonstration et les comptes de test restent présents. Sur une base vierge : administrateur `0104818092`, mot de passe initial `1234`, à saisir manuellement. Le premier accès demande un nouveau mot de passe d'au moins 8 caractères et les informations d'identité prévues par l'interface d'origine. Utiliser uniquement des informations fictives et l'exemple de document fourni par le formulaire.

Les nouveaux mots de passe sont hachés et salés. Les anciens comptes locaux sont migrés lors d'une connexion réussie. Le compte initial et les réinitialisations restent des mécanismes de démonstration. Cela ne constitue pas une authentification serveur : une personne contrôlant le navigateur peut modifier sa base et sa session.

Aucune API de synchronisation ni base cloud n'est raccordée. Firebase Hosting est une configuration d'hébergement statique, pas un backend métier. `SyncQueueManager.configureTransport` constitue seulement un point d'intégration futur. Aucune opération n'est déclarée synchronisée sans acquittement du transport configuré.

## Documents de revue

- `AUDIT_ET_PROPOSITIONS.md` : constats, corrections, limites, priorités et critères de validation.
- `MODIFICATIONS.md` : fichiers modifiés par rapport à l'archive reçue.
- `VALIDATION.txt` : sortie des contrôles effectués.
- `tests/regressions.test.ts` : tests automatisés reproductibles.

Avant une migration, exporter les données locales de chaque navigateur utilisé. L'archive de code ne contient pas les données IndexedDB des utilisateurs. L'import JSON fusionne les enregistrements par identifiant, de façon atomique ; il ne remplace pas intégralement la base et ne réalise pas une validation métier exhaustive.

Les workflows GitHub incluent maintenant les tests avant compilation/déploiement. Aucun dépôt, hébergement ou compte Firebase n'a été modifié lors de cette revue. Les anciennes pages de présentation de l'architecture et les anciens documents restent historiques ; ce README et le rapport de revue décrivent les capacités réellement vérifiées.
