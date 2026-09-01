import 'package:isar/isar.dart';
import '../../domain/entities/purchase_order_entity.dart';
import '../../domain/entities/supplier_entity.dart';

part 'purchase_models.g.dart';

@collection
class SupplierModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index(type: IndexType.value)
  late String name;

  String? contactPerson;
  late String phone;
  String? email;
  String? address;
  String? categories;
  late DateTime createdAt;
  late DateTime updatedAt;

  SupplierEntity toEntity() {
    return SupplierEntity(
      id: remoteId,
      name: name,
      contactPerson: contactPerson,
      phone: phone,
      email: email,
      address: address,
      categories: categories,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  static SupplierModel fromEntity(SupplierEntity entity) {
    final model = SupplierModel();
    model.remoteId = entity.id;
    model.name = entity.name;
    model.contactPerson = entity.contactPerson;
    model.phone = entity.phone;
    model.email = entity.email;
    model.address = entity.address;
    model.categories = entity.categories;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}

@embedded
class PurchaseOrderItemModel {
  late String materialId;
  late String materialName;
  late double quantity;
  late String unit;
  late double unitPrice;

  PurchaseOrderItemEntity toEntity() {
    return PurchaseOrderItemEntity(
      materialId: materialId,
      materialName: materialName,
      quantity: quantity,
      unit: unit,
      unitPrice: unitPrice,
    );
  }

  static PurchaseOrderItemModel fromEntity(PurchaseOrderItemEntity entity) {
    final model = PurchaseOrderItemModel();
    model.materialId = entity.materialId;
    model.materialName = entity.materialName;
    model.quantity = entity.quantity;
    model.unit = entity.unit;
    model.unitPrice = entity.unitPrice;
    return model;
  }
}

@collection
class PurchaseOrderModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index(type: IndexType.value)
  late String orderNumber;

  @Index()
  late String supplierId;
  late String supplierName;

  @Index()
  late String projectId;
  late String projectName;

  late List<PurchaseOrderItemModel> items;

  @enumerated
  late PurchaseOrderStatus status;

  late DateTime orderDate;
  DateTime? expectedDeliveryDate;
  String? notes;
  late DateTime createdAt;
  late DateTime updatedAt;

  PurchaseOrderEntity toEntity() {
    return PurchaseOrderEntity(
      id: remoteId,
      orderNumber: orderNumber,
      supplierId: supplierId,
      supplierName: supplierName,
      projectId: projectId,
      projectName: projectName,
      items: items.map((i) => i.toEntity()).toList(),
      status: status,
      orderDate: orderDate,
      expectedDeliveryDate: expectedDeliveryDate,
      notes: notes,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  static PurchaseOrderModel fromEntity(PurchaseOrderEntity entity) {
    final model = PurchaseOrderModel();
    model.remoteId = entity.id;
    model.orderNumber = entity.orderNumber;
    model.supplierId = entity.supplierId;
    model.supplierName = entity.supplierName;
    model.projectId = entity.projectId;
    model.projectName = entity.projectName;
    model.items = entity.items.map((i) => PurchaseOrderItemModel.fromEntity(i)).toList();
    model.status = entity.status;
    model.orderDate = entity.orderDate;
    model.expectedDeliveryDate = entity.expectedDeliveryDate;
    model.notes = entity.notes;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}
