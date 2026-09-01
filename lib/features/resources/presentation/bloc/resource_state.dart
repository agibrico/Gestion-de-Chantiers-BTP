import 'package:equatable/equatable.dart';
import '../../domain/entities/employee_entity.dart';
import '../../domain/entities/stakeholder_entity.dart';
import '../../domain/entities/team_entity.dart';

abstract class ResourceState extends Equatable {
  const ResourceState();
  
  @override
  List<Object?> get props => [];
}

class ResourceInitial extends ResourceState {}

class ResourceLoading extends ResourceState {}

class ResourcesLoaded extends ResourceState {
  final List<EmployeeEntity> employees;
  final List<StakeholderEntity> stakeholders;
  final List<TeamEntity> teams;

  const ResourcesLoaded({
    required this.employees,
    required this.stakeholders,
    required this.teams,
  });

  @override
  List<Object?> get props => [employees, stakeholders, teams];
}

class ResourceOperationSuccess extends ResourceState {
  final String message;
  const ResourceOperationSuccess(this.message);

  @override
  List<Object?> get props => [message];
}

class ResourceError extends ResourceState {
  final String message;
  const ResourceError(this.message);

  @override
  List<Object?> get props => [message];
}
