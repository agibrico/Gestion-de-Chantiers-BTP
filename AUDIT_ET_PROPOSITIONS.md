# Revue développeur — AGB CHANTIER

Date : 21 septembre 2026. Source : archive fournie par l'utilisateur.

## Conclusion

Le projet dispose d'une interface riche et de nombreux modules BTP. Il constitue une base de démonstration web avancée, mais pas encore une application de production multi-utilisateur. Le nombre d'écrans ne garantit pas que chaque circuit métier soit complet ou que les données soient cohérentes entre modules.

Cette livraison corrige des défauts ciblés et ajoute des tests. Elle ne prétend pas corriger tous les problèmes du projet, livrer un backend, ni convertir l'application en Flutter.

## État constaté

| Domaine | Présent dans le code | Travail restant |
|---|---|---|
| Clients et chantiers | Entités, formulaires, dépôts locaux, listes, filtres | Validation complète des relations, archivage, suppression et séparation par entreprise |
| Planning et tâches | Phases, jalons, tâches, écrans de planning | Dépendances fiables, calendriers de travail, consolidation de l'avancement |
| Personnel et pointage | Rôles, équipes, présence, profils | Invitations, périmètre par chantier, circuit de validation et paie |
| Stocks et fournisseurs | Articles, mouvements, commandes et livraisons | Réceptions partielles, annulations, transferts à deux dépôts, valorisation cohérente |
| Finances | Dépenses persistées, écrans budget/caisse | Caisse persistante, devis, factures, règlements et rapprochement |
| Journal, photos, documents | Écrans et dépôts locaux | Fichiers distants, quotas, versionnement et partage autorisé |
| Qualité, HSE et réserves | Écrans de saisie/suivi | Recette de bout en bout, responsables, échéances et traçabilité |
| Rapports | Exports et prévisualisations | Vérifier exactitude des agrégats et documents exportés |
| Synchronisation | File d'attente locale | Transport réel, branchement des mutations, conflits, reprise et tests multi-appareils |
| QR, IA, audit central | Routes ou composants partiels | Les routes dédiées affichent encore des écrans d'attente |
| Mobile natif | Exemples Flutter documentaires | Aucun projet Dart/Flutter compilable ni paquet natif livré |

## Corrections réalisées

1. **Navigation et état partagé** : connexion obligatoire avant le tableau de bord et le portail ; contrôle des permissions de lecture sur les routes métier ; blocage pendant la première connexion ; accès au tableau financier conditionné aux droits projet et finance. Les fournisseurs de contexte d'authentification, thème et options ne sont plus dupliqués entre les deux vues.
2. **Mots de passe locaux** : PBKDF2 SHA-256 avec sel aléatoire pour les comptes initialisés, créés, réinitialisés et les changements de mot de passe. Migration des anciens mots de passe en clair uniquement après vérification réussie. Suppression du préremplissage du mot de passe par sa valeur stockée. Première connexion : minimum 8 caractères. Une pièce déposée n'est plus automatiquement marquée vérifiée. Une session d'un compte inactif ou suspendu n'est plus restaurée.
3. **Initialisation et connexion** : sérialisation de l'initialisation des comptes de test et correction du rafraîchissement qui pouvait réappliquer un ancien utilisateur après une nouvelle connexion.
4. **Synchronisation** : suppression de l'attente artificielle qui marquait les écritures comme synchronisées. Sans transport, les opérations restent en attente. Les opérations interrompues peuvent reprendre ; un échec arrête le traitement pour éviter qu'une modification ultérieure dépasse l'opération en erreur. Le transport devra être idempotent et confirmer une écriture distante durable.
5. **Transactions locales** : les écritures et suppressions attendent maintenant la fin de transaction IndexedDB avant de retourner un succès.
6. **Stocks** : enregistrement du mouvement et mise à jour du stock dans une seule transaction. Rejet des quantités non finies, négatives, nulles hors ajustement, des articles absents et des sorties supérieures au stock. Protection contre deux sorties concurrentes. Les transferts inter-chantiers incomplets sont retirés du formulaire et refusés par le dépôt en attendant leur implémentation complète.
7. **Sauvegardes** : conservation des marqueurs de suppression ; une lecture impossible interrompt l'export au lieu de produire silencieusement une table vide. Validation des noms de tables et des identifiants avant import ; fusion atomique des tables, annulée en totalité en cas d'erreur. La remise à zéro inclut les enregistrements supprimés et retire la session locale.
8. **Tableau de bord** : suppression de l'affichage automatique de faux chantiers en cas de lecture vide ou en erreur. Une erreur de chargement est signalée. Le service worker ne précharge plus un faux instantané de chantiers ; nouvelle version du cache. Les chantiers supprimés ne sont plus recréés par l'initialisation du dépôt lorsqu'il reste leurs marqueurs de suppression.
9. **Exports CSV** : neutralisation des chaînes pouvant être interprétées comme formules par un tableur ; échappement des guillemets conservé. La moyenne d'avancement exportée est correctement désignée comme arithmétique.
10. **Dépenses** : rejet des montants non finis, négatifs, nuls ou fractionnaires pour le FCFA ; chantier et libellé obligatoires ; identifiants aléatoires au lieu du seul horodatage.
11. **Livraison** : documentation React corrigée, fichier de verrouillage npm, commande `check`, 17 tests et étapes de validation dans les workflows existants.

