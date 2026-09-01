import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../domain/entities/client_entity.dart';
import '../../domain/repositories/client_repository.dart';
import '../models/client_model.dart';

class ClientRepositoryImpl implements ClientRepository {
  final IsarService isarService;

  ClientRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, List<ClientEntity>>> getAllClients() async {
    try {
      final isar = await isarService.db;
      final models = await isar.clientModels.where().sortByCreatedAtDesc().findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure('Impossible de charger les clients.'));
    }
  }

  @override
  Future<Either<Failure, ClientEntity>> getClientById(String id) async {
    try {
      final isar = await isarService.db;
      final model = await isar.clientModels.filter().remoteIdEqualTo(id).findFirst();
      if (model != null) {
        return Right(model.toEntity());
      }
      return const Left(CacheFailure('Client non trouvé.'));
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, ClientEntity>> createClient(ClientEntity client) async {
    try {
      final isar = await isarService.db;
      final model = ClientModel.fromEntity(client);
      
      await isar.writeTxn(() async {
        await isar.clientModels.put(model);
      });
      
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure('Échec de la création du client.'));
    }
  }

  @override
  Future<Either<Failure, ClientEntity>> updateClient(ClientEntity client) async {
    try {
      final isar = await isarService.db;
      final existing = await isar.clientModels.filter().remoteIdEqualTo(client.id).findFirst();
      
      if (existing == null) return const Left(CacheFailure('Client non existant.'));
      
      final model = ClientModel.fromEntity(client);
      model.id = existing.id; // Keep same internal Isar ID
      
      await isar.writeTxn(() async {
        await isar.clientModels.put(model);
      });
      
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure('Échec de la mise à jour du client.'));
    }
  }

  @override
  Future<Either<Failure, void>> deleteClient(String id) async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() async {
        await isar.clientModels.filter().remoteIdEqualTo(id).deleteFirst();
      });
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure('Échec de la suppression.'));
    }
  }

  @override
  Future<Either<Failure, List<ClientEntity>>> searchClients(String query) async {
    try {
      final isar = await isarService.db;
      final models = await isar.clientModels
          .filter()
          .nameContains(query, caseSensitive: false)
          .or()
          .clientNumberContains(query, caseSensitive: false)
          .findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }
}
