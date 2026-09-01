import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/client_repository.dart';
import 'client_event.dart';
import 'client_state.dart';

class ClientBloc extends Bloc<ClientEvent, ClientState> {
  final ClientRepository clientRepository;

  ClientBloc({required this.clientRepository}) : super(ClientInitial()) {
    on<LoadClients>(_onLoadClients);
    on<SearchClientsRequested>(_onSearchClients);
    on<AddClientRequested>(_onAddClient);
    on<DeleteClientRequested>(_onDeleteClient);
  }

  Future<void> _onLoadClients(LoadClients event, Emitter<ClientState> emit) async {
    emit(ClientLoading());
    final result = await clientRepository.getAllClients();
    result.fold(
      (failure) => emit(ClientError(failure.message)),
      (clients) => emit(ClientsLoaded(clients)),
    );
  }

  Future<void> _onSearchClients(SearchClientsRequested event, Emitter<ClientState> emit) async {
    if (event.query.isEmpty) {
      add(LoadClients());
      return;
    }
    emit(ClientLoading());
    final result = await clientRepository.searchClients(event.query);
    result.fold(
      (failure) => emit(ClientError(failure.message)),
      (clients) => emit(ClientsLoaded(clients)),
    );
  }

  Future<void> _onAddClient(AddClientRequested event, Emitter<ClientState> emit) async {
    emit(ClientLoading());
    final result = await clientRepository.createClient(event.client);
    result.fold(
      (failure) => emit(ClientError(failure.message)),
      (client) {
        emit(const ClientOperationSuccess('Client enregistré avec succès.'));
        add(LoadClients());
      },
    );
  }

  Future<void> _onDeleteClient(DeleteClientRequested event, Emitter<ClientState> emit) async {
    emit(ClientLoading());
    final result = await clientRepository.deleteClient(event.id);
    result.fold(
      (failure) => emit(ClientError(failure.message)),
      (_) {
        emit(const ClientOperationSuccess('Client supprimé.'));
        add(LoadClients());
      },
    );
  }
}
