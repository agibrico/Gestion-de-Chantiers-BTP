import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../domain/entities/quality_inspection_entity.dart';
import '../../domain/repositories/quality_repository.dart';
import '../models/quality_models.dart';

class QualityRepositoryImpl implements QualityRepository {
  final IsarService isarService;

  QualityRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, List<QualityInspectionEntity>>> getInspectionsByProject(String projectId) async {
    try {
      final isar = await isarService.db;
      final models = await isar.qualityInspectionModels
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
  Future<Either<Failure, QualityInspectionEntity>> getInspectionById(String id) async {
    try {
      final isar = await isarService.db;
      final model = await isar.qualityInspectionModels.filter().remoteIdEqualTo(id).findFirst();
      if (model != null) return Right(model.toEntity());
      return const Left(CacheFailure('Inspection non trouvée.'));
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, QualityInspectionEntity>> saveInspection(QualityInspectionEntity inspection) async {
    try {
      final isar = await isarService.db;
      final model = QualityInspectionModel.fromEntity(inspection);
      
      final existing = await isar.qualityInspectionModels.filter().remoteIdEqualTo(inspection.id).findFirst();
      if (existing != null) {
        model.id = existing.id;
      }
      
      await isar.writeTxn(() => isar.qualityInspectionModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deleteInspection(String id) async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() => isar.qualityInspectionModels.filter().remoteIdEqualTo(id).deleteFirst());
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }
}
