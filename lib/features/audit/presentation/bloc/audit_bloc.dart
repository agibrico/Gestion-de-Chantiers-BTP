import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/audit_repository.dart';
import 'audit_event.dart';
import 'audit_state.dart';

class AuditBloc extends Bloc<AuditEvent, AuditState> {
  final AuditRepository repository;

  AuditBloc({required this.repository}) : super(AuditInitial()) {
    on<LoadAuditLogsRequested>(_onLoadLogs);
  }

  Future<void> _onLoadLogs(LoadAuditLogsRequested event, Emitter<AuditState> emit) async {
    emit(AuditLoading());
    final result = await repository.getLogs(
      filterModule: event.module,
      filterAction: event.action,
    );
    
    result.fold(
      (failure) => emit(AuditError(failure.message)),
      (logs) => emit(AuditLogsLoaded(logs)),
    );
  }
}
