import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/project_document_entity.dart';

abstract class DocumentRepository {
  Future<Either<Failure, List<ProjectDocumentEntity>>> getDocumentsByProject(String projectId);
  
  Future<Either<Failure, ProjectDocumentEntity>> saveDocument(ProjectDocumentEntity document);
  
  Future<Either<Failure, void>> deleteDocument(String id);
  
  Future<Either<Failure, List<ProjectDocumentEntity>>> searchDocuments(String projectId, String query);
}
