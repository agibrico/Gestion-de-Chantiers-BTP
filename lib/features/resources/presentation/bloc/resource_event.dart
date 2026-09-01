import 'package:equatable/equatable.dart';
import '../../domain/entities/employee_entity.dart';
import '../../domain/entities/stakeholder_entity.dart';
import '../../domain/entities/team_entity.dart';

abstract class ResourceEvent extends Equatable {
  const ResourceEvent();

  @override
  List<Object?> get props => [];
}

class LoadResources extends ResourceEvent {}

// Employees
class AddEmployeeRequested extends ResourceEvent {
  final EmployeeEntity employee;
  const AddEmployeeRequested(this.employee);

  @override
  List<Object?> get props => [employee];
}

// Stakeholders
class AddStakeholderRequested extends ResourceEvent {
  final StakeholderEntity stakeholder;
  const AddStakeholderRequested(this.stakeholder);

  @override
  List<Object?> get props => [stakeholder];
}

// Teams
class AddTeamRequested extends ResourceEvent {
  final TeamEntity team;
  const AddTeamRequested(this.team);

  @override
  List<Object?> get props => [team];
}

class DeleteTeamRequested extends ResourceEvent {
  final String id;
  const DeleteTeamRequested(this.id);

  @override
  List<Object?> get props => [id];
}
