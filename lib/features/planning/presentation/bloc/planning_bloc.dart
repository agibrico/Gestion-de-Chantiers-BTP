import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/planning_repository.dart';
import '../../domain/entities/planning_task_entity.dart';
import 'planning_event.dart';
import 'planning_state.dart';

class PlanningBloc extends Bloc<PlanningEvent, PlanningState> {
  final PlanningRepository planningRepository;

  PlanningBloc({required this.planningRepository}) : super(PlanningInitial()) {
    on<LoadProjectPlanning>(_onLoadPlanning);
    on<AddPhaseRequested>(_onAddPhase);
    on<AddPlanningTaskRequested>(_onAddTask);
    on<UpdatePlanningTaskStatusRequested>(_onUpdateTaskStatus);
  }

  Future<void> _onLoadPlanning(LoadProjectPlanning event, Emitter<PlanningState> emit) async {
    emit(PlanningLoading());
    
    final phasesRes = await planningRepository.getPhasesByProject(event.projectId);
    final tasksRes = await planningRepository.getTasksByProject(event.projectId);

    phasesRes.fold(
      (failure) => emit(PlanningError(failure.message)),
      (phases) {
        tasksRes.fold(
          (failure) => emit(PlanningError(failure.message)),
          (tasks) => emit(PlanningLoaded(phases: phases, tasks: tasks)),
        );
      },
    );
  }

  Future<void> _onAddPhase(AddPhaseRequested event, Emitter<PlanningState> emit) async {
    final result = await planningRepository.createPhase(event.phase);
    result.fold(
      (failure) => emit(PlanningError(failure.message)),
      (_) {
        emit(const PlanningOperationSuccess('Phase ajoutée au planning.'));
        add(LoadProjectPlanning(event.phase.projectId));
      },
    );
  }

  Future<void> _onAddTask(AddPlanningTaskRequested event, Emitter<PlanningState> emit) async {
    final result = await planningRepository.createPlanningTask(event.task);
    result.fold(
      (failure) => emit(PlanningError(failure.message)),
      (_) {
        emit(const PlanningOperationSuccess('Tâche planifiée avec succès.'));
        add(LoadProjectPlanning(event.task.projectId));
      },
    );
  }

  Future<void> _onUpdateTaskStatus(UpdatePlanningTaskStatusRequested event, Emitter<PlanningState> emit) async {
    final getResult = await planningRepository.getPlanningTaskById(event.taskId);
    
    await getResult.fold(
      (failure) async => emit(PlanningError(failure.message)),
      (task) async {
        final updatedTask = PlanningTaskEntity(
          id: task.id,
          phaseId: task.phaseId,
          projectId: task.projectId,
          title: task.title,
          description: task.description,
          startDate: task.startDate,
          endDate: task.endDate,
          status: event.newStatus,
          priority: task.priority,
          progressPercentage: event.progress,
          dependencies: task.dependencies,
          assignedTeamId: task.assignedTeamId,
          assignedTeamName: task.assignedTeamName,
          estimatedCost: task.estimatedCost,
          actualCost: event.actualCost,
          observations: event.observations,
          createdAt: task.createdAt,
          updatedAt: DateTime.now(),
        );
        
        final updateResult = await planningRepository.updatePlanningTask(updatedTask);
        updateResult.fold(
          (failure) => emit(PlanningError(failure.message)),
          (_) {
            emit(const PlanningOperationSuccess('Avancement mis à jour.'));
            add(LoadProjectPlanning(event.projectId));
          },
        );
      },
    );
  }
}
