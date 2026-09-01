import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/employee_entity.dart';
import '../entities/stakeholder_entity.dart';
import '../entities/team_entity.dart';

abstract class ResourceRepository {
  // Employees
  Future<Either<Failure, List<EmployeeEntity>>> getAllEmployees();
  Future<Either<Failure, EmployeeEntity>> createEmployee(EmployeeEntity employee);
  Future<Either<Failure, void>> deleteEmployee(String id);
  
  // Stakeholders
  Future<Either<Failure, List<StakeholderEntity>>> getAllStakeholders();
  Future<Either<Failure, StakeholderEntity>> createStakeholder(StakeholderEntity stakeholder);
  
  // Teams
  Future<Either<Failure, List<TeamEntity>>> getAllTeams();
  Future<Either<Failure, TeamEntity>> createTeam(TeamEntity team);
  Future<Either<Failure, void>> deleteTeam(String id);
}
