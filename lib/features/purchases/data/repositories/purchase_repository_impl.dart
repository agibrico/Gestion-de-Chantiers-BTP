import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../../inventory/data/models/inventory_models.dart';
import '../../../inventory/domain/entities/stock_movement_entity.dart';
import '../../domain/entities/purchase_order_entity.dart';
import '../../domain/entities/supplier_entity.dart';
import '../../domain/repositories/purchase_repository.dart';
import '../models/purchase_models.dart';

class PurchaseRepositoryImpl implements PurchaseRepository {
  final IsarService isarService;

  PurchaseRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, List<SupplierEntity>>> getAllSuppliers() async {
    try {
      final isar = await isarService.db;
      final models = await isar.supplierModels.where().sortByName().findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, SupplierEntity>> createSupplier(SupplierEntity supplier) async {
    try {
      final isar = await isarService.db;
      final model = SupplierModel.fromEntity(supplier);
      await isar.writeTxn(() => isar.supplierModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deleteSupplier(String id) async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() => isar.supplierModels.filter().remoteIdEqualTo(id).deleteFirst());
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<PurchaseOrderEntity>>> getAllPurchaseOrders() async {
    try {
      final isar = await isarService.db;
      final models = await isar.purchaseOrderModels.where().sortByOrderDateDesc().findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<PurchaseOrderEntity>>> getPurchaseOrdersByProject(String projectId) async {
    try {
      final isar = await isarService.db;
      final models = await isar.purchaseOrderModels.filter().projectIdEqualTo(projectId).sortByOrderDateDesc().findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, PurchaseOrderEntity>> createPurchaseOrder(PurchaseOrderEntity order) async {
    try {
      final isar = await isarService.db;
      final model = PurchaseOrderModel.fromEntity(order);
      await isar.writeTxn(() => isar.purchaseOrderModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, PurchaseOrderEntity>> updatePurchaseOrderStatus(String orderId, PurchaseOrderStatus status) async {
    try {
      final isar = await isarService.db;
      final existing = await isar.purchaseOrderModels.filter().remoteIdEqualTo(orderId).findFirst();
      if (existing == null) return const Left(CacheFailure('Commande introuvable.'));

      final oldStatus = existing.status;
      existing.status = status;
      existing.updatedAt = DateTime.now();

      await isar.writeTxn(() async {
        await isar.purchaseOrderModels.put(existing);

        // Si la commande passe en LIVRE, on incrémente le stock pour chaque article
        if (status == PurchaseOrderStatus.LIVRE && oldStatus != PurchaseOrderStatus.LIVRE) {
          for (final item in existing.items) {
            final material = await isar.materialModels.filter().remoteIdEqualTo(item.materialId).findFirst();
            if (material != null) {
              material.currentStock += item.quantity;
              material.updatedAt = DateTime.now();
              await isar.materialModels.put(material);

              // Enregistrer le mouvement de stock
              final movement = StockMovementModel.fromEntity(StockMovementEntity(
                id: const Uuid().v4(),
                materialId: material.remoteId,
                materialName: material.name,
                projectId: existing.projectId,
                projectName: existing.projectName,
                type: MovementType.ENTREE_LIVRAISON,
                quantity: item.quantity,
                date: DateTime.now(),
                referenceDocument: existing.orderNumber,
                notes: 'Livraison via BC ${existing.orderNumber}',
                createdAt: DateTime.now(),
              ));
              await isar.stockMovementModels.put(movement);
            }
          }
        }
      });

      return Right(existing.toEntity());
    } catch (e) {
      return const Left(CacheFailure('Erreur lors de la mise à jour du statut.'));
    }
  }
}
