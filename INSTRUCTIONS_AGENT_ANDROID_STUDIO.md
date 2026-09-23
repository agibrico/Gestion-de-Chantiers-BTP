# Mission de développement — AGB CHANTIER

## Statut de ce dossier

Ce fichier est une consigne d'implémentation destinée à l'agent IA de l'IDE. Le code joint est la version React corrigée 0.1.1. Le dossier initial guidé, le contexte chantier actif et leur raccordement transversal décrits ci-dessous restent À IMPLÉMENTER. Ce paquet n'est pas un APK ni un projet Flutter prêt à compiler.

## Demande de l'utilisateur

Fais évoluer mon application BTP pour que toutes les opérations d'un chantier reposent sur un dossier de référence créé au départ. Implémente réellement les fonctions dans le projet, relie les modules existants et vérifie les résultats. Préserve les fonctionnalités, le nom AGB CHANTIER, le français, les montants FCFA et les données existantes. Ne te limite pas à un plan ou à une maquette.

## 1. Examiner le projet avant modification

Lis les éventuelles consignes locales de l'IDE, puis README.md, AUDIT_ET_PROPOSITIONS.md, package.json et les fichiers concernés. Inspecte les modifications déjà présentes avant toute réécriture.

La base fournie utilise React, TypeScript, Vite et IndexedDB. Elle ne contient pas de pubspec.yaml ni de projet Flutter compilable. Les exemples Flutter ne sont pas une application native. Firebase Hosting n'est pas une base de données métier.

Points d'entrée à examiner :
- src/App.tsx ; src/app/app.tsx ; src/app/router.tsx
- src/features/projects/domain/entities/project_entity.ts
- src/features/projects/domain/repositories/project_repository.ts
- src/features/projects/data/project_repository_impl.ts
- src/features/projects/presentation/
- src/core/storage/idb_adapter.ts et db_service.ts
- src/features/auth/ et src/core/permissions/
- src/features/inventory/, finance/, planning/, tasks/, attendance/
- src/features/suppliers/, teams/, documents/, photos/, site_diary/
- src/features/quality/, hse/, reservations/, reports/, handover/
- src/components/Dashboard.tsx

Exécute la vérification existante et note l'état initial. Préserve les 17 tests de régression ; n'en supprime pas pour masquer un défaut. Travaille avec des modifications réversibles. N'efface aucune base utilisateur et n'effectue aucun déploiement distant pour cette mission.

## 2. Parcours utilisateur attendu

Après connexion et finalisation du profil : afficher « Mes chantiers » avec les seuls chantiers autorisés. Sans chantier, afficher « Créer mon premier chantier » si l'utilisateur possède le droit de création ; sinon expliquer qu'une affectation est nécessaire.

Chaque carte présente : nom, code, client, ville, statut et avancement. Actions : « Ouvrir le chantier », « Compléter le dossier », « Consulter ». Un administrateur autorisé dispose aussi d'une vue consolidée « Tous les chantiers », en lecture et filtrage ; cette vue ne doit jamais servir de contexte implicite à une nouvelle écriture.

Après sélection, le nom et le code du chantier actif restent visibles dans l'en-tête. Les modules affichent uniquement les opérations de ce chantier. Le bouton « Changer de chantier » revient à la sélection.

## 3. Dossier initial guidé

Réutilise et étends ProjectEntity et le formulaire existant ; ne crée pas une deuxième liste de projets indépendante.

Étapes :
1. Identification : nom, code automatique, type, description, adresse, ville, pays, coordonnées GPS facultatives.
2. Client et responsables : sélection/création du client, contact, responsable principal et encadrement ; affectation des utilisateurs autorisés.
3. Marché et budget : montant du marché, budget prévisionnel, devise FCFA, modalités de paiement, retenue facultative, avance effectivement reçue si connue.
4. Planning : début prévu, livraison prévue, phases et jalons ; ajout progressif possible.
5. Ressources : équipes, équipements, stocks de départ facultatifs.
6. Documents : contrat, devis accepté, plans, autorisations et photos facultatifs.
7. Récapitulatif : données manquantes, validation et ouverture du chantier.

Boutons : Précédent, Suivant, Enregistrer en brouillon, Reprendre, Valider le dossier.

