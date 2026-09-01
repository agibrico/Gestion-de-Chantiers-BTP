import 'package:equatable/equatable.dart';

enum NotificationType {
  STOCK_ALERTE,
  PLANNING_RETARD,
  HSE_URGENCE,
  FINANCE_ALERTE,
  SYSTEME,
}

enum NotificationPriority {
  BASSE,
  MOYENNE,
  HAUTE,
  CRITIQUE,
}

class AppNotificationEntity extends Equatable {
  final String id;
  final String title;
  final String message;
  final NotificationType type;
  final NotificationPriority priority;
  final DateTime date;
  final bool isRead;
  final String? relatedObjectId; // ID de l'élément concerné (ex: materialId)
  final String? route; // Route pour la navigation contextuelle

  const AppNotificationEntity({
    required this.id,
    required this.title,
    required this.message,
    required this.type,
    required this.priority,
    required this.date,
    required this.isRead,
    this.relatedObjectId,
    this.route,
  });

  AppNotificationEntity copyWith({
    bool? isRead,
  }) {
    return AppNotificationEntity(
      id: id,
      title: title,
      message: message,
      type: type,
      priority: priority,
      date: date,
      isRead: isRead ?? this.isRead,
      relatedObjectId: relatedObjectId,
      route: route,
    );
  }

  @override
  List<Object?> get props => [
        id,
        title,
        message,
        type,
        priority,
        date,
        isRead,
        relatedObjectId,
        route,
      ];
}
