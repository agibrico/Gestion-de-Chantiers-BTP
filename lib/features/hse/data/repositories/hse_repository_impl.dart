import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../domain/entities/hse_incident_entity.dart';
import '../../domain/entities/ppe_audit_entity.dart';
import '../../domain/repositories/hse_repository.dart';
import '../models/hse_models.dart';

class HseRepositoryImpl implements HseRepository {
  final IsarService isarService;

  HseRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, List<HseIncidentEntity>>> getIncidentsByProject(String projectId) async {
    try {
      final isar = await isarService.db;
      final models = await isar.hseIncidentModels
          .filter()
          .projectIdEqualTo(projectId)
          .sortByDateDesc()
          .findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, HseIncidentEntity>> reportIncident(HseIncidentEntity incident) async {
    try {
      final isar = await isarService.db;
      final model = HseIncidentModel.fromEntity(incident);
      await isar.writeTxn(() => isar.hseIncidentModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> closeIncident(String id) async {
    try {
      final isar = await isarService.db;
      final existing = await isar.hseIncidentModels.filter().remoteIdEqualTo(id).findFirst();
      if (existing != null) {
        existing.isClosed = true;
        await isar.writeTxn(() => isar.hseIncidentModels.put(existing));
      }
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<PpeAuditEntity>>> getPpeAuditsByProject(String projectId) async {
    try {
      final isar = await isarService.db;
      final models = await isar.ppeAuditModels
          .filter()
          .projectIdEqualTo(projectId)
          .sortByDateDesc()
          .findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, PpeAuditEntity>> savePpeAudit(PpeAuditEntity audit) async {
    try {
      final isar = await isarService.db;
      final model = PpeAuditModel.fromEntity(audit);
      await isar.writeTxn(() => isar.ppeAuditModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }
}
