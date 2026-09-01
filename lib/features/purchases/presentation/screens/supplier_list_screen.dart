import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../domain/entities/supplier_entity.dart';
import '../bloc/purchase_bloc.dart';

class SupplierListScreen extends StatefulWidget {
  const SupplierListScreen({super.key});

  @override
  State<SupplierListScreen> createState() => _SupplierListScreenState();
}

class _SupplierListScreenState extends State<SupplierListScreen> {
  @override
  void initState() {
    super.initState();
    context.read<PurchaseBloc>().add(LoadSuppliersRequested());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('FOURNISSEURS')),
      body: BlocBuilder<PurchaseBloc, PurchaseState>(
        builder: (context, state) {
          if (state is PurchaseLoading) return const Center(child: CircularProgressIndicator());
          
          if (state is PurchaseDataLoaded) {
            final suppliers = state.suppliers;
            if (suppliers.isEmpty) return _buildEmptyState();
            
            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: suppliers.length,
              itemBuilder: (context, index) {
                final s = suppliers[index];
                return Card(
                  child: ListTile(
                    leading: const CircleAvatar(backgroundColor: AppColors.background, child: Icon(LucideIcons.truck, color: AppColors.acierBTP)),
                    title: Text(s.name.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.black)),
                    subtitle: Text('${s.contactPerson ?? ''} • ${s.phone}'),
                    trailing: const Icon(LucideIcons.chevronRight),
                  ),
                );
              },
            );
          }
          return const SizedBox();
        },
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.orangeSecurite,
        child: const Icon(LucideIcons.plus, color: Colors.white),
        onPressed: () => _showAddSupplierDialog(context),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.factory, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text('Aucun fournisseur enregistré.'),
          const SizedBox(height: 24),
          AppButton(text: 'Ajouter un fournisseur', onPressed: () => _showAddSupplierDialog(context)),
        ],
      ),
    );
  }

  void _showAddSupplierDialog(BuildContext context) {
    final nameController = TextEditingController();
    final contactController = TextEditingController();
    final phoneController = TextEditingController();
    final catController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: const BoxDecoration(color: Colors.white, borderRadius: BorderRadius.vertical(top: Radius.circular(32))),
        padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom, top: 32, left: 24, right: 24),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('NOUVEAU FOURNISSEUR', style: TextStyle(fontSize: 20, fontWeight: FontWeight.black)),
              const SizedBox(height: 24),
              AppTextField(label: 'Raison Sociale', hint: 'Ex: Batimat CI', controller: nameController),
              const SizedBox(height: 16),
              AppTextField(label: 'Interlocuteur', hint: 'Ex: M. Soro', controller: contactController),
              const SizedBox(height: 16),
              AppTextField(label: 'Téléphone', controller: phoneController, keyboardType: TextInputType.phone),
              const SizedBox(height: 16),
              AppTextField(label: 'Catégories fournies', hint: 'Ex: Ciment, Fers, Outillage', controller: catController),
              const SizedBox(height: 32),
              AppButton(
                text: 'ENREGISTRER', 
                onPressed: () {
                  final s = SupplierEntity(
                    id: const Uuid().v4(),
                    name: nameController.text,
                    contactPerson: contactController.text,
                    phone: phoneController.text,
                    categories: catController.text,
                    createdAt: DateTime.now(),
                    updatedAt: DateTime.now(),
                  );
                  context.read<PurchaseBloc>().add(AddSupplierRequested(s));
                  Navigator.pop(context);
                },
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}
