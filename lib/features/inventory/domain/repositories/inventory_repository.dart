import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/material_entity.dart';
import '../entities/stock_movement_entity.dart';

abstract class InventoryRepository {
  // Materials
  Future<Either<Failure, List<MaterialEntity>>> getAllMaterials();
  Future<Either<Failure, MaterialEntity>> getMaterialById(String id);
  Future<Either<Failure, MaterialEntity>> createMaterial(MaterialEntity material);
  Future<Either<Failure, MaterialEntity>> updateMaterial(MaterialEntity material);
  Future<Either<Failure, void>> deleteMaterial(String id);
  Future<Either<Failure, List<MaterialEntity>>> searchMaterials(String query);

  // Movements
  Future<Either<Failure, List<StockMovementEntity>>> getMovementsByMaterial(String materialId);
  Future<Either<Failure, StockMovementEntity>> recordMovement(StockMovementEntity movement);
}
