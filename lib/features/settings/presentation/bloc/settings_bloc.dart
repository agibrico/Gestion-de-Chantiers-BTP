import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/repositories/settings_repository.dart';
import '../../../../core/services/backup_service.dart';

// Events
abstract class SettingsEvent extends Equatable {
  const SettingsEvent();
  @override
  List<Object?> get props => [];
}

class LoadSettingsRequested extends SettingsEvent {}
class ToggleDarkModeRequested extends SettingsEvent {
  final bool enabled;
  const ToggleDarkModeRequested(this.enabled);
  @override
  List<Object?> get props => [enabled];
}
class CreateBackupRequested extends SettingsEvent {}
class RestoreBackupRequested extends SettingsEvent {}

// States
class SettingsState extends Equatable {
  final bool isDarkMode;
  final bool notificationsEnabled;
  final String language;
  final bool isProcessing;
  final String? message;

  const SettingsState({
    required this.isDarkMode,
    required this.notificationsEnabled,
    required this.language,
    this.isProcessing = false,
    this.message,
  });

  factory SettingsState.initial() => const SettingsState(
    isDarkMode: false,
    notificationsEnabled: true,
    language: 'fr',
  );

  SettingsState copyWith({
    bool? isDarkMode,
    bool? notificationsEnabled,
    String? language,
    bool? isProcessing,
    String? message,
  }) {
    return SettingsState(
      isDarkMode: isDarkMode ?? this.isDarkMode,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      language: language ?? this.language,
      isProcessing: isProcessing ?? this.isProcessing,
      message: message,
    );
  }

  @override
  List<Object?> get props => [isDarkMode, notificationsEnabled, language, isProcessing, message];
}

// Bloc
class SettingsBloc extends Bloc<SettingsEvent, SettingsState> {
  final SettingsRepository repository;
  final BackupService backupService;

  SettingsBloc({
    required this.repository,
    required this.backupService,
  }) : super(SettingsState.initial()) {
    on<LoadSettingsRequested>(_onLoad);
    on<ToggleDarkModeRequested>(_onToggleDarkMode);
    on<CreateBackupRequested>(_onCreateBackup);
    on<RestoreBackupRequested>(_onRestoreBackup);
  }

  void _onLoad(LoadSettingsRequested event, Emitter<SettingsState> emit) {
    emit(state.copyWith(
      isDarkMode: repository.isDarkMode(),
      notificationsEnabled: repository.notificationsEnabled(),
      language: repository.getLanguage(),
    ));
  }

  Future<void> _onToggleDarkMode(ToggleDarkModeRequested event, Emitter<SettingsState> emit) async {
    await repository.setDarkMode(event.enabled);
    emit(state.copyWith(isDarkMode: event.enabled));
  }

  Future<void> _onCreateBackup(CreateBackupRequested event, Emitter<SettingsState> emit) async {
    emit(state.copyWith(isProcessing: true));
    try {
      await backupService.createBackup();
      emit(state.copyWith(isProcessing: false, message: 'Sauvegarde terminée.'));
    } catch (e) {
      emit(state.copyWith(isProcessing: false, message: 'Erreur sauvegarde.'));
    }
  }

  Future<void> _onRestoreBackup(RestoreBackupRequested event, Emitter<SettingsState> emit) async {
    emit(state.copyWith(isProcessing: true));
    try {
      final success = await backupService.restoreBackup();
      if (success) {
        emit(state.copyWith(isProcessing: false, message: 'Restauration réussie. Redémarrage requis.'));
      } else {
        emit(state.copyWith(isProcessing: false, message: 'Restauration annulée.'));
      }
    } catch (e) {
      emit(state.copyWith(isProcessing: false, message: 'Erreur lors de la restauration.'));
    }
  }
}
