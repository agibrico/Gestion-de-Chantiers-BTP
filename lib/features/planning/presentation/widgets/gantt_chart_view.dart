import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/planning_task_entity.dart';
import 'package:intl/intl.dart';

class GanttChartView extends StatelessWidget {
  final List<PlanningTaskEntity> tasks;
  final DateTime startDate;
  final DateTime endDate;

  const GanttChartView({
    super.key,
    required this.tasks,
    required this.startDate,
    required this.endDate,
  });

  @override
  Widget build(BuildContext context) {
    if (tasks.isEmpty) return const Center(child: Text('Aucune tâche à afficher'));

    // Calcul de la largeur totale basée sur les jours
    final totalDays = endDate.difference(startDate).inDays + 1;
    const dayWidth = 40.0;
    const rowHeight = 60.0;
    final chartWidth = totalDays * dayWidth;

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: SizedBox(
        width: chartWidth + 200, // + espace pour les titres
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header: Jours/Dates
            _buildTimelineHeader(startDate, totalDays, dayWidth),
            
            // Rows: Tâches
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: tasks.map((task) => _buildTaskRow(task, startDate, dayWidth, rowHeight)).toList(),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTimelineHeader(DateTime start, int totalDays, double dayWidth) {
    return Container(
      height: 40,
      decoration: BoxDecoration(
        color: AppColors.acierBTP,
        border: Border.all(color: Colors.white10),
      ),
      child: Row(
        children: [
          const SizedBox(width: 200), // Offset pour les noms de tâches
          ...List.generate(totalDays, (index) {
            final day = start.add(Duration(days: index));
            return Container(
              width: dayWidth,
              alignment: Center,
              decoration: const BoxDecoration(
                border: Border(left: BorderSide(color: Colors.white10)),
              ),
              child: Text(
                DateFormat('dd').format(day),
                style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildTaskRow(PlanningTaskEntity task, DateTime start, double dayWidth, double rowHeight) {
    final startOffset = task.startDate.difference(start).inDays * dayWidth;
    final taskWidth = task.durationInDays * dayWidth;

    return Container(
      height: rowHeight,
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: Colors.grey[200]!)),
      ),
      child: Row(
        children: [
          // Titre de la tâche
          Container(
            width: 200,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Text(
              task.title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ),
          
          // Barre de Gantt
          Expanded(
            child: Stack(
              children: [
                Positioned(
                  left: startOffset,
                  top: 15,
                  child: Container(
                    height: 30,
                    width: taskWidth,
                    decoration: BoxDecoration(
                      color: _getStatusColor(task.status).withOpacity(0.3),
                      borderRadius: BorderRadius.circular(15),
                      border: Border.all(color: _getStatusColor(task.status)),
                    ),
                    child: Stack(
                      children: [
                        // Progress
                        Container(
                          width: taskWidth * (task.progressPercentage / 100),
                          decoration: BoxDecoration(
                            color: _getStatusColor(task.status),
                            borderRadius: BorderRadius.circular(15),
                          ),
                        ),
                        Center(
                          child: Text(
                            '${task.progressPercentage.toInt()}%',
                            style: const TextStyle(fontSize: 9, fontWeight: FontWeight.black, color: Colors.white),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
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
