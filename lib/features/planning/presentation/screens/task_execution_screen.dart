import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../domain/entities/planning_task_entity.dart';
import '../bloc/planning_bloc.dart';
import '../bloc/planning_event.dart';
import '../bloc/planning_state.dart';
import '../widgets/update_progress_dialog.dart';
import 'package:intl/intl.dart';

class TaskExecutionScreen extends StatefulWidget {
  final String projectId;
  final String projectName;

  const TaskExecutionScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  State<TaskExecutionScreen> createState() => _TaskExecutionScreenState();
}

class _TaskExecutionScreenState extends State<TaskExecutionScreen> {
  @override
  void initState() {
    super.initState();
    context.read<PlanningBloc>().add(LoadProjectPlanning(widget.projectId));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('SUIVI D\'EXÉCUTION'),
            Text(widget.projectName.toUpperCase(), 
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.orangeSecurite)),
          ],
        ),
      ),
      body: BlocBuilder<PlanningBloc, PlanningState>(
        builder: (context, state) {
          if (state is PlanningLoading) return const Center(child: CircularProgressIndicator());
          
          if (state is PlanningLoaded) {
            if (state.tasks.isEmpty) {
              return const Center(child: Text('Aucune tâche planifiée pour ce chantier.'));
            }
            
            // Regrouper par phase pour une meilleure lisibilité
            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: state.phases.length,
              itemBuilder: (context, index) {
                final phase = state.phases[index];
                final phaseTasks = state.tasks.where((t) => t.phaseId == phase.id).toList();
                
                if (phaseTasks.isEmpty) return const SizedBox();

                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 12.0, horizontal: 4.0),
                      child: Text(phase.name.toUpperCase(), 
                        style: const TextStyle(fontWeight: FontWeight.black, fontSize: 12, letterSpacing: 1.0, color: AppColors.textSecondary)),
                    ),
                    ...phaseTasks.map((task) => _buildTaskCard(task)).toList(),
                    const SizedBox(height: 16),
                  ],
                );
              },
            );
          }
          
          return const SizedBox();
        },
      ),
    );
  }

  Widget _buildTaskCard(PlanningTaskEntity task) {
    final currencyFormat = NumberFormat.currency(symbol: 'FCFA', decimalDigits: 0, locale: 'fr_FR');

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(task.title.toUpperCase(), 
                    style: const TextStyle(fontWeight: FontWeight.black, fontSize: 14)),
                ),
                _buildPriorityBadge(task.priority),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(LucideIcons.calendar, size: 14, color: AppColors.textSecondary),
                const SizedBox(width: 8),
                Text('Fin prévue : ${DateFormat('dd/MM/yyyy').format(task.endDate)}', 
                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Avancement: ${task.progressPercentage.toInt()}%', 
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                Text('Coût réel: ${currencyFormat.format(task.actualCost)}', 
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, 
                    color: task.actualCost > task.estimatedCost && task.estimatedCost > 0 ? AppColors.danger : AppColors.success)),
              ],
            ),
            const SizedBox(height: 4),
            LinearProgressIndicator(
              value: task.progressPercentage / 100,
              backgroundColor: Colors.grey[100],
              valueColor: AlwaysStoppedAnimation<Color>(_getStatusColor(task.status)),
              minHeight: 6,
            ),
            if (task.observations != null && task.observations!.isNotEmpty) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.blueGrey[50],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(LucideIcons.messageSquare, size: 12, color: AppColors.textSecondary),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(task.observations!, 
                        style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic)),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () => _showUpdateDialog(task),
                icon: const Icon(LucideIcons.edit3, size: 16),
                label: const Text('RAPPORTER L\'AVANCEMENT'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.orangeSecurite,
                  side: const BorderSide(color: AppColors.orangeSecurite),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPriorityBadge(TaskPriority priority) {
    switch (priority) {
      case TaskPriority.BASSE:
        return AppBadge(label: 'BASSE', color: Colors.blue[50]!, textColor: Colors.blue);
      case TaskPriority.MOYENNE:
        return AppBadge(label: 'MOYENNE', color: Colors.grey[100]!, textColor: Colors.grey);
      case TaskPriority.HAUTE:
        return AppBadge(label: 'HAUTE', color: Colors.orange[50]!, textColor: Colors.orange);
      case TaskPriority.CRITIQUE:
        return AppBadge(label: 'CRITIQUE', color: AppColors.danger.withOpacity(0.1), textColor: AppColors.danger);
    }
  }

  void _showUpdateDialog(PlanningTaskEntity task) {
    showDialog(
      context: context,
      builder: (context) => UpdateProgressDialog(
        task: task,
        onUpdate: (progress, actualCost, observations, status) {
          context.read<PlanningBloc>().add(UpdatePlanningTaskStatusRequested(
            taskId: task.id,
            projectId: widget.projectId,
            progress: progress,
            actualCost: actualCost,
            observations: observations,
            newStatus: status,
          ));
        },
      ),
    );
  }

  Color _getStatusColor(PlanningTaskStatus status) {
    switch (status) {
      case PlanningTaskStatus.A_FAIRE: return Colors.grey;
      case PlanningTaskStatus.EN_COURS: return AppColors.orangeSecurite;
      case PlanningTaskStatus.TERMINE: return AppColors.success;
      case PlanningTaskStatus.EN_RETARD: return AppColors.danger;
    }
  }
}