## Limites importantes encore présentes

- **Sécurité serveur absente** : les permissions restent contrôlées dans le navigateur. Les méthodes de dépôt et les actions d'écriture ne sont pas toutes protégées. IndexedDB, les sessions, les droits et les fichiers locaux peuvent être modifiés par l'utilisateur du poste. Le hachage n'apporte ni isolation entre entreprises ni authentification distante.
- **Comptes de démonstration** : mot de passe initial commun et réinitialisation de démonstration conservés. Avant production, remplacer par création du propriétaire, invitations et récupération sécurisée. Les anciennes valeurs en clair restent sur les comptes historiques jusqu'à leur prochaine connexion ou réinitialisation.
- **Données personnelles** : le formulaire d'identité conserve le comportement d'origine et stocke localement ses données. Le caractère nécessaire de cette collecte doit être décidé ; ne pas utiliser de vrais documents dans cette version.
- **Cohérence des données d'exemple** : les dépenses utilisent notamment `proj-001` alors que le dépôt de projets utilise des identifiants comme `proj_001_plateau`. Certains indicateurs agrégés sont stockés indépendamment des opérations réelles. Leur réconciliation n'est pas effectuée dans cette livraison.
- **Finances incomplètes** : `getAllCashTransactions` retourne encore une liste d'exemple ; budget et caisse ne constituent pas un livre comptable complet. Les transitions d'approbation, le paiement, les annulations et les contrôles métier doivent être finalisés.
- **Stocks** : les transferts entre deux stocks sont à construire. Le calcul des statistiques mensuelles et leur périmètre chantier nécessitent une révision ; les créations/modifications directes d'articles demandent aussi des validations supplémentaires.
- **Sauvegardes** : le JSON contient des données sensibles et n'est pas chiffré. La validation des imports porte sur les tables et identifiants, pas sur l'intégralité de chaque schéma métier. Les réglages localStorage ne sont pas tous inclus. Ne restaurer que des sauvegardes de confiance.
- **Hors connexion** : le cache est local et partagé à l'échelle de l'origine du navigateur. Il n'est pas une sauvegarde distante. La synchronisation n'est pas raccordée aux dépôts et aucune gestion complète des conflits multi-appareils n'est fournie.
- **Performances** : le build génère un fichier JavaScript principal d'environ 1,42 Mo minifié, 362 Ko gzip. Chargement différé des modules et réduction des composants volumineux à prévoir.
- **Documentation historique** : certains écrans de présentation et documents anciens annoncent encore Flutter, des axes « validés » ou un SaaS complet. Ils ne constituent pas une preuve de fonctionnement. Le présent rapport et le README sont les références de cette revue.

## Feuille de route proposée

