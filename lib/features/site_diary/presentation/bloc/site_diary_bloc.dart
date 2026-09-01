import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/site_diary_entity.dart';
import '../../domain/repositories/site_diary_repository.dart';

// Events
abstract class SiteDiaryEvent extends Equatable {
  const SiteDiaryEvent();
  @override
  List<Object?> get props => [];
}

class LoadProjectDiaryRequested extends SiteDiaryEvent {
  final String projectId;
  const LoadProjectDiaryRequested(this.projectId);
  @override
  List<Object?> get props => [projectId];
}

class SaveSiteDiaryRequested extends SiteDiaryEvent {
  final SiteDiaryEntry entry;
  const SaveSiteDiaryRequested(this.entry);
  @override
  List<Object?> get props => [entry];
}

// States
abstract class SiteDiaryState extends Equatable {
  const SiteDiaryState();
  @override
  List<Object?> get props => [];
}

class SiteDiaryInitial extends SiteDiaryState {}
class SiteDiaryLoading extends SiteDiaryState {}

class SiteDiaryLoaded extends SiteDiaryState {
  final List<SiteDiaryEntry> entries;
  const SiteDiaryLoaded(this.entries);
  @override
  List<Object?> get props => [entries];
}

class SiteDiaryOperationSuccess extends SiteDiaryState {
  final String message;
  const SiteDiaryOperationSuccess(this.message);
  @override
  List<Object?> get props => [message];
}

class SiteDiaryError extends SiteDiaryState {
  final String message;
  const SiteDiaryError(this.message);
  @override
  List<Object?> get props => [message];
}

// Bloc
class SiteDiaryBloc extends Bloc<SiteDiaryEvent, SiteDiaryState> {
  final SiteDiaryRepository siteDiaryRepository;

  SiteDiaryBloc({required this.siteDiaryRepository}) : super(SiteDiaryInitial()) {
    on<LoadProjectDiaryRequested>(_onLoadDiary);
    on<SaveSiteDiaryRequested>(_onSaveEntry);
  }

  Future<void> _onLoadDiary(LoadProjectDiaryRequested event, Emitter<SiteDiaryState> emit) async {
    emit(SiteDiaryLoading());
    final result = await siteDiaryRepository.getEntriesByProject(event.projectId);
    result.fold(
      (failure) => emit(SiteDiaryError(failure.message)),
      (entries) => emit(SiteDiaryLoaded(entries)),
    );
  }

  Future<void> _onSaveEntry(SaveSiteDiaryRequested event, Emitter<SiteDiaryState> emit) async {
    emit(SiteDiaryLoading());
    final result = await siteDiaryRepository.createEntry(event.entry);
    result.fold(
      (failure) => emit(SiteDiaryError(failure.message)),
      (_) {
        emit(const SiteDiaryOperationSuccess('Journal de chantier enregistré.'));
        add(LoadProjectDiaryRequested(event.entry.projectId));
      },
    );
  }
}
