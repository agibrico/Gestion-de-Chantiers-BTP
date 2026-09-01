import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../domain/entities/phase_entity.dart';
import '../../domain/entities/planning_task_entity.dart';
import '../bloc/planning_bloc.dart';
import '../bloc/planning_event.dart';
import '../bloc/planning_state.dart';
import '../widgets/gantt_chart_view.dart';
import 'package:intl/intl.dart';

class PlanningScreen extends StatefulWidget {
  final String projectId;
  final String projectName;

  const PlanningScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  State<PlanningScreen> createState() => _PlanningScreenState();
}

class _PlanningScreenState extends State<PlanningScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
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
            const Text('PLANNING & PHASES'),
            Text(widget.projectName.toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.orangeSecurite)),
          ],
        ),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.orangeSecurite,
          unselectedLabelColor: Colors.white70,
          indicatorColor: AppColors.orangeSecurite,
          tabs: const [
            Tab(text: 'STRUCTURE PHASES'),
            Tab(text: 'DIAGRAMME DE GANTT'),
          ],
        ),
      ),
      body: BlocBuilder<PlanningBloc, PlanningState>(
        builder: (context, state) {
          if (state is PlanningLoading) return const Center(child: CircularProgressIndicator());
          
          if (state is PlanningLoaded) {
            return TabBarView(
              controller: _tabController,
              children: [
                _buildPhasesList(state.phases, state.tasks),
                _buildGanttView(state.tasks),
              ],
            );
          }
          
          return const SizedBox();
        },
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.orangeSecurite,
        child: const Icon(LucideIcons.plus, color: Colors.white),
        onPressed: () => _showAddPhaseDialog(context),
      ),
    );
  }

  Widget _buildPhasesList(List<PhaseEntity> phases, List<PlanningTaskEntity> allTasks) {
    if (phases.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(LucideIcons.calendarClock, size: 64, color: Colors.grey),
            const SizedBox(height: 16),
            const Text('Aucune phase planifiée.'),
            const SizedBox(height: 16),
            AppButton(text: 'Ajouter une phase', onPressed: () => _showAddPhaseDialog(context)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: phases.length,
      itemBuilder: (context, index) {
        final phase = phases[index];
        final phaseTasks = allTasks.where((t) => t.phaseId == phase.id).toList();
        
        return Card(
          margin: const EdgeInsets.bottom(16),
          child: ExpansionTile(
            title: Text(phase.name.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.black)),
            subtitle: Text('Progression: ${phase.progressPercentage.toInt()}%'),
            children: [
              ...phaseTasks.map((task) => ListTile(
                title: Text(task.title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                subtitle: Text('${DateFormat('dd/MM').format(task.startDate)} - ${DateFormat('dd/MM').format(task.endDate)}'),
                trailing: AppBadge.info(task.status.toString().split('.').last),
              )),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: AppButton(
                  text: 'Ajouter une tâche',
                  variant: AppButtonVariant.outline,
                  onPressed: () => _showAddTaskDialog(context, phase.id),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildGanttView(List<PlanningTaskEntity> tasks) {
    if (tasks.isEmpty) return const Center(child: Text('Aucune tâche à afficher dans le Gantt'));
    
    // Déterminer les limites de la timeline
    DateTime start = tasks.first.startDate;
    DateTime end = tasks.first.endDate;
    
    for (var t in tasks) {
      if (t.startDate.isBefore(start)) start = t.startDate;
      if (t.endDate.isAfter(end)) end = t.endDate;
    }

    // Ajouter un peu de marge
    start = start.subtract(const Duration(days: 2));
    end = end.add(const Duration(days: 10));

    return Column(
      children: [
        const Padding(
          padding: EdgeInsets.all(16.0),
          child: Row(
            children: [
              Icon(LucideIcons.info, size: 14, color: AppColors.textSecondary),
              SizedBox(width: 8),
              Text('Faites défiler horizontalement pour voir le planning', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
            ],
          ),
        ),
        Expanded(
          child: GanttChartView(
            tasks: tasks,
            startDate: start,
            endDate: end,
          ),
        ),
      ],
    );
  }

  void _showAddPhaseDialog(BuildContext context) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('NOUVELLE PHASE'),
        content: AppTextField(label: 'Nom de la phase', hint: 'Ex: Fondations', controller: controller),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('ANNULER')),
          TextButton(
            onPressed: () {
              if (controller.text.isNotEmpty) {
                final phase = PhaseEntity(
                  id: const Uuid().v4(),
                  projectId: widget.projectId,
                  name: controller.text,
                  order: 1,
                  startDate: DateTime.now(),
                  endDate: DateTime.now().add(const Duration(days: 30)),
                  progressPercentage: 0,
                  createdAt: DateTime.now(),
                  updatedAt: DateTime.now(),
                );
                context.read<PlanningBloc>().add(AddPhaseRequested(phase));
                Navigator.pop(context);
              }
            },
            child: const Text('CRÉER', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.orangeSecurite)),
          ),
        ],
      ),
    );
  }

  void _showAddTaskDialog(BuildContext context, String phaseId) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('PLANIFIER TÂCHE'),
        content: AppTextField(label: 'Titre de la tâche', hint: 'Ex: Coulage béton', controller: controller),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('ANNULER')),
          TextButton(
            onPressed: () {
              if (controller.text.isNotEmpty) {
                final task = PlanningTaskEntity(
                  id: const Uuid().v4(),
                  phaseId: phaseId,
                  projectId: widget.projectId,
                  title: controller.text,
                  startDate: DateTime.now(),
                  endDate: DateTime.now().add(const Duration(days: 5)),
                  status: PlanningTaskStatus.A_FAIRE,
                  progressPercentage: 0,
                  dependencies: [],
                  createdAt: DateTime.now(),
                  updatedAt: DateTime.now(),
                );
                context.read<PlanningBloc>().add(AddPlanningTaskRequested(task));
                Navigator.pop(context);
              }
            },
            child: const Text('AJOUTER', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.orangeSecurite)),
          ),
        ],
      ),
    );
  }
}
