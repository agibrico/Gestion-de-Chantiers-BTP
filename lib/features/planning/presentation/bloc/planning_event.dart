import 'package:equatable/equatable.dart';
import '../../domain/entities/phase_entity.dart';
import '../../domain/entities/planning_task_entity.dart';

abstract class PlanningEvent extends Equatable {
  const PlanningEvent();

  @override
  List<Object?> get props => [];
}

class LoadProjectPlanning extends PlanningEvent {
  final String projectId;
  const LoadProjectPlanning(this.projectId);

  @override
  List<Object?> get props => [projectId];
}

class AddPhaseRequested extends PlanningEvent {
  final PhaseEntity phase;
  const AddPhaseRequested(this.phase);

  @override
  List<Object?> get props => [phase];
}

class AddPlanningTaskRequested extends PlanningEvent {
  final PlanningTaskEntity task;
  const AddPlanningTaskRequested(this.task);

  @override
  List<Object?> get props => [task];
}

class UpdatePlanningTaskStatusRequested extends PlanningEvent {
  final String taskId;
  final String projectId;
  final PlanningTaskStatus newStatus;
  final double progress;
  final double actualCost;
  final String observations;

  const UpdatePlanningTaskStatusRequested({
    required this.taskId,
    required this.projectId,
    required this.newStatus,
    required this.progress,
    required this.actualCost,
    required this.observations,
  });

  @override
  List<Object?> get props => [taskId, projectId, newStatus, progress, actualCost, observations];
}
