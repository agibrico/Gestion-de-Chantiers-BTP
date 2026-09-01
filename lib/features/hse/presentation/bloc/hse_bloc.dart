import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/hse_incident_entity.dart';
import '../../domain/entities/ppe_audit_entity.dart';
import '../../domain/repositories/hse_repository.dart';

// Events
abstract class HseEvent extends Equatable {
  const HseEvent();
  @override
  List<Object?> get props => [];
}

class LoadProjectHseRequested extends HseEvent {
  final String projectId;
  const LoadProjectHseRequested(this.projectId);
  @override
  List<Object?> get props => [projectId];
}

class ReportIncidentRequested extends HseEvent {
  final HseIncidentEntity incident;
  const ReportIncidentRequested(this.incident);
  @override
  List<Object?> get props => [incident];
}

class SavePpeAuditRequested extends HseEvent {
  final PpeAuditEntity audit;
  const SavePpeAuditRequested(this.audit);
  @override
  List<Object?> get props => [audit];
}

// States
abstract class HseState extends Equatable {
  const HseState();
  @override
  List<Object?> get props => [];
}

class HseInitial extends HseState {}
class HseLoading extends HseState {}
class HseLoaded extends HseState {
  final List<HseIncidentEntity> incidents;
  final List<PpeAuditEntity> ppeAudits;

  const HseLoaded({required this.incidents, required this.ppeAudits});

  int get openIncidentsCount => incidents.where((i) => !i.isClosed).length;
  double get avgPpeCompliance => ppeAudits.isEmpty ? 100.0 : ppeAudits.map((a) => a.complianceRate).reduce((a, b) => a + b) / ppeAudits.length;

  @override
  List<Object?> get props => [incidents, ppeAudits];
}

class HseOperationSuccess extends HseState {
  final String message;
  const HseOperationSuccess(this.message);
}

class HseError extends HseState {
  final String message;
  const HseError(this.message);
}

// Bloc
class HseBloc extends Bloc<HseEvent, HseState> {
  final HseRepository hseRepository;

  HseBloc({required this.hseRepository}) : super(HseInitial()) {
    on<LoadProjectHseRequested>(_onLoadHse);
    on<ReportIncidentRequested>(_onReportIncident);
    on<SavePpeAuditRequested>(_onSaveAudit);
  }

  Future<void> _onLoadHse(LoadProjectHseRequested event, Emitter<HseState> emit) async {
    emit(HseLoading());
    final incidentsRes = await hseRepository.getIncidentsByProject(event.projectId);
    final auditsRes = await hseRepository.getPpeAuditsByProject(event.projectId);

    incidentsRes.fold(
      (failure) => emit(HseError(failure.message)),
      (incidents) {
        auditsRes.fold(
          (failure) => emit(HseError(failure.message)),
          (audits) => emit(HseLoaded(incidents: incidents, ppeAudits: audits)),
        );
      },
    );
  }

  Future<void> _onReportIncident(ReportIncidentRequested event, Emitter<HseState> emit) async {
    final result = await hseRepository.reportIncident(event.incident);
    result.fold(
      (failure) => emit(HseError(failure.message)),
      (_) {
        emit(const HseOperationSuccess('Incident rapporté.'));
        add(LoadProjectHseRequested(event.incident.projectId));
      },
    );
  }

  Future<void> _onSaveAudit(SavePpeAuditRequested event, Emitter<HseState> emit) async {
    final result = await hseRepository.savePpeAudit(event.audit);
    result.fold(
      (failure) => emit(HseError(failure.message)),
      (_) {
        emit(const HseOperationSuccess('Audit EPI enregistré.'));
        add(LoadProjectHseRequested(event.audit.projectId));
      },
    );
  }
}
