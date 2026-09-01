import 'package:equatable/equatable.dart';

class PhaseEntity extends Equatable {
  final String id;
  final String projectId;
  final String name; // Ex: Terrassement, Fondations, Gros Oeuvre
  final int order; // Ordre d'affichage
  final DateTime startDate;
  final DateTime endDate;
  final double progressPercentage;
  final DateTime createdAt;
  final DateTime updatedAt;

  const PhaseEntity({
    required this.id,
    required this.projectId,
    required this.name,
    required this.order,
    required this.startDate,
    required this.endDate,
    required this.progressPercentage,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        projectId,
        name,
        order,
        startDate,
        endDate,
        progressPercentage,
        createdAt,
        updatedAt,
      ];
}
