import 'package:equatable/equatable.dart';

class PpeCheck extends Equatable {
  final String employeeId;
  final String employeeName;
  final bool hasHelmet;
  final bool hasSafetyShoes;
  final bool hasHighVisVest;
  final bool hasGloves;
  final bool hasGlasses;
  final String? observations;

  const PpeCheck({
    required this.employeeId,
    required this.employeeName,
    required this.hasHelmet,
    required this.hasSafetyShoes,
    required this.hasHighVisVest,
    required this.hasGloves,
    required this.hasGlasses,
    this.observations,
  });

  bool get isCompliant => hasHelmet && hasSafetyShoes && hasHighVisVest;

  @override
  List<Object?> get props => [
        employeeId,
        employeeName,
        hasHelmet,
        hasSafetyShoes,
        hasHighVisVest,
        hasGloves,
        hasGlasses,
        observations,
      ];
}

class PpeAuditEntity extends Equatable {
  final String id;
  final String projectId;
  final String projectName;
  final DateTime date;
  final String teamId;
  final String teamName;
  final List<PpeCheck> checks;
  final String auditorName;
  final DateTime createdAt;

  const PpeAuditEntity({
    required this.id,
    required this.projectId,
    required this.projectName,
    required this.date,
    required this.teamId,
    required this.teamName,
    required this.checks,
    required this.auditorName,
    required this.createdAt,
  });

  double get complianceRate {
    if (checks.isEmpty) return 100.0;
    final compliantCount = checks.where((c) => c.isCompliant).length;
    return (compliantCount / checks.length) * 100;
  }

  @override
  List<Object?> get props => [
        id,
        projectId,
        projectName,
        date,
        teamId,
        teamName,
        checks,
        auditorName,
        createdAt,
      ];
}
