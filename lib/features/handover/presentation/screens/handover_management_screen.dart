import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';
import '../../domain/entities/handover_entity.dart';
import '../bloc/handover_bloc.dart';
import '../bloc/handover_event.dart';
import '../bloc/handover_state.dart';

class HandoverManagementScreen extends StatefulWidget {
  final String projectId;
  final String projectName;

  const HandoverManagementScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  State<HandoverManagementScreen> createState() => _HandoverManagementScreenState();
}

class _HandoverManagementScreenState extends State<HandoverManagementScreen> {
  @override
  void initState() {
    super.initState();
    context.read<HandoverBloc>().add(LoadProjectHandoversRequested(widget.projectId));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('RÉCEPTION DE TRAVAUX'),
            Text(widget.projectName.toUpperCase(), 
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.orangeSecurite)),
          ],
        ),
      ),
      body: BlocBuilder<HandoverBloc, HandoverState>(
        builder: (context, state) {
          if (state is HandoverLoading) return const Center(child: CircularProgressIndicator());
          
          if (state is HandoversLoaded) {
            final handovers = state.handovers;
            if (handovers.isEmpty) return _buildEmptyState();

            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: handovers.length,
              itemBuilder: (context, index) {
                final h = handovers[index];
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
                            AppBadge.info(h.type == HandoverType.PROVISOIRE ? 'RÉCEPTION PROVISOIRE' : 'RÉCEPTION DÉFINITIVE'),
                            if (h.isCompleted) AppBadge.success('SIGNÉ & VALIDÉ'),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          DateFormat('EEEE dd MMMM yyyy', 'fr_FR').format(h.date).toUpperCase(),
                          style: const TextStyle(fontWeight: FontWeight.black, fontSize: 14),
                        ),
                        const SizedBox(height: 12),
                        _buildSummaryItem(LucideIcons.users, 'Participants', '${h.participants.length} personnes présentes'),
                        _buildSummaryItem(LucideIcons.alertCircle, 'Réserves', '${h.reserves.length} points notés'),
                        const Divider(height: 32),
                        Row(
                          children: [
                            Expanded(
                              child: AppButton(
                                text: 'VOIR LE PV',
                                variant: AppButtonVariant.outline,
                                size: AppButtonSize.small,
                                icon: const Icon(LucideIcons.fileText, size: 14),
                                onPressed: () {
                                  // TODO: Generate and show PDF
                                },
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: AppButton(
                                text: 'GÉRER LEVÉES',
                                variant: AppButtonVariant.secondary,
                                size: AppButtonSize.small,
                                icon: const Icon(LucideIcons.listChecks, size: 14),
                                onPressed: () {
                                  // TODO: Snag list filter for this handover
                                },
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
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
        icon: const Icon(LucideIcons.checkCircle2, color: Colors.white),
        label: const Text('NOUVELLE RÉCEPTION', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        onPressed: () => context.push('/projects/${widget.projectId}/reception/add?projectName=${widget.projectName}'),
      ),
    );
  }

  Widget _buildSummaryItem(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        children: [
          Icon(icon, size: 14, color: AppColors.textSecondary),
          const SizedBox(width: 8),
          Text('$label : ', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
          Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.packageCheck, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text('Aucune réception de travaux effectuée.'),
          const SizedBox(height: 24),
          AppButton(
            text: 'Démarrer la réception', 
            onPressed: () => context.push('/projects/${widget.projectId}/reception/add?projectName=${widget.projectName}')
          ),
        ],
      ),
    );
  }
}
