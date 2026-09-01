import 'package:isar/isar.dart';
import '../../domain/entities/ai_message_entity.dart';

part 'ai_models.g.dart';

@collection
class AiChatMessageModel {
  Id id = Isar.autoIncrement;

  @Index(unique: true, replace: true)
  late String remoteId;

  late String content;

  @enumerated
  late AiMessageRole role;

  @Index()
  late DateTime timestamp;

  late bool isPrediction;

  AiMessageEntity toEntity() {
    return AiMessageEntity(
      id: remoteId,
      content: content,
      role: role,
      timestamp: timestamp,
      isPrediction: isPrediction,
    );
  }

  static AiChatMessageModel fromEntity(AiMessageEntity entity) {
    final model = AiChatMessageModel();
    model.remoteId = entity.id;
    model.content = entity.content;
    model.role = entity.role;
    model.timestamp = entity.timestamp;
    model.isPrediction = entity.isPrediction;
    return model;
  }
}
