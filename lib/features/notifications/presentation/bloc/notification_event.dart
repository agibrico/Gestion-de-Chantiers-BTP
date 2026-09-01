import 'package:equatable/equatable.dart';

abstract class NotificationEvent extends Equatable {
  const NotificationEvent();
  @override
  List<Object?> get props => [];
}

class LoadNotificationsRequested extends NotificationEvent {}

class MarkAsReadRequested extends NotificationEvent {
  final String notificationId;
  const MarkAsReadRequested(this.notificationId);
  @override
  List<Object?> get props => [notificationId];
}

class MarkAllAsReadRequested extends NotificationEvent {}

class DeleteNotificationRequested extends NotificationEvent {
  final String notificationId;
  const DeleteNotificationRequested(this.notificationId);
  @override
  List<Object?> get props => [notificationId];
}
