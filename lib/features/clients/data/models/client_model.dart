import 'package:isar/isar.dart';
import '../../domain/entities/client_entity.dart';

part 'client_model.g.dart';

@collection
class ClientModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId; // L'ID UUID généré par l'app

  @Index(type: IndexType.value)
  late String clientNumber;

  @Index(type: IndexType.value)
  late String name;

  String? contactPerson;
  String? email;
  late String phone;
  String? whatsapp;
  String? address;
  String? city;

  @enumerated
  late ClientType type;

  String? notes;
  late DateTime createdAt;
  late DateTime updatedAt;

  // Convert to Entity
  ClientEntity toEntity() {
    return ClientEntity(
      id: remoteId,
      clientNumber: clientNumber,
      name: name,
      contactPerson: contactPerson,
      email: email,
      phone: phone,
      whatsapp: whatsapp,
      address: address,
      city: city,
      type: type,
      notes: notes,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  // From Entity
  static ClientModel fromEntity(ClientEntity entity) {
    final model = ClientModel();
    model.remoteId = entity.id;
    model.clientNumber = entity.clientNumber;
    model.name = entity.name;
    model.contactPerson = entity.contactPerson;
    model.email = entity.email;
    model.phone = entity.phone;
    model.whatsapp = entity.whatsapp;
    model.address = entity.address;
    model.city = entity.city;
    model.type = entity.type;
    model.notes = entity.notes;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}
