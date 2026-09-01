import 'package:isar/isar.dart';
import '../../domain/entities/phase_entity.dart';
import '../../domain/entities/planning_task_entity.dart';

part 'planning_models.g.dart';

@collection
class PhaseModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index()
  late String projectId;

  late String name;
  late int order;
  late DateTime startDate;
  late DateTime endDate;
  late double progressPercentage;
  late DateTime createdAt;
  late DateTime updatedAt;

  PhaseEntity toEntity() {
    return PhaseEntity(
      id: remoteId,
      projectId: projectId,
      name: name,
      order: order,
      startDate: startDate,
      endDate: endDate,
      progressPercentage: progressPercentage,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  static PhaseModel fromEntity(PhaseEntity entity) {
    final model = PhaseModel();
    model.remoteId = entity.id;
    model.projectId = entity.projectId;
    model.name = entity.name;
    model.order = entity.order;
    model.startDate = entity.startDate;
    model.endDate = entity.endDate;
    model.progressPercentage = entity.progressPercentage;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}

@collection
class PlanningTaskModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index()
  late String phaseId;

  @Index()
  late String projectId;

  late String title;
  String? description;
  late DateTime startDate;
  late DateTime endDate;

  @enumerated
  late PlanningTaskStatus status;

  @enumerated
  late TaskPriority priority;

  late double progressPercentage;
  late List<String> dependencies;
  String? assignedTeamId;
  String? assignedTeamName;
  late double estimatedCost;
  late double actualCost;
  String? observations;
  late DateTime createdAt;
  late DateTime updatedAt;

  PlanningTaskEntity toEntity() {
    return PlanningTaskEntity(
      id: remoteId,
      phaseId: phaseId,
      projectId: projectId,
      title: title,
      description: description,
      startDate: startDate,
      endDate: endDate,
      status: status,
      priority: priority,
      progressPercentage: progressPercentage,
      dependencies: dependencies,
      assignedTeamId: assignedTeamId,
      assignedTeamName: assignedTeamName,
      estimatedCost: estimatedCost,
      actualCost: actualCost,
      observations: observations,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  static PlanningTaskModel fromEntity(PlanningTaskEntity entity) {
    final model = PlanningTaskModel();
    model.remoteId = entity.id;
    model.phaseId = entity.phaseId;
    model.projectId = entity.projectId;
    model.title = entity.title;
    model.description = entity.description;
    model.startDate = entity.startDate;
    model.endDate = entity.endDate;
    model.status = entity.status;
    model.priority = entity.priority;
    model.progressPercentage = entity.progressPercentage;
    model.dependencies = entity.dependencies;
    model.assignedTeamId = entity.assignedTeamId;
    model.assignedTeamName = entity.assignedTeamName;
    model.estimatedCost = entity.estimatedCost;
    model.actualCost = entity.actualCost;
    model.observations = entity.observations;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}
