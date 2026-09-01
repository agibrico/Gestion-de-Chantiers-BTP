import 'package:dartz/dartz.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/repositories/settings_repository.dart';

class SettingsRepositoryImpl implements SettingsRepository {
  final SharedPreferences sharedPreferences;

  SettingsRepositoryImpl({required this.sharedPreferences});

  static const String keyDarkMode = 'dark_mode';
  static const String keyNotifications = 'notifications_enabled';
  static const String keyLanguage = 'language_code';

  @override
  bool isDarkMode() {
    return sharedPreferences.getBool(keyDarkMode) ?? false;
  }

  @override
  Future<Either<Failure, void>> setDarkMode(bool enabled) async {
    await sharedPreferences.setBool(keyDarkMode, enabled);
    return const Right(null);
  }

  @override
  bool notificationsEnabled() {
    return sharedPreferences.getBool(keyNotifications) ?? true;
  }

  @override
  Future<Either<Failure, void>> setNotificationsEnabled(bool enabled) async {
    await sharedPreferences.setBool(keyNotifications, enabled);
    return const Right(null);
  }

  @override
  String getLanguage() {
    return sharedPreferences.getString(keyLanguage) ?? 'fr';
  }

  @override
  Future<Either<Failure, void>> setLanguage(String langCode) async {
    await sharedPreferences.setString(keyLanguage, langCode);
    return const Right(null);
  }
}
