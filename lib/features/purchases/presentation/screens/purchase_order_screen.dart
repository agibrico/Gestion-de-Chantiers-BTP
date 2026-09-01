import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../inventory/presentation/bloc/inventory_bloc.dart';
import '../../../inventory/presentation/bloc/inventory_event.dart';
import '../../../inventory/presentation/bloc/inventory_state.dart';
import '../../../projects/domain/entities/project_entity.dart';
import '../../../projects/presentation/bloc/project_bloc.dart';
import '../../../projects/presentation/bloc/project_state.dart';
import '../../domain/entities/purchase_order_entity.dart';
import '../../domain/entities/supplier_entity.dart';
import '../bloc/purchase_bloc.dart';
import 'package:intl/intl.dart';

class PurchaseOrderScreen extends StatefulWidget {
  final String? initialProjectId;

  const PurchaseOrderScreen({super.key, this.initialProjectId});

  @override
  State<PurchaseOrderScreen> createState() => _PurchaseOrderScreenState();
}

class _PurchaseOrderScreenState extends State<PurchaseOrderScreen> {
  ProjectEntity? _selectedProject;

  @override
  void initState() {
    super.initState();
    context.read<ProjectBloc>().add(LoadProjects());
    context.read<PurchaseBloc>().add(LoadSuppliersRequested());
    context.read<InventoryBloc>().add(LoadInventoryRequested());
    
    if (widget.initialProjectId != null) {
      _loadOrders(widget.initialProjectId!);
    } else {
      context.read<PurchaseBloc>().add(const LoadPurchaseOrdersRequested());
    }
  }

