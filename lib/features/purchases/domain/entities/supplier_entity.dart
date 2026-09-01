import 'package:equatable/equatable.dart';

class SupplierEntity extends Equatable {
  final String id;
  final String name;
  final String? contactPerson;
  final String phone;
  final String? email;
  final String? address;
  final String? categories; // Ex: Matériaux, Outillage, Engins
  final DateTime createdAt;
  final DateTime updatedAt;

  const SupplierEntity({
    required this.id,
    required this.name,
    this.contactPerson,
    required this.phone,
    this.email,
    this.address,
    this.categories,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        name,
        contactPerson,
        phone,
        email,
        address,
        categories,
        createdAt,
        updatedAt,
      ];
}
