import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';
import '../../domain/entities/quality_inspection_entity.dart';
import '../bloc/quality_bloc.dart';

class InspectionListScreen extends StatefulWidget {
  final String projectId;
  final String projectName;

  const InspectionListScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  State<InspectionListScreen> createState() => _InspectionListScreenState();
}

class _InspectionListScreenState extends State<InspectionListScreen> {
  @override
  void initState() {
    super.initState();
    context.read<QualityBloc>().add(LoadProjectInspectionsRequested(widget.projectId));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('CONTRÔLES QUALITÉ'),
            Text(widget.projectName.toUpperCase(), 
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.orangeSecurite)),
          ],
        ),
      ),
      body: BlocBuilder<QualityBloc, QualityState>(
        builder: (context, state) {
          if (state is QualityLoading) return const Center(child: CircularProgressIndicator());
          
          if (state is QualityLoaded) {
            final inspections = state.inspections;
            if (inspections.isEmpty) return _buildEmptyState();

            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: inspections.length,
              itemBuilder: (context, index) {
                final inspection = inspections[index];
                return Card(
                  margin: const EdgeInsets.bottom(16),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(16),
                    title: Row(
                      children: [
                        Text(inspection.type.toString().split('.').last.replaceAll('_', ' '), 
                          style: const TextStyle(fontWeight: FontWeight.black, fontSize: 14)),
                        const Spacer(),
                        _buildStatusBadge(inspection.result),
                      ],
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(LucideIcons.mapPin, size: 12, color: AppColors.textSecondary),
                            const SizedBox(width: 4),
                            Text('Zone : ${inspection.zone}', style: const TextStyle(fontSize: 11)),
                            const SizedBox(width: 16),
                            const Icon(LucideIcons.calendar, size: 12, color: AppColors.textSecondary),
                            const SizedBox(width: 4),
                            Text(DateFormat('dd/MM/yyyy').format(inspection.date), style: const TextStyle(fontSize: 11)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text('Contrôleur : ${inspection.inspectorName}', style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic)),
                      ],
                    ),
                    trailing: const Icon(LucideIcons.chevronRight),
                    onTap: () {
                      // View details
                    },
                  ),
                );
              },
            );
          }
          return const SizedBox();
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.orangeSecurite,
        icon: const Icon(LucideIcons.fileCheck, color: Colors.white),
        label: const Text('NOUVEAU CONTRÔLE', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        onPressed: () => context.push('/projects/${widget.projectId}/quality/add?projectName=${widget.projectName}'),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.clipboardCheck, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text('Aucun contrôle qualité enregistré.'),
          const SizedBox(height: 24),
          AppButton(text: 'Lancer un contrôle', onPressed: () => context.push('/projects/${widget.projectId}/quality/add?projectName=${widget.projectName}')),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(InspectionStatus status) {
    switch (status) {
      case InspectionStatus.CONFORME:
        return AppBadge.success('CONFORME');
      case InspectionStatus.NON_CONFORME:
        return const AppBadge(label: 'NON CONFORME', color: AppColors.danger);
      case InspectionStatus.SOUS_RESERVE:
        return AppBadge.warning('SOUS RÉSERVE');
    }
  }
}
