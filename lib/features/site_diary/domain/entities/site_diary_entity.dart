import 'package:equatable/equatable.dart';

enum WeatherCondition {
  ENSOLEILLE,
  NUAGEUX,
  PLUIE_LEGERE,
  FORTE_PLUIE,
  ORAGE,
  VENT_FORT,
}

class SiteDiaryEntry extends Equatable {
  final String id;
  final String projectId;
  final String projectName;
  final DateTime date;
  
  // Météo
  final WeatherCondition weather;
  final double? temperature; // en Celsius
  
  // Effectifs & Travaux
  final String activitiesPerformed; // Résumé des travaux du jour
  final int totalWorkers;
  final String equipmentUsed; // Engins actifs ce jour
  
  // Aléas & Incidents
  final String? incidents; // Pannes, accidents, etc.
  final String? delays; // Retards de livraison, intempéries
  
  final String? observations; // Notes diverses du conducteur
  final String authorName;
  
  final DateTime createdAt;
  final DateTime updatedAt;

  const SiteDiaryEntry({
    required this.id,
    required this.projectId,
    required this.projectName,
    required this.date,
    required this.weather,
    this.temperature,
    required this.activitiesPerformed,
    required this.totalWorkers,
    required this.equipmentUsed,
    this.incidents,
    this.delays,
    this.observations,
    required this.authorName,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        projectId,
        projectName,
        date,
        weather,
        temperature,
        activitiesPerformed,
        totalWorkers,
        equipmentUsed,
        incidents,
        delays,
        observations,
        authorName,
        createdAt,
        updatedAt,
      ];
}
