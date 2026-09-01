import 'package:equatable/equatable.dart';
import '../../domain/entities/attendance_entity.dart';

abstract class AttendanceState extends Equatable {
  const AttendanceState();
  
  @override
  List<Object?> get props => [];
}

class AttendanceInitial extends AttendanceState {}

class AttendanceLoading extends AttendanceState {}

class AttendanceLoaded extends AttendanceState {
  final List<AttendanceEntity> attendances;
  final DateTime date;
  final String projectId;

  const AttendanceLoaded({
    required this.attendances,
    required this.date,
    required this.projectId,
  });

  @override
  List<Object?> get props => [attendances, date, projectId];
}

class AttendanceOperationSuccess extends AttendanceState {
  final String message;
  const AttendanceOperationSuccess(this.message);

  @override
  List<Object?> get props => [message];
}

class AttendanceError extends AttendanceState {
  final String message;
  const AttendanceError(this.message);

  @override
  List<Object?> get props => [message];
}