| Priorité | Lot | Résultat attendu et critère de validation |
|---|---|---|
| Indispensable — 1 | Comptes et backend | Connexion réelle, invitations, droits contrôlés par le serveur, entreprise et chantiers autorisés. Un utilisateur ne peut ni lire ni modifier les données d'une autre entreprise via une requête directe. |
| Indispensable — 2 | Données fiables | Identifiants communs, migrations, contraintes, données d'exemple séparées. Une dépense modifie les totaux du chantier correspondant et aucun exemple ne réapparaît après suppression. |
| Indispensable — 3 | Sauvegarde et synchronisation | Écritures idempotentes, journal des conflits, sauvegardes automatiques et restauration testée. Deux appareils convergent sans doublon après une coupure réseau. |
| Ensuite — 4 | Circuit commercial et financier | Devis → marché → budget → situations de travaux → factures → règlements ; avances et retenues configurables, FCFA, justificatifs et marge par chantier. Les totaux se rapprochent avec les opérations. |
| Ensuite — 5 | Achats et stocks | Demande d'achat → validation → commande → livraison partielle → stock → consommation ; transfert atomique entre deux dépôts et suivi des écarts. |
| Ensuite — 6 | Personnel et chantier | Affectations, heures, absences, validation du pointage, préparation de paie et journal quotidien lié aux tâches. |
| Ensuite — 7 | Qualité et livraison | Contrôles, réserves, actions correctives, pièces jointes, réception et PV avec historique des validations. |
| Plus tard — 8 | Mobilité et productivité | Parcours mobile simplifié, photos compressées, notifications et rapports PDF ; choisir ensuite la stratégie de paquet Android/Windows à partir des besoins réels. |
| Plus tard — 9 | Fonctions avancées | QR matériel/document, portail client, cartographie et assistant IA après fiabilisation des données et des autorisations. |

Le choix du backend reste ouvert. L'archive possède déjà des configurations Firebase Hosting, mais aucun accès ou service métier n'est raccordé. La décision doit tenir compte des comptes disponibles, du budget, du volume de documents, du mode hors connexion et du nombre d'utilisateurs.

## Informations à préciser pour la suite

1. Usage par une seule entreprise ou plusieurs entreprises clientes indépendantes ?
2. Nombre d'utilisateurs et rôles autorisés sur chaque chantier ?
3. Priorité : navigateur sur téléphone, APK Android ou application Windows installable ?
4. Existence de données réelles à préserver dans les navigateurs déjà utilisés ?
5. Périmètre financier attendu : simple suivi des dépenses ou devis, factures, encaissements et paie ?
6. Durée typique sans connexion, volume des photos/documents et budget d'hébergement ?

## Validation et limites de la revue

La vérification TypeScript et les 17 tests de régression passent. La compilation de production Vite réussit, avec l'avertissement de taille du fichier JavaScript indiqué plus haut. Le journal complet est fourni dans `VALIDATION.txt`.

Tests : hachage et vérification ; migration d'un ancien mot de passe ; session suspendue ; première connexion et identité non vérifiée ; absence de transport ; échec et reprise distante ; reprise d'opération interrompue ; marqueurs de suppression exportés ; erreur de lecture lors de sauvegarde ; validation préalable d'import ; annulation d'import ; fusion d'import ; sortie de stock excessive ; sorties concurrentes ; quantités invalides ; CSV ; montants de dépenses.

Ces tests utilisent un IndexedDB simulé et ne remplacent pas une recette navigateur. La tentative de lancement du navigateur automatisé a été bloquée par l'absence de Chromium et l'expiration du téléchargement. Aucune validation visuelle ni recette complète des écrans n'est donc revendiquée. Aucun déploiement, test de Firebase réel, audit exhaustif des dépendances ou compilation native n'a été réalisé.

Avant publication : tester dans un navigateur réel la connexion de chaque rôle, la première connexion, le refus d'accès direct à la finance pour un ouvrier, la déconnexion, la création d'un chantier, les commandes/livraisons, les photos, la suppression, l'import/export et le rechargement hors ligne. Puis tester les mêmes scénarios sur deux appareils avec le futur backend.
