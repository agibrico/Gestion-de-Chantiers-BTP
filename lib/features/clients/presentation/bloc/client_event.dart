import 'package:equatable/equatable.dart';
import '../../domain/entities/client_entity.dart';

abstract class ClientEvent extends Equatable {
  const ClientEvent();

  @override
  List<Object?> get props => [];
}

class LoadClients extends ClientEvent {}

class SearchClientsRequested extends ClientEvent {
  final String query;
  const SearchClientsRequested(this.query);

  @override
  List<Object?> get props => [query];
}

class AddClientRequested extends ClientEvent {
  final ClientEntity client;
  const AddClientRequested(this.client);

  @override
  List<Object?> get props => [client];
}

class DeleteClientRequested extends ClientEvent {
  final String id;
  const DeleteClientRequested(this.id);

  @override
  List<Object?> get props => [id];
}
