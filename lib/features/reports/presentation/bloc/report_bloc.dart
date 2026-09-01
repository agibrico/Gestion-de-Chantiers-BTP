import 'dart:typed_data';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/repositories/report_repository.dart';

// Events
abstract class ReportEvent extends Equatable {
  const ReportEvent();
  @override
  List<Object?> get props => [];
}

class GenerateDailyReportRequested extends ReportEvent {
  final String projectId;
  final DateTime date;
  const GenerateDailyReportRequested({required this.projectId, required this.date});
  @override
  List<Object?> get props => [projectId, date];
}

// States
abstract class ReportState extends Equatable {
  const ReportState();
  @override
  List<Object?> get props => [];
}

class ReportInitial extends ReportState {}
class ReportGenerating extends ReportState {}

class ReportGenerated extends ReportState {
  final Uint8List pdfBytes;
  final String fileName;
  const ReportGenerated(this.pdfBytes, this.fileName);
  @override
  List<Object?> get props => [pdfBytes, fileName];
}

class ReportError extends ReportState {
  final String message;
  const ReportError(this.message);
  @override
  List<Object?> get props => [message];
}

// Bloc
class ReportBloc extends Bloc<ReportEvent, ReportState> {
  final ReportRepository reportRepository;

  ReportBloc({required this.reportRepository}) : super(ReportInitial()) {
    on<GenerateDailyReportRequested>(_onGenerateDailyReport);
  }

  Future<void> _onGenerateDailyReport(GenerateDailyReportRequested event, Emitter<ReportState> emit) async {
    emit(ReportGenerating());
    final result = await reportRepository.generateDailyDiaryReport(
      projectId: event.projectId,
      date: event.date,
    );

    result.fold(
      (failure) => emit(ReportError(failure.message)),
      (bytes) => emit(ReportGenerated(bytes, 'Rapport_Journalier_${event.date.day}_${event.date.month}.pdf')),
    );
  }
}
