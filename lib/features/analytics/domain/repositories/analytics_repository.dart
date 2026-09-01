import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/analytics_entity.dart';

abstract class AnalyticsRepository {
  Future<Either<Failure, GlobalAnalytics>> getGlobalAnalytics();
  
  Future<Either<Failure, DashboardKpis>> getProjectKpis(String projectId);
}
