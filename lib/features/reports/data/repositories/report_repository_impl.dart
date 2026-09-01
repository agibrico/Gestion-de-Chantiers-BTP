import 'dart:typed_data';
import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/services/pdf_service.dart';
import '../../../../core/storage/isar_service.dart';
import '../../../site_diary/data/models/site_diary_model.dart';
import '../../../projects/data/models/project_model.dart';
import '../../domain/repositories/report_repository.dart';
import 'package:isar/isar.dart';

class ReportRepositoryImpl implements ReportRepository {
  final IsarService isarService;
  final PdfService pdfService;

  ReportRepositoryImpl({
    required this.isarService,
    required this.pdfService,
  });

  @override
  Future<Either<Failure, Uint8List>> generateDailyDiaryReport({
    required String projectId,
    required DateTime date,
  }) async {
    try {
      final isar = await isarService.db;
      
      // 1. Récupérer les données du projet
      final project = await isar.projectModels.filter().remoteIdEqualTo(projectId).findFirst();
      if (project == null) return const Left(ServerFailure('Projet non trouvé.'));

      // 2. Récupérer le journal pour cette date
      final normalizedDate = DateTime(date.year, date.month, date.day);
      final diary = await isar.siteDiaryModels
          .filter()
          .projectIdEqualTo(projectId)
          .dateEqualTo(normalizedDate)
          .findFirst();

      if (diary == null) return const Left(ServerFailure('Aucun journal rédigé pour cette date.'));

      // 3. Appeler le service PDF
      final pdfBytes = await pdfService.generateSiteDiaryReport(
        projectName: project.name,
        date: diary.date,
        weather: diary.weather.toString().split('.').last,
        activities: diary.activitiesPerformed,
        workers: diary.totalWorkers,
        author: diary.authorName,
        incidents: diary.incidents,
      );

      return Right(pdfBytes);
    } catch (e) {
      return Left(ServerFailure('Échec de la génération : $e'));
    }
  }

  @override
  Future<Either<Failure, Uint8List>> generateStockStatusReport({required String projectId}) {
    // Placeholder for stock report
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, Uint8List>> generateFinancialSummaryReport({required String projectId}) {
    // Placeholder for financial report
    throw UnimplementedError();
  }
}
