import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../domain/entities/attendance_entity.dart';
import '../../domain/repositories/attendance_repository.dart';
import '../models/attendance_model.dart';

class AttendanceRepositoryImpl implements AttendanceRepository {
  final IsarService isarService;

  AttendanceRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, List<AttendanceEntity>>> getAttendanceByProjectAndDate({
    required String projectId,
    required DateTime date,
  }) async {
    try {
      final isar = await isarService.db;
      final normalizedDate = DateTime(date.year, date.month, date.day);
      
      final models = await isar.attendanceModels
          .filter()
          .projectIdEqualTo(projectId)
          .dateEqualTo(normalizedDate)
          .findAll();
          
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, AttendanceEntity>> recordAttendance(AttendanceEntity attendance) async {
    try {
      final isar = await isarService.db;
      final model = AttendanceModel.fromEntity(attendance);
      
      // Check if entry already exists for this employee/date/project to update it
      final existing = await isar.attendanceModels
          .filter()
          .employeeIdEqualTo(attendance.employeeId)
          .dateEqualTo(model.date)
          .projectIdEqualTo(attendance.projectId)
          .findFirst();
          
      if (existing != null) {
        model.id = existing.id;
      }
      
      await isar.writeTxn(() => isar.attendanceModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<AttendanceEntity>>> recordBulkAttendance(List<AttendanceEntity> attendances) async {
    try {
      final isar = await isarService.db;
      final results = <AttendanceEntity>[];
      
      await isar.writeTxn(() async {
        for (final attendance in attendances) {
          final model = AttendanceModel.fromEntity(attendance);
          final existing = await isar.attendanceModels
              .filter()
              .employeeIdEqualTo(attendance.employeeId)
              .dateEqualTo(model.date)
              .projectIdEqualTo(attendance.projectId)
              .findFirst();
              
          if (existing != null) {
            model.id = existing.id;
          }
          await isar.attendanceModels.put(model);
          results.add(model.toEntity());
        }
      });
      
      return Right(results);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<AttendanceEntity>>> getEmployeeAttendanceHistory(String employeeId) async {
    try {
      final isar = await isarService.db;
      final models = await isar.attendanceModels
          .filter()
          .employeeIdEqualTo(employeeId)
          .sortByDateDesc()
          .findAll();
          
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }
}
