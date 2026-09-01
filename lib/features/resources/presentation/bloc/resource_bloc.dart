import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/resource_repository.dart';
import 'resource_event.dart';
import 'resource_state.dart';

class ResourceBloc extends Bloc<ResourceEvent, ResourceState> {
  final ResourceRepository resourceRepository;

  ResourceBloc({required this.resourceRepository}) : super(ResourceInitial()) {
    on<LoadResources>(_onLoadResources);
    on<AddEmployeeRequested>(_onAddEmployee);
    on<AddStakeholderRequested>(_onAddStakeholder);
    on<AddTeamRequested>(_onAddTeam);
    on<DeleteTeamRequested>(_onDeleteTeam);
  }

  Future<void> _onLoadResources(LoadResources event, Emitter<ResourceState> emit) async {
    emit(ResourceLoading());
    
    final employeesRes = await resourceRepository.getAllEmployees();
    final stakeholdersRes = await resourceRepository.getAllStakeholders();
    final teamsRes = await resourceRepository.getAllTeams();

    employeesRes.fold(
      (failure) => emit(ResourceError(failure.message)),
      (employees) {
        stakeholdersRes.fold(
          (failure) => emit(ResourceError(failure.message)),
          (stakeholders) {
            teamsRes.fold(
              (failure) => emit(ResourceError(failure.message)),
              (teams) => emit(ResourcesLoaded(
                employees: employees,
                stakeholders: stakeholders,
                teams: teams,
              )),
            );
          },
        );
      },
    );
  }

  Future<void> _onAddEmployee(AddEmployeeRequested event, Emitter<ResourceState> emit) async {
    emit(ResourceLoading());
    final result = await resourceRepository.createEmployee(event.employee);
    result.fold(
      (failure) => emit(ResourceError(failure.message)),
      (_) {
        emit(const ResourceOperationSuccess('Employé enregistré.'));
        add(LoadResources());
      },
    );
  }

  Future<void> _onAddStakeholder(AddStakeholderRequested event, Emitter<ResourceState> emit) async {
    emit(ResourceLoading());
    final result = await resourceRepository.createStakeholder(event.stakeholder);
    result.fold(
      (failure) => emit(ResourceError(failure.message)),
      (_) {
        emit(const ResourceOperationSuccess('Intervenant enregistré.'));
        add(LoadResources());
      },
    );
  }

  Future<void> _onAddTeam(AddTeamRequested event, Emitter<ResourceState> emit) async {
    emit(ResourceLoading());
    final result = await resourceRepository.createTeam(event.team);
    result.fold(
      (failure) => emit(ResourceError(failure.message)),
      (_) {
        emit(const ResourceOperationSuccess('Équipe créée.'));
        add(LoadResources());
      },
    );
  }

  Future<void> _onDeleteTeam(DeleteTeamRequested event, Emitter<ResourceState> emit) async {
    emit(ResourceLoading());
    final result = await resourceRepository.deleteTeam(event.id);
    result.fold(
      (failure) => emit(ResourceError(failure.message)),
      (_) {
        emit(const ResourceOperationSuccess('Équipe supprimée.'));
        add(LoadResources());
      },
    );
  }
}
