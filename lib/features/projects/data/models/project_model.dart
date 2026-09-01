import 'package:isar/isar.dart';
import '../../domain/entities/project_entity.dart';

part 'project_model.g.dart';

@collection
class ProjectModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index(type: IndexType.value)
  late String projectNumber;

  @Index(type: IndexType.value)
  late String name;

  @Index(type: IndexType.value)
  late String clientId;
  
  late String clientName;
  late String description;
  late String address;
  late String city;
  
  double? latitude;
  double? longitude;
  late String projectType;
  late double surfaceArea;
  late int levels;
  late double budgetAllocated;
  late DateTime startDate;
  late DateTime endDate;

  @enumerated
  late ProjectStatus status;

  late double progressPercentage;
  late DateTime createdAt;
  late DateTime updatedAt;

  @Index()
  bool isPendingSync = false;
  DateTime? lastUpdatedServer;

  // Convert to Entity
  ProjectEntity toEntity() {
    return ProjectEntity(
      id: remoteId,
      projectNumber: projectNumber,
      name: name,
      clientId: clientId,
      clientName: clientName,
      description: description,
      address: address,
      city: city,
      latitude: latitude,
      longitude: longitude,
      projectType: projectType,
      surfaceArea: surfaceArea,
      levels: levels,
      budgetAllocated: budgetAllocated,
      startDate: startDate,
      endDate: endDate,
      status: status,
      progressPercentage: progressPercentage,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  // From Entity
  static ProjectModel fromEntity(ProjectEntity entity) {
    final model = ProjectModel();
    model.remoteId = entity.id;
    model.projectNumber = entity.projectNumber;
    model.name = entity.name;
    model.clientId = entity.clientId;
    model.clientName = entity.clientName;
    model.description = entity.description;
    model.address = entity.address;
    model.city = entity.city;
    model.latitude = entity.latitude;
    model.longitude = entity.longitude;
    model.projectType = entity.projectType;
    model.surfaceArea = entity.surfaceArea;
    model.levels = entity.levels;
    model.budgetAllocated = entity.budgetAllocated;
    model.startDate = entity.startDate;
    model.endDate = entity.endDate;
    model.status = entity.status;
    model.progressPercentage = entity.progressPercentage;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}
