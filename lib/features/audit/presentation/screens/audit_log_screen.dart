import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/audit_log_entity.dart';
import '../bloc/audit_bloc.dart';
import '../bloc/audit_event.dart';
import '../bloc/audit_state.dart';

class AuditLogScreen extends StatefulWidget {
  const AuditLogScreen({super.key});

  @override
  State<AuditLogScreen> createState() => _AuditLogScreenState();
}

class _AuditLogScreenState extends State<AuditLogScreen> {
  @override
  void initState() {
    super.initState();
    context.read<AuditBloc>().add(const LoadAuditLogsRequested());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('JOURNAL D\'AUDIT & SÉCURITÉ'),
      ),
      body: Column(
        children: [
          _buildFilterBar(),
          Expanded(
            child: BlocBuilder<AuditBloc, AuditState>(
              builder: (context, state) {
                if (state is AuditLoading) return const Center(child: CircularProgressIndicator());
                
                if (state is AuditLogsLoaded) {
                  final logs = state.logs;
                  if (logs.isEmpty) return _buildEmptyState();

                  return ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: logs.length,
                    separatorBuilder: (context, index) => const Divider(height: 1),
                    itemBuilder: (context, index) {
                      final log = logs[index];
                      return _buildLogTile(log);
                    },
                  );
                }
                return const SizedBox();
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterBar() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          const Icon(LucideIcons.filter, size: 16, color: AppColors.textSecondary),
          const SizedBox(width: 12),
          Text('TOUS LES MODULES', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey[600])),
          const Spacer(),
          Text('DERNIERS 100 ÉVÉNEMENTS', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey[600])),
        ],
      ),
    );
  }

  Widget _buildLogTile(AuditLogEntity log) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildActionIcon(log.action),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      log.actionDetail,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    Text(
                      DateFormat('dd/MM HH:mm').format(log.timestamp),
                      style: const TextStyle(fontSize: 10, color: Colors.grey),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(LucideIcons.user, size: 10, color: AppColors.textSecondary),
                    const SizedBox(width: 4),
                    Text(log.authorName, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                    const SizedBox(width: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(color: AppColors.acierBTP.withOpacity(0.1), borderRadius: BorderRadius.circular(4)),
                      child: Text(log.module.toString().split('.').last, style: const TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: AppColors.acierBTP)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionIcon(AuditAction action) {
    IconData icon;
    Color color;

    switch (action) {
      case AuditAction.CREATE:
        icon = LucideIcons.plusCircle;
        color = AppColors.success;
        break;
      case AuditAction.UPDATE:
        icon = LucideIcons.edit;
        color = AppColors.orangeSecurite;
        break;
      case AuditAction.DELETE:
        icon = LucideIcons.trash2;
        color = AppColors.danger;
        break;
      case AuditAction.LOGIN:
      case AuditAction.LOGOUT:
        icon = LucideIcons.key;
        color = Colors.blue;
        break;
      default:
        icon = LucideIcons.activity;
        color = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle),
      child: Icon(icon, color: color, size: 16),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.shieldCheck, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text('Aucune action critique enregistrée.'),
        ],
      ),
    );
  }
}
