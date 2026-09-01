import 'package:uuid/uuid.dart';
import '../../features/notifications/domain/entities/notification_entity.dart';
import '../../features/notifications/domain/repositories/notification_repository.dart';

class NotificationService {
  final NotificationRepository repository;

  NotificationService({required this.repository});

  Future<void> notify({
    required String title,
    required String message,
    required NotificationType type,
    NotificationPriority priority = NotificationPriority.MOYENNE,
    String? relatedObjectId,
    String? route,
  }) async {
    final notification = AppNotificationEntity(
      id: const Uuid().v4(),
      title: title,
      message: message,
      type: type,
      priority: priority,
      date: DateTime.now(),
      isRead: false,
      relatedObjectId: relatedObjectId,
      route: route,
    );

    await repository.pushNotification(notification);
  }

  // Stock Alerts
  Future<void> notifyLowStock(String materialName, double currentStock, String unit) async {
    await notify(
      title: 'RUPTURE DE STOCK IMMINENTE',
      message: 'Le stock de $materialName est de seulement $currentStock $unit. Pensez à commander.',
      type: NotificationType.STOCK_ALERTE,
      priority: NotificationPriority.HAUTE,
      route: '/inventory',
    );
  }

  // Planning Alerts
  Future<void> notifyTaskDelayed(String taskName, String projectName) async {
    await notify(
      title: 'RETARD PLANNING',
      message: 'La tâche "$taskName" sur le chantier $projectName est en retard.',
      type: NotificationType.PLANNING_RETARD,
      priority: NotificationPriority.HAUTE,
    );
  }
}
