import 'package:equatable/equatable.dart';

enum HandoverType {
  PROVISOIRE,
  DEFINITIVE,
}

class HandoverParticipant extends Equatable {
  final String name;
  final String role; // Ex: Client, AGB, Maître d'œuvre
  final bool hasSigned;

  const HandoverParticipant({
    required this.name,
    required this.role,
    required this.hasSigned,
  });

  @override
  List<Object?> get props => [name, role, hasSigned];
}

class HandoverReserve extends Equatable {
  final String description;
  final bool isResolved;
  final DateTime? resolutionDate;

  const HandoverReserve({
    required this.description,
    required this.isResolved,
    this.resolutionDate,
  });

  @override
  List<Object?> get props => [description, isResolved, resolutionDate];
}

class HandoverEntity extends Equatable {
  final String id;
  final String projectId;
  final String projectName;
  final DateTime date;
  final HandoverType type;
  final List<HandoverParticipant> participants;
  final List<HandoverReserve> reserves;
  final String observations;
  final bool isCompleted;
  final DateTime createdAt;
  final DateTime updatedAt;

  const HandoverEntity({
    required this.id,
    required this.projectId,
    required this.projectName,
    required this.date,
    required this.type,
    required this.participants,
    required this.reserves,
    required this.observations,
    required this.isCompleted,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        projectId,
        projectName,
        date,
        type,
        participants,
        reserves,
        observations,
        isCompleted,
        createdAt,
        updatedAt,
      ];
}
