import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/services/sync_service.dart';
import '../../../../core/services/connectivity_service.dart';

// Events
abstract class SyncEvent extends Equatable {
  const SyncEvent();
  @override
  List<Object?> get props => [];
}

class StartGlobalSyncRequested extends SyncEvent {}
class ConnectivityChanged extends SyncEvent {
  final AppConnectivityStatus status;
  const ConnectivityChanged(this.status);
  @override
  List<Object?> get props => [status];
}

// States
enum SyncStatus { idle, syncing, success, error, offline }

class SyncState extends Equatable {
  final SyncStatus status;
  final String? lastSyncTime;
  final String? errorMessage;

  const SyncState({
    required this.status,
    this.lastSyncTime,
    this.errorMessage,
  });

  factory SyncState.initial() => const SyncState(status: SyncStatus.idle);

  @override
  List<Object?> get props => [status, lastSyncTime, errorMessage];
}

// Bloc
class SyncBloc extends Bloc<SyncEvent, SyncState> {
  final SyncService syncService;
  final ConnectivityService connectivityService;

  SyncBloc({
    required this.syncService,
    required this.connectivityService,
  }) : super(SyncState.initial()) {
    
    // Listen to connectivity changes automatically
    connectivityService.statusStream.listen((status) {
      add(ConnectivityChanged(status));
    });

    on<ConnectivityChanged>((event, emit) {
      if (event.status == AppConnectivityStatus.online) {
        add(StartGlobalSyncRequested());
      } else {
        emit(const SyncState(status: SyncStatus.offline));
      }
    });

    on<StartGlobalSyncRequested>(_onStartSync);
  }

  Future<void> _onStartSync(StartGlobalSyncRequested event, Emitter<SyncState> emit) async {
    if (state.status == SyncStatus.syncing) return;
    
    final isOnline = await connectivityService.isOnline;
    if (!isOnline) {
      emit(const SyncState(status: SyncStatus.offline));
      return;
    }

    emit(const SyncState(status: SyncStatus.syncing));
    
    try {
      await syncService.syncAll();
      await syncService.fetchUpdates();
      
      emit(SyncState(
        status: SyncStatus.success,
        lastSyncTime: DateTime.now().toIso8601String(),
      ));
    } catch (e) {
      emit(SyncState(status: SyncStatus.error, errorMessage: e.toString()));
    }
  }
}
