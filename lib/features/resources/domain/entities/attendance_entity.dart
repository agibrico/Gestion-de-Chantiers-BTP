import 'package:equatable/equatable.dart';

enum AttendanceStatus {
  PRESENT,
  ABSENT,
  RETARD,
  CONGE,
}

class AttendanceEntity extends Equatable {
  final String id;
  final String employeeId;
  final String employeeName;
  final String projectId;
  final String projectName;
  final DateTime date;
  final AttendanceStatus status;
  final double hoursWorked;
  final double overtimeHours;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  const AttendanceEntity({
    required this.id,
    required this.employeeId,
    required this.employeeName,
    required this.projectId,
    required this.projectName,
    required this.date,
    required this.status,
    required this.hoursWorked,
    required this.overtimeHours,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        employeeId,
        employeeName,
        projectId,
        projectName,
        date,
        status,
        hoursWorked,
        overtimeHours,
        notes,
        createdAt,
        updatedAt,
      ];
}
