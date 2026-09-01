import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';
import '../../domain/entities/project_entity.dart';
import 'package:intl/intl.dart';

class ProjectCard extends StatelessWidget {
  final ProjectEntity project;
  final VoidCallback onTap;

  const ProjectCard({
    super.key,
    required this.project,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(symbol: 'FCFA', decimalDigits: 0, locale: 'fr_FR');
    final dateFormat = DateFormat('dd/MM/yyyy');

    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  AppBadge.info(project.projectNumber),
                  _buildStatusBadge(project.status),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                project.name.toUpperCase(),
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.black,
                  letterSpacing: -0.5,
                  color: AppColors.acierBTP,
                ),
              ),
              Text(
                'Client: ${project.clientName}',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: AppColors.orangeSecurite,
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  const Icon(LucideIcons.mapPin, size: 14, color: AppColors.textSecondary),
                  const SizedBox(width: 8),
                  Text('${project.city}, ${project.address}', style: const TextStyle(fontSize: 12)),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(LucideIcons.calendar, size: 14, color: AppColors.textSecondary),
                  const SizedBox(width: 8),
                  Text(
                    '${dateFormat.format(project.startDate)} - ${dateFormat.format(project.endDate)}',
                    style: const TextStyle(fontSize: 12),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              const Text(
                'AVANCEMENT GLOBAL',
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.black, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 4),
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: project.progressPercentage / 100,
                  backgroundColor: Colors.grey[200],
                  valueColor: AlwaysStoppedAnimation<Color>(_getProgressColor(project.progressPercentage)),
                  minHeight: 8,
                ),
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'BUDGET: ${currencyFormat.format(project.budgetAllocated)}',
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    '${project.progressPercentage.toInt()}%',
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.black),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: AppButton(
                      text: 'Planning',
                      variant: AppButtonVariant.secondary,
                      icon: const Icon(LucideIcons.calendarClock, size: 16, color: Colors.white),
                      onPressed: () => context.push('/projects/${project.id}/planning?name=${project.name}'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: AppButton(
                      text: 'Suivi Travaux',
                      variant: AppButtonVariant.primary,
                      icon: const Icon(LucideIcons.activity, size: 16, color: Colors.white),
                      onPressed: () => context.push('/projects/${project.id}/tasks?name=${project.name}'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: AppButton(
                      text: 'Pointage',
                      variant: AppButtonVariant.outline,
                      icon: const Icon(LucideIcons.checkSquare, size: 16),
                      onPressed: () => context.push('/attendance?projectId=${project.id}'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: AppButton(
                      text: 'Finances',
                      variant: AppButtonVariant.outline,
                      icon: const Icon(LucideIcons.banknote, size: 16),
                      onPressed: () => context.push('/finance?projectId=${project.id}'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: AppButton(
                      text: 'Journal',
                      variant: AppButtonVariant.outline,
                      icon: const Icon(LucideIcons.bookOpen, size: 16),
                      onPressed: () => context.push('/projects/${project.id}/diary?projectName=${project.name}'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: AppButton(
                      text: 'Galerie',
                      variant: AppButtonVariant.outline,
                      icon: const Icon(LucideIcons.image, size: 16),
                      onPressed: () => context.push('/projects/${project.id}/gallery?projectName=${project.name}'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: AppButton(
                      text: 'Qualité',
                      variant: AppButtonVariant.outline,
                      icon: const Icon(LucideIcons.clipboardCheck, size: 16),
                      onPressed: () => context.push('/projects/${project.id}/quality?projectName=${project.name}'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: AppButton(
                      text: 'Réserves',
                      variant: AppButtonVariant.outline,
                      icon: const Icon(LucideIcons.alertCircle, size: 16),
                      onPressed: () => context.push('/projects/${project.id}/snags?projectName=${project.name}'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: AppButton(
                      text: 'Rapports',
                      variant: AppButtonVariant.outline,
                      icon: const Icon(LucideIcons.fileText, size: 16),
                      onPressed: () => context.push('/projects/${project.id}/reports?projectName=${project.name}'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: AppButton(
                      text: 'GED & DOCS',
                      variant: AppButtonVariant.outline,
                      icon: const Icon(LucideIcons.folderClosed, size: 16),
                      onPressed: () => context.push('/projects/${project.id}/documents?projectName=${project.name}'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              AppButton(
                text: 'SÉCURITÉ & HSE',
                variant: AppButtonVariant.danger,
                icon: const Icon(LucideIcons.shieldAlert, size: 16, color: Colors.white),
                onPressed: () => context.push('/projects/${project.id}/hse?projectName=${project.name}'),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: AppButton(
                      text: 'Réception',
                      variant: AppButtonVariant.outline,
                      icon: const Icon(LucideIcons.packageCheck, size: 16),
                      onPressed: () => context.push('/projects/${project.id}/reception?projectName=${project.name}'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: AppButton(
                      text: 'Détails',
                      variant: AppButtonVariant.outline,
                      onPressed: onTap,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusBadge(ProjectStatus status) {
    switch (status) {
      case ProjectStatus.PREPARATION:
        return AppBadge.info('PRÉPARATION');
      case ProjectStatus.EN_COURS:
        return AppBadge.success('EN COURS');
      case ProjectStatus.SUSPENDU:
        return AppBadge.warning('SUSPENDU');
      case ProjectStatus.EN_RETARD:
        return AppBadge(label: 'EN RETARD', color: AppColors.danger.withOpacity(0.1), textColor: AppColors.danger);
      case ProjectStatus.TERMINE:
        return AppBadge.success('TERMINÉ');
      case ProjectStatus.ARCHIVE:
        return AppBadge(label: 'ARCHIVÉ', color: Colors.grey.withOpacity(0.1), textColor: Colors.grey);
    }
  }

  Color _getProgressColor(double percentage) {
    if (percentage < 30) return AppColors.info;
    if (percentage < 70) return AppColors.orangeSecurite;
    return AppColors.success;
  }
}
