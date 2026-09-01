import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../domain/entities/project_photo_entity.dart';
import '../../domain/repositories/photo_repository.dart';
import '../models/photo_model.dart';

class PhotoRepositoryImpl implements PhotoRepository {
  final IsarService isarService;

  PhotoRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, List<ProjectPhotoEntity>>> getPhotosByProject(String projectId) async {
    try {
      final isar = await isarService.db;
      final models = await isar.projectPhotoModels
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
  Future<Either<Failure, ProjectPhotoEntity>> savePhoto(ProjectPhotoEntity photo) async {
    try {
      final isar = await isarService.db;
      final model = ProjectPhotoModel.fromEntity(photo);
      await isar.writeTxn(() => isar.projectPhotoModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deletePhoto(String id) async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() => isar.projectPhotoModels.filter().remoteIdEqualTo(id).deleteFirst());
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }
}
