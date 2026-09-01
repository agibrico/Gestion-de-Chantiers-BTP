import 'package:equatable/equatable.dart';

enum EmployeeStatus {
  ACTIF,
  EN_CONGE,
  SUSPENDU,
  SORTI,
}

class EmployeeEntity extends Equatable {
  final String id;
  final String registrationNumber; // Matricule AGB
  final String firstName;
  final String lastName;
  final String position; // Ex: Maçon, Ferrailleur, Grutier
  final String phone;
  final String? email;
  final EmployeeStatus status;
  final double dailyRate; // Coût journalier pour le pointage
  final DateTime hireDate;
  final DateTime createdAt;
  final DateTime updatedAt;

  const EmployeeEntity({
    required this.id,
    required this.registrationNumber,
    required this.firstName,
    required this.lastName,
    required this.position,
    required this.phone,
    this.email,
    required this.status,
    required this.dailyRate,
    required this.hireDate,
    required this.createdAt,
    required this.updatedAt,
  });

  String get fullName => '$firstName $lastName';

  @override
  List<Object?> get props => [
        id,
        registrationNumber,
        firstName,
        lastName,
        position,
        phone,
        email,
        status,
        dailyRate,
        hireDate,
        createdAt,
        updatedAt,
      ];
}
