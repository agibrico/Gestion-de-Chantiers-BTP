import 'package:equatable/equatable.dart';

enum IncidentSeverity {
  MINEURE, // Pas d'arrêt, soins mineurs
  MODEREE, // Arrêt court, soins médicaux
  GRAVE, // Hospitalisation, arrêt long
  CRITIQUE, // Décès ou invalidité permanente
}

enum IncidentType {
  ACCIDENT_TRAVAIL,
  PRESQU_ACCIDENT,
  INCIDENT_ENVIRONNEMENTAL,
  DOMMAGE_MATERIEL,
  URGENCE_MEDICALE,
}

class HseIncidentEntity extends Equatable {
  final String id;
  final String projectId;
  final String projectName;
  final DateTime date;
  final IncidentType type;
  final IncidentSeverity severity;
  final String location; // Zone précise sur le chantier
  final String description;
  final List<String> victims; // Noms des personnes concernées
  final String immediateActions; // Mesures prises tout de suite
  final String reporterName;
  final bool isClosed;
  final DateTime createdAt;

  const HseIncidentEntity({
    required this.id,
    required this.projectId,
    required this.projectName,
    required this.date,
    required this.type,
    required this.severity,
    required this.location,
    required this.description,
    required this.victims,
    required this.immediateActions,
    required this.reporterName,
    required this.isClosed,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [
        id,
        projectId,
        projectName,
        date,
        type,
        severity,
        location,
        description,
        victims,
        immediateActions,
        reporterName,
        isClosed,
        createdAt,
      ];
}
