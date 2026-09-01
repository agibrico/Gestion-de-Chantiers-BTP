import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../domain/entities/employee_entity.dart';
import '../../domain/entities/team_entity.dart';
import '../bloc/resource_bloc.dart';
import '../bloc/resource_event.dart';
import '../bloc/resource_state.dart';

class TeamManagementScreen extends StatefulWidget {
  const TeamManagementScreen({super.key});

  @override
  State<TeamManagementScreen> createState() => _TeamManagementScreenState();
}

class _TeamManagementScreenState extends State<TeamManagementScreen> {
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
        title: const Text('ÉQUIPES DE TRAVAIL'),
      ),
      body: BlocBuilder<ResourceBloc, ResourceState>(
        builder: (context, state) {
          if (state is ResourceLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (state is ResourcesLoaded) {
            if (state.teams.isEmpty) {
              return _buildEmptyState(context, state.employees);
            }
            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: state.teams.length,
              itemBuilder: (context, index) {
                final team = state.teams[index];
                return Card(
                  child: ExpansionTile(
                    leading: const Icon(LucideIcons.users, color: AppColors.orangeSecurite),
                    title: Text(team.name.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.black)),
                    subtitle: Text('Chef d\'équipe : ${team.leaderName}'),
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Text('${team.memberIds.length} membres affectés', style: const TextStyle(fontWeight: FontWeight.bold)),
                            const SizedBox(height: 8),
                            // List of members could go here
                            const SizedBox(height: 16),
                            AppButton(
                              text: 'Supprimer l\'équipe',
                              variant: AppButtonVariant.danger,
                              onPressed: () => context.read<ResourceBloc>().add(DeleteTeamRequested(team.id)),
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
      floatingActionButton: BlocBuilder<ResourceBloc, ResourceState>(
        builder: (context, state) {
          if (state is ResourcesLoaded) {
            return FloatingActionButton(
              backgroundColor: AppColors.orangeSecurite,
              child: const Icon(LucideIcons.plus, color: Colors.white),
              onPressed: () => _showAddTeamDialog(context, state.employees),
            );
          }
          return const SizedBox();
        },
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context, List<EmployeeEntity> employees) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.contact, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text('Aucune équipe constituée.', style: TextStyle(color: AppColors.textSecondary)),
          const SizedBox(height: 24),
          AppButton(
            text: 'Créer une équipe',
            onPressed: () => _showAddTeamDialog(context, employees),
          ),
        ],
      ),
    );
  }

  void _showAddTeamDialog(BuildContext context, List<EmployeeEntity> employees) {
    final nameController = TextEditingController();
    EmployeeEntity? selectedLeader;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
          ),
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
            top: 32, left: 24, right: 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('CRÉER UNE ÉQUIPE', style: TextStyle(fontSize: 20, fontWeight: FontWeight.black)),
              const SizedBox(height: 24),
              AppTextField(label: 'Nom de l\'équipe', hint: 'Ex: Équipe Maçonnerie A', controller: nameController),
              const SizedBox(height: 24),
              const Text('CHEF D\'ÉQUIPE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.black, color: AppColors.textSecondary)),
              const SizedBox(height: 8),
              DropdownButtonFormField<EmployeeEntity>(
                value: selectedLeader,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.grey[100],
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                ),
                items: employees.map((e) => DropdownMenuItem(value: e, child: Text(e.fullName))).toList(),
                onChanged: (v) => setModalState(() => selectedLeader = v),
              ),
              const SizedBox(height: 32),
              AppButton(
                text: 'Valider la création',
                onPressed: () {
                  if (selectedLeader != null && nameController.text.isNotEmpty) {
                    final team = TeamEntity(
                      id: const Uuid().v4(),
                      name: nameController.text,
                      leaderId: selectedLeader!.id,
                      leaderName: selectedLeader!.fullName,
                      memberIds: [], // Members management simplified for this axe
                      createdAt: DateTime.now(),
                      updatedAt: DateTime.now(),
                    );
                    context.read<ResourceBloc>().add(AddTeamRequested(team));
                    Navigator.pop(context);
                  }
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
