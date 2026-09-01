import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/equipment_entity.dart';
import '../../domain/repositories/equipment_repository.dart';

// Events
abstract class EquipmentEvent extends Equatable {
  const EquipmentEvent();
  @override
  List<Object?> get props => [];
}

class LoadAllEquipmentRequested extends EquipmentEvent {}

class CreateEquipmentRequested extends EquipmentEvent {
  final EquipmentEntity equipment;
  const CreateEquipmentRequested(this.equipment);
  @override
  List<Object?> get props => [equipment];
}

class RecordMaintenanceRequested extends EquipmentEvent {
  final String equipmentId;
  final MaintenanceLogEntity log;
  final EquipmentStatus newStatus;
  const RecordMaintenanceRequested({required this.equipmentId, required this.log, required this.newStatus});
  @override
  List<Object?> get props => [equipmentId, log, newStatus];
}

class AssignEquipmentToProjectRequested extends EquipmentEvent {
  final String equipmentId;
  final String projectId;
  final String projectName;
  const AssignEquipmentToProjectRequested({required this.equipmentId, required this.projectId, required this.projectName});
  @override
  List<Object?> get props => [equipmentId, projectId, projectName];
}

// States
abstract class EquipmentState extends Equatable {
  const EquipmentState();
  @override
  List<Object?> get props => [];
}

class EquipmentInitial extends EquipmentState {}
class EquipmentLoading extends EquipmentState {}
class EquipmentLoaded extends EquipmentState {
  final List<EquipmentEntity> equipmentList;
  const EquipmentLoaded(this.equipmentList);
  @override
  List<Object?> get props => [equipmentList];
}
class EquipmentOperationSuccess extends EquipmentState {
  final String message;
  const EquipmentOperationSuccess(this.message);
  @override
  List<Object?> get props => [message];
}
class EquipmentError extends EquipmentState {
  final String message;
  const EquipmentError(this.message);
  @override
  List<Object?> get props => [message];
}

// Bloc
class EquipmentBloc extends Bloc<EquipmentEvent, EquipmentState> {
  final EquipmentRepository equipmentRepository;

  EquipmentBloc({required this.equipmentRepository}) : super(EquipmentInitial()) {
    on<LoadAllEquipmentRequested>(_onLoadAll);
    on<CreateEquipmentRequested>(_onCreate);
    on<RecordMaintenanceRequested>(_onRecordMaintenance);
    on<AssignEquipmentToProjectRequested>(_onAssignProject);
  }

  Future<void> _onLoadAll(LoadAllEquipmentRequested event, Emitter<EquipmentState> emit) async {
    emit(EquipmentLoading());
    final result = await equipmentRepository.getAllEquipment();
    result.fold(
      (failure) => emit(EquipmentError(failure.message)),
      (list) => emit(EquipmentLoaded(list)),
    );
  }

  Future<void> _onCreate(CreateEquipmentRequested event, Emitter<EquipmentState> emit) async {
    final result = await equipmentRepository.createEquipment(event.equipment);
    result.fold(
      (failure) => emit(EquipmentError(failure.message)),
      (_) {
        emit(const EquipmentOperationSuccess('Nouvel engin enregistré.'));
        add(LoadAllEquipmentRequested());
      },
    );
  }

  Future<void> _onRecordMaintenance(RecordMaintenanceRequested event, Emitter<EquipmentState> emit) async {
    final result = await equipmentRepository.recordMaintenance(
      equipmentId: event.equipmentId,
      log: event.log,
      newStatus: event.newStatus,
    );
    result.fold(
      (failure) => emit(EquipmentError(failure.message)),
      (_) {
        emit(const EquipmentOperationSuccess('Intervention de maintenance enregistrée.'));
        add(LoadAllEquipmentRequested());
      },
    );
  }

  Future<void> _onAssignProject(AssignEquipmentToProjectRequested event, Emitter<EquipmentState> emit) async {
    final result = await equipmentRepository.assignToProject(
      equipmentId: event.equipmentId,
      projectId: event.projectId,
      projectName: event.projectName,
    );
    result.fold(
      (failure) => emit(EquipmentError(failure.message)),
      (_) {
        emit(const EquipmentOperationSuccess('Engin affecté au chantier.'));
        add(LoadAllEquipmentRequested());
      },
    );
  }
}
