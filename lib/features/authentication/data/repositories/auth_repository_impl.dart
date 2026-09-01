import 'dart:convert';
import 'package:dartz/dartz.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/errors/failures.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../models/user_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  final SharedPreferences sharedPreferences;
  static const String CACHED_USER = 'CACHED_USER';

  AuthRepositoryImpl({required this.sharedPreferences});

  @override
  Future<Either<Failure, UserEntity>> login({
    required String email,
    required String password,
  }) async {
    try {
      // Simulation d'une API pour l'AXE 02
      await Future.delayed(const Duration(seconds: 1));

      if (email == 'admin@agb.ci' && password == 'admin123') {
        final user = UserModel(
          id: '1',
          email: 'admin@agb.ci',
          firstName: 'Gilles',
          lastName: 'Brice',
          role: AppRole.ADMINISTRATEUR,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        );

        await _cacheUser(user);
        return Right(user);
      } else if (email == 'conducteur@agb.ci' && password == 'btp2026') {
        final user = UserModel(
          id: '2',
          email: 'conducteur@agb.ci',
          firstName: 'Jean',
          lastName: 'Marc',
          role: AppRole.CONDUCTEUR_DE_TRAVAUX,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        );

        await _cacheUser(user);
        return Right(user);
      } else {
        return const Left(AuthFailure('Identifiants incorrects.'));
      }
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    try {
      await sharedPreferences.remove(CACHED_USER);
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, UserEntity?>> getCurrentUser() async {
    try {
      final jsonString = sharedPreferences.getString(CACHED_USER);
      if (jsonString != null) {
        return Right(UserModel.fromJson(json.decode(jsonString)));
      }
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<bool> isAuthenticated() async {
    return sharedPreferences.containsKey(CACHED_USER);
  }

  Future<void> _cacheUser(UserModel user) async {
    await sharedPreferences.setString(
      CACHED_USER,
      json.encode(user.toJson()),
    );
  }
}
