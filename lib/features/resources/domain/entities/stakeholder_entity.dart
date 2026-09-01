import 'package:equatable/equatable.dart';

enum StakeholderType {
  ARCHITECTE,
  BUREAU_D_ETUDES,
  BUREAU_DE_CONTROLE,
  GEOMETRE,
  SOUS_TRAITANT,
  FOURNISSEUR,
  COORDONNATEUR_HSE,
  MAITRE_D_OEUVRE,
  AUTRE,
}

class StakeholderEntity extends Equatable {
  final String id;
  final String name;
  final StakeholderType type;
  final String companyName;
  final String phone;
  final String? email;
  final String? address;
  final DateTime createdAt;
  final DateTime updatedAt;

  const StakeholderEntity({
    required this.id,
    required this.name,
    required this.type,
    required this.companyName,
    required this.phone,
    this.email,
    this.address,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        name,
        type,
        companyName,
        phone,
        email,
        address,
        createdAt,
        updatedAt,
      ];
}
