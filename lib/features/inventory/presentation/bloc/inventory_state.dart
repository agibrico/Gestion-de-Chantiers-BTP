import 'package:equatable/equatable.dart';
import '../../domain/entities/material_entity.dart';

abstract class InventoryState extends Equatable {
  const InventoryState();
  
  @override
  List<Object?> get props => [];
}

class InventoryInitial extends InventoryState {}

class InventoryLoading extends InventoryState {}

class InventoryLoaded extends InventoryState {
  final List<MaterialEntity> materials;
  const InventoryLoaded(this.materials);

  @override
  List<Object?> get props => [materials];
}

class InventoryOperationSuccess extends InventoryState {
  final String message;
  const InventoryOperationSuccess(this.message);

  @override
  List<Object?> get props => [message];
}

class InventoryError extends InventoryState {
  final String message;
  const InventoryError(this.message);

  @override
  List<Object?> get props => [message];
}
