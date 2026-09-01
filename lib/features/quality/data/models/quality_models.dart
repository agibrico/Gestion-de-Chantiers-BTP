import 'package:isar/isar.dart';
import '../../domain/entities/quality_inspection_entity.dart';

part 'quality_models.g.dart';

@embedded
class ChecklistItemModel {
  late String label;
  late bool isChecked;
  String? comment;

  ChecklistItem toEntity() {
    return ChecklistItem(
      label: label,
      isChecked: isChecked,
      comment: comment,
    );
  }

  static ChecklistItemModel fromEntity(ChecklistItem entity) {
    final model = ChecklistItemModel();
    model.label = entity.label;
    model.isChecked = entity.isChecked;
    model.comment = entity.comment;
    return model;
  }
}

@collection
class QualityInspectionModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index()
  late String projectId;
  
  late String projectName;

  @enumerated
  late InspectionType type;

  late String zone;
  late DateTime date;
  late String inspectorName;
  late List<ChecklistItemModel> checklist;

  @enumerated
  late InspectionStatus result;

  String? observations;
  late bool isSigned;
  String? signatureData;
  late DateTime createdAt;
  late DateTime updatedAt;

  QualityInspectionEntity toEntity() {
    return QualityInspectionEntity(
      id: remoteId,
      projectId: projectId,
      projectName: projectName,
      type: type,
      zone: zone,
      date: date,
      inspectorName: inspectorName,
      checklist: checklist.map((i) => i.toEntity()).toList(),
      result: result,
      observations: observations,
      isSigned: isSigned,
      signatureData: signatureData,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  static QualityInspectionModel fromEntity(QualityInspectionEntity entity) {
    final model = QualityInspectionModel();
    model.remoteId = entity.id;
    model.projectId = entity.projectId;
    model.projectName = entity.projectName;
    model.type = entity.type;
    model.zone = entity.zone;
    model.date = entity.date;
    model.inspectorName = entity.inspectorName;
    model.checklist = entity.checklist.map((i) => ChecklistItemModel.fromEntity(i)).toList();
    model.result = entity.result;
    model.observations = entity.observations;
    model.isSigned = entity.isSigned;
    model.signatureData = entity.signatureData;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}
