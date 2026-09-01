import 'package:uuid/uuid.dart';
import '../../features/audit/domain/entities/audit_log_entity.dart';
import '../../features/audit/domain/repositories/audit_repository.dart';
import '../../features/authentication/presentation/bloc/auth_bloc.dart';
import '../../features/authentication/presentation/bloc/auth_state.dart';

class AuditService {
  final AuditRepository repository;
  final AuthBloc authBloc;

  AuditService({required this.repository, required this.authBloc});

  Future<void> log({
    required AuditAction action,
    required AuditModule module,
    required String detail,
    String? relatedObjectId,
  }) async {
    final state = authBloc.state;
    String authorId = "SYSTEM";
    String authorName = "Système Automatique";

    if (state is Authenticated) {
      authorId = state.user.id;
      authorName = state.user.fullName;
    }

    final auditLog = AuditLogEntity(
      id: const Uuid().v4(),
      action: action,
      module: module,
      actionDetail: detail,
      authorId: authorId,
      authorName: authorName,
      timestamp: DateTime.now(),
      relatedObjectId: relatedObjectId,
    );

    await repository.log(auditLog);
  }
}
