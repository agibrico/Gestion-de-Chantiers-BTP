import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../domain/entities/material_entity.dart';
import '../../domain/entities/stock_movement_entity.dart';

class StockMovementDialog extends StatefulWidget {
  final MaterialEntity material;
  final Function(StockMovementEntity) onConfirm;

  const StockMovementDialog({
    super.key,
    required this.material,
    required this.onConfirm,
  });

  @override
  State<StockMovementDialog> createState() => _StockMovementDialogState();
}

class _StockMovementDialogState extends State<StockMovementDialog> {
  final _quantityController = TextEditingController();
  final _refController = TextEditingController();
  final _notesController = TextEditingController();
  MovementType _type = MovementType.ENTREE_LIVRAISON;

  @override
  void dispose() {
    _quantityController.dispose();
    _refController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('MOUVEMENT DE STOCK : ${widget.material.code}', style: const TextStyle(fontWeight: FontWeight.black, fontSize: 16)),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(widget.material.name, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
            const SizedBox(height: 24),
            const Text('TYPE DE MOUVEMENT', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
            const SizedBox(height: 8),
            DropdownButtonFormField<MovementType>(
              value: _type,
              decoration: InputDecoration(
                filled: true,
                fillColor: Colors.grey[100],
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
              items: MovementType.values.map((t) => DropdownMenuItem(
                value: t, 
                child: Text(t.toString().split('.').last.replaceAll('_', ' '))
              )).toList(),
              onChanged: (v) => setState(() => _type = v!),
            ),
            const SizedBox(height: 16),
            AppTextField(
              label: 'Quantité (${widget.material.unit.toString().split('.').last})', 
              controller: _quantityController,
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            AppTextField(
              label: 'N° Document / Référence', 
              hint: 'Ex: BL-2026-001',
              controller: _refController,
            ),
            const SizedBox(height: 16),
            AppTextField(
              label: 'Notes', 
              hint: 'Commentaires...',
              controller: _notesController,
            ),
          ],
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('ANNULER')),
        AppButton(
          text: 'VALIDER LE MOUVEMENT', 
          onPressed: () {
            if (_quantityController.text.isNotEmpty) {
              final movement = StockMovementEntity(
                id: const Uuid().v4(),
                materialId: widget.material.id,
                materialName: widget.material.name,
                type: _type,
                quantity: double.tryParse(_quantityController.text) ?? 0.0,
                date: DateTime.now(),
                referenceDocument: _refController.text,
                notes: _notesController.text,
                createdAt: DateTime.now(),
              );
              widget.onConfirm(movement);
              Navigator.pop(context);
            }
          },
        ),
      ],
    );
  }
}
