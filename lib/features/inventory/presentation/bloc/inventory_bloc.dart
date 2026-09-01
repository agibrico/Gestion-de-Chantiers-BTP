import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/inventory_repository.dart';
import 'inventory_event.dart';
import 'inventory_state.dart';

class InventoryBloc extends Bloc<InventoryEvent, InventoryState> {
  final InventoryRepository inventoryRepository;

  InventoryBloc({required this.inventoryRepository}) : super(InventoryInitial()) {
    on<LoadInventoryRequested>(_onLoadInventory);
    on<SearchInventoryRequested>(_onSearchInventory);
    on<AddMaterialRequested>(_onAddMaterial);
    on<RecordStockMovementRequested>(_onRecordMovement);
  }

  Future<void> _onLoadInventory(LoadInventoryRequested event, Emitter<InventoryState> emit) async {
    emit(InventoryLoading());
    final result = await inventoryRepository.getAllMaterials();
    result.fold(
      (failure) => emit(InventoryError(failure.message)),
      (materials) => emit(InventoryLoaded(materials)),
    );
  }

  Future<void> _onSearchInventory(SearchInventoryRequested event, Emitter<InventoryState> emit) async {
    if (event.query.isEmpty) {
      add(LoadInventoryRequested());
      return;
    }
    emit(InventoryLoading());
    final result = await inventoryRepository.searchMaterials(event.query);
    result.fold(
      (failure) => emit(InventoryError(failure.message)),
      (materials) => emit(InventoryLoaded(materials)),
    );
  }

  Future<void> _onAddMaterial(AddMaterialRequested event, Emitter<InventoryState> emit) async {
    emit(InventoryLoading());
    final result = await inventoryRepository.createMaterial(event.material);
    result.fold(
      (failure) => emit(InventoryError(failure.message)),
      (_) {
        emit(const InventoryOperationSuccess('Matériau ajouté au catalogue.'));
        add(LoadInventoryRequested());
      },
    );
  }

  Future<void> _onRecordMovement(RecordStockMovementRequested event, Emitter<InventoryState> emit) async {
    emit(InventoryLoading());
    final result = await inventoryRepository.recordMovement(event.movement);
    result.fold(
      (failure) => emit(InventoryError(failure.message)),
      (_) {
        emit(const InventoryOperationSuccess('Mouvement de stock enregistré.'));
        add(LoadInventoryRequested());
      },
    );
  }
}
