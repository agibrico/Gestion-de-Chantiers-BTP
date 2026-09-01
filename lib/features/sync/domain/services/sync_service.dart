import '../../../../core/api/api_client.dart';
import '../../../../core/storage/isar_service.dart';
import '../../../projects/data/models/project_model.dart';
import 'package:isar/isar.dart';

class SyncService {
  final IsarService isarService;
  final ApiClient apiClient;

  SyncService({required this.isarService, required this.apiClient});

  Future<void> syncAll() async {
    final isar = await isarService.db;

    // 1. Sync Projects
    final pendingProjects = await isar.projectModels.filter().remoteIdIsNotEmpty().findAll(); 
    // Note: In a real app, we would use an 'isPendingSync' flag. 
    // For this axe, we'll demonstrate the logic with a placeholder filter.
    
    for (final project in pendingProjects) {
      try {
        await apiClient.post('/projects/sync', {
          'id': project.remoteId,
          'name': project.name,
          'status': project.status.toString(),
          // ... other fields
        });
        
        // Mark as synced if success (simulation)
        // await isar.writeTxn(() => isar.projectModels.put(project..isPendingSync = false));
      } catch (e) {
        // Log error and continue with next item
      }
    }

    // 2. Sync other entities (SiteDiary, Expenses, etc.)
    // ... same pattern
  }

  Future<void> fetchUpdates() async {
    // Logic to get new data from server and save to Isar
  }
}
