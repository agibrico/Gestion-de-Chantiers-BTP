import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../domain/entities/material_entity.dart';
import '../bloc/inventory_bloc.dart';
import '../bloc/inventory_event.dart';
import '../bloc/inventory_state.dart';
import '../widgets/stock_movement_dialog.dart';
import '../../../../core/widgets/qr_code_viewer.dart';

class MaterialListScreen extends StatefulWidget {
  const MaterialListScreen({super.key});

  @override
  State<MaterialListScreen> createState() => _MaterialListScreenState();
}

class _MaterialListScreenState extends State<MaterialListScreen> {
  @override
  void initState() {
    super.initState();
    context.read<InventoryBloc>().add(LoadInventoryRequested());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('MATÉRIAUX & STOCKS'),
      ),
      body: Column(
        children: [
          // Search & Filters
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              onChanged: (v) => context.read<InventoryBloc>().add(SearchInventoryRequested(v)),
              decoration: InputDecoration(
                hintText: 'Rechercher un matériau, un code...',
                prefixIcon: const Icon(LucideIcons.search, size: 20),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
              ),
            ),
          ),
          
          Expanded(
            child: BlocBuilder<InventoryBloc, InventoryState>(
              builder: (context, state) {
                if (state is InventoryLoading) return const Center(child: CircularProgressIndicator());
                
                if (state is InventoryLoaded) {
                  if (state.materials.isEmpty) return _buildEmptyState();
                  
                  return ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: state.materials.length,
                    itemBuilder: (context, index) {
                      final material = state.materials[index];
                      return _buildMaterialCard(material);
                    },
                  );
                }
                return const SizedBox();
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.orangeSecurite,
        child: const Icon(LucideIcons.plus, color: Colors.white),
        onPressed: () => _showAddMaterialDialog(context),
      ),
    );
  }

  Widget _buildMaterialCard(MaterialEntity material) {
    return Card(
      margin: const EdgeInsets.bottom(12),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(12)),
                  child: const Icon(LucideIcons.package, color: AppColors.acierBTP),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(material.code, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.orangeSecurite, fontSize: 10, fontAlpha: 150)),
                          if (material.isBelowAlertThreshold) 
                            const AppBadge(label: 'ALERTE RUPTURE', color: AppColors.danger, textColor: Colors.white),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(material.name.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.black, fontSize: 14)),
                      Text(material.category.toString().split('.').last.replaceAll('_', ' '), style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('STOCK ACTUEL', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                    Text('${material.currentStock.toInt()} ${material.unit.toString().split('.').last}', 
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.black, color: material.isBelowAlertThreshold ? AppColors.danger : AppColors.acierBTP)),
                  ],
                ),
                AppButton(
                  text: 'BL / BS', 
                  variant: AppButtonVariant.outline,
                  onPressed: () => _showMovementDialog(material),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(LucideIcons.qrCode, color: AppColors.info),
                  onPressed: () => _showQrViewer(material),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showQrViewer(MaterialEntity material) {
    showDialog(
      context: context,
      builder: (context) => QrCodeViewer(
        value: material.code,
        title: material.name,
        subtitle: material.category.toString().split('.').last.replaceAll('_', ' '),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.boxes, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text('Catalogue vide.', style: TextStyle(color: AppColors.textSecondary)),
        ],
      ),
    );
  }

  void _showAddMaterialDialog(BuildContext context) {
    final codeController = TextEditingController();
    final nameController = TextEditingController();
    final alertController = TextEditingController();
    MaterialCategory selectedCat = MaterialCategory.CIMENT_LIANTS;
    MaterialUnit selectedUnit = MaterialUnit.SAC_50KG;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          decoration: const BoxDecoration(color: Colors.white, borderRadius: BorderRadius.vertical(top: Radius.circular(32))),
          padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom, top: 32, left: 24, right: 24),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text('NOUVEL ARTICLE', style: TextStyle(fontSize: 20, fontWeight: FontWeight.black)),
                const SizedBox(height: 24),
                AppTextField(label: 'Code Article', hint: 'Ex: MAT-CIM-01', controller: codeController),
                const SizedBox(height: 16),
                AppTextField(label: 'Désignation', hint: 'Ex: Ciment CPJ 42.5', controller: nameController),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('UNITÉ', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                          DropdownButtonFormField<MaterialUnit>(
                            value: selectedUnit,
                            items: MaterialUnit.values.map((u) => DropdownMenuItem(value: u, child: Text(u.toString().split('.').last))).toList(),
                            onChanged: (v) => setModalState(() => selectedUnit = v!),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: AppTextField(label: 'Seuil Alerte', hint: 'Ex: 50', controller: alertController, keyboardType: TextInputType.number),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                const Text('CATÉGORIE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                DropdownButtonFormField<MaterialCategory>(
                  value: selectedCat,
                  items: MaterialCategory.values.map((c) => DropdownMenuItem(value: c, child: Text(c.toString().split('.').last.replaceAll('_', ' ')))).toList(),
                  onChanged: (v) => setModalState(() => selectedCat = v!),
                ),
                const SizedBox(height: 32),
                AppButton(
                  text: 'AJOUTER AU CATALOGUE', 
                  onPressed: () {
                    final mat = MaterialEntity(
                      id: const Uuid().v4(),
                      code: codeController.text,
                      name: nameController.text,
                      category: selectedCat,
                      unit: selectedUnit,
                      currentStock: 0,
                      minStockAlert: double.tryParse(alertController.text) ?? 0,
                      unitPrice: 0,
                      createdAt: DateTime.now(),
                      updatedAt: DateTime.now(),
                    );
                    context.read<InventoryBloc>().add(AddMaterialRequested(mat));
                    Navigator.pop(context);
                  },
                ),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showMovementDialog(MaterialEntity material) {
    showDialog(
      context: context,
      builder: (context) => StockMovementDialog(
        material: material,
        onConfirm: (movement) {
          context.read<InventoryBloc>().add(RecordStockMovementRequested(movement));
        },
      ),
    );
  }
}
