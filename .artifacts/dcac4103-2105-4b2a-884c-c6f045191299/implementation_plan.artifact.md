# Implémentation de l'AXE 21 : QR CODE + IDENTIFICATION DES ÉLÉMENTS

Ce plan détaille l'ajout de la fonctionnalité de scan et de génération de QR codes pour l'identification rapide des matériaux (Inventaire) et des engins (Équipements) sur les chantiers AGB.

## User Review Required

> [!IMPORTANT]
> L'utilisation de la caméra pour le scan nécessite une connexion sécurisée (HTTPS) ou un environnement local (localhost) pour fonctionner dans le navigateur. Pour l'application finale sur Android, les permissions caméra seront gérées via Capacitor/Cordova (prévu en AXE 30).

## Proposed Changes

### Core & Shared Components

#### [NEW] [qr_scanner.tsx](file:///C:/Users/aaaa/Downloads/agb-chantier-—-gestion-de-chantiers-btp(1)/src/core/widgets/display/qr_scanner.tsx)
Création d'un composant de scan basé sur `html5-qrcode` pour capturer les codes QR via la caméra.

#### [NEW] [qr_code_display.tsx](file:///C:/Users/aaaa/Downloads/agb-chantier-—-gestion-de-chantiers-btp(1)/src/core/widgets/display/qr_code_display.tsx)
Composant pour afficher et imprimer un QR code à partir d'un identifiant (Code Matériau ou Code Engin).

### Feature: QR Identification

#### [NEW] [qr_identification_screen.tsx](file:///C:/Users/aaaa/Downloads/agb-chantier-—-gestion-de-chantiers-btp(1)/src/features/qr_identification/presentation/qr_identification_screen.tsx)
Écran dédié accessible via le menu latéral pour scanner un élément et afficher instantanément ses détails (Stock, Statut, Affectation).

#### [NEW] [qr_identification_controller.ts](file:///C:/Users/aaaa/Downloads/agb-chantier-—-gestion-de-chantiers-btp(1)/src/features/qr_identification/presentation/qr_identification_controller.ts)
Logique pour rechercher un élément dans les différents dépôts (Inventory, Equipment) à partir du code scanné.

### Integration in Existing Features

#### [MODIFY] [inventory_management_screen.tsx](file:///C:/Users/aaaa/Downloads/agb-chantier-—-gestion-de-chantiers-btp(1)/src/features/inventory/presentation/inventory_management_screen.tsx)
Ajout d'un bouton "Voir QR" sur chaque ligne de matériau pour générer l'étiquette d'identification.

#### [MODIFY] [equipment_management_screen.tsx](file:///C:/Users/aaaa/Downloads/agb-chantier-—-gestion-de-chantiers-btp(1)/src/features/equipment/presentation/equipment_management_screen.tsx)
Ajout d'un bouton "Voir QR" sur les cartes d'engins pour faciliter le contrôle sur le terrain.

#### [MODIFY] [router.tsx](file:///C:/Users/aaaa/Downloads/agb-chantier-—-gestion-de-chantiers-btp(1)/src/app/router.tsx)
Activation de la route `/qr-scanner` pointant vers le nouvel écran d'identification.

## Verification Plan

### Automated Tests
- Test unitaire du contrôleur d'identification pour vérifier la recherche croisée (Inventaire/Équipement).
- Mock du scanner pour vérifier la redirection vers la fiche produit après détection.

### Manual Verification
1. Ouvrir le scanner QR via la barre latérale.
2. Simuler ou scanner un code (ex: `MAT-CIM-01`).
3. Vérifier que la fiche du ciment s'affiche avec son stock actuel.
4. Générer un QR code pour une "Pelle Hydraulique" et vérifier qu'il contient bien le code `ENG-CAT-01`.
