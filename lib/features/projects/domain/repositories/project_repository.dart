import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/project_entity.dart';

abstract class ProjectRepository {
  Future<Either<Failure, List<ProjectEntity>>> getAllProjects();
  
  Future<Either<Failure, ProjectEntity>> getProjectById(String id);
  
  Future<Either<Failure, ProjectEntity>> createProject(ProjectEntity project);
  
  Future<Either<Failure, ProjectEntity>> updateProject(ProjectEntity project);
  
  Future<Either<Failure, void>> deleteProject(String id);
  
  Future<Either<Failure, List<ProjectEntity>>> getProjectsByClient(String clientId);
  
  Future<Either<Failure, List<ProjectEntity>>> searchProjects(String query);
}
