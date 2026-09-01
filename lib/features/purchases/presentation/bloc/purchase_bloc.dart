import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/supplier_entity.dart';
import '../../domain/entities/purchase_order_entity.dart';
import '../../domain/repositories/purchase_repository.dart';

// Events
abstract class PurchaseEvent extends Equatable {
  const PurchaseEvent();
  @override
  List<Object?> get props => [];
}

class LoadSuppliersRequested extends PurchaseEvent {}

class AddSupplierRequested extends PurchaseEvent {
  final SupplierEntity supplier;
  const AddSupplierRequested(this.supplier);
  @override
  List<Object?> get props => [supplier];
}

class LoadPurchaseOrdersRequested extends PurchaseEvent {
  final String? projectId;
  const LoadPurchaseOrdersRequested({this.projectId});
  @override
  List<Object?> get props => [projectId];
}

class CreatePurchaseOrderRequested extends PurchaseEvent {
  final PurchaseOrderEntity order;
  const CreatePurchaseOrderRequested(this.order);
  @override
  List<Object?> get props => [order];
}

class UpdateOrderStatusRequested extends PurchaseEvent {
  final String orderId;
  final PurchaseOrderStatus status;
  final String? projectId;
  const UpdateOrderStatusRequested({required this.orderId, required this.status, this.projectId});
  @override
  List<Object?> get props => [orderId, status, projectId];
}

// States
abstract class PurchaseState extends Equatable {
  const PurchaseState();
  @override
  List<Object?> get props => [];
}

class PurchaseInitial extends PurchaseState {}

class PurchaseLoading extends PurchaseState {}

class PurchaseDataLoaded extends PurchaseState {
  final List<SupplierEntity> suppliers;
  final List<PurchaseOrderEntity> orders;

  const PurchaseDataLoaded({this.suppliers = const [], this.orders = const []});

  @override
  List<Object?> get props => [suppliers, orders];
}

class PurchaseOperationSuccess extends PurchaseState {
  final String message;
  const PurchaseOperationSuccess(this.message);
  @override
  List<Object?> get props => [message];
}

class PurchaseError extends PurchaseState {
  final String message;
  const PurchaseError(this.message);
  @override
  List<Object?> get props => [message];
}

// Bloc
class PurchaseBloc extends Bloc<PurchaseEvent, PurchaseState> {
  final PurchaseRepository purchaseRepository;

  PurchaseBloc({required this.purchaseRepository}) : super(PurchaseInitial()) {
    on<LoadSuppliersRequested>(_onLoadSuppliers);
    on<AddSupplierRequested>(_onAddSupplier);
    on<LoadPurchaseOrdersRequested>(_onLoadOrders);
    on<CreatePurchaseOrderRequested>(_onCreateOrder);
    on<UpdateOrderStatusRequested>(_onUpdateStatus);
  }

  Future<void> _onLoadSuppliers(LoadSuppliersRequested event, Emitter<PurchaseState> emit) async {
    emit(PurchaseLoading());
    final result = await purchaseRepository.getAllSuppliers();
    result.fold(
      (failure) => emit(PurchaseError(failure.message)),
      (suppliers) => emit(PurchaseDataLoaded(suppliers: suppliers, orders: state is PurchaseDataLoaded ? (state as PurchaseDataLoaded).orders : [])),
    );
  }

  Future<void> _onAddSupplier(AddSupplierRequested event, Emitter<PurchaseState> emit) async {
    final result = await purchaseRepository.createSupplier(event.supplier);
    result.fold(
      (failure) => emit(PurchaseError(failure.message)),
      (_) {
        emit(const PurchaseOperationSuccess('Fournisseur ajouté.'));
        add(LoadSuppliersRequested());
      },
    );
  }

  Future<void> _onLoadOrders(LoadPurchaseOrdersRequested event, Emitter<PurchaseState> emit) async {
    emit(PurchaseLoading());
    final result = event.projectId != null 
        ? await purchaseRepository.getPurchaseOrdersByProject(event.projectId!)
        : await purchaseRepository.getAllPurchaseOrders();
    
    result.fold(
      (failure) => emit(PurchaseError(failure.message)),
      (orders) => emit(PurchaseDataLoaded(
        orders: orders, 
        suppliers: state is PurchaseDataLoaded ? (state as PurchaseDataLoaded).suppliers : []
      )),
    );
  }

  Future<void> _onCreateOrder(CreatePurchaseOrderRequested event, Emitter<PurchaseState> emit) async {
    final result = await purchaseRepository.createPurchaseOrder(event.order);
    result.fold(
      (failure) => emit(PurchaseError(failure.message)),
      (_) {
        emit(const PurchaseOperationSuccess('Bon de commande enregistré.'));
        add(LoadPurchaseOrdersRequested(projectId: event.order.projectId));
      },
    );
  }

  Future<void> _onUpdateStatus(UpdateOrderStatusRequested event, Emitter<PurchaseState> emit) async {
    final result = await purchaseRepository.updatePurchaseOrderStatus(event.orderId, event.status);
    result.fold(
      (failure) => emit(PurchaseError(failure.message)),
      (_) {
        emit(const PurchaseOperationSuccess('Statut mis à jour et stock actualisé si livré.'));
        add(LoadPurchaseOrdersRequested(projectId: event.projectId));
      },
    );
  }
}
