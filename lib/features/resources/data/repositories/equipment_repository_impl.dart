import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../domain/entities/equipment_entity.dart';
import '../../domain/repositories/equipment_repository.dart';
import '../models/equipment_model.dart';

class EquipmentRepositoryImpl implements EquipmentRepository {
  final IsarService isarService;

  EquipmentRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, List<EquipmentEntity>>> getAllEquipment() async {
    try {
      final isar = await isarService.db;
      final models = await isar.equipmentModels.where().sortByCode().findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, EquipmentEntity>> getEquipmentById(String id) async {
    try {
      final isar = await isarService.db;
      final model = await isar.equipmentModels.filter().remoteIdEqualTo(id).findFirst();
      if (model != null) return Right(model.toEntity());
      return const Left(CacheFailure('Engin non trouvé.'));
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, EquipmentEntity>> createEquipment(EquipmentEntity equipment) async {
    try {
      final isar = await isarService.db;
      final model = EquipmentModel.fromEntity(equipment);
      await isar.writeTxn(() => isar.equipmentModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, EquipmentEntity>> updateEquipment(EquipmentEntity equipment) async {
    try {
      final isar = await isarService.db;
      final existing = await isar.equipmentModels.filter().remoteIdEqualTo(equipment.id).findFirst();
      if (existing == null) return const Left(CacheFailure('Engin non trouvé.'));

      final model = EquipmentModel.fromEntity(equipment);
      model.id = existing.id;
      await isar.writeTxn(() => isar.equipmentModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deleteEquipment(String id) async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() => isar.equipmentModels.filter().remoteIdEqualTo(id).deleteFirst());
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, EquipmentEntity>> recordMaintenance({
    required String equipmentId,
    required MaintenanceLogEntity log,
    required EquipmentStatus newStatus,
  }) async {
    try {
      final isar = await isarService.db;
      final existing = await isar.equipmentModels.filter().remoteIdEqualTo(equipmentId).findFirst();
      if (existing == null) return const Left(CacheFailure());

      final logModel = MaintenanceLogModel.fromEntity(log);
      existing.maintenanceHistory = [...existing.maintenanceHistory, logModel];
      existing.status = newStatus;
      existing.lastMaintenanceDate = log.date;
      existing.updatedAt = DateTime.now();

      await isar.writeTxn(() => isar.equipmentModels.put(existing));
      return Right(existing.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, EquipmentEntity>> updateHourMeter({
    required String equipmentId,
    required double newHours,
  }) async {
    try {
      final isar = await isarService.db;
      final existing = await isar.equipmentModels.filter().remoteIdEqualTo(equipmentId).findFirst();
      if (existing == null) return const Left(CacheFailure());

      existing.hourMeterCurrent = newHours;
      existing.updatedAt = DateTime.now();

      await isar.writeTxn(() => isar.equipmentModels.put(existing));
      return Right(existing.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, EquipmentEntity>> assignToProject({
    required String equipmentId,
    required String projectId,
    required String projectName,
  }) async {
    try {
      final isar = await isarService.db;
      final existing = await isar.equipmentModels.filter().remoteIdEqualTo(equipmentId).findFirst();
      if (existing == null) return const Left(CacheFailure());

      existing.currentProjectId = projectId;
      existing.currentProjectName = projectName;
      existing.status = EquipmentStatus.EN_SERVICE;
      existing.updatedAt = DateTime.now();

      await isar.writeTxn(() => isar.equipmentModels.put(existing));
      return Right(existing.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }
}
