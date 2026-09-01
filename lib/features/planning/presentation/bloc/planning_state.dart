import 'package:equatable/equatable.dart';
import '../../domain/entities/phase_entity.dart';
import '../../domain/entities/planning_task_entity.dart';

abstract class PlanningState extends Equatable {
  const PlanningState();
  
  @override
  List<Object?> get props => [];
}

class PlanningInitial extends PlanningState {}

class PlanningLoading extends PlanningState {}

class PlanningLoaded extends PlanningState {
  final List<PhaseEntity> phases;
  final List<PlanningTaskEntity> tasks;

  const PlanningLoaded({
    required this.phases,
    required this.tasks,
  });

  @override
  List<Object?> get props => [phases, tasks];
}

class PlanningOperationSuccess extends PlanningState {
  final String message;
  const PlanningOperationSuccess(this.message);

  @override
  List<Object?> get props => [message];
}

class PlanningError extends PlanningState {
  final String message;
  const PlanningError(this.message);

  @override
  List<Object?> get props => [message];
}
