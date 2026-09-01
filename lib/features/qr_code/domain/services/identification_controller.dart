import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../../../inventory/domain/entities/material_entity.dart';
import '../../../inventory/domain/repositories/inventory_repository.dart';
import '../../../resources/domain/entities/equipment_entity.dart';
import '../../../resources/domain/repositories/equipment_repository.dart';

enum IdentifiedType { material, equipment, unknown }

class QuickIdentification {
  final IdentifiedType type;
  final dynamic data;
  final String code;

  QuickIdentification({required this.type, this.data, required this.code});
}

class IdentificationController {
  final InventoryRepository inventoryRepository;
  final EquipmentRepository equipmentRepository;

  IdentificationController({
    required this.inventoryRepository,
    required this.equipmentRepository,
  });

  Future<QuickIdentification> identify(String code) async {
    final cleanCode = code.trim().toUpperCase();

    // 1. Try to find in Inventory
    final materialResult = await inventoryRepository.getAllMaterials();
    MaterialEntity? foundMaterial;
    
    materialResult.fold((_) => null, (list) {
      try {
        foundMaterial = list.firstWhere((m) => m.code.toUpperCase() == cleanCode);
      } catch (_) {}
    });

    if (foundMaterial != null) {
      return QuickIdentification(type: IdentifiedType.material, data: foundMaterial, code: cleanCode);
    }

    // 2. Try to find in Equipment
    final equipmentResult = await equipmentRepository.getAllEquipment();
    EquipmentEntity? foundEquipment;

    equipmentResult.fold((_) => null, (list) {
      try {
        foundEquipment = list.firstWhere((e) => e.code.toUpperCase() == cleanCode);
      } catch (_) {}
    });

    if (foundEquipment != null) {
      return QuickIdentification(type: IdentifiedType.equipment, data: foundEquipment, code: cleanCode);
    }

    // 3. Not found
    return QuickIdentification(type: IdentifiedType.unknown, code: cleanCode);
  }
}
