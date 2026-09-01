import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/notification_entity.dart';
import '../bloc/notification_bloc.dart';
import '../bloc/notification_event.dart';
import '../bloc/notification_state.dart';

class NotificationCenterScreen extends StatefulWidget {
  const NotificationCenterScreen({super.key});

  @override
  State<NotificationCenterScreen> createState() => _NotificationCenterScreenState();
}

class _NotificationCenterScreenState extends State<NotificationCenterScreen> {
  @override
  void initState() {
    super.initState();
    context.read<NotificationBloc>().add(LoadNotificationsRequested());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('CENTRE DE NOTIFICATIONS'),
        actions: [
          TextButton(
            onPressed: () => context.read<NotificationBloc>().add(MarkAllAsReadRequested()),
            child: const Text('TOUT LIRE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      body: BlocBuilder<NotificationBloc, NotificationState>(
        builder: (context, state) {
          if (state is NotificationLoading) return const Center(child: CircularProgressIndicator());
          
          if (state is NotificationsLoaded) {
            final notifications = state.notifications;
            if (notifications.isEmpty) return _buildEmptyState();

            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                final n = notifications[index];
                return _buildNotificationCard(context, n);
              },
            );
          }
          return const SizedBox();
        },
      ),
    );
  }

  Widget _buildNotificationCard(BuildContext context, AppNotificationEntity n) {
    return Card(
      elevation: n.isRead ? 0 : 2,
      margin: const EdgeInsets.bottom(12),
      color: n.isRead ? Colors.white.withOpacity(0.6) : Colors.white,
      child: InkWell(
        onTap: () {
          context.read<NotificationBloc>().add(MarkAsReadRequested(n.id));
          if (n.route != null) context.push(n.route!);
        },
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildTypeIcon(n),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          n.title.toUpperCase(),
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.black,
                            color: n.isRead ? Colors.grey : AppColors.acierBTP,
                          ),
                        ),
                        Text(
                          DateFormat('HH:mm').format(n.date),
                          style: const TextStyle(fontSize: 10, color: Colors.grey),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      n.message,
                      style: TextStyle(
                        fontSize: 13,
                        color: n.isRead ? Colors.grey : AppColors.textSecondary,
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      DateFormat('dd MMM yyyy').format(n.date),
                      style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey),
                    ),
                  ],
                ),
              ),
              if (!n.isRead)
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(color: AppColors.orangeSecurite, shape: BoxShape.circle),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTypeIcon(AppNotificationEntity n) {
    IconData icon;
    Color color;

    switch (n.type) {
      case NotificationType.STOCK_ALERTE:
        icon = LucideIcons.boxes;
        color = AppColors.warning;
        break;
      case NotificationType.PLANNING_RETARD:
        icon = LucideIcons.calendarClock;
        color = AppColors.danger;
        break;
      case NotificationType.HSE_URGENCE:
        icon = LucideIcons.shieldAlert;
        color = AppColors.danger;
        break;
      case NotificationType.FINANCE_ALERTE:
        icon = LucideIcons.banknote;
        color = AppColors.info;
        break;
      case NotificationType.SYSTEME:
        icon = LucideIcons.info;
        color = AppColors.acierBTP;
        break;
    }

    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Icon(icon, color: color, size: 20),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.bellOff, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text('Aucune notification pour le moment.'),
        ],
      ),
    );
  }
}
