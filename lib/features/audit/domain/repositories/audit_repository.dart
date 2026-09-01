import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/audit_log_entity.dart';

abstract class AuditRepository {
  /// Enregistre une nouvelle trace d'audit
  Future<Either<Failure, void>> log(AuditLogEntity log);

  /// Récupère l'historique complet (trié par date décroissante)
  Future<Either<Failure, List<AuditLogEntity>>> getLogs({
    AuditModule? filterModule,
    AuditAction? filterAction,
    int limit = 100,
  });

  /// Efface les logs anciens (optionnel)
  Future<Either<Failure, void>> clearOldLogs(DateTime before);
}
