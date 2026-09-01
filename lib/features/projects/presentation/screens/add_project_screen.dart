import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../clients/domain/entities/client_entity.dart';
import '../../../clients/presentation/bloc/client_bloc.dart';
import '../../../clients/presentation/bloc/client_event.dart';
import '../../../clients/presentation/bloc/client_state.dart';
import '../../domain/entities/project_entity.dart';
import '../bloc/project_bloc.dart';
import '../bloc/project_event.dart';
import '../bloc/project_state.dart';
import 'package:intl/intl.dart';

class AddProjectScreen extends StatefulWidget {
  const AddProjectScreen({super.key});

  @override
  State<AddProjectScreen> createState() => _AddProjectScreenState();
}

class _AddProjectScreenState extends State<AddProjectScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _addressController = TextEditingController();
  final _cityController = TextEditingController();
  final _surfaceAreaController = TextEditingController();
  final _levelsController = TextEditingController();
  final _budgetController = TextEditingController();
  final _startDateController = TextEditingController();
  final _endDateController = TextEditingController();

  ClientEntity? _selectedClient;
  String _projectType = 'Résidentiel';
  DateTime _startDate = DateTime.now();
  DateTime _endDate = DateTime.now().add(const Duration(days: 180));

  @override
  void initState() {
    super.initState();
    context.read<ClientBloc>().add(LoadClients());
    _startDateController.text = DateFormat('dd/MM/yyyy').format(_startDate);
    _endDateController.text = DateFormat('dd/MM/yyyy').format(_endDate);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _addressController.dispose();
    _cityController.dispose();
    _surfaceAreaController.dispose();
    _levelsController.dispose();
    _budgetController.dispose();
    _startDateController.dispose();
    _endDateController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context, bool isStart) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: isStart ? _startDate : _endDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
    );
    if (picked != null) {
      setState(() {
        if (isStart) {
          _startDate = picked;
          _startDateController.text = DateFormat('dd/MM/yyyy').format(_startDate);
        } else {
          _endDate = picked;
          _endDateController.text = DateFormat('dd/MM/yyyy').format(_endDate);
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('OUVERTURE DE CHANTIER'),
      ),
      body: BlocListener<ProjectBloc, ProjectState>(
        listener: (context, state) {
          if (state is ProjectOperationSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message), backgroundColor: AppColors.success),
            );
            context.pop();
          }
          if (state is ProjectError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message), backgroundColor: AppColors.danger),
            );
          }
        },
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'DÉTAILS DU PROJET',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite),
                ),
                const SizedBox(height: 16),
                AppTextField(
                  label: 'Nom du Projet / Chantier',
                  hint: 'Ex: Villa Horizon Riviera',
                  controller: _nameController,
                  validator: (v) => v?.isEmpty ?? true ? 'Nom requis' : null,
                ),
                const SizedBox(height: 16),
                const Text(
                  'CLIENT / MAÎTRE D\'OUVRAGE',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.black, color: AppColors.textSecondary),
                ),
                const SizedBox(height: 8),
                BlocBuilder<ClientBloc, ClientState>(
                  builder: (context, state) {
                    List<ClientEntity> clients = [];
                    if (state is ClientsLoaded) {
                      clients = state.clients;
                    }
                    return DropdownButtonFormField<ClientEntity>(
                      value: _selectedClient,
                      hint: const Text('Sélectionner un client'),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: Colors.grey[100],
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                      ),
                      items: clients.map((c) {
                        return DropdownMenuItem(value: c, child: Text(c.name));
                      }).toList(),
                      onChanged: (v) => setState(() => _selectedClient = v),
                      validator: (v) => v == null ? 'Client requis' : null,
                    );
                  },
                ),
                const SizedBox(height: 16),
                AppTextField(
                  label: 'Description du projet',
                  hint: 'Ex: Construction d\'une villa R+2 avec piscine...',
                  controller: _descriptionController,
                ),
                const SizedBox(height: 24),
                const Text(
                  'CARACTÉRISTIQUES TECHNIQUES',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: AppTextField(
                        label: 'Surface (m²)',
                        hint: '400',
                        controller: _surfaceAreaController,
                        keyboardType: TextInputType.number,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: AppTextField(
                        label: 'Niveaux (R+X)',
                        hint: '2',
                        controller: _levelsController,
                        keyboardType: TextInputType.number,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                AppTextField(
                  label: 'Type de Chantier',
                  hint: 'Résidentiel, Tertiaire...',
                  controller: TextEditingController(text: _projectType),
                  // Simple hack for example
                ),
                const SizedBox(height: 24),
                const Text(
                  'LOCALISATION',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite),
                ),
                const SizedBox(height: 16),
                AppTextField(label: 'Ville', hint: 'Abidjan', controller: _cityController),
                const SizedBox(height: 16),
                AppTextField(label: 'Adresse / Quartier', hint: 'Cocody Riviera 3', controller: _addressController),
                const SizedBox(height: 24),
                const Text(
                  'FINANCES & DÉLAIS',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.orangeSecurite),
                ),
                const SizedBox(height: 16),
                AppTextField(
                  label: 'Budget Alloué (FCFA)',
                  hint: '50 000 000',
                  controller: _budgetController,
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => _selectDate(context, true),
                        child: AbsorbPointer(
                          child: AppTextField(
                            label: 'Date Début',
                            controller: _startDateController,
                            prefixIcon: const Icon(LucideIcons.calendar),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => _selectDate(context, false),
                        child: AbsorbPointer(
                          child: AppTextField(
                            label: 'Date Fin (Prévue)',
                            controller: _endDateController,
                            prefixIcon: const Icon(LucideIcons.calendar),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 40),
                AppButton(
                  text: 'Ouvrir le Chantier',
                  onPressed: () {
                    if (_formKey.currentState!.validate() && _selectedClient != null) {
                      final now = DateTime.now();
                      final project = ProjectEntity(
                        id: const Uuid().v4(),
                        projectNumber: 'PRJ-${now.year}-${(100 + now.millisecond)}',
                        name: _nameController.text,
                        clientId: _selectedClient!.id,
                        clientName: _selectedClient!.name,
                        description: _descriptionController.text,
                        address: _addressController.text,
                        city: _cityController.text,
                        projectType: _projectType,
                        surfaceArea: double.tryParse(_surfaceAreaController.text) ?? 0,
                        levels: int.tryParse(_levelsController.text) ?? 0,
                        budgetAllocated: double.tryParse(_budgetController.text) ?? 0,
                        startDate: _startDate,
                        endDate: _endDate,
                        status: ProjectStatus.PREPARATION,
                        progressPercentage: 0.0,
                        createdAt: now,
                        updatedAt: now,
                      );
                      context.read<ProjectBloc>().add(AddProjectRequested(project));
                    }
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
