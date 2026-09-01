import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/project_repository.dart';
import '../../domain/entities/project_entity.dart';
import 'project_event.dart';
import 'project_state.dart';

class ProjectBloc extends Bloc<ProjectEvent, ProjectState> {
  final ProjectRepository projectRepository;

  ProjectBloc({required this.projectRepository}) : super(ProjectInitial()) {
    on<LoadProjects>(_onLoadProjects);
    on<SearchProjectsRequested>(_onSearchProjects);
    on<AddProjectRequested>(_onAddProject);
    on<UpdateProjectStatusRequested>(_onUpdateStatus);
  }

  Future<void> _onLoadProjects(LoadProjects event, Emitter<ProjectState> emit) async {
    emit(ProjectLoading());
    final result = await projectRepository.getAllProjects();
    result.fold(
      (failure) => emit(ProjectError(failure.message)),
      (projects) => emit(ProjectsLoaded(projects)),
    );
  }

  Future<void> _onSearchProjects(SearchProjectsRequested event, Emitter<ProjectState> emit) async {
    if (event.query.isEmpty) {
      add(LoadProjects());
      return;
    }
    emit(ProjectLoading());
    final result = await projectRepository.searchProjects(event.query);
    result.fold(
      (failure) => emit(ProjectError(failure.message)),
      (projects) => emit(ProjectsLoaded(projects)),
    );
  }

  Future<void> _onAddProject(AddProjectRequested event, Emitter<ProjectState> emit) async {
    emit(ProjectLoading());
    final result = await projectRepository.createProject(event.project);
    result.fold(
      (failure) => emit(ProjectError(failure.message)),
      (project) {
        emit(const ProjectOperationSuccess('Chantier ouvert avec succès.'));
        add(LoadProjects());
      },
    );
  }

  Future<void> _onUpdateStatus(UpdateProjectStatusRequested event, Emitter<ProjectState> emit) async {
    final getResult = await projectRepository.getProjectById(event.projectId);
    
    await getResult.fold(
      (failure) async => emit(ProjectError(failure.message)),
      (project) async {
        final updatedProject = ProjectEntity(
          id: project.id,
          projectNumber: project.projectNumber,
          name: project.name,
          clientId: project.clientId,
          clientName: project.clientName,
          description: project.description,
          address: project.address,
          city: project.city,
          latitude: project.latitude,
          longitude: project.longitude,
          projectType: project.projectType,
          surfaceArea: project.surfaceArea,
          levels: project.levels,
          budgetAllocated: project.budgetAllocated,
          startDate: project.startDate,
          endDate: project.endDate,
          status: event.newStatus,
          progressPercentage: project.progressPercentage,
          createdAt: project.createdAt,
          updatedAt: DateTime.now(),
        );
        
        final updateResult = await projectRepository.updateProject(updatedProject);
        updateResult.fold(
          (failure) => emit(ProjectError(failure.message)),
          (_) {
            emit(const ProjectOperationSuccess('Statut du chantier mis à jour.'));
            add(LoadProjects());
          },
        );
      },
    );
  }
}
