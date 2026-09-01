import 'package:equatable/equatable.dart';

enum InspectionStatus {
  CONFORME,
  NON_CONFORME,
  SOUS_RESERVE,
}

enum InspectionType {
  FERRAILLAGE,
  BETONNAGE,
  ETANCHEITE,
  RESEAUX_FLUIDES,
  MACONNERIE,
  SECOND_OEUVRE,
  HSE_SECURITE,
  AUTRE,
}

class ChecklistItem extends Equatable {
  final String label;
  final bool isChecked;
  final String? comment;

  const ChecklistItem({
    required this.label,
    required this.isChecked,
    this.comment,
  });

  @override
  List<Object?> get props => [label, isChecked, comment];
}

class QualityInspectionEntity extends Equatable {
  final String id;
  final String projectId;
  final String projectName;
  final InspectionType type;
  final String zone; // Zone du chantier (ex: RDC, Batiment B)
  final DateTime date;
  final String inspectorName;
  final List<ChecklistItem> checklist;
  final InspectionStatus result;
  final String? observations;
  final bool isSigned;
  final String? signatureData; // En base64 ou chemin fichier
  final DateTime createdAt;
  final DateTime updatedAt;

  const QualityInspectionEntity({
    required this.id,
    required this.projectId,
    required this.projectName,
    required this.type,
    required this.zone,
    required this.date,
    required this.inspectorName,
    required this.checklist,
    required this.result,
    this.observations,
    required this.isSigned,
    this.signatureData,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        projectId,
        projectName,
        type,
        zone,
        date,
        inspectorName,
        checklist,
        result,
        observations,
        isSigned,
        signatureData,
        createdAt,
        updatedAt,
      ];
}
