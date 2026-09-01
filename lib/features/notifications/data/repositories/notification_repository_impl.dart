import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../domain/entities/notification_entity.dart';
import '../../domain/repositories/notification_repository.dart';
import '../models/notification_model.dart';

class NotificationRepositoryImpl implements NotificationRepository {
  final IsarService isarService;

  NotificationRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, List<AppNotificationEntity>>> getNotifications() async {
    try {
      final isar = await isarService.db;
      final models = await isar.notificationModels.where().sortByDateDesc().findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> markAsRead(String id) async {
    try {
      final isar = await isarService.db;
      final existing = await isar.notificationModels.filter().remoteIdEqualTo(id).findFirst();
      if (existing != null) {
        existing.isRead = true;
        await isar.writeTxn(() => isar.notificationModels.put(existing));
      }
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> markAllAsRead() async {
    try {
      final isar = await isarService.db;
      final unread = await isar.notificationModels.filter().isReadEqualTo(false).findAll();
      for (final n in unread) {
        n.isRead = true;
      }
      await isar.writeTxn(() => isar.notificationModels.putAll(unread));
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deleteNotification(String id) async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() => isar.notificationModels.filter().remoteIdEqualTo(id).deleteFirst());
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, int>> getUnreadCount() async {
    try {
      final isar = await isarService.db;
      final count = await isar.notificationModels.filter().isReadEqualTo(false).count();
      return Right(count);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, AppNotificationEntity>> pushNotification(AppNotificationEntity notification) async {
    try {
      final isar = await isarService.db;
      final model = NotificationModel.fromEntity(notification);
      await isar.writeTxn(() => isar.notificationModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }
}
