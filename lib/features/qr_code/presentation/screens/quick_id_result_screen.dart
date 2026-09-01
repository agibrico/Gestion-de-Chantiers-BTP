import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../domain/services/identification_controller.dart';
import '../../../inventory/domain/entities/material_entity.dart';
import '../../../resources/domain/entities/equipment_entity.dart';

class QuickIdResultScreen extends StatelessWidget {
  final QuickIdentification result;

  const QuickIdResultScreen({super.key, required this.result});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('RÉSULTAT IDENTIFICATION'),
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft),
          onPressed: () => context.go('/'),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (result.type == IdentifiedType.unknown) 
              _buildUnknownUI(context)
            else if (result.type == IdentifiedType.material)
              _buildMaterialUI(context, result.data as MaterialEntity)
            else
              _buildEquipmentUI(context, result.data as EquipmentEntity),
              
            const SizedBox(height: 40),
            AppButton(
              text: 'NOUVEAU SCAN',
              icon: const Icon(LucideIcons.scan, color: Colors.white, size: 18),
              onPressed: () => context.pushReplacement('/qr-scanner'),
            ),
            const SizedBox(height: 12),
            AppButton(
              text: 'RETOUR DASHBOARD',
              variant: AppButtonVariant.outline,
              onPressed: () => context.go('/'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUnknownUI(BuildContext context) {
    return Center(
      child: Column(
        children: [
          const SizedBox(height: 60),
          const Icon(LucideIcons.alertCircle, size: 80, color: AppColors.danger),
          const SizedBox(height: 24),
          const Text('CODE INCONNU', style: TextStyle(fontSize: 20, fontWeight: FontWeight.black)),
          const SizedBox(height: 8),
          Text('Le code "${result.code}" ne correspond à aucun élément AGB référencé.', 
            textAlign: TextAlign.center,
            style: const TextStyle(color: AppColors.textSecondary)),
        ],
      ),
    );
  }

  Widget _buildMaterialUI(BuildContext context, MaterialEntity material) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildResultHeader(LucideIcons.package, 'MATÉRIAU IDENTIFIÉ', material.code),
        const SizedBox(height: 24),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(material.name.toUpperCase(), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.black)),
                Text(material.category.toString().split('.').last.replaceAll('_', ' '), 
                  style: const TextStyle(color: AppColors.orangeSecurite, fontWeight: FontWeight.bold, fontSize: 12)),
                const Divider(height: 40),
                _buildDataRow('Stock Actuel', '${material.currentStock.toInt()} ${material.unit.toString().split('.').last}', 
                  valueColor: material.isBelowAlertThreshold ? AppColors.danger : AppColors.success),
                _buildDataRow('Seuil Alerte', '${material.minStockAlert.toInt()}'),
                _buildDataRow('Emplacement', material.storageLocation ?? 'Non précisé'),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildEquipmentUI(BuildContext context, EquipmentEntity equipment) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildResultHeader(LucideIcons.truck, 'ENGIN IDENTIFIÉ', equipment.code),
        const SizedBox(height: 24),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('${equipment.brand} ${equipment.model}'.toUpperCase(), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.black)),
                Text(equipment.name, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                const Divider(height: 40),
                _buildDataRow('Statut Actuel', equipment.status.toString().split('.').last.replaceAll('_', ' '), 
                  valueColor: _getStatusColor(equipment.status)),
                _buildDataRow('Horamètre', '${equipment.hourMeterCurrent.toInt()} h'),
                _buildDataRow('Chantier', equipment.currentProjectName ?? 'Dépôt Central'),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildResultHeader(IconData icon, String label, String code) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: AppColors.acierBTP, borderRadius: BorderRadius.circular(12)),
          child: Icon(icon, color: Colors.white),
        ),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
            Text(code, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.black, color: AppColors.acierBTP)),
          ],
        ),
      ],
    );
  }

  Widget _buildDataRow(String label, String value, {Color? valueColor}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
          Text(value, style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: valueColor)),
        ],
      ),
    );
  }

  Color _getStatusColor(EquipmentStatus status) {
    switch (status) {
      case EquipmentStatus.DISPONIBLE: return AppColors.success;
      case EquipmentStatus.EN_SERVICE: return AppColors.info;
      case EquipmentStatus.EN_PANNE: return AppColors.danger;
      default: return AppColors.warning;
    }
  }
}
