import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../domain/entities/audit_log_entity.dart';
import '../../domain/repositories/audit_repository.dart';
import '../models/audit_model.dart';

class AuditRepositoryImpl implements AuditRepository {
  final IsarService isarService;

  AuditRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, void>> log(AuditLogEntity log) async {
    try {
      final isar = await isarService.db;
      final model = AuditLogModel.fromEntity(log);
      await isar.writeTxn(() => isar.auditLogModels.put(model));
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<AuditLogEntity>>> getLogs({
    AuditModule? filterModule,
    AuditAction? filterAction,
    int limit = 100,
  }) async {
    try {
      final isar = await isarService.db;
      var query = isar.auditLogModels.where().sortByTimestampDesc();

      final models = await query.limit(limit).findAll();
      
      // Filtrage manuel si Isar where simple ne suffit pas pour les enums combinés sans indexes complexes
      Iterable<AuditLogModel> filtered = models;
      if (filterModule != null) {
        filtered = filtered.where((m) => m.module == filterModule);
      }
      if (filterAction != null) {
        filtered = filtered.where((m) => m.action == filterAction);
      }

      return Right(filtered.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> clearOldLogs(DateTime before) async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() => isar.auditLogModels.filter().timestampLessThan(before).deleteAll());
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }
}
