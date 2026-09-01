import 'package:get_it/get_it.dart';
import 'package:logger/logger.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../features/authentication/data/repositories/auth_repository_impl.dart';
import '../../features/authentication/domain/repositories/auth_repository.dart';
import '../../features/authentication/presentation/bloc/auth_bloc.dart';
import '../../features/clients/data/repositories/client_repository_impl.dart';
import '../../features/clients/domain/repositories/client_repository.dart';
import '../../features/clients/presentation/bloc/client_bloc.dart';
import '../../features/projects/data/repositories/project_repository_impl.dart';
import '../../features/projects/domain/repositories/project_repository.dart';
import '../../features/projects/presentation/bloc/project_bloc.dart';
import '../../features/resources/data/repositories/resource_repository_impl.dart';
import '../../features/resources/data/repositories/equipment_repository_impl.dart';
import '../../features/resources/domain/repositories/resource_repository.dart';
import '../../features/resources/domain/repositories/equipment_repository.dart';
import '../../features/resources/presentation/bloc/resource_bloc.dart';
import '../../features/resources/presentation/bloc/equipment_bloc.dart';
import '../../features/resources/data/repositories/attendance_repository_impl.dart';
import '../../features/resources/domain/repositories/attendance_repository.dart';
import '../../features/resources/presentation/bloc/attendance_bloc.dart';
import '../../features/planning/data/repositories/planning_repository_impl.dart';
import '../../features/planning/domain/repositories/planning_repository.dart';
import '../../features/planning/presentation/bloc/planning_bloc.dart';
import '../../features/inventory/data/repositories/inventory_repository_impl.dart';
import '../../features/inventory/domain/repositories/inventory_repository.dart';
import '../../features/inventory/presentation/bloc/inventory_bloc.dart';
import '../../features/purchases/data/repositories/purchase_repository_impl.dart';
import '../../features/purchases/domain/repositories/purchase_repository.dart';
import '../../features/purchases/presentation/bloc/purchase_bloc.dart';
import '../../features/finance/data/repositories/finance_repository_impl.dart';
import '../../features/finance/domain/repositories/finance_repository.dart';
import '../../features/finance/presentation/bloc/finance_bloc.dart';
import '../../features/site_diary/data/repositories/site_diary_repository_impl.dart';
import '../../features/site_diary/domain/repositories/site_diary_repository.dart';
import '../../features/site_diary/presentation/bloc/site_diary_bloc.dart';
import '../../features/photos/data/repositories/photo_repository_impl.dart';
import '../../features/photos/domain/repositories/photo_repository.dart';
import '../../features/photos/presentation/bloc/photo_bloc.dart';
import '../../features/quality/data/repositories/quality_repository_impl.dart';
import '../../features/quality/data/repositories/snag_repository_impl.dart';
import '../../features/quality/domain/repositories/quality_repository.dart';
import '../../features/quality/domain/repositories/snag_repository.dart';
import '../../features/quality/presentation/bloc/quality_bloc.dart';
import '../../features/quality/presentation/bloc/snag_bloc.dart';
import '../../features/hse/data/repositories/hse_repository_impl.dart';
import '../../features/hse/domain/repositories/hse_repository.dart';
import '../../features/hse/presentation/bloc/hse_bloc.dart';
import '../../features/qr_code/domain/services/identification_controller.dart';
import '../../features/notifications/data/repositories/notification_repository_impl.dart';
import '../../features/notifications/domain/repositories/notification_repository.dart';
import '../../features/notifications/presentation/bloc/notification_bloc.dart';
import '../../features/analytics/data/repositories/analytics_repository_impl.dart';
import '../../features/analytics/domain/repositories/analytics_repository.dart';
import '../../features/analytics/presentation/bloc/analytics_bloc.dart';
import '../../features/sync/domain/services/sync_service.dart';
import '../../features/sync/presentation/bloc/sync_bloc.dart';
import '../../features/ai_assistant/data/repositories/ai_repository_impl.dart';
import '../../features/ai_assistant/domain/repositories/ai_repository.dart';
import '../../features/ai_assistant/presentation/bloc/ai_bloc.dart';
import '../../features/audit/data/repositories/audit_repository_impl.dart';
import '../../features/audit/domain/repositories/audit_repository.dart';
import '../../features/audit/presentation/bloc/audit_bloc.dart';
import '../../features/settings/data/repositories/settings_repository_impl.dart';
import '../../features/settings/domain/repositories/settings_repository.dart';
import '../../features/settings/presentation/bloc/settings_bloc.dart';
import '../api/api_client.dart';
import '../services/audit_service.dart';
import '../services/backup_service.dart';
import '../services/security_service.dart';
import '../services/connectivity_service.dart';
import '../services/notification_service.dart';
import '../services/pdf_service.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // Features - Authentication
  sl.registerFactory(() => AuthBloc(authRepository: sl()));
  
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(sharedPreferences: sl()),
  );

  // Features - Clients
  sl.registerFactory(() => ClientBloc(clientRepository: sl()));
  sl.registerLazySingleton<ClientRepository>(
    () => ClientRepositoryImpl(isarService: sl()),
  );

  // Features - Projects
  sl.registerFactory(() => ProjectBloc(projectRepository: sl()));
  sl.registerLazySingleton<ProjectRepository>(
    () => ProjectRepositoryImpl(isarService: sl()),
  );

  // Features - Resources
  sl.registerFactory(() => ResourceBloc(resourceRepository: sl()));
  sl.registerLazySingleton<ResourceRepository>(
    () => ResourceRepositoryImpl(isarService: sl()),
  );

  // Features - Equipment
  sl.registerFactory(() => EquipmentBloc(equipmentRepository: sl()));
  sl.registerLazySingleton<EquipmentRepository>(
    () => EquipmentRepositoryImpl(isarService: sl()),
  );

  // Features - Planning
  sl.registerFactory(() => PlanningBloc(planningRepository: sl()));
  sl.registerLazySingleton<PlanningRepository>(
    () => PlanningRepositoryImpl(isarService: sl()),
  );

  // Features - Attendance
  sl.registerFactory(() => AttendanceBloc(attendanceRepository: sl()));
  sl.registerLazySingleton<AttendanceRepository>(
    () => AttendanceRepositoryImpl(isarService: sl()),
  );

  // Features - Inventory
  sl.registerFactory(() => InventoryBloc(inventoryRepository: sl()));
  sl.registerLazySingleton<InventoryRepository>(
    () => InventoryRepositoryImpl(isarService: sl()),
  );

  // Features - Purchases
  sl.registerFactory(() => PurchaseBloc(purchaseRepository: sl()));
  sl.registerLazySingleton<PurchaseRepository>(
    () => PurchaseRepositoryImpl(isarService: sl()),
  );

  // Features - Finance
  sl.registerFactory(() => FinanceBloc(financeRepository: sl()));
  sl.registerLazySingleton<FinanceRepository>(
    () => FinanceRepositoryImpl(isarService: sl()),
  );

  // Features - Site Diary
  sl.registerFactory(() => SiteDiaryBloc(siteDiaryRepository: sl()));
  sl.registerLazySingleton<SiteDiaryRepository>(
    () => SiteDiaryRepositoryImpl(isarService: sl()),
  );

  // Features - Photos
  sl.registerFactory(() => PhotoBloc(photoRepository: sl()));
  sl.registerLazySingleton<PhotoRepository>(
    () => PhotoRepositoryImpl(isarService: sl()),
  );

  // Features - Quality
  sl.registerFactory(() => QualityBloc(qualityRepository: sl()));
  sl.registerLazySingleton<QualityRepository>(
    () => QualityRepositoryImpl(isarService: sl()),
  );

  // Features - Snags
  sl.registerFactory(() => SnagBloc(snagRepository: sl()));
  sl.registerLazySingleton<SnagRepository>(
    () => SnagRepositoryImpl(isarService: sl()),
  );

  // Features - HSE
  sl.registerFactory(() => HseBloc(hseRepository: sl()));
  sl.registerLazySingleton<HseRepository>(
    () => HseRepositoryImpl(isarService: sl()),
  );

  // Features - Handover
  sl.registerFactory(() => HandoverBloc(handoverRepository: sl()));
  sl.registerLazySingleton<HandoverRepository>(
    () => HandoverRepositoryImpl(isarService: sl()),
  );

  // Features - Documents
  sl.registerFactory(() => DocumentBloc(documentRepository: sl()));
  sl.registerLazySingleton<DocumentRepository>(
    () => DocumentRepositoryImpl(isarService: sl()),
  );

  // Features - Reports
  sl.registerFactory(() => ReportBloc(reportRepository: sl()));
  sl.registerLazySingleton<ReportRepository>(
    () => ReportRepositoryImpl(isarService: sl(), pdfService: sl()),
  );

  // Features - QR Code
  sl.registerLazySingleton(() => IdentificationController(
    inventoryRepository: sl(),
    equipmentRepository: sl(),
  ));

  // Features - Notifications
  sl.registerFactory(() => NotificationBloc(repository: sl()));
  sl.registerLazySingleton<NotificationRepository>(
    () => NotificationRepositoryImpl(isarService: sl()),
  );

  // Features - Analytics
  sl.registerFactory(() => AnalyticsBloc(repository: sl()));
  sl.registerLazySingleton<AnalyticsRepository>(
    () => AnalyticsRepositoryImpl(isarService: sl()),
  );

  // Features - Sync
  sl.registerLazySingleton(() => SyncService(isarService: sl(), apiClient: sl()));
  sl.registerFactory(() => SyncBloc(syncService: sl(), connectivityService: sl()));

  // Features - IA Assistant
  sl.registerFactory(() => AiBloc(repository: sl()));
  sl.registerLazySingleton<AiRepository>(
    () => AiRepositoryImpl(isarService: sl()),
  );

  // Features - Audit
  sl.registerFactory(() => AuditBloc(repository: sl()));
  sl.registerLazySingleton<AuditRepository>(
    () => AuditRepositoryImpl(isarService: sl()),
  );

  // Features - Settings
  sl.registerFactory(() => SettingsBloc(repository: sl(), backupService: sl()));
  sl.registerLazySingleton<SettingsRepository>(
    () => SettingsRepositoryImpl(sharedPreferences: sl()),
  );

  // Core
  sl.registerLazySingleton(() => SecurityService());
  sl.registerLazySingleton(() => BackupService(isarService: sl()));
  sl.registerLazySingleton(() => AuditService(repository: sl(), authBloc: sl()));
  sl.registerLazySingleton(() => ApiClient());
  sl.registerLazySingleton(() => ConnectivityService());
  sl.registerLazySingleton(() => NotificationService(repository: sl()));
  sl.registerLazySingleton(() => PdfService());
  sl.registerLazySingleton(() => IsarService(securityService: sl()));
  sl.registerLazySingleton(() => Logger(
        printer: PrettyPrinter(
          methodCount: 0,
          errorMethodCount: 5,
          lineLength: 50,
          colors: true,
          printEmojis: true,
        ),
      ));

  // External
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton(() => sharedPreferences);
}
