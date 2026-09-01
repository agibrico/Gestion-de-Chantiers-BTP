import 'package:flutter_test/flutter_test.dart';
import 'package:agb_chantier/features/inventory/domain/entities/material_entity.dart';

void main() {
  group('MaterialEntity Logic', () {
    test('should return true for isBelowAlertThreshold when current stock is low', () {
      final material = MaterialEntity(
        id: '1',
        code: 'CIM001',
        name: 'Ciment CPJ 45',
        category: MaterialCategory.GROS_OEUVRE,
        unit: MaterialUnit.SAC,
        currentStock: 5.0,
        minStockAlert: 10.0,
        unitPrice: 5000,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      expect(material.isBelowAlertThreshold, true);
    });

    test('should return false for isBelowAlertThreshold when current stock is sufficient', () {
      final material = MaterialEntity(
        id: '1',
        code: 'CIM001',
        name: 'Ciment CPJ 45',
        category: MaterialCategory.GROS_OEUVRE,
        unit: MaterialUnit.SAC,
        currentStock: 15.0,
        minStockAlert: 10.0,
        unitPrice: 5000,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      expect(material.isBelowAlertThreshold, false);
    });
  });
}
