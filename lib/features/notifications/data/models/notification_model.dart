import 'package:isar/isar.dart';
import '../../domain/entities/notification_entity.dart';

part 'notification_model.g.dart';

@collection
class NotificationModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  late String title;
  late String message;

  @enumerated
  late NotificationType type;

  @enumerated
  late NotificationPriority priority;

  @Index()
  late DateTime date;

  @Index()
  late bool isRead;

  String? relatedObjectId;
  String? route;

  AppNotificationEntity toEntity() {
    return AppNotificationEntity(
      id: remoteId,
      title: title,
      message: message,
      type: type,
      priority: priority,
      date: date,
      isRead: isRead,
      relatedObjectId: relatedObjectId,
      route: route,
    );
  }

  static NotificationModel fromEntity(AppNotificationEntity entity) {
    final model = NotificationModel();
    model.remoteId = entity.id;
    model.title = entity.title;
    model.message = entity.message;
    model.type = entity.type;
    model.priority = entity.priority;
    model.date = entity.date;
    model.isRead = entity.isRead;
    model.relatedObjectId = entity.relatedObjectId;
    model.route = entity.route;
    return model;
  }
}
