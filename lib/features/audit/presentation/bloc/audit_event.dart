import 'package:equatable/equatable.dart';
import '../../domain/entities/audit_log_entity.dart';

abstract class AuditEvent extends Equatable {
  const AuditEvent();
  @override
  List<Object?> get props => [];
}

class LoadAuditLogsRequested extends AuditEvent {
  final AuditModule? module;
  final AuditAction? action;
  
  const LoadAuditLogsRequested({this.module, this.action});
  
  @override
  List<Object?> get props => [module, action];
}
