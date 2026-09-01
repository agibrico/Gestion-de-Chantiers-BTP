import 'package:equatable/equatable.dart';
import '../../domain/entities/audit_log_entity.dart';

abstract class AuditState extends Equatable {
  const AuditState();
  @override
  List<Object?> get props => [];
}

class AuditInitial extends AuditState {}
class AuditLoading extends AuditState {}

class AuditLogsLoaded extends AuditState {
  final List<AuditLogEntity> logs;
  const AuditLogsLoaded(this.logs);
  @override
  List<Object?> get props => [logs];
}

class AuditError extends AuditState {
  final String message;
  const AuditError(this.message);
}
