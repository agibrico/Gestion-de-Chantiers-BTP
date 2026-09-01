import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/handover_entity.dart';

abstract class HandoverRepository {
  Future<Either<Failure, List<HandoverEntity>>> getHandoversByProject(String projectId);
  
  Future<Either<Failure, HandoverEntity>> saveHandover(HandoverEntity handover);
  
  Future<Either<Failure, void>> deleteHandover(String id);
}
