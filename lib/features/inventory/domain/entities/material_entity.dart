import 'package:equatable/equatable.dart';

enum MaterialUnit {
  SAC_50KG,
  TONNE,
  M3,
  UNITE,
  METRE_LINEAIRE,
  POT_20L,
  ROULEAU,
  BARRE_12M,
}

enum MaterialCategory {
  CIMENT_LIANTS,
  ARMATURES_ACIER,
  GRANULATS_SABLE_GRAVIER,
  AGGLOS_BRIQUES,
  BOIS_COFFRAGE,
  PLOMBERIE_TUYAUTERIE,
  ELECTRICITE_CABLES,
  PEINTURE_CHIMIE,
  QUINCAILLERIE_OUTILLAGE,
}

class MaterialEntity extends Equatable {
  final String id;
  final String code; // Ex: MAT-CIM-01
  final String name;
  final MaterialCategory category;
  final MaterialUnit unit;
  final double currentStock;
  final double minStockAlert;
  final double unitPrice;
  final String? storageLocation;
  final DateTime createdAt;
  final DateTime updatedAt;

  const MaterialEntity({
    required this.id,
    required this.code,
    required this.name,
    required this.category,
    required this.unit,
    required this.currentStock,
    required this.minStockAlert,
    required this.unitPrice,
    this.storageLocation,
    required this.createdAt,
    required this.updatedAt,
  });

  bool get isBelowAlertThreshold => currentStock <= minStockAlert;

  @override
  List<Object?> get props => [
        id,
        code,
        name,
        category,
        unit,
        currentStock,
        minStockAlert,
        unitPrice,
        storageLocation,
        createdAt,
        updatedAt,
      ];
}
