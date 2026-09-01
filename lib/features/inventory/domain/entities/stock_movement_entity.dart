import 'package:equatable/equatable.dart';

enum MovementType {
  ENTREE_LIVRAISON,
  SORTIE_CONSOMMATION,
  TRANSFERT,
  AJUSTEMENT_INVENTAIRE,
  PERTE_CASSE,
}

class StockMovementEntity extends Equatable {
  final String id;
  final String materialId;
  final String materialName;
  final String? projectId;
  final String? projectName;
  final MovementType type;
  final double quantity;
  final DateTime date;
  final String? referenceDocument; // Ex: BL-001, BS-042
  final String? requestedBy;
  final String? notes;
  final DateTime createdAt;

  const StockMovementEntity({
    required this.id,
    required this.materialId,
    required this.materialName,
    this.projectId,
    this.projectName,
    required this.type,
    required this.quantity,
    required this.date,
    this.referenceDocument,
    this.requestedBy,
    this.notes,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [
        id,
        materialId,
        materialName,
        projectId,
        projectName,
        type,
        quantity,
        date,
        referenceDocument,
        requestedBy,
        notes,
        createdAt,
      ];
}
