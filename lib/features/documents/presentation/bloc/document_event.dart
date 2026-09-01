import 'package:equatable/equatable.dart';
import '../../domain/entities/project_document_entity.dart';

abstract class DocumentEvent extends Equatable {
  const DocumentEvent();
  @override
  List<Object?> get props => [];
}

class LoadProjectDocumentsRequested extends DocumentEvent {
  final String projectId;
  const LoadProjectDocumentsRequested(this.projectId);
  @override
  List<Object?> get props => [projectId];
}

class SaveDocumentRequested extends DocumentEvent {
  final ProjectDocumentEntity document;
  const SaveDocumentRequested(this.document);
  @override
  List<Object?> get props => [document];
}

class DeleteDocumentRequested extends DocumentEvent {
  final String documentId;
  final String projectId;
  const DeleteDocumentRequested(this.documentId, this.projectId);
  @override
  List<Object?> get props => [documentId, projectId];
}

class SearchDocumentsRequested extends DocumentEvent {
  final String projectId;
  final String query;
  const SearchDocumentsRequested(this.projectId, this.query);
  @override
  List<Object?> get props => [projectId, query];
}
