import 'package:isar/isar.dart';
import '../../domain/entities/site_diary_entity.dart';

part 'site_diary_model.g.dart';

@collection
class SiteDiaryModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  @Index()
  late String projectId;
  
  late String projectName;

  @Index(composite: [IndexComposite('projectId')])
  late DateTime date;

  @enumerated
  late WeatherCondition weather;
  
  double? temperature;
  late String activitiesPerformed;
  late int totalWorkers;
  late String equipmentUsed;
  
  String? incidents;
  String? delays;
  String? observations;
  late String authorName;
  
  late DateTime createdAt;
  late DateTime updatedAt;

  @Index()
  bool isPendingSync = false;
  DateTime? lastUpdatedServer;

  SiteDiaryEntry toEntity() {
    return SiteDiaryEntry(
      id: remoteId,
      projectId: projectId,
      projectName: projectName,
      date: date,
      weather: weather,
      temperature: temperature,
      activitiesPerformed: activitiesPerformed,
      totalWorkers: totalWorkers,
      equipmentUsed: equipmentUsed,
      incidents: incidents,
      delays: delays,
      observations: observations,
      authorName: authorName,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  static SiteDiaryModel fromEntity(SiteDiaryEntry entity) {
    final model = SiteDiaryModel();
    model.remoteId = entity.id;
    model.projectId = entity.projectId;
    model.projectName = entity.projectName;
    model.date = DateTime(entity.date.year, entity.date.month, entity.date.day);
    model.weather = entity.weather;
    model.temperature = entity.temperature;
    model.activitiesPerformed = entity.activitiesPerformed;
    model.totalWorkers = entity.totalWorkers;
    model.equipmentUsed = entity.equipmentUsed;
    model.incidents = entity.incidents;
    model.delays = entity.delays;
    model.observations = entity.observations;
    model.authorName = entity.authorName;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    return model;
  }
}
