# Script de compilation optimisée pour AGB CHANTIER
# Active l'obfuscation et la minification

Write-Host "--- DÉMARRAGE DU BUILD DE PRODUCTION AGB CHANTIER ---" -ForegroundColor Cyan

# 1. Nettoyage
flutter clean

# 2. Récupération des dépendances
flutter pub get

# 3. Génération de code (Isar, Bloc, etc.)
flutter pub run build_runner build --delete-conflicting-outputs

# 4. Compilation APK avec Obfuscation
# --split-debug-info crée un dossier pour décoder les logs d'erreurs plus tard
Write-Host "Compilation de l'APK Release..." -ForegroundColor Yellow
flutter build apk --release --obfuscate --split-debug-info=build/app/outputs/symbols

Write-Host "--- BUILD TERMINÉ AVEC SUCCÈS ---" -ForegroundColor Green
Write-Host "Le fichier est disponible dans : build/app/outputs/flutter-apk/app-release.apk"
