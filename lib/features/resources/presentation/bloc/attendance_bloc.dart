import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/attendance_repository.dart';
import 'attendance_event.dart';
import 'attendance_state.dart';

class AttendanceBloc extends Bloc<AttendanceEvent, AttendanceState> {
  final AttendanceRepository attendanceRepository;

  AttendanceBloc({required this.attendanceRepository}) : super(AttendanceInitial()) {
    on<LoadAttendanceRequested>(_onLoadAttendance);
    on<RecordAttendanceRequested>(_onRecordAttendance);
    on<RecordBulkAttendanceRequested>(_onRecordBulkAttendance);
  }

  Future<void> _onLoadAttendance(LoadAttendanceRequested event, Emitter<AttendanceState> emit) async {
    emit(AttendanceLoading());
    final result = await attendanceRepository.getAttendanceByProjectAndDate(
      projectId: event.projectId,
      date: event.date,
    );

    result.fold(
      (failure) => emit(AttendanceError(failure.message)),
      (attendances) => emit(AttendanceLoaded(
        attendances: attendances,
        date: event.date,
        projectId: event.projectId,
      )),
    );
  }

  Future<void> _onRecordAttendance(RecordAttendanceRequested event, Emitter<AttendanceState> emit) async {
    final result = await attendanceRepository.recordAttendance(event.attendance);
    
    result.fold(
      (failure) => emit(AttendanceError(failure.message)),
      (_) {
        emit(const AttendanceOperationSuccess('Pointage enregistré.'));
        add(LoadAttendanceRequested(projectId: event.attendance.projectId, date: event.attendance.date));
      },
    );
  }

  Future<void> _onRecordBulkAttendance(RecordBulkAttendanceRequested event, Emitter<AttendanceState> emit) async {
    if (event.attendances.isEmpty) return;
    
    emit(AttendanceLoading());
    final result = await attendanceRepository.recordBulkAttendance(event.attendances);
    
    result.fold(
      (failure) => emit(AttendanceError(failure.message)),
      (_) {
        emit(const AttendanceOperationSuccess('Pointage d\'équipe enregistré.'));
        add(LoadAttendanceRequested(
          projectId: event.attendances.first.projectId, 
          date: event.attendances.first.date,
        ));
      },
    );
  }
}
