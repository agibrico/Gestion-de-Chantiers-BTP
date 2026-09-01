import 'package:isar/isar.dart';
import '../../domain/entities/handover_entity.dart';

part 'handover_models.g.dart';

@embedded
class HandoverParticipantModel {
  late String name;
  late String role;
  late bool hasSigned;

  HandoverParticipant toEntity() {
    return HandoverParticipant(
      name: name,
      role: role,
      hasSigned: hasSigned,
    );
  }

  static HandoverParticipantModel fromEntity(HandoverParticipant entity) {
    final model = HandoverParticipantModel();
    model.name = entity.name;
    model.role = entity.role;
    model.hasSigned = entity.hasSigned;
    return model;
  }
}

@embedded
class HandoverReserveModel {
  late String description;
  late bool isResolved;
  DateTime? resolutionDate;

  HandoverReserve toEntity() {
    return HandoverReserve(
      description: description,
      isResolved: isResolved,
      resolutionDate: resolutionDate,
    );
  }

  static HandoverReserveModel fromEntity(HandoverReserve entity) {
    final model = HandoverReserveModel();
    model.description = entity.description;
    model.isResolved = entity.isResolved;
    model.resolutionDate = entity.resolutionDate;
    return model;
  }
}

@collection
class HandoverModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index()
  late String projectId;
  
  late String projectName;
  late DateTime date;

  @enumerated
  late HandoverType type;

  late List<HandoverParticipantModel> participants;
  late List<HandoverReserveModel> reserves;
  
  late String observations;
  late bool isCompleted;
  late DateTime createdAt;
  late DateTime updatedAt;

  HandoverEntity toEntity() {
    return HandoverEntity(
      id: remoteId,
      projectId: projectId,
      projectName: projectName,
      date: date,
      type: type,
      participants: participants.map((p) => p.toEntity()).toList(),
      reserves: reserves.map((r) => r.toEntity()).toList(),
      observations: observations,
      isCompleted: isCompleted,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  static HandoverModel fromEntity(HandoverEntity entity) {
    final model = HandoverModel();
    model.remoteId = entity.id;
    model.projectId = entity.projectId;
    model.projectName = entity.projectName;
    model.date = entity.date;
    model.type = entity.type;
    model.participants = entity.participants.map((p) => HandoverParticipantModel.fromEntity(p)).toList();
    model.reserves = entity.reserves.map((r) => HandoverReserveModel.fromEntity(r)).toList();
    model.observations = entity.observations;
    model.isCompleted = entity.isCompleted;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}
