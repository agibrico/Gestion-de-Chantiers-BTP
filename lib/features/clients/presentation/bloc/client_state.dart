import 'package:equatable/equatable.dart';
import '../../domain/entities/client_entity.dart';

abstract class ClientState extends Equatable {
  const ClientState();
  
  @override
  List<Object?> get props => [];
}

class ClientInitial extends ClientState {}

class ClientLoading extends ClientState {}

class ClientsLoaded extends ClientState {
  final List<ClientEntity> clients;
  const ClientsLoaded(this.clients);

  @override
  List<Object?> get props => [clients];
}

class ClientOperationSuccess extends ClientState {
  final String message;
  const ClientOperationSuccess(this.message);

  @override
  List<Object?> get props => [message];
}

class ClientError extends ClientState {
  final String message;
  const ClientError(this.message);

  @override
  List<Object?> get props => [message];
}
