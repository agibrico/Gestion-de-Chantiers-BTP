import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';

abstract class SettingsRepository {
  bool isDarkMode();
  Future<Either<Failure, void>> setDarkMode(bool enabled);

  bool notificationsEnabled();
  Future<Either<Failure, void>> setNotificationsEnabled(bool enabled);

  String getLanguage();
  Future<Either<Failure, void>> setLanguage(String langCode);
}
