import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../domain/entities/employee_entity.dart';
import '../../domain/entities/stakeholder_entity.dart';
import '../../domain/entities/team_entity.dart';
import '../../domain/repositories/resource_repository.dart';
import '../models/resource_models.dart';

class ResourceRepositoryImpl implements ResourceRepository {
  final IsarService isarService;

  ResourceRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, List<EmployeeEntity>>> getAllEmployees() async {
    try {
      final isar = await isarService.db;
      final models = await isar.employeeModels.where().findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, EmployeeEntity>> createEmployee(EmployeeEntity employee) async {
    try {
      final isar = await isarService.db;
      final model = EmployeeModel.fromEntity(employee);
      await isar.writeTxn(() => isar.employeeModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deleteEmployee(String id) async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() => isar.employeeModels.filter().remoteIdEqualTo(id).deleteFirst());
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<StakeholderEntity>>> getAllStakeholders() async {
    try {
      final isar = await isarService.db;
      final models = await isar.stakeholderModels.where().findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, StakeholderEntity>> createStakeholder(StakeholderEntity stakeholder) async {
    try {
      final isar = await isarService.db;
      final model = StakeholderModel.fromEntity(stakeholder);
      await isar.writeTxn(() => isar.stakeholderModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<TeamEntity>>> getAllTeams() async {
    try {
      final isar = await isarService.db;
      final models = await isar.teamModels.where().findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, TeamEntity>> createTeam(TeamEntity team) async {
    try {
      final isar = await isarService.db;
      final model = TeamModel.fromEntity(team);
      await isar.writeTxn(() => isar.teamModels.put(model));
      return Right(model.toEntity());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deleteTeam(String id) async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() => isar.teamModels.filter().remoteIdEqualTo(id).deleteFirst());
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }
}
