import 'package:equatable/equatable.dart';

enum PlanningTaskStatus {
  A_FAIRE,
  EN_COURS,
  TERMINE,
  EN_RETARD,
}

enum TaskPriority {
  BASSE,
  MOYENNE,
  HAUTE,
  CRITIQUE,
}

class PlanningTaskEntity extends Equatable {
  final String id;
  final String phaseId;
  final String projectId;
  final String title;
  final String? description;
  final DateTime startDate;
  final DateTime endDate;
  final PlanningTaskStatus status;
  final TaskPriority priority;
  final double progressPercentage;
  final List<String> dependencies;
  final String? assignedTeamId;
  final String? assignedTeamName;
  final double estimatedCost;
  final double actualCost;
  final String? observations;
  final DateTime createdAt;
  final DateTime updatedAt;

  const PlanningTaskEntity({
    required this.id,
    required this.phaseId,
    required this.projectId,
    required this.title,
    this.description,
    required this.startDate,
    required this.endDate,
    required this.status,
    this.priority = TaskPriority.MOYENNE,
    required this.progressPercentage,
    required this.dependencies,
    this.assignedTeamId,
    this.assignedTeamName,
    this.estimatedCost = 0.0,
    this.actualCost = 0.0,
    this.observations,
    required this.createdAt,
    required this.updatedAt,
  });

  int get durationInDays => endDate.difference(startDate).inDays;

  @override
  List<Object?> get props => [
        id,
        phaseId,
        projectId,
        title,
        description,
        startDate,
        endDate,
        status,
        progressPercentage,
        dependencies,
        assignedTeamId,
        assignedTeamName,
        createdAt,
        updatedAt,
      ];
}
