/**
 * AGB CHANTIER - Flutter Multiplatform Engine Architecture
 * Spécifications et structures de compilation Android Studio / Flutter
 */

export interface FlutterTargetPlatform {
  platform: "android" | "ios" | "windows" | "macos" | "linux" | "web";
  artifact: string;
  command: string;
  studioTooling: string;
}

export const FLUTTER_PLATFORMS: FlutterTargetPlatform[] = [
  {
    platform: "android",
    artifact: "APK (armeabi-v7a / arm64-v8a) & AAB (Google Play Store)",
    command: "flutter build apk --release / flutter build appbundle",
    studioTooling: "Android Studio Build / Generate Signed Bundle or APK",
  },
  {
    platform: "ios",
    artifact: "IPA & Xcode Archive",
    command: "flutter build ipa --release",
    studioTooling: "Xcode Organizer & TestFlight / App Store",
  },
  {
    platform: "windows",
    artifact: "MSIX / EXE Standalone Installer",
    command: "flutter build windows --release",
    studioTooling: "Visual Studio C++ Build Tools",
  },
  {
    platform: "macos",
    artifact: "DMG & App Bundle Signé",
    command: "flutter build macos --release",
    studioTooling: "Xcode / Apple Developer Notarization",
  },
  {
    platform: "linux",
    artifact: "Debian Package (.deb) & Snap / AppImage",
    command: "flutter build linux --release",
    studioTooling: "Clang / CMake / Ninja",
  },
  {
    platform: "web",
    artifact: "Wasm / CanvasKit HTML Bundle",
    command: "flutter build web --release",
    studioTooling: "Flutter Web Engine",
  },
];

export const FLUTTER_DART_PROJECT_STRUCTURE = {
  lib: {
    app: ["routes.dart", "router.dart", "app_theme.dart", "app_scaffold.dart"],
    core: {
      storage: ["hive_database_service.dart", "sqlite_idb_helper.dart"],
      security: ["rbac_role_guard.dart", "permission_matrix.dart"],
      widgets: ["agb_signature_widget.dart", "app_button.dart", "app_card.dart", "stat_card.dart"],
    },
    features: {
      chantiers: ["presentation/", "domain/", "data/"],
      planning: ["presentation/", "domain/", "data/"],
      finance: ["presentation/", "domain/", "data/"],
      hse: ["presentation/", "domain/", "data/"],
    },
  },
  android: ["app/build.gradle", "app/src/main/AndroidManifest.xml"],
  ios: ["Runner.xcodeproj", "Runner/Info.plist"],
  windows: ["runner/main.cpp", "CMakeLists.txt"],
  macos: ["Runner/AppDelegate.swift"],
  linux: ["runner/main.cc"],
};
