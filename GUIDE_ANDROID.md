# AGB Chantier — Android 0.2.0 (test)

## Installation et premier lancement

L'APK de test est destiné à un téléphone Android 7.0 ou supérieur. Ouvrir l'APK sur le téléphone et suivre les instructions d'installation affichées par Android. L'application est un paquet de test, pas une publication Play Store.

Au premier lancement sur une base vierge, le compte administrateur de démonstration du projet initial est disponible : téléphone `0104818092`, mot de passe `1234`. Saisir le mot de passe manuellement, puis le remplacer par un mot de passe personnel d'au moins 8 caractères. La pièce d'identité est désormais facultative ; elle n'est pas nécessaire pour tester l'application.

Choisir **Créer un chantier / reprendre mon brouillon**, puis remplir :
1. Identification et localisation.
2. Client et responsable.
3. Marché et budget en FCFA.
4. Dates prévues.
5. Récapitulatif et validation.

La validation ouvre le chantier. Son nom reste affiché au-dessus des modules. **Mes chantiers** permet de revenir à la liste ; cette action recharge l'application après confirmation et abandonne les formulaires non enregistrés. Le brouillon du dossier initial est conservé automatiquement sur l'appareil.

Les phases, équipes, ressources et documents se complètent ensuite dans leurs modules respectifs. Le nouveau chantier commence sans dépenses, sans avancement fictif et sans fausse livraison.

## Ce qui est intégré

- Dossier initial guidé, validation, brouillon local par utilisateur et identifiant stable.
- Écran Mes chantiers, sélection du chantier actif et filtre d'accès local basé sur administrateur, propriétaire et affectations existantes.
- Filtrage des tables métier IndexedDB par projectId et rattachement des nouvelles écritures sans identifiant au chantier actif.
- Refus d'une écriture portant explicitement sur un autre chantier ; protection contre l'écrasement d'un enregistrement d'un autre chantier.
- Protection locale des chantiers clôturés/annulés sélectionnés en consultation.
- Préservation d'une référence initiale du budget et du planning dans le dossier.
- Arrêt du remplissage automatique des tables métier avec des exemples. Les anciens enregistrements ne sont pas supprimés.
- Dépenses approuvées/payées utilisées pour calculer le total des dépenses affiché par la liste/tableau de bord des projets.
- Projet Android Capacitor 8, identité `ci.agb.chantier`, ressources web embarquées et version de test 0.2.0.

## Limites à connaître avant utilisation réelle

Cette livraison est un prototype Android local amélioré. Elle ne constitue pas une application SaaS de production entièrement achevée.

Les comptes de démonstration et réinitialisations de test du code d'origine subsistent. Les droits sont locaux et peuvent être modifiés par une personne contrôlant l'appareil ; aucun serveur n'est connecté. Il n'existe pas de synchronisation entre téléphones. Éviter les données réelles sensibles pendant les essais.

Les anciens enregistrements dont projectId est absent ou incohérent sont conservés mais exclus du chantier actif. Aucune correspondance entre anciens identifiants n'est devinée. L'interface d'affectation des données orphelines, la gestion complète des membres, les avenants avec comparaison de versions et la vue consolidée autorisée restent à finaliser.

Le formulaire initial couvre les références essentielles ; les stocks d'ouverture, avances et documents ne sont pas créés automatiquement par ce formulaire. Les modules de caisse complète, facturation, transferts entre dépôts, rapprochement comptable et synchronisation restent incomplets. Le registre de caisse ne présente plus les anciennes opérations fictives.

Le filtrage central ne remplace pas une validation exhaustive de toutes les relations entre objets ni un contrôle serveur par rôle/action. Tous les écrans historiques n'ont pas été testés de bout en bout. Les métadonnées initiales sont conservées mais le circuit complet de validation des avenants/reprises n'est pas fourni.

Les exports, pièces jointes, appareil photo, navigation système et comportement hors connexion doivent encore être testés sur un téléphone réel. Le téléchargement du navigateur automatisé était indisponible dans l'environnement ; le parcours guidé a été testé avec un DOM simulé, pas avec un navigateur réel ni un émulateur Android.

Les données du navigateur web ne sont pas automatiquement transférées dans l'application Android. Exporter une sauvegarde avant une migration ou une désinstallation. Une désinstallation peut supprimer les données locales. La sauvegarde Android automatique est désactivée pour cette version de test.

## Recompiler dans Android Studio

Prérequis correspondant à ce projet : Node.js 22 ou supérieur, JDK 21, Android SDK Platform 36, Build Tools 35.0.0, accès aux dépôts npm/Google Maven/Maven Central/Gradle. Le wrapper fourni utilise Gradle 8.14.3 et le plugin Android 8.13.0.

Dans le dossier racine :

```text
npm ci
npm run check
npm run android:sync
```

Ouvrir ensuite le sous-dossier `android` dans Android Studio. Configurer le SDK et le JDK localement, puis lancer la génération de l'APK debug. Ou, sous Windows :

```text
cd android
gradlew.bat assembleDebug
```

Sous Linux/macOS :

```text
cd android
./gradlew assembleDebug
```

Résultat : `android/app/build/outputs/apk/debug/app-debug.apk`.

Le fichier local.properties et les chemins propres à la machine de compilation ne sont pas livrés. Android Studio les recrée. Aucune clé de signature de production n'est fournie. Une recompilation debug sur un autre poste peut utiliser une autre signature et ne pas pouvoir remplacer l'installation existante : sauvegarder les données avant de modifier l'installation.

Documentation des outils : https://capacitorjs.com/docs ; https://developer.android.com/studio/build/building-cmdline . La présence de configurations Firebase Hosting historiques n'active aucun backend.

## Résultat de cette livraison

25 tests passent, vérification TypeScript et build web réussis. Build Android :app:assembleDebug réussi. Signature APK v2 et alignement ZIP vérifiés. Les fichiers web embarqués correspondent exactement au build validé. Aucun test sur appareil Android réel ou émulateur n’est revendiqué.
