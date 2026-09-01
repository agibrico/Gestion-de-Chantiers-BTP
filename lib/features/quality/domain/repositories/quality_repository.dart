import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/quality_inspection_entity.dart';

abstract class QualityRepository {
  Future<Either<Failure, List<QualityInspectionEntity>>> getInspectionsByProject(String projectId);
  
  Future<Either<Failure, QualityInspectionEntity>> getInspectionById(String id);
  
  Future<Either<Failure, QualityInspectionEntity>> saveInspection(QualityInspectionEntity inspection);
  
  Future<Either<Failure, void>> deleteInspection(String id);
}
