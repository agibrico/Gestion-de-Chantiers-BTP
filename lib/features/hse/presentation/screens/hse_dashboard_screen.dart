import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';
import '../bloc/hse_bloc.dart';
import 'package:intl/intl.dart';

class HseDashboardScreen extends StatefulWidget {
  final String projectId;
  final String projectName;

  const HseDashboardScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  State<HseDashboardScreen> createState() => _HseDashboardScreenState();
}

class _HseDashboardScreenState extends State<HseDashboardScreen> {
  @override
  void initState() {
    super.initState();
    context.read<HseBloc>().add(LoadProjectHseRequested(widget.projectId));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('HSE & SÉCURITÉ'),
            Text(widget.projectName.toUpperCase(), style: const TextStyle(fontSize: 10, color: AppColors.orangeSecurite, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
      body: BlocBuilder<HseBloc, HseState>(
        builder: (context, state) {
          if (state is HseLoading) return const Center(child: CircularProgressIndicator());
          if (state is HseLoaded) {
            return ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _buildSafetyOverview(state),
                const SizedBox(height: 24),
                _buildActionButtons(context),
                const SizedBox(height: 32),
                const Text('DERNIERS INCIDENTS', style: TextStyle(fontWeight: FontWeight.black, fontSize: 14)),
                const SizedBox(height: 12),
                ...state.incidents.map((i) => _buildIncidentCard(i)),
                if (state.incidents.isEmpty) const Center(child: Text('Aucun incident rapporté.', style: TextStyle(fontSize: 12, color: AppColors.textSecondary))),
              ],
            );
          }
          return const SizedBox();
        },
      ),
    );
  }

  Widget _buildSafetyOverview(HseLoaded state) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildKpiCard(
                'CONFORMITÉ EPI', 
                '${state.avgPpeCompliance.toInt()}%', 
                LucideIcons.shieldCheck, 
                state.avgPpeCompliance > 80 ? AppColors.success : AppColors.warning
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildKpiCard(
                'INCIDENTS ACTIFS', 
                '${state.openIncidentsCount}', 
                LucideIcons.alertOctagon, 
                state.openIncidentsCount > 0 ? AppColors.danger : AppColors.success
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildKpiCard(String label, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(height: 12),
            Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
            const SizedBox(height: 4),
            Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.black)),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Column(
      children: [
        AppButton(
          text: 'RAPPORTER UN INCIDENT',
          variant: AppButtonVariant.danger,
          icon: const Icon(LucideIcons.alertTriangle, size: 18, color: Colors.white),
          onPressed: () => context.push('/projects/${widget.projectId}/hse/incident?projectName=${widget.projectName}'),
        ),
        const SizedBox(height: 12),
        AppButton(
          text: 'FAIRE UN AUDIT EPI',
          variant: AppButtonVariant.secondary,
          icon: const Icon(LucideIcons.shield, size: 18, color: Colors.white),
          onPressed: () => context.push('/projects/${widget.projectId}/hse/ppe?projectName=${widget.projectName}'),
        ),
      ],
    );
  }

  Widget _buildIncidentCard(dynamic incident) {
    return Card(
      margin: const EdgeInsets.bottom(12),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: AppColors.danger.withOpacity(0.1),
          child: const Icon(LucideIcons.alertCircle, color: AppColors.danger, size: 18),
        ),
        title: Text(incident.type.toString().split('.').last.replaceAll('_', ' '), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        subtitle: Text('${DateFormat('dd/MM/yyyy').format(incident.date)} • ${incident.location}'),
        trailing: AppBadge(
          label: incident.severity.toString().split('.').last, 
          color: _getSeverityColor(incident.severity).withOpacity(0.1),
          textColor: _getSeverityColor(incident.severity),
        ),
      ),
    );
  }

  Color _getSeverityColor(dynamic severity) {
    // Simplified logic
    return AppColors.danger;
  }
}
