import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../domain/entities/site_diary_entity.dart';
import '../../domain/repositories/site_diary_repository.dart';
import '../models/site_diary_model.dart';

class SiteDiaryRepositoryImpl implements SiteDiaryRepository {
  final IsarService isarService;

  SiteDiaryRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, List<SiteDiaryEntry>>> getEntriesByProject(String projectId) async {
    try {
      final isar = await isarService.db;
      final models = await isar.siteDiaryModels
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
  Future<Either<Failure, SiteDiaryEntry?>> getEntryByProjectAndDate(String projectId, DateTime date) async {
    try {
      final isar = await isarService.db;
      final normalizedDate = DateTime(date.year, date.month, date.day);
      final model = await isar.siteDiaryModels
          .filter()
          .projectIdEqualTo(projectId)
          .dateEqualTo(normalizedDate)
          .findFirst();
      return Right(model?.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, SiteDiaryEntry>> createEntry(SiteDiaryEntry entry) async {
    try {
      final isar = await isarService.db;
      final model = SiteDiaryModel.fromEntity(entry);
      await isar.writeTxn(() => isar.siteDiaryModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, SiteDiaryEntry>> updateEntry(SiteDiaryEntry entry) async {
    try {
      final isar = await isarService.db;
      final existing = await isar.siteDiaryModels.filter().remoteIdEqualTo(entry.id).findFirst();
      if (existing == null) return const Left(CacheFailure('Journal non trouvé.'));
      
      final model = SiteDiaryModel.fromEntity(entry);
      model.id = existing.id;
      await isar.writeTxn(() => isar.siteDiaryModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deleteEntry(String id) async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() => isar.siteDiaryModels.filter().remoteIdEqualTo(id).deleteFirst());
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }
}
