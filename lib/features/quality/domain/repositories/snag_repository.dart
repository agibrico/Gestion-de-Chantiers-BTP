import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/snag_entity.dart';

abstract class SnagRepository {
  Future<Either<Failure, List<SnagEntity>>> getSnagsByProject(String projectId);
  
  Future<Either<Failure, SnagEntity>> getSnagById(String id);
  
  Future<Either<Failure, SnagEntity>> createSnag(SnagEntity snag);
  
  Future<Either<Failure, SnagEntity>> updateSnag(SnagEntity snag);
  
  Future<Either<Failure, void>> deleteSnag(String id);

  /// Filtre les réserves par statut
  Future<Either<Failure, List<SnagEntity>>> getSnagsByStatus(String projectId, SnagStatus status);
}
