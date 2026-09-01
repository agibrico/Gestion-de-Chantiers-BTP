import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../domain/entities/snag_entity.dart';
import '../../domain/repositories/snag_repository.dart';
import '../models/snag_model.dart';

class SnagRepositoryImpl implements SnagRepository {
  final IsarService isarService;

  SnagRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, List<SnagEntity>>> getSnagsByProject(String projectId) async {
    try {
      final isar = await isarService.db;
      final models = await isar.snagModels
          .filter()
          .projectIdEqualTo(projectId)
          .sortByCreatedAtDesc()
          .findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, SnagEntity>> getSnagById(String id) async {
    try {
      final isar = await isarService.db;
      final model = await isar.snagModels.filter().remoteIdEqualTo(id).findFirst();
      if (model != null) return Right(model.toEntity());
      return const Left(CacheFailure('Réserve non trouvée.'));
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, SnagEntity>> createSnag(SnagEntity snag) async {
    try {
      final isar = await isarService.db;
      final model = SnagModel.fromEntity(snag);
      await isar.writeTxn(() => isar.snagModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, SnagEntity>> updateSnag(SnagEntity snag) async {
    try {
      final isar = await isarService.db;
      final existing = await isar.snagModels.filter().remoteIdEqualTo(snag.id).findFirst();
      if (existing == null) return const Left(CacheFailure('Réserve non trouvée.'));

      final model = SnagModel.fromEntity(snag);
      model.id = existing.id;
      await isar.writeTxn(() => isar.snagModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deleteSnag(String id) async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() => isar.snagModels.filter().remoteIdEqualTo(id).deleteFirst());
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<SnagEntity>>> getSnagsByStatus(String projectId, SnagStatus status) async {
    try {
      final isar = await isarService.db;
      final models = await isar.snagModels
          .filter()
          .projectIdEqualTo(projectId)
          .statusEqualTo(status)
          .sortByCreatedAtDesc()
          .findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }
}
