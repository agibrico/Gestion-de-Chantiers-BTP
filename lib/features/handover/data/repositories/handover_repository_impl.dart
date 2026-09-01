import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../domain/entities/handover_entity.dart';
import '../../domain/repositories/handover_repository.dart';
import '../models/handover_models.dart';

class HandoverRepositoryImpl implements HandoverRepository {
  final IsarService isarService;

  HandoverRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, List<HandoverEntity>>> getHandoversByProject(String projectId) async {
    try {
      final isar = await isarService.db;
      final models = await isar.handoverModels
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
  Future<Either<Failure, HandoverEntity>> saveHandover(HandoverEntity handover) async {
    try {
      final isar = await isarService.db;
      final model = HandoverModel.fromEntity(handover);
      
      final existing = await isar.handoverModels.filter().remoteIdEqualTo(handover.id).findFirst();
      if (existing != null) {
        model.id = existing.id;
      }
      
      await isar.writeTxn(() => isar.handoverModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deleteHandover(String id) async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() => isar.handoverModels.filter().remoteIdEqualTo(id).deleteFirst());
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }
}
