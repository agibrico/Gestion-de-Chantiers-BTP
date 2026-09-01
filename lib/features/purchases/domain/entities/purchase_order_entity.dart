import 'package:equatable/equatable.dart';

enum PurchaseOrderStatus {
  BROUILLON,
  ENVOYE,
  LIVRE_PARTIEL,
  LIVRE,
  ANNULE,
}

class PurchaseOrderItemEntity extends Equatable {
  final String materialId;
  final String materialName;
  final double quantity;
  final String unit;
  final double unitPrice;

  const PurchaseOrderItemEntity({
    required this.materialId,
    required this.materialName,
    required this.quantity,
    required this.unit,
    required this.unitPrice,
  });

  double get totalPrice => quantity * unitPrice;

  @override
  List<Object?> get props => [materialId, materialName, quantity, unit, unitPrice];
}

class PurchaseOrderEntity extends Equatable {
  final String id;
  final String orderNumber; // Ex: BC-2026-001
  final String supplierId;
  final String supplierName;
  final String projectId;
  final String projectName;
  final List<PurchaseOrderItemEntity> items;
  final PurchaseOrderStatus status;
  final DateTime orderDate;
  final DateTime? expectedDeliveryDate;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  const PurchaseOrderEntity({
    required this.id,
    required this.orderNumber,
    required this.supplierId,
    required this.supplierName,
    required this.projectId,
    required this.projectName,
    required this.items,
    required this.status,
    required this.orderDate,
    this.expectedDeliveryDate,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  double get totalAmount => items.fold(0, (sum, item) => sum + item.totalPrice);

  @override
  List<Object?> get props => [
        id,
        orderNumber,
        supplierId,
        supplierName,
        projectId,
        projectName,
        items,
        status,
        orderDate,
        expectedDeliveryDate,
        notes,
        createdAt,
        updatedAt,
      ];
}
