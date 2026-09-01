import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/quality_inspection_entity.dart';
import '../../domain/repositories/quality_repository.dart';

// Events
abstract class QualityEvent extends Equatable {
  const QualityEvent();
  @override
  List<Object?> get props => [];
}

class LoadProjectInspectionsRequested extends QualityEvent {
  final String projectId;
  const LoadProjectInspectionsRequested(this.projectId);
  @override
  List<Object?> get props => [projectId];
}

class SaveInspectionRequested extends QualityEvent {
  final QualityInspectionEntity inspection;
  const SaveInspectionRequested(this.inspection);
  @override
  List<Object?> get props => [inspection];
}

// States
abstract class QualityState extends Equatable {
  const QualityState();
  @override
  List<Object?> get props => [];
}

class QualityInitial extends QualityState {}
class QualityLoading extends QualityState {}
class QualityLoaded extends QualityState {
  final List<QualityInspectionEntity> inspections;
  const QualityLoaded(this.inspections);
  @override
  List<Object?> get props => [inspections];
}
class QualityOperationSuccess extends QualityState {
  final String message;
  const QualityOperationSuccess(this.message);
}
class QualityError extends QualityState {
  final String message;
  const QualityError(this.message);
}

// Bloc
class QualityBloc extends Bloc<QualityEvent, QualityState> {
  final QualityRepository qualityRepository;

  QualityBloc({required this.qualityRepository}) : super(QualityInitial()) {
    on<LoadProjectInspectionsRequested>(_onLoadInspections);
    on<SaveInspectionRequested>(_onSaveInspection);
  }

  Future<void> _onLoadInspections(LoadProjectInspectionsRequested event, Emitter<QualityState> emit) async {
    emit(QualityLoading());
    final result = await qualityRepository.getInspectionsByProject(event.projectId);
    result.fold(
      (failure) => emit(QualityError(failure.message)),
      (inspections) => emit(QualityLoaded(inspections)),
    );
  }

  Future<void> _onSaveInspection(SaveInspectionRequested event, Emitter<QualityState> emit) async {
    emit(QualityLoading());
    final result = await qualityRepository.saveInspection(event.inspection);
    result.fold(
      (failure) => emit(QualityError(failure.message)),
      (_) {
        emit(const QualityOperationSuccess('Rapport d\'inspection enregistré.'));
        add(LoadProjectInspectionsRequested(event.inspection.projectId));
      },
    );
  }
}
