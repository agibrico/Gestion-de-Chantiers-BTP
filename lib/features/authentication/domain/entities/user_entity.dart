import 'package:equatable/equatable.dart';

enum AppRole {
  ADMINISTRATEUR,
  MAITRE_D_OUVRAGE,
  MAITRE_D_OEUVRE,
  ARCHITECTE,
  CONDUCTEUR_DE_TRAVAUX,
  CHEF_DE_CHANTIER,
  CHEF_D_EQUIPE,
  OUVRIER,
  HSE,
  GEOMETRE,
  CONTROLEUR,
  FOURNISSEUR,
  SOUS_TRAITANT,
}

class UserEntity extends Equatable {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final AppRole role;
  final String? phoneNumber;
  final String? profileImageUrl;
  final DateTime createdAt;
  final DateTime updatedAt;

  const UserEntity({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.role,
    this.phoneNumber,
    this.profileImageUrl,
    required this.createdAt,
    required this.updatedAt,
  });

  String get fullName => '$firstName $lastName';

  bool get isAdmin => role == AppRole.ADMINISTRATEUR;

  @override
  List<Object?> get props => [
        id,
        email,
        firstName,
        lastName,
        role,
        phoneNumber,
        profileImageUrl,
        createdAt,
        updatedAt,
      ];
}
