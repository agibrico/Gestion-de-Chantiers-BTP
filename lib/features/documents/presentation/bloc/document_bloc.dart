import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/document_repository.dart';
import 'document_event.dart';
import 'document_state.dart';

class DocumentBloc extends Bloc<DocumentEvent, DocumentState> {
  final DocumentRepository documentRepository;

  DocumentBloc({required this.documentRepository}) : super(DocumentInitial()) {
    on<LoadProjectDocumentsRequested>(_onLoadDocuments);
    on<SaveDocumentRequested>(_onSaveDocument);
    on<DeleteDocumentRequested>(_onDeleteDocument);
    on<SearchDocumentsRequested>(_onSearchDocuments);
  }

  Future<void> _onLoadDocuments(LoadProjectDocumentsRequested event, Emitter<DocumentState> emit) async {
    emit(DocumentLoading());
    final result = await documentRepository.getDocumentsByProject(event.projectId);
    result.fold(
      (failure) => emit(DocumentError(failure.message)),
      (docs) => emit(DocumentsLoaded(docs)),
    );
  }

  Future<void> _onSaveDocument(SaveDocumentRequested event, Emitter<DocumentState> emit) async {
    final result = await documentRepository.saveDocument(event.document);
    result.fold(
      (failure) => emit(DocumentError(failure.message)),
      (_) {
        emit(const DocumentOperationSuccess('Document archivé avec succès.'));
        add(LoadProjectDocumentsRequested(event.document.projectId));
      },
    );
  }

  Future<void> _onDeleteDocument(DeleteDocumentRequested event, Emitter<DocumentState> emit) async {
    final result = await documentRepository.deleteDocument(event.documentId);
    result.fold(
      (failure) => emit(DocumentError(failure.message)),
      (_) {
        emit(const DocumentOperationSuccess('Document supprimé.'));
        add(LoadProjectDocumentsRequested(event.projectId));
      },
    );
  }

  Future<void> _onSearchDocuments(SearchDocumentsRequested event, Emitter<DocumentState> emit) async {
    if (event.query.isEmpty) {
      add(LoadProjectDocumentsRequested(event.projectId));
      return;
    }
    emit(DocumentLoading());
    final result = await documentRepository.searchDocuments(event.projectId, event.query);
    result.fold(
      (failure) => emit(DocumentError(failure.message)),
      (docs) => emit(DocumentsLoaded(docs)),
    );
  }
}
