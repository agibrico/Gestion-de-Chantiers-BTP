import 'package:isar/isar.dart';
import 'package:path_provider/path_provider.dart';
import '../../features/clients/data/models/client_model.dart';
import '../../features/projects/data/models/project_model.dart';
import '../../features/resources/data/models/resource_models.dart';
import '../../features/planning/data/models/planning_models.dart';
import '../../features/resources/data/models/attendance_model.dart';
import '../../features/inventory/data/models/inventory_models.dart';
import '../../features/purchases/data/models/purchase_models.dart';
import '../../features/finance/data/models/finance_models.dart';
import '../../features/resources/data/models/equipment_model.dart';
import '../../features/site_diary/data/models/site_diary_model.dart';
import '../../features/photos/data/models/photo_model.dart';
import '../../features/quality/data/models/quality_models.dart';
import '../../features/hse/data/models/hse_models.dart';
import '../../features/quality/data/models/snag_model.dart';
import '../../features/documents/data/models/document_model.dart';
import '../../features/handover/data/models/handover_models.dart';
import '../../features/notifications/data/models/notification_model.dart';
import '../../features/ai_assistant/data/models/ai_models.dart';
import '../../features/audit/data/models/audit_model.dart';
import '../services/security_service.dart';

class IsarService {
  late Future<Isar> db;
  final SecurityService securityService;

  IsarService({required this.securityService}) {
    db = openDB();
  }

  Future<Isar> openDB() async {
    if (Isar.instanceNames.isEmpty) {
      final dir = await getApplicationDocumentsDirectory();
      
      // Récupération de la clé de chiffrement (Axe 28)
      final encryptionKey = await securityService.getIsarEncryptionKey();

      return await Isar.open(
        [
          ClientModelSchema,
          ProjectModelSchema,
          EmployeeModelSchema,
          StakeholderModelSchema,
          TeamModelSchema,
          PhaseModelSchema,
          PlanningTaskModelSchema,
          AttendanceModelSchema,
          MaterialModelSchema,
          StockMovementModelSchema,
          SupplierModelSchema,
          PurchaseOrderModelSchema,
          BudgetModelSchema,
          ExpenseModelSchema,
          EquipmentModelSchema,
          SiteDiaryModelSchema,
          ProjectPhotoModelSchema,
          QualityInspectionModelSchema,
          HseIncidentModelSchema,
          PpeAuditModelSchema,
          SnagModelSchema,
          ProjectDocumentModelSchema,
          HandoverModelSchema,
          NotificationModelSchema,
          AiChatMessageModelSchema,
          AuditLogModelSchema,
        ],
        inspector: true,
        directory: dir.path,
        encryptionKey: encryptionKey,
      );
    }
    return Future.value(Isar.getInstance());
  }

  Future<void> cleanDb() async {
    final isar = await db;
    await isar.writeTxn(() => isar.clear());
  }

  Future<void> closeDB() async {
    final isar = await db;
    await isar.close();
  }
}
