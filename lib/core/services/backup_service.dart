import 'dart:io';
import 'package:isar/isar.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:file_picker/file_picker.dart';
import 'package:intl/intl.dart';
import '../storage/isar_service.dart';

class BackupService {
  final IsarService isarService;

  BackupService({required this.isarService});

  /// Exporte la base de données actuelle vers un fichier et ouvre le menu de partage
  Future<void> createBackup() async {
    final db = await isarService.db;
    final appDir = await getApplicationDocumentsDirectory();
    final fileName = 'AGB_BACKUP_${DateFormat('yyyyMMdd_HHmm').format(DateTime.now())}.isar';
    final backupPath = '${appDir.path}/$fileName';

    // Isar supporte la copie de sauvegarde native
    await db.copyBundle(backupPath);

    // Partager le fichier
    await Share.shareXFiles([XFile(backupPath)], text: 'Sauvegarde AGB Chantier - $fileName');
  }

  /// Restaure la base de données à partir d'un fichier .isar sélectionné par l'utilisateur
  /// ATTENTION : Cette action efface les données actuelles.
  Future<bool> restoreBackup() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.any,
    );

    if (result != null && result.files.single.path != null) {
      final backupFile = File(result.files.single.path!);
      final appDir = await getApplicationDocumentsDirectory();
      final dbPath = '${appDir.path}/default.isar'; // Nom par défaut d'Isar

      // 1. Fermer la base de données actuelle
      await isarService.closeDB();

      // 2. Remplacer le fichier physique
      if (await File(dbPath).exists()) {
        await File(dbPath).delete();
      }
      await backupFile.copy(dbPath);

      // Le redémarrage de l'application est recommandé pour recharger Isar proprement
      return true;
    }
    return false;
  }
}
