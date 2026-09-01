import 'dart:typed_data';
import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';

abstract class ReportRepository {
  /// Génère le PDF du journal de chantier pour une date précise
  Future<Either<Failure, Uint8List>> generateDailyDiaryReport({
    required String projectId,
    required DateTime date,
  });

  /// Génère un rapport d'état des stocks global pour un projet
  Future<Either<Failure, Uint8List>> generateStockStatusReport({
    required String projectId,
  });

  /// Génère une synthèse financière du projet
  Future<Either<Failure, Uint8List>> generateFinancialSummaryReport({
    required String projectId,
  });
}
