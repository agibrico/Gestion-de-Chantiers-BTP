import 'package:equatable/equatable.dart';

enum ClientType {
  PARTICULIER,
  ENTREPRISE_PRIVEE,
  ETAT_PUBLIC,
  PROPROMOTEUR_IMMOBILIER,
  AUTRE,
}

class ClientEntity extends Equatable {
  final String id;
  final String clientNumber; // Ex: CLT-2026-001
  final String name; // Nom ou Raison Sociale
  final String? contactPerson; // Nom du contact si c'est une entreprise
  final String? email;
  final String phone;
  final String? whatsapp;
  final String? address;
  final String? city;
  final ClientType type;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  const ClientEntity({
    required this.id,
    required this.clientNumber,
    required this.name,
    this.contactPerson,
    this.email,
    required this.phone,
    this.whatsapp,
    this.address,
    this.city,
    required this.type,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        clientNumber,
        name,
        contactPerson,
        email,
        phone,
        whatsapp,
        address,
        city,
        type,
        notes,
        createdAt,
        updatedAt,
      ];
}
