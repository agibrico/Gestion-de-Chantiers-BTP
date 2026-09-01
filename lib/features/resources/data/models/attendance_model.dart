import 'package:isar/isar.dart';
import '../../domain/entities/attendance_entity.dart';

part 'attendance_model.g.dart';

@collection
class AttendanceModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index(composite: [IndexComposite('date'), IndexComposite('projectId')])
  late String employeeId;

  late String employeeName;

  @Index()
  late String projectId;

  late String projectName;

  @Index()
  late DateTime date;

  @enumerated
  late AttendanceStatus status;

  late double hoursWorked;
  late double overtimeHours;
  String? notes;
  late DateTime createdAt;
  late DateTime updatedAt;

  AttendanceEntity toEntity() {
    return AttendanceEntity(
      id: remoteId,
      employeeId: employeeId,
      employeeName: employeeName,
      projectId: projectId,
      projectName: projectName,
      date: date,
      status: status,
      hoursWorked: hoursWorked,
      overtimeHours: overtimeHours,
      notes: notes,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  static AttendanceModel fromEntity(AttendanceEntity entity) {
    final model = AttendanceModel();
    model.remoteId = entity.id;
    model.employeeId = entity.employeeId;
    model.employeeName = entity.employeeName;
    model.projectId = entity.projectId;
    model.projectName = entity.projectName;
    model.date = DateTime(entity.date.year, entity.date.month, entity.date.day); // Normaliser à la journée
    model.status = entity.status;
    model.hoursWorked = entity.hoursWorked;
    model.overtimeHours = entity.overtimeHours;
    model.notes = entity.notes;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}
