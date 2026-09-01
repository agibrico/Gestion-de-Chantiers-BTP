import 'package:isar/isar.dart';
import '../../domain/entities/employee_entity.dart';
import '../../domain/entities/stakeholder_entity.dart';
import '../../domain/entities/team_entity.dart';

part 'resource_models.g.dart';

@collection
class EmployeeModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index(unique: true)
  late String registrationNumber;

  late String firstName;
  late String lastName;
  late String position;
  late String phone;
  String? email;

  @enumerated
  late EmployeeStatus status;

  late double dailyRate;
  late DateTime hireDate;
  late DateTime createdAt;
  late DateTime updatedAt;

  EmployeeEntity toEntity() {
    return EmployeeEntity(
      id: remoteId,
      registrationNumber: registrationNumber,
      firstName: firstName,
      lastName: lastName,
      position: position,
      phone: phone,
      email: email,
      status: status,
      dailyRate: dailyRate,
      hireDate: hireDate,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  static EmployeeModel fromEntity(EmployeeEntity entity) {
    final model = EmployeeModel();
    model.remoteId = entity.id;
    model.registrationNumber = entity.registrationNumber;
    model.firstName = entity.firstName;
    model.lastName = entity.lastName;
    model.position = entity.position;
    model.phone = entity.phone;
    model.email = entity.email;
    model.status = entity.status;
    model.dailyRate = entity.dailyRate;
    model.hireDate = entity.hireDate;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}

@collection
class StakeholderModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  late String name;

  @enumerated
  late StakeholderType type;

  late String companyName;
  late String phone;
  String? email;
  String? address;
  late DateTime createdAt;
  late DateTime updatedAt;

  StakeholderEntity toEntity() {
    return StakeholderEntity(
      id: remoteId,
      name: name,
      type: type,
      companyName: companyName,
      phone: phone,
      email: email,
      address: address,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  static StakeholderModel fromEntity(StakeholderEntity entity) {
    final model = StakeholderModel();
    model.remoteId = entity.id;
    model.name = entity.name;
    model.type = entity.type;
    model.companyName = entity.companyName;
    model.phone = entity.phone;
    model.email = entity.email;
    model.address = entity.address;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}

@collection
class TeamModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  late String name;
  late String leaderId;
  late String leaderName;
  late List<String> memberIds;
  String? specialty;
  late DateTime createdAt;
  late DateTime updatedAt;

  TeamEntity toEntity() {
    return TeamEntity(
      id: remoteId,
      name: name,
      leaderId: leaderId,
      leaderName: leaderName,
      memberIds: memberIds,
      specialty: specialty,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  static TeamModel fromEntity(TeamEntity entity) {
    final model = TeamModel();
    model.remoteId = entity.id;
    model.name = entity.name;
    model.leaderId = entity.leaderId;
    model.leaderName = entity.leaderName;
    model.memberIds = entity.memberIds;
    model.specialty = entity.specialty;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}
