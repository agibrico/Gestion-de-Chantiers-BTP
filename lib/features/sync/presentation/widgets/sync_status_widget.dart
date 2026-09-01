import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/constants/app_colors.dart';
import '../bloc/sync_bloc.dart';

class SyncStatusWidget extends StatelessWidget {
  const SyncStatusWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<SyncBloc, SyncState>(
      builder: (context, state) {
        IconData icon;
        Color color;
        String tooltip;

        switch (state.status) {
          case SyncStatus.syncing:
            return const Padding(
              padding: EdgeInsets.all(12.0),
              child: SizedBox(
                width: 18,
                height: 18,
                child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.orangeSecurite),
              ),
            );
          case SyncStatus.success:
            icon = LucideIcons.cloudCheck;
            color = AppColors.success;
            tooltip = 'Données synchronisées';
            break;
          case SyncStatus.error:
            icon = LucideIcons.cloudAlert;
            color = AppColors.danger;
            tooltip = 'Erreur de synchro : ${state.errorMessage}';
            break;
          case SyncStatus.offline:
            icon = LucideIcons.cloudOff;
            color = Colors.grey;
            tooltip = 'Mode Hors-ligne';
            break;
          default:
            icon = LucideIcons.cloud;
            color = AppColors.acierBTP;
            tooltip = 'En attente';
        }

        return Tooltip(
          message: tooltip,
          child: IconButton(
            icon: Icon(icon, color: color, size: 20),
            onPressed: () {
              if (state.status != SyncStatus.syncing) {
                context.read<SyncBloc>().add(StartGlobalSyncRequested());
              }
            },
          ),
        );
      },
    );
  }
}
