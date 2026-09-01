import 'package:equatable/equatable.dart';

enum DocumentType {
  PLAN,
  DEVIS,
  FACTURE,
  CONTRAT,
  RAPPORT,
  AUTRE,
}

class ProjectDocumentEntity extends Equatable {
  final String id;
  final String projectId;
  final String projectName;
  final String title;
  final DocumentType type;
  final String filePath; // Chemin local du fichier
  final String fileName;
  final double fileSize; // en Ko ou Mo
  final String? version;
  final DateTime dateAdded;
  final String authorName;
  final DateTime createdAt;

  const ProjectDocumentEntity({
    required this.id,
    required this.projectId,
    required this.projectName,
    required this.title,
    required this.type,
    required this.filePath,
    required this.fileName,
    required this.fileSize,
    this.version,
    required this.dateAdded,
    required this.authorName,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [
        id,
        projectId,
        projectName,
        title,
        type,
        filePath,
        fileName,
        fileSize,
        version,
        dateAdded,
        authorName,
        createdAt,
      ];
}
