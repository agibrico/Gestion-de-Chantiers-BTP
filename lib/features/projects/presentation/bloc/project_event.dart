import 'package:equatable/equatable.dart';
import '../../domain/entities/project_entity.dart';

abstract class ProjectEvent extends Equatable {
  const ProjectEvent();

  @override
  List<Object?> get props => [];
}

class LoadProjects extends ProjectEvent {}

class SearchProjectsRequested extends ProjectEvent {
  final String query;
  const SearchProjectsRequested(this.query);

  @override
  List<Object?> get props => [query];
}

class AddProjectRequested extends ProjectEvent {
  final ProjectEntity project;
  const AddProjectRequested(this.project);

  @override
  List<Object?> get props => [project];
}

class UpdateProjectStatusRequested extends ProjectEvent {
  final String projectId;
  final ProjectStatus newStatus;

  const UpdateProjectStatusRequested({
    required this.projectId,
    required this.newStatus,
  });

  @override
  List<Object?> get props => [projectId, newStatus];
}
