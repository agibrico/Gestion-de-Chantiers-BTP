import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/analytics_entity.dart';
import '../../domain/repositories/analytics_repository.dart';

// Events
abstract class AnalyticsEvent extends Equatable {
  const AnalyticsEvent();
  @override
  List<Object?> get props => [];
}

class LoadGlobalAnalyticsRequested extends AnalyticsEvent {}

// States
abstract class AnalyticsState extends Equatable {
  const AnalyticsState();
  @override
  List<Object?> get props => [];
}

class AnalyticsInitial extends AnalyticsState {}
class AnalyticsLoading extends AnalyticsState {}
class AnalyticsLoaded extends AnalyticsState {
  final GlobalAnalytics analytics;
  const AnalyticsLoaded(this.analytics);
  @override
  List<Object?> get props => [analytics];
}
class AnalyticsError extends AnalyticsState {
  final String message;
  const AnalyticsError(this.message);
  @override
  List<Object?> get props => [message];
}

// Bloc
class AnalyticsBloc extends Bloc<AnalyticsEvent, AnalyticsState> {
  final AnalyticsRepository repository;

  AnalyticsBloc({required this.repository}) : super(AnalyticsInitial()) {
    on<LoadGlobalAnalyticsRequested>(_onLoad);
  }

  Future<void> _onLoad(LoadGlobalAnalyticsRequested event, Emitter<AnalyticsState> emit) async {
    emit(AnalyticsLoading());
    final result = await repository.getGlobalAnalytics();
    result.fold(
      (failure) => emit(AnalyticsError(failure.message)),
      (analytics) => emit(AnalyticsLoaded(analytics)),
    );
  }
}