Pour un brouillon, exiger seulement un nom. Pour valider, exiger nom, type, client, ville, responsable, dates cohérentes et montants prévisionnels renseignés et non négatifs. Autoriser zéro avec une indication claire ; une dépense effective reste strictement positive. Ne pas imposer une photo, une pièce d'identité, le GPS ou la totalité des équipes pour créer le chantier.

Le statut de complétude du dossier est distinct du statut métier existant ETUDE_PREPARATION, EN_COURS, EN_PAUSE, RECEPTIONNE, CLOTURE ou ANNULE. Une simple complétion de formulaire ne doit pas déclarer les travaux commencés. Les données d'un brouillon doivent survivre à un rechargement.

## 4. Contexte chantier et modèle de données

Crée un contexte chantier central partagé par les vues principales et le portail : chantier courant, chargement, sélection, liste autorisée, rafraîchissement, révocation et absence de sélection.

L'identifiant immuable est projectId. Le code visible peut évoluer selon une règle métier sans casser les liens. Ne pas utiliser le nom comme clé. Sur base existante, conserver tous les identifiants.

Conserve la sélection par utilisateur, puis revérifie à chaque restauration que le projet existe et que l'utilisateur y a toujours accès. À la déconnexion ou au changement d'utilisateur, retirer le contexte et les caches de consultation associés. Une sélection enregistrée n'est jamais une autorisation.

Étends le modèle avec les métadonnées nécessaires : complétude, validations, références initiales, affectations et historique. N'introduis companyId que de manière cohérente avec le modèle d'entreprise constaté ; ne prétends pas fournir un SaaS multi-entreprise par l'ajout d'un simple champ.

Pour chaque module, dresse la liste des lectures et écritures à modifier. Toutes les opérations propres au chantier portent un projectId requis et vérifié au niveau du service/dépôt, et non uniquement dans le formulaire. Vérifie aussi le rattachement au même chantier des ressources liées : phase, tâche, dépense, livraison, document, etc.

Les clients, fournisseurs et employés peuvent rester des répertoires communs de l'entreprise. Leurs affectations et opérations sont contextualisées. Les stocks d'un dépôt central doivent être explicitement distingués des stocks d'un chantier.

## 5. Rattachement de tous les modules

Couvrir les opérations existantes de planning, tâches, dépenses, caisse, commandes, livraisons, stocks, équipements, personnel, pointage, journal, photos, documents, qualité, HSE, réserves, réception, rapports, notifications et exports.

Une écriture doit capturer son projectId au début de l'opération. En cas de changement de chantier pendant un formulaire, demander d'enregistrer ou abandonner la saisie ; ne jamais la rattacher silencieusement au nouveau chantier. Ignorer ou annuler les anciennes réponses asynchrones afin qu'une réponse du chantier A ne remplace pas l'écran du chantier B.

Un chantier clôturé ou annulé est consultable mais ses nouvelles opérations sont bloquées par défaut. Une réouverture nécessite un droit explicite, un motif et une trace. L'historique reste disponible. Pas de suppression en cascade de données réelles ; privilégier l'archivage lorsqu'il existe des opérations liées.

## 6. Références initiales et calculs fiables

À la validation, conserver une version initiale du budget et du planning. Les avenants/modifications ultérieurs sont datés, motivés et attribués à un auteur ; ne pas écraser la référence initiale.

Éviter la double saisie et le double comptage :
- Marché et budget prévisionnel sont des références, pas des dépenses.
- Une avance réellement reçue est une opération de trésorerie idempotente, pas un simple total modifiable et une deuxième recette.
- Le stock initial crée un mouvement d'ouverture unique, et non une entrée supplémentaire à chaque réouverture du dossier.
- Une commande engagée, une livraison et son règlement ne sont pas trois dépenses à additionner.
- Distinguer engagé, réalisé, payé, facturé et encaissé ; préciser les statuts inclus dans chaque agrégat.
- Calculer les indicateurs à partir des opérations ou de projections mises à jour de manière cohérente. Ne pas conserver des totaux d'exemple indépendants des mouvements.
- Avancement physique : méthode explicite ; pondération uniquement si les poids existent et sont cohérents. Ne jamais diviser par zéro.

Une création répétée après double clic ou reprise réseau ne doit pas doubler les mouvements d'ouverture, avances ou validations.

## 7. Migration et sécurité

