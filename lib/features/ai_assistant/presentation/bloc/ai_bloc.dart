import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/entities/ai_message_entity.dart';
import '../../domain/repositories/ai_repository.dart';

// Events
abstract class AiEvent extends Equatable {
  const AiEvent();
  @override
  List<Object?> get props => [];
}

class LoadChatHistoryRequested extends AiEvent {}
class SendUserPromptRequested extends AiEvent {
  final String prompt;
  const SendUserPromptRequested(this.prompt);
  @override
  List<Object?> get props => [prompt];
}
class ClearChatRequested extends AiEvent {}

// States
abstract class AiState extends Equatable {
  const AiState();
  @override
  List<Object?> get props => [];
}

class AiInitial extends AiState {}
class AiLoading extends AiState {}
class AiLoaded extends AiState {
  final List<AiMessageEntity> messages;
  final bool isGenerating;

  const AiLoaded(this.messages, {this.isGenerating = false});

  @override
  List<Object?> get props => [messages, isGenerating];
}
class AiError extends AiState {
  final String message;
  const AiError(this.message);
}

// Bloc
class AiBloc extends Bloc<AiEvent, AiState> {
  final AiRepository repository;

  AiBloc({required this.repository}) : super(AiInitial()) {
    on<LoadChatHistoryRequested>(_onLoadHistory);
    on<SendUserPromptRequested>(_onSendMessage);
    on<ClearChatRequested>(_onClearChat);
  }

  Future<void> _onLoadHistory(LoadChatHistoryRequested event, Emitter<AiState> emit) async {
    emit(AiLoading());
    final result = await repository.getChatHistory();
    result.fold(
      (failure) => emit(AiError(failure.message)),
      (messages) => emit(AiLoaded(messages)),
    );
  }

  Future<void> _onSendMessage(SendUserPromptRequested event, Emitter<AiState> emit) async {
    final currentMessages = state is AiLoaded ? (state as AiLoaded).messages : <AiMessageEntity>[];
    
    // Add user message immediately
    final updatedMessages = List<AiMessageEntity>.from(currentMessages)
      ..add(AiMessageEntity(
        id: 'temp',
        content: event.prompt,
        role: AiMessageRole.user,
        timestamp: DateTime.now(),
      ));
    
    emit(AiLoaded(updatedMessages, isGenerating: true));

    final result = await repository.askAssistant(event.prompt);
    
    result.fold(
      (failure) => emit(AiError(failure.message)),
      (_) {
        add(LoadChatHistoryRequested()); // Refresh to get proper IDs and assistant response
      },
    );
  }

  Future<void> _onClearChat(ClearChatRequested event, Emitter<AiState> emit) async {
    await repository.clearHistory();
    emit(const AiLoaded([]));
  }
}
