import 'package:equatable/equatable.dart';

enum AiMessageRole {
  user,
  assistant,
  system,
}

class AiMessageEntity extends Equatable {
  final String id;
  final String content;
  final AiMessageRole role;
  final DateTime timestamp;
  final bool isPrediction; // Si le message contient une analyse prédictive

  const AiMessageEntity({
    required this.id,
    required this.content,
    required this.role,
    required this.timestamp,
    this.isPrediction = false,
  });

  @override
  List<Object?> get props => [id, content, role, timestamp, isPrediction];
}

class PredictiveInsight extends Equatable {
  final String title;
  final String description;
  final String impact; // Ex: Retard, Budget, Sécurité
  final double confidenceScore;

  const PredictiveInsight({
    required this.title,
    required this.description,
    required this.impact,
    required this.confidenceScore,
  });

  @override
  List<Object?> get props => [title, description, impact, confidenceScore];
}
