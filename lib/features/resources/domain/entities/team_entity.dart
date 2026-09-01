import 'package:equatable/equatable.dart';

class TeamEntity extends Equatable {
  final String id;
  final String name; // Ex: Équipe Maçonnerie A
  final String leaderId; // ID de l'employé chef d'équipe
  final String leaderName;
  final List<String> memberIds; // IDs des employés membres
  final String? specialty; // Ex: Gros Œuvre, Second Œuvre
  final DateTime createdAt;
  final DateTime updatedAt;

  const TeamEntity({
    required this.id,
    required this.name,
    required this.leaderId,
    required this.leaderName,
    required this.memberIds,
    this.specialty,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        name,
        leaderId,
        leaderName,
        memberIds,
        specialty,
        createdAt,
        updatedAt,
      ];
}
