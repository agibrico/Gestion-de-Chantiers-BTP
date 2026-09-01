import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  final String message;
  const Failure(this.message);

  @override
  List<Object> get props => [message];
}

class ServerFailure extends Failure {
  const ServerFailure([String message = 'Erreur serveur interne']) : super(message);
}

class CacheFailure extends Failure {
  const CacheFailure([String message = 'Erreur de stockage local']) : super(message);
}

class AuthFailure extends Failure {
  const AuthFailure([String message = 'Erreur d\'authentification']) : super(message);
}

class PermissionFailure extends Failure {
  const PermissionFailure([String message = 'Permission refusée']) : super(message);
}

class ValidationFailure extends Failure {
  const ValidationFailure([String message = 'Données invalides']) : super(message);
}
