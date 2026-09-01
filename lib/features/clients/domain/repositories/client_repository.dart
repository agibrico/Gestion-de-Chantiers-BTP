import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/client_entity.dart';

abstract class ClientRepository {
  Future<Either<Failure, List<ClientEntity>>> getAllClients();
  
  Future<Either<Failure, ClientEntity>> getClientById(String id);
  
  Future<Either<Failure, ClientEntity>> createClient(ClientEntity client);
  
  Future<Either<Failure, ClientEntity>> updateClient(ClientEntity client);
  
  Future<Either<Failure, void>> deleteClient(String id);
  
  Future<Either<Failure, List<ClientEntity>>> searchClients(String query);
}
