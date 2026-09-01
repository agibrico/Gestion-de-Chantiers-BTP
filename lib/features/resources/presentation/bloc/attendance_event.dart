import 'package:equatable/equatable.dart';
import '../../domain/entities/attendance_entity.dart';

abstract class AttendanceEvent extends Equatable {
  const AttendanceEvent();

  @override
  List<Object?> get props => [];
}

class LoadAttendanceRequested extends AttendanceEvent {
  final String projectId;
  final DateTime date;

  const LoadAttendanceRequested({required this.projectId, required this.date});

  @override
  List<Object?> get props => [projectId, date];
}

class RecordAttendanceRequested extends AttendanceEvent {
  final AttendanceEntity attendance;

  const RecordAttendanceRequested(this.attendance);

  @override
  List<Object?> get props => [attendance];
}

class RecordBulkAttendanceRequested extends AttendanceEvent {
  final List<AttendanceEntity> attendances;

  const RecordBulkAttendanceRequested(this.attendances);

  @override
  List<Object?> get props => [attendances];
}
