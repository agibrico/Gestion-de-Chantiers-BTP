import 'dart:convert';
import 'dart:math';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:local_auth/local_auth.dart';

class SecurityService {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  final LocalAuthentication _auth = LocalAuthentication();

  static const String _isarKeyName = 'isar_encryption_key';

  /// Vérifie si la biométrie est disponible et configurée sur l'appareil
  Future<bool> canUseBiometrics() async {
    final bool canAuthenticateWithBiometrics = await _auth.canCheckBiometrics;
    final bool canAuthenticate = canAuthenticateWithBiometrics || await _auth.isDeviceSupported();
    return canAuthenticate;
  }

  /// Tente une authentification biométrique
  Future<bool> authenticate() async {
    try {
      return await _auth.authenticate(
        localizedReason: 'Veuillez vous authentifier pour accéder à AGB Chantier',
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: true,
        ),
      );
    } catch (e) {
      return false;
    }
  }

  /// Récupère ou génère la clé de chiffrement pour Isar (AES-256)
  Future<List<int>> getIsarEncryptionKey() async {
    String? keyBase64 = await _storage.read(key: _isarKeyName);
    
    if (keyBase64 == null) {
      // Générer une nouvelle clé de 32 octets (256 bits)
      final random = Random.secure();
      final key = List<int>.generate(32, (i) => random.nextInt(256));
      keyBase64 = base64Encode(key);
      await _storage.write(key: _isarKeyName, value: keyBase64);
      return key;
    }
    
    return base64Decode(keyBase64);
  }
}
