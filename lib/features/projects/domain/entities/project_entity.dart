import 'package:equatable/equatable.dart';

enum ProjectStatus {
  PREPARATION,
  EN_COURS,
  SUSPENDU,
  EN_RETARD,
  TERMINE,
  ARCHIVE,
}

class ProjectEntity extends Equatable {
  final String id;
  final String projectNumber; // Ex: PRJ-2026-001
  final String name;
  final String clientId;
  final String clientName;
  final String description;
  final String address;
  final String city;
  final double? latitude;
  final double? longitude;
  final String projectType; // Ex: Résidentiel, Industriel, Tertiaire
  final double surfaceArea; // en m²
  final int levels; // nombre de niveaux R+X
  final double budgetAllocated; // en FCFA
  final DateTime startDate;
  final DateTime endDate;
  final ProjectStatus status;
  final double progressPercentage; // 0.0 to 100.0
  final DateTime createdAt;
  final DateTime updatedAt;

  const ProjectEntity({
    required this.id,
    required this.projectNumber,
    required this.name,
    required this.clientId,
    required this.clientName,
    required this.description,
    required this.address,
    required this.city,
    this.latitude,
    this.longitude,
    required this.projectType,
    required this.surfaceArea,
    required this.levels,
    required this.budgetAllocated,
    required this.startDate,
    required this.endDate,
    required this.status,
    required this.progressPercentage,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        projectNumber,
        name,
        clientId,
        clientName,
        description,
        address,
        city,
        latitude,
        longitude,
        projectType,
        surfaceArea,
        levels,
        budgetAllocated,
        startDate,
        endDate,
        status,
        progressPercentage,
        createdAt,
        updatedAt,
      ];
}
