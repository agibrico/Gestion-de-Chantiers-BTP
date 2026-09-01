import 'package:equatable/equatable.dart';

enum EquipmentStatus {
  DISPONIBLE,
  EN_SERVICE,
  EN_PANNE,
  EN_MAINTENANCE,
  REFORME,
}

enum EquipmentCategory {
  TERRASSEMENT,
  LEVAGE_MANUTENTION,
  BETON_MALAXAGE,
  ENERGIE_COMPRESSEUR,
  COMPACTAGE_ROUTIER,
  VEHICULE_LIAISON,
  OUTILLAGE_ELECTROPORTATIF,
  AUTRE,
}

class MaintenanceLogEntity extends Equatable {
  final String id;
  final DateTime date;
  final String type; // Ex: Vidange, Réparation flexible, etc.
  final String description;
  final double cost;
  final double hourMeter; // Compteur au moment de l'intervention
  final String technician;

  const MaintenanceLogEntity({
    required this.id,
    required this.date,
    required this.type,
    required this.description,
    required this.cost,
    required this.hourMeter,
    required this.technician,
  });

  @override
  List<Object?> get props => [id, date, type, description, cost, hourMeter, technician];
}

class EquipmentEntity extends Equatable {
  final String id;
  final String code; // Ex: ENG-CAT-01
  final String name; // Ex: Pelle Hydraulique 320D
  final EquipmentCategory category;
  final String brand;
  final String model;
  final String? serialNumber;
  final String? registrationPlate;
  final EquipmentStatus status;
  final String? currentProjectId;
  final String? currentProjectName;
  final double hourMeterCurrent; // Heures de fonctionnement
  final double fuelConsumptionAvg; // L/h
  final DateTime? lastMaintenanceDate;
  final double? nextMaintenanceHours; // Prochaine révision prévue à X heures
  final List<MaintenanceLogEntity> maintenanceHistory;
  final double dailyCostRate; // Coût journalier d'imputation
  final DateTime createdAt;
  final DateTime updatedAt;

  const EquipmentEntity({
    required this.id,
    required this.code,
    required this.name,
    required this.category,
    required this.brand,
    required this.model,
    this.serialNumber,
    this.registrationPlate,
    required this.status,
    this.currentProjectId,
    this.currentProjectName,
    required this.hourMeterCurrent,
    required this.fuelConsumptionAvg,
    this.lastMaintenanceDate,
    this.nextMaintenanceHours,
    required this.maintenanceHistory,
    required this.dailyCostRate,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        code,
        name,
        category,
        brand,
        model,
        serialNumber,
        registrationPlate,
        status,
        currentProjectId,
        currentProjectName,
        hourMeterCurrent,
        fuelConsumptionAvg,
        lastMaintenanceDate,
        nextMaintenanceHours,
        maintenanceHistory,
        dailyCostRate,
        createdAt,
        updatedAt,
      ];
}
