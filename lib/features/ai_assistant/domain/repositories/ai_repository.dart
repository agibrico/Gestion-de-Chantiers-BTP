import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../entities/ai_message_entity.dart';

abstract class AiRepository {
  /// Envoie une question à l'IA avec le contexte des données actuelles
  Future<Either<Failure, AiMessageEntity>> askAssistant(String prompt);

  /// Récupère l'historique des conversations locales
  Future<Either<Failure, List<AiMessageEntity>>> getChatHistory();

  /// Efface l'historique des conversations
  Future<Either<Failure, void>> clearHistory();

  /// Analyse prédictive automatique basée sur les données du projet
  Future<Either<Failure, List<PredictiveInsight>>> getAutoAnalysis(String projectId);
}
