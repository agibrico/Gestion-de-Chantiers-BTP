import 'package:isar/isar.dart';
import '../../domain/entities/snag_entity.dart';

part 'snag_model.g.dart';

@collection
class SnagModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index()
  late String projectId;
  
  late String projectName;
  late String title;
  late String description;
  late String zone;

  @enumerated
  late SnagStatus status;

  @enumerated
  late SnagPriority priority;

  String? responsiblePerson;
  DateTime? dueDate;
  String? photoPath;
  late String reporterName;
  String? closureObservations;
  late DateTime createdAt;
  late DateTime updatedAt;

  SnagEntity toEntity() {
    return SnagEntity(
      id: remoteId,
      projectId: projectId,
      projectName: projectName,
      title: title,
      description: description,
      zone: zone,
      status: status,
      priority: priority,
      responsiblePerson: responsiblePerson,
      dueDate: dueDate,
      photoPath: photoPath,
      reporterName: reporterName,
      closureObservations: closureObservations,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  static SnagModel fromEntity(SnagEntity entity) {
    final model = SnagModel();
    model.remoteId = entity.id;
    model.projectId = entity.projectId;
    model.projectName = entity.projectName;
    model.title = entity.title;
    model.description = entity.description;
    model.zone = entity.zone;
    model.status = entity.status;
    model.priority = entity.priority;
    model.responsiblePerson = entity.responsiblePerson;
    model.dueDate = entity.dueDate;
    model.photoPath = entity.photoPath;
    model.reporterName = entity.reporterName;
    model.closureObservations = entity.closureObservations;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}
