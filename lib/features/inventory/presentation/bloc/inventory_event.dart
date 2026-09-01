import 'package:equatable/equatable.dart';
import '../../domain/entities/material_entity.dart';
import '../../domain/entities/stock_movement_entity.dart';

abstract class InventoryEvent extends Equatable {
  const InventoryEvent();

  @override
  List<Object?> get props => [];
}

class LoadInventoryRequested extends InventoryEvent {}

class SearchInventoryRequested extends InventoryEvent {
  final String query;
  const SearchInventoryRequested(this.query);

  @override
  List<Object?> get props => [query];
}

class AddMaterialRequested extends InventoryEvent {
  final MaterialEntity material;
  const AddMaterialRequested(this.material);

  @override
  List<Object?> get props => [material];
}

class RecordStockMovementRequested extends InventoryEvent {
  final StockMovementEntity movement;
  const RecordStockMovementRequested(this.movement);

  @override
  List<Object?> get props => [movement];
}
