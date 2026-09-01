import 'dart:io';
import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../domain/entities/project_document_entity.dart';
import '../../domain/repositories/document_repository.dart';
import '../models/document_model.dart';

class DocumentRepositoryImpl implements DocumentRepository {
  final IsarService isarService;

  DocumentRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, List<ProjectDocumentEntity>>> getDocumentsByProject(String projectId) async {
    try {
      final isar = await isarService.db;
      final models = await isar.projectDocumentModels
          .filter()
          .projectIdEqualTo(projectId)
          .sortByDateAddedDesc()
          .findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, ProjectDocumentEntity>> saveDocument(ProjectDocumentEntity document) async {
    try {
      final isar = await isarService.db;
      
      // On déplace le fichier dans le dossier de l'application pour la GED locale
      final appDir = await getApplicationDocumentsDirectory();
      final gedDir = Directory(p.join(appDir.path, 'GED', document.projectId));
      if (!await gedDir.exists()) {
        await gedDir.create(recursive: true);
      }
      
      final sourceFile = File(document.filePath);
      final destPath = p.join(gedDir.path, '${DateTime.now().millisecondsSinceEpoch}_${document.fileName}');
      await sourceFile.copy(destPath);

      // Création du modèle avec le nouveau chemin
      final docWithNewPath = ProjectDocumentEntity(
        id: document.id,
        projectId: document.projectId,
        projectName: document.projectName,
        title: document.title,
        type: document.type,
        filePath: destPath,
        fileName: document.fileName,
        fileSize: document.fileSize,
        version: document.version,
        dateAdded: document.dateAdded,
        authorName: document.authorName,
        createdAt: document.createdAt,
      );

      final model = ProjectDocumentModel.fromEntity(docWithNewPath);
      await isar.writeTxn(() => isar.projectDocumentModels.put(model));
      
      return Right(docWithNewPath);
    } catch (e) {
      return const Left(CacheFailure('Erreur lors de l\'archivage du document.'));
    }
  }

  @override
  Future<Either<Failure, void>> deleteDocument(String id) async {
    try {
      final isar = await isarService.db;
      final existing = await isar.projectDocumentModels.filter().remoteIdEqualTo(id).findFirst();
      
      if (existing != null) {
        // Supprimer le fichier physique
        final file = File(existing.filePath);
        if (await file.exists()) {
          await file.delete();
        }
        
        // Supprimer l'entrée Isar
        await isar.writeTxn(() => isar.projectDocumentModels.filter().remoteIdEqualTo(id).deleteFirst());
      }
      
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<ProjectDocumentEntity>>> searchDocuments(String projectId, String query) async {
    try {
      final isar = await isarService.db;
      final models = await isar.projectDocumentModels
          .filter()
          .projectIdEqualTo(projectId)
          .and()
          .group((q) => q.titleContains(query, caseSensitive: false)
                        .or()
                        .fileNameContains(query, caseSensitive: false))
          .findAll();
      return Right(models.map((m) => m.toEntity()).toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }
}
