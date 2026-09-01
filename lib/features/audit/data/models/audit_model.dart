import 'package:isar/isar.dart';
import '../../domain/entities/audit_log_entity.dart';

part 'audit_model.g.dart';

@collection
class AuditLogModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @enumerated
  late AuditAction action;

  @enumerated
  late AuditModule module;

  late String actionDetail;
  
  @Index()
  late String authorId;
  
  late String authorName;

  @Index()
  late DateTime timestamp;

  String? relatedObjectId;
  
  // Isar ne supporte pas directement Map<String, dynamic> complexe, on stocke en JSON si besoin
  String? metadataJson;

  AuditLogEntity toEntity() {
    return AuditLogEntity(
      id: remoteId,
      action: action,
      module: module,
      actionDetail: actionDetail,
      authorId: authorId,
      authorName: authorName,
      timestamp: timestamp,
      relatedObjectId: relatedObjectId,
    );
  }

  static AuditLogModel fromEntity(AuditLogEntity entity) {
    final model = AuditLogModel();
    model.remoteId = entity.id;
    model.action = entity.action;
    model.module = entity.module;
    model.actionDetail = entity.actionDetail;
    model.authorId = entity.authorId;
    model.authorName = entity.authorName;
    model.timestamp = entity.timestamp;
    model.relatedObjectId = entity.relatedObjectId;
    return model;
  }
}
