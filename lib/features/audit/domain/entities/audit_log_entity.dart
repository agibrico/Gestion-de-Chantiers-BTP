import 'package:equatable/equatable.dart';

enum AuditAction {
  CREATE,
  UPDATE,
  DELETE,
  LOGIN,
  LOGOUT,
  SYNC,
  EXPORT,
}

enum AuditModule {
  PROJECT,
  INVENTORY,
  FINANCE,
  RESOURCES,
  HSE,
  QUALITY,
  AUTH,
  SYSTEM,
}

class AuditLogEntity extends Equatable {
  final String id;
  final AuditAction action;
  final AuditModule module;
  final String actionDetail; // Ex: "Création du projet Riviera"
  final String authorId;
  final String authorName;
  final DateTime timestamp;
  final String? relatedObjectId;
  final Map<String, dynamic>? metadata; // Pour stocker les anciennes/nouvelles valeurs si besoin

  const AuditLogEntity({
    required this.id,
    required this.action,
    required this.module,
    required this.actionDetail,
    required this.authorId,
    required this.authorName,
    required this.timestamp,
    this.relatedObjectId,
    this.metadata,
  });

  @override
  List<Object?> get props => [
        id,
        action,
        module,
        actionDetail,
        authorId,
        authorName,
        timestamp,
        relatedObjectId,
        metadata,
      ];
}
