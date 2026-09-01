import 'package:equatable/equatable.dart';

class ProjectPhotoEntity extends Equatable {
  final String id;
  final String projectId;
  final String projectName;
  final String filePath;
  final String? description;
  final double? latitude;
  final double? longitude;
  final DateTime date;
  final String authorName;
  final DateTime createdAt;

  const ProjectPhotoEntity({
    required this.id,
    required this.projectId,
    required this.projectName,
    required this.filePath,
    this.description,
    this.latitude,
    this.longitude,
    required this.date,
    required this.authorName,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [
        id,
        projectId,
        projectName,
        filePath,
        description,
        latitude,
        longitude,
        date,
        authorName,
        createdAt,
      ];
}
