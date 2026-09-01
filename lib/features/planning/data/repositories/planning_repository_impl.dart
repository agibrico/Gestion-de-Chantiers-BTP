import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../domain/entities/phase_entity.dart';
import '../../domain/entities/planning_task_entity.dart';
import '../../domain/repositories/planning_repository.dart';
import '../models/planning_models.dart';

class PlanningRepositoryImpl implements PlanningRepository {
  final IsarService isarService;

  PlanningRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, List<PhaseEntity>>> getPhasesByProject(String projectId) async {
    try {
      final isar = await isarService.db;
      final models = await isar.phaseModels
          .filter()
          .projectIdEqualTo(projectId)
          .sortByOrder()
          .findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, PhaseEntity>> createPhase(PhaseEntity phase) async {
    try {
      final isar = await isarService.db;
      final model = PhaseModel.fromEntity(phase);
      await isar.writeTxn(() => isar.phaseModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, PhaseEntity>> updatePhase(PhaseEntity phase) async {
    try {
      final isar = await isarService.db;
      final existing = await isar.phaseModels.filter().remoteIdEqualTo(phase.id).findFirst();
      if (existing == null) return const Left(CacheFailure('Phase non trouvée'));
      
      final model = PhaseModel.fromEntity(phase);
      model.id = existing.id;
      await isar.writeTxn(() => isar.phaseModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deletePhase(String id) async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() async {
        await isar.phaseModels.filter().remoteIdEqualTo(id).deleteFirst();
        // Optionnel : supprimer les tâches orphelines
        await isar.planningTaskModels.filter().phaseIdEqualTo(id).deleteAll();
      });
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<PlanningTaskEntity>>> getTasksByPhase(String phaseId) async {
    try {
      final isar = await isarService.db;
      final models = await isar.planningTaskModels
          .filter()
          .phaseIdEqualTo(phaseId)
          .sortByStartDate()
          .findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<PlanningTaskEntity>>> getTasksByProject(String projectId) async {
    try {
      final isar = await isarService.db;
      final models = await isar.planningTaskModels
          .filter()
          .projectIdEqualTo(projectId)
          .sortByStartDate()
          .findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, PlanningTaskEntity>> getPlanningTaskById(String id) async {
    try {
      final isar = await isarService.db;
      final model = await isar.planningTaskModels.filter().remoteIdEqualTo(id).findFirst();
      if (model != null) {
        return Right(model.toEntity());
      }
      return const Left(CacheFailure('Tâche non trouvée.'));
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, PlanningTaskEntity>> createPlanningTask(PlanningTaskEntity task) async {
    try {
      final isar = await isarService.db;
      final model = PlanningTaskModel.fromEntity(task);
      await isar.writeTxn(() => isar.planningTaskModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, PlanningTaskEntity>> updatePlanningTask(PlanningTaskEntity task) async {
    try {
      final isar = await isarService.db;
      final existing = await isar.planningTaskModels.filter().remoteIdEqualTo(task.id).findFirst();
      if (existing == null) return const Left(CacheFailure('Tâche non trouvée'));

      final model = PlanningTaskModel.fromEntity(task);
      model.id = existing.id;
      await isar.writeTxn(() => isar.planningTaskModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deletePlanningTask(String id) async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() => isar.planningTaskModels.filter().remoteIdEqualTo(id).deleteFirst());
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }
}
