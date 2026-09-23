/**
 * AGB CHANTIER - Spécifications Flutter pour Android Studio & Compilation Multiplateforme
 * Code source complet Flutter / Dart pour la compilation native de l'application.
 */

export const FLUTTER_PUBSPEC_YAML = `name: agb_chantier
description: Solution BTP SaaS Multi-Plateformes AGB CHANTIER
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"
  flutter: ">=3.19.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  
  # Stockage local & Offline-First (Équivalent IndexedDB)
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  sqflite: ^2.3.0
  path_provider: ^2.1.2

  # State Management & DI (Clean Architecture)
  flutter_bloc: ^8.1.3
  provider: ^6.1.1
  get_it: ^7.6.0
  equatable: ^2.0.5

  # UI, Icônes & Composants
  lucide_icons: ^0.359.0
  google_fonts: ^6.1.0
  flutter_svg: ^2.0.9
  url_launcher: ^6.2.4

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  build_runner: ^2.4.8
  hive_generator: ^2.0.1

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/icons/
`;

export const FLUTTER_AGB_SIGNATURE_DART = `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

/// Widget Signature Officielle AGB Concepteur
/// Affiché systématiquement en dessous de toutes les applications
class AgbCreatorSignatureWidget extends StatelessWidget {
  final bool compact;

  const AgbCreatorSignatureWidget({
    Key? key,
    this.compact = false,
  }) : super(key: key);

  static const String designerEmail = 'atsegillesbrice@gmail.com';
  static const String designerPhone1 = '0104818092';
  static const String designerPhone2 = '0797709693';

  void _launchEmail() async {
    final uri = Uri.parse('mailto:$designerEmail');
    if (await canLaunchUrl(uri)) await launchUrl(uri);
  }

  void _launchPhone(String phone) async {
    final uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) await launchUrl(uri);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF0F172A) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Monogramme AGB Circuit Concepteur
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1D4ED8), Color(0xFF0284C7), Color(0xFF38BDF8)],
              ),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Text(
              'AGB',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w900,
                fontSize: 18,
                letterSpacing: 2,
              ),
            ),
          ),
          const SizedBox(height: 8),

          // Titre Concepteur Officiel
          Text(
            "CONCEPTEUR D'APPLICATIONS MOBILES",
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w900,
              color: isDark ? Colors.white : const Color(0xFF0F172A),
              letterSpacing: 0.5,
            ),
          ),
          Text(
            "ET SOLUTIONS WEB SUR MESURE",
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w900,
              color: isDark ? Colors.white : const Color(0xFF0F172A),
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 6),

          // Coordonnées Email & Téléphones
          Wrap(
            alignment: WrapAlignment.center,
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: 8,
            children: [
              GestureDetector(
                onTap: _launchEmail,
                child: const Text(
                  designerEmail,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF0284C7),
                    decoration: TextDecoration.underline,
                  ),
                ),
              ),
              Text(
                '•',
                style: TextStyle(
                  color: isDark ? Colors.grey[600] : Colors.grey[400],
                ),
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  GestureDetector(
                    onTap: () => _launchPhone(designerPhone1),
                    child: Text(
                      designerPhone1,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.grey[300] : Colors.grey[800],
                      ),
                    ),
                  ),
                  const Text(' / '),
                  GestureDetector(
                    onTap: () => _launchPhone(designerPhone2),
                    child: Text(
                      designerPhone2,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: isDark ? Colors.grey[300] : Colors.grey[800],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
`;

export const FLUTTER_MAIN_DART = `import 'package:flutter/material.dart';
import 'package:agb_chantier/core/widgets/agb_signature_widget.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const AgbChantierApp());
}

class AgbChantierApp extends StatelessWidget {
  const AgbChantierApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AGB CHANTIER',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.light,
        primaryColor: const Color(0xFFEA580C),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFFEA580C),
        scaffoldBackgroundColor: const Color(0xFF020617),
      ),
      home: const MainScaffoldScreen(),
    );
  }
}

class MainScaffoldScreen extends StatelessWidget {
  const MainScaffoldScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AGB CHANTIER SaaS'),
        backgroundColor: const Color(0xFF0F172A),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Contenu de l'application BTP...
            Container(
              height: 400,
              alignment: Alignment.center,
              child: const Text('Module de Gestion de Chantier BTP AGB'),
            ),

            // SIGNATURE OBLIGATOIRE DU CONCEPTEUR AGB EN DESSOUS
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: AgbCreatorSignatureWidget(),
            ),
          ],
        ),
      ),
    );
  }
}
`;
