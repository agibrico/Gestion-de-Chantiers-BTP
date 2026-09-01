import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/handover_repository.dart';
import 'handover_event.dart';
import 'handover_state.dart';

class HandoverBloc extends Bloc<HandoverEvent, HandoverState> {
  final HandoverRepository handoverRepository;

  HandoverBloc({required this.handoverRepository}) : super(HandoverInitial()) {
    on<LoadProjectHandoversRequested>(_onLoadHandovers);
    on<SaveHandoverRequested>(_onSaveHandover);
  }

  Future<void> _onLoadHandovers(LoadProjectHandoversRequested event, Emitter<HandoverState> emit) async {
    emit(HandoverLoading());
    final result = await handoverRepository.getHandoversByProject(event.projectId);
    result.fold(
      (failure) => emit(HandoverError(failure.message)),
      (handovers) => emit(HandoversLoaded(handovers)),
    );
  }

  Future<void> _onSaveHandover(SaveHandoverRequested event, Emitter<HandoverState> emit) async {
    emit(HandoverLoading());
    final result = await handoverRepository.saveHandover(event.handover);
    result.fold(
      (failure) => emit(HandoverError(failure.message)),
      (_) {
        emit(const HandoverOperationSuccess('Procès-verbal de réception enregistré.'));
        add(LoadProjectHandoversRequested(event.handover.projectId));
      },
    );
  }
}
