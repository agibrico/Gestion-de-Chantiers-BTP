import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/phase_entity.dart';
import '../entities/planning_task_entity.dart';

abstract class PlanningRepository {
  // Phases
  Future<Either<Failure, List<PhaseEntity>>> getPhasesByProject(String projectId);
  Future<Either<Failure, PhaseEntity>> createPhase(PhaseEntity phase);
  Future<Either<Failure, PhaseEntity>> updatePhase(PhaseEntity phase);
  Future<Either<Failure, void>> deletePhase(String id);

  // Tâches de planning
  Future<Either<Failure, List<PlanningTaskEntity>>> getTasksByPhase(String phaseId);
  Future<Either<Failure, List<PlanningTaskEntity>>> getTasksByProject(String projectId);
  Future<Either<Failure, PlanningTaskEntity>> getPlanningTaskById(String id);
  Future<Either<Failure, PlanningTaskEntity>> createPlanningTask(PlanningTaskEntity task);
  Future<Either<Failure, PlanningTaskEntity>> updatePlanningTask(PlanningTaskEntity task);
  Future<Either<Failure, void>> deletePlanningTask(String id);
}
