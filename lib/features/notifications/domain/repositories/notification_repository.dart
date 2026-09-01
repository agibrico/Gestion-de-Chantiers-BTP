import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/notification_entity.dart';

abstract class NotificationRepository {
  Future<Either<Failure, List<AppNotificationEntity>>> getNotifications();
  
  Future<Either<Failure, void>> markAsRead(String id);
  
  Future<Either<Failure, void>> markAllAsRead();
  
  Future<Either<Failure, void>> deleteNotification(String id);
  
  Future<Either<Failure, int>> getUnreadCount();

  Future<Either<Failure, AppNotificationEntity>> pushNotification(AppNotificationEntity notification);
}
