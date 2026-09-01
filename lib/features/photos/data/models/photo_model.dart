import 'package:isar/isar.dart';
import '../../domain/entities/project_photo_entity.dart';

part 'photo_model.g.dart';

@collection
class ProjectPhotoModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index()
  late String projectId;
  
  late String projectName;
  late String filePath;
  String? description;
  double? latitude;
  double? longitude;
  late DateTime date;
  late String authorName;
  late DateTime createdAt;

  ProjectPhotoEntity toEntity() {
    return ProjectPhotoEntity(
      id: remoteId,
      projectId: projectId,
      projectName: projectName,
      filePath: filePath,
      description: description,
      latitude: latitude,
      longitude: longitude,
      date: date,
      authorName: authorName,
      createdAt: createdAt,
    );
  }

  static ProjectPhotoModel fromEntity(ProjectPhotoEntity entity) {
    final model = ProjectPhotoModel();
    model.remoteId = entity.id;
    model.projectId = entity.projectId;
    model.projectName = entity.projectName;
    model.filePath = entity.filePath;
    model.description = entity.description;
    model.latitude = entity.latitude;
    model.longitude = entity.longitude;
    model.date = entity.date;
    model.authorName = entity.authorName;
    model.createdAt = entity.createdAt;
    return model;
  }
}
