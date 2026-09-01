import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/attendance_entity.dart';

abstract class AttendanceRepository {
  /// Récupère le pointage pour un projet et une date spécifique
  Future<Either<Failure, List<AttendanceEntity>>> getAttendanceByProjectAndDate({
    required String projectId,
    required DateTime date,
  });

  /// Enregistre un pointage (création ou mise à jour)
  Future<Either<Failure, AttendanceEntity>> recordAttendance(AttendanceEntity attendance);

  /// Enregistre le pointage pour une équipe entière
  Future<Either<Failure, List<AttendanceEntity>>> recordBulkAttendance(List<AttendanceEntity> attendances);

  /// Récupère les statistiques de présence pour un employé
  Future<Either<Failure, List<AttendanceEntity>>> getEmployeeAttendanceHistory(String employeeId);
}
