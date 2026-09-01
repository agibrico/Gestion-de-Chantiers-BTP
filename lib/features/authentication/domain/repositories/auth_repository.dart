import 'package:dartz/dartz.dart';
import '../../../core/errors/failures.dart';
import '../entities/user_entity.dart';

abstract class AuthRepository {
  /// Connexion avec email et mot de passe
  Future<Either<Failure, UserEntity>> login({
    required String email,
    required String password,
  });

  /// Déconnexion de l'utilisateur
  Future<Either<Failure, void>> logout();

  /// Récupère l'utilisateur actuellement connecté
  Future<Either<Failure, UserEntity?>> getCurrentUser();

  /// Vérifie si l'utilisateur est authentifié
  Future<bool> isAuthenticated();
}
