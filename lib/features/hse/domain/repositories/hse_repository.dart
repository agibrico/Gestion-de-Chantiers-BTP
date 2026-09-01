import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/hse_incident_entity.dart';
import '../entities/ppe_audit_entity.dart';

abstract class HseRepository {
  // Incidents
  Future<Either<Failure, List<HseIncidentEntity>>> getIncidentsByProject(String projectId);
  Future<Either<Failure, HseIncidentEntity>> reportIncident(HseIncidentEntity incident);
  Future<Either<Failure, void>> closeIncident(String id);

  // PPE Audits
  Future<Either<Failure, List<PpeAuditEntity>>> getPpeAuditsByProject(String projectId);
  Future<Either<Failure, PpeAuditEntity>> savePpeAudit(PpeAuditEntity audit);
}
