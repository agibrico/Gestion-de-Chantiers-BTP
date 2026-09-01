import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_badge.dart';
import '../../../../core/widgets/app_button.dart';
import '../../domain/entities/equipment_entity.dart';
import '../bloc/equipment_bloc.dart';
import '../widgets/add_equipment_dialog.dart';
import '../../../../core/widgets/qr_code_viewer.dart';

class EquipmentListScreen extends StatefulWidget {
  const EquipmentListScreen({super.key});

  @override
  State<EquipmentListScreen> createState() => _EquipmentListScreenState();
}

class _EquipmentListScreenState extends State<EquipmentListScreen> {
  @override
  void initState() {
    super.initState();
    context.read<EquipmentBloc>().add(LoadAllEquipmentRequested());
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(symbol: 'FCFA', decimalDigits: 0, locale: 'fr_FR');

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('PARC MATÉRIEL & ENGINS')),
      body: BlocBuilder<EquipmentBloc, EquipmentState>(
        builder: (context, state) {
          if (state is EquipmentLoading) return const Center(child: CircularProgressIndicator());
          
          if (state is EquipmentLoaded) {
            final list = state.equipmentList;
            if (list.isEmpty) return _buildEmptyState();

            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: list.length,
              itemBuilder: (context, index) {
                final e = list[index];
                return Card(
                  margin: const EdgeInsets.bottom(16),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            AppBadge.info(e.code),
                            _buildStatusBadge(e.status),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(
                          '${e.brand} ${e.model}'.toUpperCase(),
                          style: const TextStyle(fontWeight: FontWeight.black, fontSize: 16),
                        ),
                        Text(e.name, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                        const Divider(height: 32),
                        Row(
                          children: [
                            _buildTechInfo(LucideIcons.gauge, 'COMPTEUR', '${e.hourMeterCurrent.toInt()} h'),
                            const SizedBox(width: 24),
                            _buildTechInfo(LucideIcons.fuel, 'CONSO MOY.', '${e.fuelConsumptionAvg} L/h'),
                            const SizedBox(width: 24),
                            _buildTechInfo(LucideIcons.banknote, 'TARIF / JOUR', currencyFormat.format(e.dailyCostRate)),
                          ],
                        ),
                        if (e.currentProjectName != null) ...[
                          const SizedBox(height: 16),
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(color: Colors.blue[50], borderRadius: BorderRadius.circular(8)),
                            child: Row(
                              children: [
                                const Icon(LucideIcons.building2, size: 14, color: Colors.blue),
                                const SizedBox(width: 8),
                                Text('Affecté à : ${e.currentProjectName}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.blue)),
                              ],
                            ),
                          ),
                        ],
                        const SizedBox(height: 20),
                        Row(
                          children: [
                            Expanded(
                              child: AppButton(
                                text: 'Maintenance',
                                variant: AppButtonVariant.outline,
                                icon: const Icon(LucideIcons.wrench, size: 14),
                                onPressed: () {
                                  // TODO: Maintenance dialog
                                },
                              ),
                            ),
                            const SizedBox(width: 8),
                            IconButton(
                              icon: const Icon(LucideIcons.qrCode, color: AppColors.info),
                              onPressed: () => _showQrViewer(e),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: AppButton(
                                text: e.status == EquipmentStatus.DISPONIBLE ? 'Affecter' : 'Rapatrier',
                                variant: AppButtonVariant.secondary,
                                icon: Icon(e.status == EquipmentStatus.DISPONIBLE ? LucideIcons.externalLink : LucideIcons.home, size: 14),
                                onPressed: () {
                                  // TODO: Assignment logic
                                },
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            );
          }
          return const SizedBox();
        },
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.orangeSecurite,
        child: const Icon(LucideIcons.plus, color: Colors.white),
        onPressed: () => _showAddEquipmentDialog(context),
      ),
    );
  }

  void _showQrViewer(EquipmentEntity equipment) {
    showDialog(
      context: context,
      builder: (context) => QrCodeViewer(
        value: equipment.code,
        title: equipment.name,
        subtitle: '${equipment.brand} ${equipment.model}',
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.truck, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text('Aucun engin enregistré dans la flotte.'),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(EquipmentStatus status) {
    switch (status) {
      case EquipmentStatus.DISPONIBLE: return AppBadge.success('DISPONIBLE');
      case EquipmentStatus.EN_SERVICE: return AppBadge.info('EN SERVICE');
      case EquipmentStatus.EN_PANNE: return const AppBadge(label: 'EN PANNE', color: AppColors.danger);
      case EquipmentStatus.EN_MAINTENANCE: return AppBadge.warning('MAINTENANCE');
      case EquipmentStatus.REFORME: return const AppBadge(label: 'RÉFORMÉ', color: Colors.black);
    }
  }

  Widget _buildTechInfo(IconData icon, String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 12, color: AppColors.textSecondary),
            const SizedBox(width: 4),
            Text(label, style: const TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
          ],
        ),
        const SizedBox(height: 2),
        Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.black, color: AppColors.acierBTP)),
      ],
    );
  }

  void _showAddEquipmentDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AddEquipmentDialog(
        onConfirm: (equipment) {
          context.read<EquipmentBloc>().add(CreateEquipmentRequested(equipment));
        },
      ),
    );
  }
}
