import 'package:isar/isar.dart';
import '../../domain/entities/material_entity.dart';
import '../../domain/entities/stock_movement_entity.dart';

part 'inventory_models.g.dart';

@collection
class MaterialModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index(type: IndexType.value)
  late String code;

  @Index(type: IndexType.value)
  late String name;

  @enumerated
  late MaterialCategory category;

  @enumerated
  late MaterialUnit unit;

  late double currentStock;
  late double minStockAlert;
  late double unitPrice;
  String? storageLocation;
  late DateTime createdAt;
  late DateTime updatedAt;

  MaterialEntity toEntity() {
    return MaterialEntity(
      id: remoteId,
      code: code,
      name: name,
      category: category,
      unit: unit,
      currentStock: currentStock,
      minStockAlert: minStockAlert,
      unitPrice: unitPrice,
      storageLocation: storageLocation,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  static MaterialModel fromEntity(MaterialEntity entity) {
    final model = MaterialModel();
    model.remoteId = entity.id;
    model.code = entity.code;
    model.name = entity.name;
    model.category = entity.category;
    model.unit = entity.unit;
    model.currentStock = entity.currentStock;
    model.minStockAlert = entity.minStockAlert;
    model.unitPrice = entity.unitPrice;
    model.storageLocation = entity.storageLocation;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}

@collection
class StockMovementModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index()
  late String materialId;
  
  late String materialName;
  
  @Index()
  String? projectId;
  
  String? projectName;

  @enumerated
  late MovementType type;

  late double quantity;
  late DateTime date;
  String? referenceDocument;
  String? requestedBy;
  String? notes;
  late DateTime createdAt;

  @Index()
  bool isPendingSync = false;
  DateTime? lastUpdatedServer;

  StockMovementEntity toEntity() {
    return StockMovementEntity(
      id: remoteId,
      materialId: materialId,
      materialName: materialName,
      projectId: projectId,
      projectName: projectName,
      type: type,
      quantity: quantity,
      date: date,
      referenceDocument: referenceDocument,
      requestedBy: requestedBy,
      notes: notes,
      createdAt: createdAt,
    );
  }

  static StockMovementModel fromEntity(StockMovementEntity entity) {
    final model = StockMovementModel();
    model.remoteId = entity.id;
    model.materialId = entity.materialId;
    model.materialName = entity.materialName;
    model.projectId = entity.projectId;
    model.projectName = entity.projectName;
    model.type = entity.type;
    model.quantity = entity.quantity;
    model.date = entity.date;
    model.referenceDocument = entity.referenceDocument;
    model.requestedBy = entity.requestedBy;
    model.notes = entity.notes;
    model.createdAt = entity.createdAt;
    return model;
  }
}
