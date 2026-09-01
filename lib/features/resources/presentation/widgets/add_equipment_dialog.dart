import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../domain/entities/equipment_entity.dart';

class AddEquipmentDialog extends StatefulWidget {
  final Function(EquipmentEntity) onConfirm;

  const AddEquipmentDialog({super.key, required this.onConfirm});

  @override
  State<AddEquipmentDialog> createState() => _AddEquipmentDialogState();
}

class _AddEquipmentDialogState extends State<AddEquipmentDialog> {
  final _codeController = TextEditingController();
  final _nameController = TextEditingController();
  final _brandController = TextEditingController();
  final _modelController = TextEditingController();
  final _costController = TextEditingController();
  
  EquipmentCategory _category = EquipmentCategory.TERRASSEMENT;

  @override
  void dispose() {
    _codeController.dispose();
    _nameController.dispose();
    _brandController.dispose();
    _modelController.dispose();
    _costController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('NOUVEL ENGIN / MATÉRIEL', style: TextStyle(fontWeight: FontWeight.black, fontSize: 18)),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            AppTextField(label: 'Code Engin', hint: 'Ex: ENG-CAT-01', controller: _codeController),
            const SizedBox(height: 16),
            AppTextField(label: 'Désignation', hint: 'Ex: Pelle Hydraulique', controller: _nameController),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: AppTextField(label: 'Marque', hint: 'Ex: Caterpillar', controller: _brandController)),
                const SizedBox(width: 16),
                Expanded(child: AppTextField(label: 'Modèle', hint: 'Ex: 320D', controller: _modelController)),
              ],
            ),
            const SizedBox(height: 16),
            const Text('CATÉGORIE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
            DropdownButtonFormField<EquipmentCategory>(
              value: _category,
              items: EquipmentCategory.values.map((c) => DropdownMenuItem(value: c, child: Text(c.toString().split('.').last.replaceAll('_', ' ')))).toList(),
              onChanged: (v) => setState(() => _category = v!),
            ),
            const SizedBox(height: 16),
            AppTextField(label: 'Coût journalier (FCFA)', controller: _costController, keyboardType: TextInputType.number),
          ],
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('ANNULER')),
        AppButton(
          text: 'ENREGISTRER',
          onPressed: () {
            if (_codeController.text.isNotEmpty && _nameController.text.isNotEmpty) {
              final equipment = EquipmentEntity(
                id: const Uuid().v4(),
                code: _codeController.text,
                name: _nameController.text,
                category: _category,
                brand: _brandController.text,
                model: _modelController.text,
                status: EquipmentStatus.DISPONIBLE,
                hourMeterCurrent: 0.0,
                fuelConsumptionAvg: 0.0,
                maintenanceHistory: const [],
                dailyCostRate: double.tryParse(_costController.text) ?? 0.0,
                createdAt: DateTime.now(),
                updatedAt: DateTime.now(),
              );
              widget.onConfirm(equipment);
              Navigator.pop(context);
            }
          },
        ),
      ],
    );
  }
}