Créer une migration versionnée, relançable sans duplication. Tester sur une copie. Les dépenses d'exemple comportent notamment des identifiants comme proj-001, différents des identifiants des projets. Ne pas deviner les correspondances : produire une liste d'enregistrements orphelins et prévoir une affectation explicite. Un enregistrement non affecté ne doit pas apparaître dans les chiffres d'un chantier au hasard.

Conserver les protections existantes sur les transactions, quantités, mots de passe et CSV. Contrôler permission d'action et accès au chantier. Si un backend existe dans le poste de travail, appliquer ces contrôles côté serveur également ; sinon annoncer clairement la limite du mode local.

Ne pas créer de fausse synchronisation ni de faux serveur. Ne pas intégrer de secrets dans le client, l'archive ou les logs. Ne pas remplacer les comptes et données existants par le jeu de démonstration. La sauvegarde initiale doit précéder toute migration réelle.

## 8. Préparation Android

Objectif : rendre la base utilisable dans Android Studio tout en préservant le code métier existant.

Si le dossier ouvert contient réellement une application Flutter ou Android déjà développée, examiner cette application et intégrer selon sa structure sans l'écraser par l'archive React.

Pour la base React jointe seule, privilégier sa conservation et préparer, dans une étape distincte, un conteneur Android adapté (par exemple Capacitor). Vérifier les versions et instructions dans les documentations officielles du framework choisi et Android avant d'ajouter les dépendances. Ne pas prétendre qu'ouvrir ce dossier dans Android Studio suffit à produire un APK.

Documenter installation des prérequis, build web, création/synchronisation du projet Android, ouverture dans l'IDE et build de test. Vérifier retour Android, clavier, petits écrans, choix de fichiers, permissions minimales et comportement hors connexion. Ne pas supposer que les données du navigateur seront automatiquement transférées dans le conteneur : prévoir export/import et tester la migration.

Aucune clé de signature de production ou publication Play Store n'est nécessaire pour cette mission. Si les outils Android sont indisponibles, livrer les fichiers préparés et indiquer exactement la compilation non exécutée. Ne pas annoncer un APK testé sans preuve.

## 9. Tests d'acceptation obligatoires

1. Créer un brouillon, recharger, reprendre et valider sans duplication.
2. Refuser dates incohérentes et montants invalides ; accepter pièces jointes absentes.
3. Créer A et B ; enregistrer une dépense dans A : aucun changement dans B.
4. Vérifier cette isolation sur stocks, pointages, tâches, documents, rapports et exports.
5. Refuser un projectId absent, inexistant ou non autorisé, même via appel direct au service.
6. Refuser une tâche de A associée à une phase de B.
7. Changer de chantier pendant une saisie ou un chargement lent : aucun mélange.
8. Recharger avec un chantier supprimé, clôturé ou devenu non autorisé : comportement explicite et sûr.
9. Déconnexion puis connexion d'un autre utilisateur : aucune sélection ni donnée résiduelle exposée.
10. Double validation : un seul stock initial et un seul encaissement d'avance.
11. Modifier budget/planning par avenant : référence initiale conservée.
12. Bloquer une écriture sur chantier clôturé ; tracer une réouverture autorisée.
13. Exécuter migration deux fois : mêmes identifiants et mêmes nombres d'opérations.
14. Export/import : liens chantier préservés ; erreurs sans import partiel.
15. Tester au moins un parcours réel sur navigateur et, si préparé, Android.
16. Exécuter les tests existants, les nouveaux tests ciblés et le build. Rapporter les échecs réels sans les masquer.

## 10. Livrables de l'agent

- Code intégré, formulaires fonctionnels et navigation utilisable.
- Tableau MODULE / LECTURES FILTRÉES / ÉCRITURES CONTRÔLÉES / TESTS / LIMITES pour montrer la couverture réelle.
- Migration, sauvegarde préalable et procédure de récupération.
- Tests automatisés et résultats exacts des commandes.
- README actualisé et GUIDE_ANDROID.md si la préparation Android est effectuée.
- Liste concise des dépendances externes manquantes et fonctions non terminées.

Procède par étapes vérifiables : modèle et migration ; dossier ; sélection ; raccordement des modules ; calculs ; tests ; préparation Android. Termine chaque étape et poursuis les suivantes autorisées. Ne remplace pas les modules non terminés par des données fictives pour annoncer un succès.
