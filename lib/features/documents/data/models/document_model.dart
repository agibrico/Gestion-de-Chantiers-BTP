import 'package:isar/isar.dart';
import '../../domain/entities/project_document_entity.dart';

part 'document_model.g.dart';

@collection
class ProjectDocumentModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index()
  late String projectId;
  
  late String projectName;
  late String title;

  @enumerated
  late DocumentType type;

  late String filePath;
  late String fileName;
  late double fileSize;
  String? version;
  late DateTime dateAdded;
  late String authorName;
  late DateTime createdAt;

  ProjectDocumentEntity toEntity() {
    return ProjectDocumentEntity(
      id: remoteId,
      projectId: projectId,
      projectName: projectName,
      title: title,
      type: type,
      filePath: filePath,
      fileName: fileName,
      fileSize: fileSize,
      version: version,
      dateAdded: dateAdded,
      authorName: authorName,
      createdAt: createdAt,
    );
  }

  static ProjectDocumentModel fromEntity(ProjectDocumentEntity entity) {
    final model = ProjectDocumentModel();
    model.remoteId = entity.id;
    model.projectId = entity.projectId;
    model.projectName = entity.projectName;
    model.title = entity.title;
    model.type = entity.type;
    model.filePath = entity.filePath;
    model.fileName = entity.fileName;
    model.fileSize = entity.fileSize;
    model.version = entity.version;
    model.dateAdded = entity.dateAdded;
    model.authorName = entity.authorName;
    model.createdAt = entity.createdAt;
    return model;
  }
}
