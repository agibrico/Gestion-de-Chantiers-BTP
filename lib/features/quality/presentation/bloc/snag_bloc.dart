import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/snag_entity.dart';
import '../../domain/repositories/snag_repository.dart';

// Events
abstract class SnagEvent extends Equatable {
  const SnagEvent();
  @override
  List<Object?> get props => [];
}

class LoadProjectSnagsRequested extends SnagEvent {
  final String projectId;
  const LoadProjectSnagsRequested(this.projectId);
  @override
  List<Object?> get props => [projectId];
}

class CreateSnagRequested extends SnagEvent {
  final SnagEntity snag;
  const CreateSnagRequested(this.snag);
  @override
  List<Object?> get props => [snag];
}

class UpdateSnagStatusRequested extends SnagEvent {
  final String snagId;
  final SnagStatus newStatus;
  final String? observations;
  final String projectId;

  const UpdateSnagStatusRequested({
    required this.snagId,
    required this.newStatus,
    this.observations,
    required this.projectId,
  });

  @override
  List<Object?> get props => [snagId, newStatus, observations, projectId];
}

// States
abstract class SnagState extends Equatable {
  const SnagState();
  @override
  List<Object?> get props => [];
}

class SnagInitial extends SnagState {}
class SnagLoading extends SnagState {}
class SnagLoaded extends SnagState {
  final List<SnagEntity> snags;
  const SnagLoaded(this.snags);
  
  int get openCount => snags.where((s) => s.status != SnagStatus.LEVEE).length;
  int get criticalCount => snags.where((s) => s.priority == SnagPriority.URGENTE && s.status != SnagStatus.LEVEE).length;

  @override
  List<Object?> get props => [snags];
}

class SnagOperationSuccess extends SnagState {
  final String message;
  const SnagOperationSuccess(this.message);
}

class SnagError extends SnagState {
  final String message;
  const SnagError(this.message);
}

// Bloc
class SnagBloc extends Bloc<SnagEvent, SnagState> {
  final SnagRepository snagRepository;

  SnagBloc({required this.snagRepository}) : super(SnagInitial()) {
    on<LoadProjectSnagsRequested>(_onLoadSnags);
    on<CreateSnagRequested>(_onCreateSnag);
    on<UpdateSnagStatusRequested>(_onUpdateStatus);
  }

  Future<void> _onLoadSnags(LoadProjectSnagsRequested event, Emitter<SnagState> emit) async {
    emit(SnagLoading());
    final result = await snagRepository.getSnagsByProject(event.projectId);
    result.fold(
      (failure) => emit(SnagError(failure.message)),
      (snags) => emit(SnagLoaded(snags)),
    );
  }

  Future<void> _onCreateSnag(CreateSnagRequested event, Emitter<SnagState> emit) async {
    emit(SnagLoading());
    final result = await snagRepository.createSnag(event.snag);
    result.fold(
      (failure) => emit(SnagError(failure.message)),
      (_) {
        emit(const SnagOperationSuccess('Réserve enregistrée.'));
        add(LoadProjectSnagsRequested(event.snag.projectId));
      },
    );
  }

  Future<void> _onUpdateStatus(UpdateSnagStatusRequested event, Emitter<SnagState> emit) async {
    final getResult = await snagRepository.getSnagById(event.snagId);
    
    await getResult.fold(
      (failure) async => emit(SnagError(failure.message)),
      (snag) async {
        final updatedSnag = SnagEntity(
          id: snag.id,
          projectId: snag.projectId,
          projectName: snag.projectName,
          title: snag.title,
          description: snag.description,
          zone: snag.zone,
          status: event.newStatus,
          priority: snag.priority,
          responsiblePerson: snag.responsiblePerson,
          dueDate: snag.dueDate,
          photoPath: snag.photoPath,
          reporterName: snag.reporterName,
          closureObservations: event.observations ?? snag.closureObservations,
          createdAt: snag.createdAt,
          updatedAt: DateTime.now(),
        );
        
        final updateResult = await snagRepository.updateSnag(updatedSnag);
        updateResult.fold(
          (failure) => emit(SnagError(failure.message)),
          (_) {
            emit(const SnagOperationSuccess('Statut de la réserve mis à jour.'));
            add(LoadProjectSnagsRequested(event.projectId));
          },
        );
      },
    );
  }
}
