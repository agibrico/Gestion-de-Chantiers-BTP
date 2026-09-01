import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/project_photo_entity.dart';

abstract class PhotoRepository {
  Future<Either<Failure, List<ProjectPhotoEntity>>> getPhotosByProject(String projectId);
  
  Future<Either<Failure, ProjectPhotoEntity>> savePhoto(ProjectPhotoEntity photo);
  
  Future<Either<Failure, void>> deletePhoto(String id);
}
