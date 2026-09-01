import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../domain/entities/project_entity.dart';
import '../../domain/repositories/project_repository.dart';
import '../models/project_model.dart';

class ProjectRepositoryImpl implements ProjectRepository {
  final IsarService isarService;

  ProjectRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, List<ProjectEntity>>> getAllProjects() async {
    try {
      final isar = await isarService.db;
      final models = await isar.projectModels.where().sortByCreatedAtDesc().findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure('Impossible de charger les chantiers.'));
    }
  }

  @override
  Future<Either<Failure, ProjectEntity>> getProjectById(String id) async {
    try {
      final isar = await isarService.db;
      final model = await isar.projectModels.filter().remoteIdEqualTo(id).findFirst();
      if (model != null) {
        return Right(model.toEntity());
      }
      return const Left(CacheFailure('Chantier non trouvé.'));
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, ProjectEntity>> createProject(ProjectEntity project) async {
    try {
      final isar = await isarService.db;
      final model = ProjectModel.fromEntity(project);
      
      await isar.writeTxn(() async {
        await isar.projectModels.put(model);
      });
      
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure('Échec de la création du chantier.'));
    }
  }

  @override
  Future<Either<Failure, ProjectEntity>> updateProject(ProjectEntity project) async {
    try {
      final isar = await isarService.db;
      final existing = await isar.projectModels.filter().remoteIdEqualTo(project.id).findFirst();
      
      if (existing == null) return const Left(CacheFailure('Chantier non existant.'));
      
      final model = ProjectModel.fromEntity(project);
      model.id = existing.id;
      
      await isar.writeTxn(() async {
        await isar.projectModels.put(model);
      });
      
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure('Échec de la mise à jour du chantier.'));
    }
  }

  @override
  Future<Either<Failure, void>> deleteProject(String id) async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() async {
        await isar.projectModels.filter().remoteIdEqualTo(id).deleteFirst();
      });
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure('Échec de la suppression du chantier.'));
    }
  }

  @override
  Future<Either<Failure, List<ProjectEntity>>> getProjectsByClient(String clientId) async {
    try {
      final isar = await isarService.db;
      final models = await isar.projectModels.filter().clientIdEqualTo(clientId).findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<ProjectEntity>>> searchProjects(String query) async {
    try {
      final isar = await isarService.db;
      final models = await isar.projectModels
          .filter()
          .nameContains(query, caseSensitive: false)
          .or()
          .projectNumberContains(query, caseSensitive: false)
          .findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }
}
