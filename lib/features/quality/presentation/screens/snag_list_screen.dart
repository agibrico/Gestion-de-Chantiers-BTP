import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';
import '../../domain/entities/snag_entity.dart';
import '../bloc/snag_bloc.dart';

class SnagListScreen extends StatefulWidget {
  final String projectId;
  final String projectName;

  const SnagListScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  State<SnagListScreen> createState() => _SnagListScreenState();
}

class _SnagListScreenState extends State<SnagListScreen> {
  @override
  void initState() {
    super.initState();
    context.read<SnagBloc>().add(LoadProjectSnagsRequested(widget.projectId));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('RÉSERVES & LEVÉES'),
            Text(widget.projectName.toUpperCase(), 
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.orangeSecurite)),
          ],
        ),
      ),
      body: BlocBuilder<SnagBloc, SnagState>(
        builder: (context, state) {
          if (state is SnagLoading) return const Center(child: CircularProgressIndicator());
          
          if (state is SnagLoaded) {
            final snags = state.snags;
            if (snags.isEmpty) return _buildEmptyState();

            return Column(
              children: [
                _buildSummaryHeader(state),
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: snags.length,
                    itemBuilder: (context, index) {
                      final snag = snags[index];
                      return _buildSnagCard(snag);
                    },
                  ),
                ),
              ],
            );
          }
          return const SizedBox();
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.orangeSecurite,
        icon: const Icon(LucideIcons.alertCircle, color: Colors.white),
        label: const Text('SIGNALER RÉSERVE', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        onPressed: () => context.push('/projects/${widget.projectId}/snags/add?projectName=${widget.projectName}'),
      ),
    );
  }

  Widget _buildSummaryHeader(SnagLoaded state) {
    return Container(
      color: AppColors.acierBTP,
      padding: const EdgeInsets.all(20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStatItem('TOTAL', '${state.snags.length}', Colors.white),
          _buildStatItem('OUVERTES', '${state.openCount}', AppColors.orangeSecurite),
          _buildStatItem('CRITIQUES', '${state.criticalCount}', AppColors.danger),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value, Color color) {
    return Column(
      children: [
        Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.black, color: color)),
        Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white54)),
      ],
    );
  }

  Widget _buildSnagCard(SnagEntity snag) {
    return Card(
      margin: const EdgeInsets.bottom(16),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildPriorityBadge(snag.priority),
                _buildStatusBadge(snag.status),
              ],
            ),
            const SizedBox(height: 12),
            Text(snag.title.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.black, fontSize: 14)),
            const SizedBox(height: 4),
            Text(snag.description, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
            const SizedBox(height: 16),
            Row(
              children: [
                const Icon(LucideIcons.mapPin, size: 12, color: AppColors.textSecondary),
                const SizedBox(width: 4),
                Text('Zone : ${snag.zone}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                const Spacer(),
                if (snag.dueDate != null) ...[
                  const Icon(LucideIcons.calendar, size: 12, color: AppColors.textSecondary),
                  const SizedBox(width: 4),
                  Text('Échéance : ${DateFormat('dd/MM').format(snag.dueDate!)}', 
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: snag.isOverdue ? AppColors.danger : AppColors.textSecondary)),
                ],
              ],
            ),
            const Divider(height: 32),
            Row(
              children: [
                if (snag.status != SnagStatus.LEVEE)
                  Expanded(
                    child: AppButton(
                      text: 'VALIDER LA LEVÉE',
                      variant: AppButtonVariant.primary,
                      size: AppButtonSize.small,
                      onPressed: () => _showClosureDialog(snag),
                    ),
                  ),
                if (snag.status != SnagStatus.LEVEE) const SizedBox(width: 8),
                Expanded(
                  child: AppButton(
                    text: 'DÉTAILS',
                    variant: AppButtonVariant.outline,
                    size: AppButtonSize.small,
                    onPressed: () {
                      // View details
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.checkCircle2, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text('Aucune réserve identifiée. Travail conforme !'),
        ],
      ),
    );
  }

  Widget _buildPriorityBadge(SnagPriority priority) {
    switch (priority) {
      case SnagPriority.BASSE: return const AppBadge(label: 'BASSE', color: Colors.blue);
      case SnagPriority.MOYENNE: return const AppBadge(label: 'MOYENNE', color: Colors.grey);
      case SnagPriority.HAUTE: return const AppBadge(label: 'HAUTE', color: Colors.orange);
      case SnagPriority.URGENTE: return const AppBadge(label: 'URGENTE', color: AppColors.danger);
    }
  }

  Widget _buildStatusBadge(SnagStatus status) {
    switch (status) {
      case SnagStatus.OUVERTE: return const AppBadge(label: 'OUVERTE', color: AppColors.danger, isOutline: true);
      case SnagStatus.EN_COURS_CORRECTION: return const AppBadge(label: 'EN COURS', color: AppColors.orangeSecurite, isOutline: true);
      case SnagStatus.LEVEE: return AppBadge.success('LEVÉE');
      case SnagStatus.ANNULEE: return const AppBadge(label: 'ANNULÉE', color: Colors.black);
    }
  }

  void _showClosureDialog(SnagEntity snag) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('VALIDATION DE LEVÉE', style: TextStyle(fontWeight: FontWeight.black)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Confirmez-vous que ce défaut a été corrigé conformément aux règles de l\'art ?', style: TextStyle(fontSize: 13)),
            const SizedBox(height: 16),
            TextField(
              controller: controller,
              decoration: const InputDecoration(labelText: 'Observations de levée (facultatif)', border: OutlineInputBorder()),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('ANNULER')),
          TextButton(
            onPressed: () {
              context.read<SnagBloc>().add(UpdateSnagStatusRequested(
                snagId: snag.id,
                newStatus: SnagStatus.LEVEE,
                observations: controller.text,
                projectId: widget.projectId,
              ));
              Navigator.pop(context);
            },
            child: const Text('VALIDER LA LEVÉE', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.success)),
          ),
        ],
      ),
    );
  }
}
