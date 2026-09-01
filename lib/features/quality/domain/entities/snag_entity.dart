import 'package:equatable/equatable.dart';

enum SnagStatus {
  OUVERTE,
  EN_COURS_CORRECTION,
  LEVEE, // Validée par le contrôleur
  ANNULEE,
}

enum SnagPriority {
  BASSE,
  MOYENNE,
  HAUTE,
  URGENTE,
}

class SnagEntity extends Equatable {
  final String id;
  final String projectId;
  final String projectName;
  final String title;
  final String description;
  final String zone; // Localisation précise (ex: R+1, Local technique)
  final SnagStatus status;
  final SnagPriority priority;
  final String? responsiblePerson; // Nom de la personne/équipe chargée de la correction
  final DateTime? dueDate; // Date limite de levée
  final String? photoPath; // Lien vers une photo de la réserve (Axe 14)
  final String reporterName;
  final String? closureObservations; // Notes lors de la levée
  final DateTime createdAt;
  final DateTime updatedAt;

  const SnagEntity({
    required this.id,
    required this.projectId,
    required this.projectName,
    required this.title,
    required this.description,
    required this.zone,
    required this.status,
    required this.priority,
    this.responsiblePerson,
    this.dueDate,
    this.photoPath,
    required this.reporterName,
    this.closureObservations,
    required this.createdAt,
    required this.updatedAt,
  });

  bool get isOverdue => dueDate != null && status != SnagStatus.LEVEE && DateTime.now().isAfter(dueDate!);

  @override
  List<Object?> get props => [
        id,
        projectId,
        projectName,
        title,
        description,
        zone,
        status,
        priority,
        responsiblePerson,
        dueDate,
        photoPath,
        reporterName,
        closureObservations,
        createdAt,
        updatedAt,
      ];
}
