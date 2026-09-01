import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../projects/domain/entities/project_entity.dart';
import '../../../projects/presentation/bloc/project_bloc.dart';
import '../../../projects/presentation/bloc/project_state.dart';
import '../bloc/site_diary_bloc.dart';

class SiteDiaryListScreen extends StatefulWidget {
  final String projectId;
  final String projectName;

  const SiteDiaryListScreen({
    super.key,
    required this.projectId,
    required this.projectName,
  });

  @override
  State<SiteDiaryListScreen> createState() => _SiteDiaryListScreenState();
}

class _SiteDiaryListScreenState extends State<SiteDiaryListScreen> {
  @override
  void initState() {
    super.initState();
    context.read<SiteDiaryBloc>().add(LoadProjectDiaryRequested(widget.projectId));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('JOURNAL DE CHANTIER'),
            Text(widget.projectName.toUpperCase(), 
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.orangeSecurite)),
          ],
        ),
      ),
      body: BlocBuilder<SiteDiaryBloc, SiteDiaryState>(
        builder: (context, state) {
          if (state is SiteDiaryLoading) return const Center(child: CircularProgressIndicator());
          
          if (state is SiteDiaryLoaded) {
            final entries = state.entries;
            if (entries.isEmpty) return _buildEmptyState();

            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: entries.length,
              itemBuilder: (context, index) {
                final entry = entries[index];
                return Card(
                  margin: const EdgeInsets.bottom(16),
                  child: ExpansionTile(
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: AppColors.background, borderRadius: BorderRadius.circular(12)),
                      child: Icon(_getWeatherIcon(entry.weather), color: AppColors.orangeSecurite, size: 20),
                    ),
                    title: Text(
                      DateFormat('EEEE dd MMMM yyyy', 'fr_FR').format(entry.date).toUpperCase(),
                      style: const TextStyle(fontWeight: FontWeight.black, fontSize: 13),
                    ),
                    subtitle: Text('Par : ${entry.authorName}', style: const TextStyle(fontSize: 11)),
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildInfoSection('TRAVAUX RÉALISÉS', entry.activitiesPerformed, LucideIcons.hammer),
                            const SizedBox(height: 16),
                            Row(
                              children: [
                                Expanded(child: _buildInfoSection('EFFECTIFS', '${entry.totalWorkers} ouvriers', LucideIcons.users)),
                                Expanded(child: _buildInfoSection('TEMPÉRATURE', '${entry.temperature ?? "--"} °C', LucideIcons.thermometer)),
                              ],
                            ),
                            if (entry.incidents != null && entry.incidents!.isNotEmpty) ...[
                              const SizedBox(height: 16),
                              _buildInfoSection('ALÉAS & INCIDENTS', entry.incidents!, LucideIcons.alertTriangle, color: AppColors.danger),
                            ],
                            const SizedBox(height: 24),
                            AppButton(
                              text: 'VOIR LES DÉTAILS',
                              variant: AppButtonVariant.outline,
                              onPressed: () {
                                // View/Edit
                              },
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
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.orangeSecurite,
        icon: const Icon(LucideIcons.filePlus, color: Colors.white),
        label: const Text('RÉDIGER LE JOURNAL', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        onPressed: () => context.push('/projects/${widget.projectId}/diary/add?projectName=${widget.projectName}'),
      ),
    );
  }

  Widget _buildInfoSection(String label, String value, IconData icon, {Color color = AppColors.acierBTP}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 12, color: AppColors.textSecondary),
            const SizedBox(width: 8),
            Text(label, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
          ],
        ),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: color)),
      ],
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.bookOpen, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text('Aucun journal rédigé pour ce chantier.'),
          const SizedBox(height: 24),
          AppButton(text: 'Commencer le journal', onPressed: () => context.push('/projects/${widget.projectId}/diary/add?projectName=${widget.projectName}')),
        ],
      ),
    );
  }

  IconData _getWeatherIcon(WeatherCondition weather) {
    switch (weather) {
      case WeatherCondition.ENSOLEILLE: return LucideIcons.sun;
      case WeatherCondition.NUAGEUX: return LucideIcons.cloud;
      case WeatherCondition.PLUIE_LEGERE: return LucideIcons.cloudRain;
      case WeatherCondition.FORTE_PLUIE: return LucideIcons.cloudLightning;
      default: return LucideIcons.cloud;
    }
  }
}
