import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/notification_repository.dart';
import 'notification_event.dart';
import 'notification_state.dart';

class NotificationBloc extends Bloc<NotificationEvent, NotificationState> {
  final NotificationRepository repository;

  NotificationBloc({required this.repository}) : super(NotificationInitial()) {
    on<LoadNotificationsRequested>(_onLoad);
    on<MarkAsReadRequested>(_onMarkAsRead);
    on<MarkAllAsReadRequested>(_onMarkAllAsRead);
    on<DeleteNotificationRequested>(_onDelete);
  }

  Future<void> _onLoad(LoadNotificationsRequested event, Emitter<NotificationState> emit) async {
    emit(NotificationLoading());
    await _refresh(emit);
  }

  Future<void> _onMarkAsRead(MarkAsReadRequested event, Emitter<NotificationState> emit) async {
    await repository.markAsRead(event.notificationId);
    await _refresh(emit);
  }

  Future<void> _onMarkAllAsRead(MarkAllAsReadRequested event, Emitter<NotificationState> emit) async {
    await repository.markAllAsRead();
    await _refresh(emit);
  }

  Future<void> _onDelete(DeleteNotificationRequested event, Emitter<NotificationState> emit) async {
    await repository.deleteNotification(event.notificationId);
    await _refresh(emit);
  }

  Future<void> _refresh(Emitter<NotificationState> emit) async {
    final listResult = await repository.getNotifications();
    final countResult = await repository.getUnreadCount();

    listResult.fold(
      (failure) => emit(NotificationError(failure.message)),
      (notifications) {
        countResult.fold(
          (failure) => emit(NotificationError(failure.message)),
          (count) => emit(NotificationsLoaded(notifications, count)),
        );
      },
    );
  }
}
