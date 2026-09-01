import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../domain/entities/employee_entity.dart';
import '../bloc/resource_bloc.dart';
import '../bloc/resource_event.dart';
import '../bloc/resource_state.dart';

class EmployeeListScreen extends StatefulWidget {
  const EmployeeListScreen({super.key});

  @override
  State<EmployeeListScreen> createState() => _EmployeeListScreenState();
}

class _EmployeeListScreenState extends State<EmployeeListScreen> {
  @override
  void initState() {
    super.initState();
    context.read<ResourceBloc>().add(LoadResources());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('PERSONNEL INTERNE'),
      ),
      body: BlocBuilder<ResourceBloc, ResourceState>(
        builder: (context, state) {
          if (state is ResourceLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (state is ResourcesLoaded) {
            if (state.employees.isEmpty) {
              return _buildEmptyState();
            }
            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: state.employees.length,
              itemBuilder: (context, index) {
                final emp = state.employees[index];
                return Card(
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: AppColors.acierBTP,
                      child: Text(emp.firstName[0] + emp.lastName[0], 
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                    title: Text(emp.fullName.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.black)),
                    subtitle: Text('${emp.position} • ${emp.registrationNumber}'),
                    trailing: AppBadge.success(emp.status.toString().split('.').last),
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
        child: const Icon(LucideIcons.userPlus, color: Colors.white),
        onPressed: () => _showAddEmployeeDialog(context),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.users, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text('Aucun employé enregistré.', style: TextStyle(color: AppColors.textSecondary)),
          const SizedBox(height: 24),
          AppButton(
            text: 'Ajouter un employé',
            onPressed: () => _showAddEmployeeDialog(context),
          ),
        ],
      ),
    );
  }

  void _showAddEmployeeDialog(BuildContext context) {
    final nameController = TextEditingController();
    final lastNameController = TextEditingController();
    final positionController = TextEditingController();
    final phoneController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        ),
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          top: 32, left: 24, right: 24,
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('NOUVEL EMPLOYÉ', style: TextStyle(fontSize: 20, fontWeight: FontWeight.black)),
              const SizedBox(height: 24),
              AppTextField(label: 'Prénom', controller: nameController),
              const SizedBox(height: 16),
              AppTextField(label: 'Nom', controller: lastNameController),
              const SizedBox(height: 16),
              AppTextField(label: 'Poste / Métier', hint: 'Ex: Maçon, Chef de chantier', controller: positionController),
              const SizedBox(height: 16),
              AppTextField(label: 'Téléphone', controller: phoneController, keyboardType: TextInputType.phone),
              const SizedBox(height: 32),
              AppButton(
                text: 'Enregistrer',
                onPressed: () {
                  final emp = EmployeeEntity(
                    id: const Uuid().v4(),
                    registrationNumber: 'AGB-${DateTime.now().millisecond}',
                    firstName: nameController.text,
                    lastName: lastNameController.text,
                    position: positionController.text,
                    phone: phoneController.text,
                    status: EmployeeStatus.ACTIF,
                    dailyRate: 5000, // Default
                    hireDate: DateTime.now(),
                    createdAt: DateTime.now(),
                    updatedAt: DateTime.now(),
                  );
                  context.read<ResourceBloc>().add(AddEmployeeRequested(emp));
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
