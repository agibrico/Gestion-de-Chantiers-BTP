import 'package:dartz/dartz.dart';
import 'package:isar/isar.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/storage/isar_service.dart';
import '../../../projects/data/models/project_model.dart';
import '../../../inventory/data/models/inventory_models.dart';
import '../../domain/entities/ai_message_entity.dart';
import '../../domain/repositories/ai_repository.dart';
import '../models/ai_models.dart';

class AiRepositoryImpl implements AiRepository {
  final IsarService isarService;

  AiRepositoryImpl({required this.isarService});

  @override
  Future<Either<Failure, AiMessageEntity>> askAssistant(String prompt) async {
    try {
      final isar = await isarService.db;

      // 1. Sauvegarder le message de l'utilisateur
      final userMessage = AiMessageEntity(
        id: const Uuid().v4(),
        content: prompt,
        role: AiMessageRole.user,
        timestamp: DateTime.now(),
      );
      await isar.writeTxn(() => isar.aiChatMessageModels.put(AiChatMessageModel.fromEntity(userMessage)));

      // 2. Récupérer le contexte métier (Simulation de Prompt Engineering)
      final projects = await isar.projectModels.where().findAll();
      final lowStock = await isar.materialModels.filter().currentStockLessThan(10).findAll();

      // 3. Simuler une réponse IA basée sur les données réelles
      String responseContent = "Je suis l'Assistant AGB. ";
      
      if (prompt.toLowerCase().contains('chantier') || prompt.toLowerCase().contains('projet')) {
        responseContent += "Vous avez actuellement ${projects.length} chantiers actifs. ";
        final lateProjects = projects.where((p) => p.progressPercentage < 50).toList();
        if (lateProjects.isNotEmpty) {
          responseContent += "Attention : ${lateProjects.length} projets semblent avoir un avancement faible (<50%).";
        }
      } else if (prompt.toLowerCase().contains('stock') || prompt.toLowerCase().contains('matériau')) {
        if (lowStock.isNotEmpty) {
          responseContent += "Alerte Stocks : ${lowStock.length} matériaux sont en dessous du seuil critique (ex: ${lowStock.first.name}).";
        } else {
          responseContent += "Tous vos stocks critiques sont au-dessus des seuils d'alerte.";
        }
      } else {
        responseContent += "Comment puis-je vous aider dans la gestion de vos travaux aujourd'hui ?";
      }

      final assistantMessage = AiMessageEntity(
        id: const Uuid().v4(),
        content: responseContent,
        role: AiMessageRole.assistant,
        timestamp: DateTime.now(),
      );

      // 4. Sauvegarder la réponse de l'assistant
      await isar.writeTxn(() => isar.aiChatMessageModels.put(AiChatMessageModel.fromEntity(assistantMessage)));

      return Right(assistantMessage);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<AiMessageEntity>>> getChatHistory() async {
    try {
      final isar = await isarService.db;
      final models = await isar.aiChatMessageModels.where().sortByTimestampDesc().findAll();
      return Right(models.map((m) => m.toEntity()).toList().reversed.toList());
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, void>> clearHistory() async {
    try {
      final isar = await isarService.db;
      await isar.writeTxn(() => isar.aiChatMessageModels.clear());
      return const Right(null);
    } catch (e) {
      return const Left(CacheFailure());
    }
  }

  @override
  Future<Either<Failure, List<PredictiveInsight>>> getAutoAnalysis(String projectId) async {
    // Simulation d'une analyse prédictive algorithmique
    return const Right([
      PredictiveInsight(
        title: "Risque de retard",
        description: "L'approvisionnement en fer à béton est lent. Risque de décalage de 4 jours sur la phase Fondations.",
        impact: "Planning",
        confidenceScore: 0.85,
      ),
    ]);
  }
}
