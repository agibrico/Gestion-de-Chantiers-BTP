import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/equipment_entity.dart';

abstract class EquipmentRepository {
  Future<Either<Failure, List<EquipmentEntity>>> getAllEquipment();
  
  Future<Either<Failure, EquipmentEntity>> getEquipmentById(String id);
  
  Future<Either<Failure, EquipmentEntity>> createEquipment(EquipmentEntity equipment);
  
  Future<Either<Failure, EquipmentEntity>> updateEquipment(EquipmentEntity equipment);
  
  Future<Either<Failure, void>> deleteEquipment(String id);
  
  /// Rapporte une maintenance et met à jour l'historique et l'état de l'engin
  Future<Either<Failure, EquipmentEntity>> recordMaintenance({
    required String equipmentId,
    required MaintenanceLogEntity log,
    required EquipmentStatus newStatus,
  });

  /// Met à jour le compteur horaire de l'engin
  Future<Either<Failure, EquipmentEntity>> updateHourMeter({
    required String equipmentId,
    required double newHours,
  });

  /// Affecte un engin à un chantier
  Future<Either<Failure, EquipmentEntity>> assignToProject({
    required String equipmentId,
    required String projectId,
    required String projectName,
  });
}
