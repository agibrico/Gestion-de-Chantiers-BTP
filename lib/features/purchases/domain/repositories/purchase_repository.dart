import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/supplier_entity.dart';
import '../entities/purchase_order_entity.dart';

abstract class PurchaseRepository {
  // Suppliers
  Future<Either<Failure, List<SupplierEntity>>> getAllSuppliers();
  Future<Either<Failure, SupplierEntity>> createSupplier(SupplierEntity supplier);
  Future<Either<Failure, void>> deleteSupplier(String id);

  // Purchase Orders
  Future<Either<Failure, List<PurchaseOrderEntity>>> getAllPurchaseOrders();
  Future<Either<Failure, List<PurchaseOrderEntity>>> getPurchaseOrdersByProject(String projectId);
  Future<Either<Failure, PurchaseOrderEntity>> createPurchaseOrder(PurchaseOrderEntity order);
  Future<Either<Failure, PurchaseOrderEntity>> updatePurchaseOrderStatus(String orderId, PurchaseOrderStatus status);
}
