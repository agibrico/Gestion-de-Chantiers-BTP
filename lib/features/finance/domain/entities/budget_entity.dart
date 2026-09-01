import 'package:equatable/equatable.dart';

class BudgetEntity extends Equatable {
  final String id;
  final String projectId;
  final String projectName;
  final double totalAllocated; // Budget initial
  final Map<String, double> allocatedByCategory; // Budget par catégorie (Matériaux, MO, etc.)
  final DateTime createdAt;
  final DateTime updatedAt;

  const BudgetEntity({
    required this.id,
    required this.projectId,
    required this.projectName,
    required this.totalAllocated,
    required this.allocatedByCategory,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        projectId,
        projectName,
        totalAllocated,
        allocatedByCategory,
        createdAt,
        updatedAt,
      ];
}
