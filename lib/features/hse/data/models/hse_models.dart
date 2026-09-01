import 'package:isar/isar.dart';
import '../../domain/entities/hse_incident_entity.dart';
import '../../domain/entities/ppe_audit_entity.dart';

part 'hse_models.g.dart';

@collection
class HseIncidentModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index()
  late String projectId;
  
  late String projectName;
  late DateTime date;

  @enumerated
  late IncidentType type;

  @enumerated
  late IncidentSeverity severity;

  late String location;
  late String description;
  late List<String> victims;
  late String immediateActions;
  late String reporterName;
  late bool isClosed;
  late DateTime createdAt;

  HseIncidentEntity toEntity() {
    return HseIncidentEntity(
      id: remoteId,
      projectId: projectId,
      projectName: projectName,
      date: date,
      type: type,
      severity: severity,
      location: location,
      description: description,
      victims: victims,
      immediateActions: immediateActions,
      reporterName: reporterName,
      isClosed: isClosed,
      createdAt: createdAt,
    );
  }

  static HseIncidentModel fromEntity(HseIncidentEntity entity) {
    final model = HseIncidentModel();
    model.remoteId = entity.id;
    model.projectId = entity.projectId;
    model.projectName = entity.projectName;
    model.date = entity.date;
    model.type = entity.type;
    model.severity = entity.severity;
    model.location = entity.location;
    model.description = entity.description;
    model.victims = entity.victims;
    model.immediateActions = entity.immediateActions;
    model.reporterName = entity.reporterName;
    model.isClosed = entity.isClosed;
    model.createdAt = entity.createdAt;
    return model;
  }
}

@embedded
class PpeCheckModel {
  late String employeeId;
  late String employeeName;
  late bool hasHelmet;
  late bool hasSafetyShoes;
  late bool hasHighVisVest;
  late bool hasGloves;
  late bool hasGlasses;
  String? observations;

  PpeCheck toEntity() {
    return PpeCheck(
      employeeId: employeeId,
      employeeName: employeeName,
      hasHelmet: hasHelmet,
      hasSafetyShoes: hasSafetyShoes,
      hasHighVisVest: hasHighVisVest,
      hasGloves: hasGloves,
      hasGlasses: hasGlasses,
      observations: observations,
    );
  }

  static PpeCheckModel fromEntity(PpeCheck entity) {
    final model = PpeCheckModel();
    model.employeeId = entity.employeeId;
    model.employeeName = entity.employeeName;
    model.hasHelmet = entity.hasHelmet;
    model.hasSafetyShoes = entity.hasSafetyShoes;
    model.hasHighVisVest = entity.hasHighVisVest;
    model.hasGloves = entity.hasGloves;
    model.hasGlasses = entity.hasGlasses;
    model.observations = entity.observations;
    return model;
  }
}

@collection
class PpeAuditModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index()
  late String projectId;
  
  late String projectName;
  late DateTime date;
  late String teamId;
  late String teamName;
  late List<PpeCheckModel> checks;
  late String auditorName;
  late DateTime createdAt;

  PpeAuditEntity toEntity() {
    return PpeAuditEntity(
      id: remoteId,
      projectId: projectId,
      projectName: projectName,
      date: date,
      teamId: teamId,
      teamName: teamName,
      checks: checks.map((c) => c.toEntity()).toList(),
      auditorName: auditorName,
      createdAt: createdAt,
    );
  }

  static PpeAuditModel fromEntity(PpeAuditEntity entity) {
    final model = PpeAuditModel();
    model.remoteId = entity.id;
    model.projectId = entity.projectId;
    model.projectName = entity.projectName;
    model.date = entity.date;
    model.teamId = entity.teamId;
    model.teamName = entity.teamName;
    model.checks = entity.checks.map((c) => PpeCheckModel.fromEntity(c)).toList();
    model.auditorName = entity.auditorName;
    model.createdAt = entity.createdAt;
    return model;
  }
}
