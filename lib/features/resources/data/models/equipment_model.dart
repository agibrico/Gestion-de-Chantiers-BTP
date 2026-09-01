import 'package:isar/isar.dart';
import '../../domain/entities/equipment_entity.dart';

part 'equipment_model.g.dart';

@embedded
class MaintenanceLogModel {
  late String remoteId;
  late DateTime date;
  late String type;
  late String description;
  late double cost;
  late double hourMeter;
  late String technician;

  MaintenanceLogEntity toEntity() {
    return MaintenanceLogEntity(
      id: remoteId,
      date: date,
      type: type,
      description: description,
      cost: cost,
      hourMeter: hourMeter,
      technician: technician,
    );
  }

  static MaintenanceLogModel fromEntity(MaintenanceLogEntity entity) {
    final model = MaintenanceLogModel();
    model.remoteId = entity.id;
    model.date = entity.date;
    model.type = entity.type;
    model.description = entity.description;
    model.cost = entity.cost;
    model.hourMeter = entity.hourMeter;
    model.technician = entity.technician;
    return model;
  }
}

@collection
class EquipmentModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index(type: IndexType.value)
  late String code;

  @Index(type: IndexType.value)
  late String name;

  @enumerated
  late EquipmentCategory category;

  late String brand;
  late String model;
  String? serialNumber;
  String? registrationPlate;

  @enumerated
  late EquipmentStatus status;

  @Index()
  String? currentProjectId;
  String? currentProjectName;

  late double hourMeterCurrent;
  late double fuelConsumptionAvg;
  DateTime? lastMaintenanceDate;
  double? nextMaintenanceHours;

  late List<MaintenanceLogModel> maintenanceHistory;
  late double dailyCostRate;
  late DateTime createdAt;
  late DateTime updatedAt;

  EquipmentEntity toEntity() {
    return EquipmentEntity(
      id: remoteId,
      code: code,
      name: name,
      category: category,
      brand: brand,
      model: model,
      serialNumber: serialNumber,
      registrationPlate: registrationPlate,
      status: status,
      currentProjectId: currentProjectId,
      currentProjectName: currentProjectName,
      hourMeterCurrent: hourMeterCurrent,
      fuelConsumptionAvg: fuelConsumptionAvg,
      lastMaintenanceDate: lastMaintenanceDate,
      nextMaintenanceHours: nextMaintenanceHours,
      maintenanceHistory: maintenanceHistory.map((m) => m.toEntity()).toList(),
      dailyCostRate: dailyCostRate,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  static EquipmentModel fromEntity(EquipmentEntity entity) {
    final model = EquipmentModel();
    model.remoteId = entity.id;
    model.code = entity.code;
    model.name = entity.name;
    model.category = entity.category;
    model.brand = entity.brand;
    model.model = entity.model;
    model.serialNumber = entity.serialNumber;
    model.registrationPlate = entity.registrationPlate;
    model.status = entity.status;
    model.currentProjectId = entity.currentProjectId;
    model.currentProjectName = entity.currentProjectName;
    model.hourMeterCurrent = entity.hourMeterCurrent;
    model.fuelConsumptionAvg = entity.fuelConsumptionAvg;
    model.lastMaintenanceDate = entity.lastMaintenanceDate;
    model.nextMaintenanceHours = entity.nextMaintenanceHours;
    model.maintenanceHistory = entity.maintenanceHistory.map((m) => MaintenanceLogModel.fromEntity(m)).toList();
    model.dailyCostRate = entity.dailyCostRate;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}