  void _loadOrders(String projectId) {
    context.read<PurchaseBloc>().add(LoadPurchaseOrdersRequested(projectId: projectId));
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(symbol: 'FCFA', decimalDigits: 0, locale: 'fr_FR');

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('BONS DE COMMANDE')),
      body: Column(
        children: [
          // Project Selector
          _buildProjectSelector(),
          
          Expanded(
            child: BlocBuilder<PurchaseBloc, PurchaseState>(
              builder: (context, state) {
                if (state is PurchaseLoading) return const Center(child: CircularProgressIndicator());
                
                if (state is PurchaseDataLoaded) {
                  final orders = state.orders;
                  if (orders.isEmpty) return _buildEmptyState();
                  
                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: orders.length,
                    itemBuilder: (context, index) {
                      final order = orders[index];
                      return Card(
                        margin: const EdgeInsets.bottom(12),
                        child: ExpansionTile(
                          title: Row(
                            children: [
                              Text(order.orderNumber, style: const TextStyle(fontWeight: FontWeight.black)),
                              const SizedBox(width: 8),
                              _buildStatusBadge(order.status),
                            ],
                          ),
                          subtitle: Text('${order.supplierName} • ${currencyFormat.format(order.totalAmount)}'),
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  ...order.items.map((item) => Padding(
                                    padding: const EdgeInsets.symmetric(vertical: 4),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text('${item.quantity.toInt()} ${item.unit} ${item.materialName}', style: const TextStyle(fontSize: 12)),
                                        Text(currencyFormat.format(item.totalPrice), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                                  )),
                                  const Divider(height: 24),
                                  if (order.status != PurchaseOrderStatus.LIVRE && order.status != PurchaseOrderStatus.ANNULE)
                                    AppButton(
                                      text: 'CONFIRMER LA LIVRAISON (MAJ STOCK)', 
                                      variant: AppButtonVariant.primary,
                                      onPressed: () {
                                        context.read<PurchaseBloc>().add(UpdateOrderStatusRequested(
                                          orderId: order.id, 
                                          status: PurchaseOrderStatus.LIVRE,
                                          projectId: order.projectId,
                                        ));
                                      },
                                    ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  );
                }
                return const SizedBox();
              },
            ),
          ),
        ],
      ),
      floatingActionButton: _selectedProject != null ? FloatingActionButton.extended(
        backgroundColor: AppColors.orangeSecurite,
        icon: const Icon(LucideIcons.shoppingCart, color: Colors.white),
        label: const Text('NOUVEAU BC', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        onPressed: () => _showCreateOrderDialog(context),
      ) : null,
    );
  }

  Widget _buildProjectSelector() {
    return Container(
      color: AppColors.acierBTP,
      padding: const EdgeInsets.all(16),
      child: BlocBuilder<ProjectBloc, ProjectState>(
        builder: (context, state) {
          List<ProjectEntity> projects = [];
          if (state is ProjectsLoaded) projects = state.projects;

          return DropdownButtonFormField<ProjectEntity>(
            dropdownColor: AppColors.acierBTP,
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
            value: _selectedProject,
            decoration: const InputDecoration(
              label: Text('SÉLECTIONNER LE CHANTIER POUR LES ACHATS', style: TextStyle(color: Colors.white54, fontSize: 10)),
              enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.white30)),
            ),
            items: projects.map((p) => DropdownMenuItem(value: p, child: Text(p.name.toUpperCase()))).toList(),
            onChanged: (v) {
              setState(() => _selectedProject = v);
              if (v != null) _loadOrders(v.id);
            },
          );
        },
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.fileSearch, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text('Aucune commande trouvée.'),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(PurchaseOrderStatus status) {
    switch (status) {
      case PurchaseOrderStatus.BROUILLON: return const AppBadge(label: 'BROUILLON', color: Colors.grey);
      case PurchaseOrderStatus.ENVOYE: return AppBadge.info('ENVOYÉ');
      case PurchaseOrderStatus.LIVRE: return AppBadge.success('LIVRÉ');
      case PurchaseOrderStatus.LIVRE_PARTIEL: return AppBadge.warning('LIVRÉ PARTIEL');
      case PurchaseOrderStatus.ANNULE: return const AppBadge(label: 'ANNULÉ', color: AppColors.danger);
    }
  }

  void _showCreateOrderDialog(BuildContext context) {
    final purchaseState = context.read<PurchaseBloc>().state;
    final inventoryState = context.read<InventoryBloc>().state;
    
    if (purchaseState is! PurchaseDataLoaded || inventoryState is! InventoryLoaded) return;

    SupplierEntity? selectedSupplier;
    List<PurchaseOrderItemEntity> selectedItems = [];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          decoration: const BoxDecoration(color: Colors.white, borderRadius: BorderRadius.vertical(top: Radius.circular(32))),
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('NOUVEAU BON DE COMMANDE', style: TextStyle(fontSize: 20, fontWeight: FontWeight.black)),
              const SizedBox(height: 24),
              DropdownButtonFormField<SupplierEntity>(
                hint: const Text('Sélectionner le fournisseur'),
                items: purchaseState.suppliers.map((s) => DropdownMenuItem(value: s, child: Text(s.name))).toList(),
                onChanged: (v) => setModalState(() => selectedSupplier = v),
              ),
              const SizedBox(height: 16),
              const Text('ARTICLES À COMMANDER', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
              const SizedBox(height: 8),
              // Simplified item addition for the axe
              AppButton(
                text: 'AJOUTER UN MATÉRIAU', 
                variant: AppButtonVariant.outline,
                onPressed: () {
                  // Simulate adding 100 bags of cement for the demo
                  final material = inventoryState.materials.first;
                  setModalState(() {
                    selectedItems.add(PurchaseOrderItemEntity(
                      materialId: material.id,
                      materialName: material.name,
                      quantity: 100,
                      unit: material.unit.toString().split('.').last,
                      unitPrice: 4500,
                    ));
                  });
                },
              ),
              ...selectedItems.map((i) => ListTile(title: Text(i.materialName), subtitle: Text('${i.quantity} x ${i.unitPrice} FCFA'))),
              const SizedBox(height: 32),
              AppButton(
                text: 'GÉNÉRER LE BON DE COMMANDE', 
                onPressed: () {
                  if (selectedSupplier != null && _selectedProject != null && selectedItems.isNotEmpty) {
                    final order = PurchaseOrderEntity(
                      id: const Uuid().v4(),
                      orderNumber: 'BC-${DateTime.now().year}-${DateTime.now().millisecond}',
                      supplierId: selectedSupplier!.id,
                      supplierName: selectedSupplier!.name,
                      projectId: _selectedProject!.id,
                      projectName: _selectedProject!.name,
                      items: selectedItems,
                      status: PurchaseOrderStatus.ENVOYE,
                      orderDate: DateTime.now(),
                      createdAt: DateTime.now(),
                      updatedAt: DateTime.now(),
                    );
                    context.read<PurchaseBloc>().add(CreatePurchaseOrderRequested(order));
                    Navigator.pop(context);
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
