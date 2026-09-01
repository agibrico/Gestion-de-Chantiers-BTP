import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../domain/entities/material_entity.dart';
import '../../domain/entities/stock_movement_entity.dart';
import '../../domain/repositories/inventory_repository.dart';
import '../models/inventory_models.dart';

class InventoryRepositoryImpl implements InventoryRepository {
  final IsarService isarService;

  InventoryRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, List<MaterialEntity>>> getAllMaterials() async {
    try {
      final isar = await isarService.db;
      final models = await isar.materialModels.where().sortByCode().findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, MaterialEntity>> getMaterialById(String id) async {
    try {
      final isar = await isarService.db;
      final model = await isar.materialModels.filter().remoteIdEqualTo(id).findFirst();
      if (model != null) return Right(model.toEntity());
      return const Left(CacheFailure('Article non trouvé.'));
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, MaterialEntity>> createMaterial(MaterialEntity material) async {
    try {
      final isar = await isarService.db;
      final model = MaterialModel.fromEntity(material);
      await isar.writeTxn(() => isar.materialModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, MaterialEntity>> updateMaterial(MaterialEntity material) async {
    try {
      final isar = await isarService.db;
      final existing = await isar.materialModels.filter().remoteIdEqualTo(material.id).findFirst();
      if (existing == null) return const Left(CacheFailure('Article non trouvé.'));
      
      final model = MaterialModel.fromEntity(material);
      model.id = existing.id;
      await isar.writeTxn(() => isar.materialModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deleteMaterial(String id) async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() => isar.materialModels.filter().remoteIdEqualTo(id).deleteFirst());
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<MaterialEntity>>> searchMaterials(String query) async {
    try {
      final isar = await isarService.db;
      final models = await isar.materialModels
          .filter()
          .nameContains(query, caseSensitive: false)
          .or()
          .codeContains(query, caseSensitive: false)
          .findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<StockMovementEntity>>> getMovementsByMaterial(String materialId) async {
    try {
      final isar = await isarService.db;
      final models = await isar.stockMovementModels
          .filter()
          .materialIdEqualTo(materialId)
          .sortByDateDesc()
          .findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, StockMovementEntity>> recordMovement(StockMovementEntity movement) async {
    try {
      final isar = await isarService.db;
      final material = await isar.materialModels.filter().remoteIdEqualTo(movement.materialId).findFirst();
      
      if (material == null) return const Left(CacheFailure('Matériau associé introuvable.'));

      // Calculer le nouveau stock
      double newStock = material.currentStock;
      if (movement.type == MovementType.ENTREE_LIVRAISON || movement.type == MovementType.AJUSTEMENT_INVENTAIRE) {
        if (movement.type == MovementType.AJUSTEMENT_INVENTAIRE) {
          newStock = movement.quantity;
        } else {
          newStock += movement.quantity;
        }
      } else {
        newStock -= movement.quantity;
      }

      final movementModel = StockMovementModel.fromEntity(movement);
      material.currentStock = newStock;
      material.updatedAt = DateTime.now();

      await isar.writeTxn(() async {
        await isar.stockMovementModels.put(movementModel);
        await isar.materialModels.put(material);
      });

      return Right(movementModel.toEntity());
    } catch (e) {
      return const Left(CacheFailure('Échec de l\'enregistrement du mouvement.'));
    }
  }
}
